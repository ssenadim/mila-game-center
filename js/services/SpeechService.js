const MILA_AUDIO_SETTINGS_KEY = "mila-learning-audio-settings";
const MILA_AUDIO_DEFAULTS = Object.freeze({
  speechEnabled: true,
  speechRate: "normal",
  turkishVoice: "auto",
  englishVoice: "auto",
  soundEffectsEnabled: true,
  volume: "normal"
});
const MILA_SPEECH_RATES = Object.freeze({ slow: .8, normal: .95, fast: 1.1 });
const MILA_AUDIO_VOLUMES = Object.freeze({ low: .45, normal: .75, high: 1 });
const MILA_SPEECH_PRIORITIES = Object.freeze({
  instruction: 1,
  question: 2,
  "answer-choice": 1,
  feedback: 3,
  celebration: 4,
  "system-navigation": 5
});
const TURKISH_NUMBER_WORDS = Object.freeze([
  "sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on",
  "on bir", "on iki", "on üç", "on dört", "on beş", "on altı", "on yedi", "on sekiz", "on dokuz", "yirmi"
]);
const ENGLISH_NUMBER_WORDS = Object.freeze([
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"
]);
const TURKISH_PRONUNCIATION_OVERRIDES = Object.freeze({ "TL": "Türk lirası" });
const ENGLISH_PRONUNCIATION_OVERRIDES = Object.freeze({});

class SpeechService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.Utterance = window.SpeechSynthesisUtterance;
    this.supported = Boolean(this.synthesis && this.Utterance);
    this.queue = [];
    this.isProcessing = false;
    this.activeRequest = undefined;
    this.activeResolver = undefined;
    this.generation = 0;
    this.requestId = 0;
    this.voices = [];
    this.englishVoice = undefined;
    this.turkishVoice = undefined;
    this.voiceSignature = "";
    this.voiceListeners = new Set();
    this.settingsListeners = new Set();
    this.stateListeners = new Set();
    this.settings = this.loadSettings();
    this.handleVoicesChanged = this.handleVoicesChanged.bind(this);
    this.listenForVoices();
    this.ready = Promise.resolve().then(() => this.cacheVoices());
  }

  getCapabilities() {
    return {
      speechSynthesis: this.supported,
      utterance: Boolean(this.Utterance),
      voices: this.voices.length > 0
    };
  }

  getStorage() {
    try {
      return window.localStorage;
    } catch {
      return undefined;
    }
  }

  sanitizeSettings(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      speechEnabled: typeof source.speechEnabled === "boolean" ? source.speechEnabled : MILA_AUDIO_DEFAULTS.speechEnabled,
      speechRate: Object.hasOwn(MILA_SPEECH_RATES, source.speechRate) ? source.speechRate : MILA_AUDIO_DEFAULTS.speechRate,
      turkishVoice: typeof source.turkishVoice === "string" && source.turkishVoice ? source.turkishVoice : "auto",
      englishVoice: typeof source.englishVoice === "string" && source.englishVoice ? source.englishVoice : "auto",
      soundEffectsEnabled: typeof source.soundEffectsEnabled === "boolean" ? source.soundEffectsEnabled : MILA_AUDIO_DEFAULTS.soundEffectsEnabled,
      volume: Object.hasOwn(MILA_AUDIO_VOLUMES, source.volume) ? source.volume : MILA_AUDIO_DEFAULTS.volume
    };
  }

  loadSettings() {
    try {
      return this.sanitizeSettings(JSON.parse(this.getStorage()?.getItem(MILA_AUDIO_SETTINGS_KEY) ?? "null"));
    } catch {
      return { ...MILA_AUDIO_DEFAULTS };
    }
  }

  persistSettings() {
    try {
      this.getStorage()?.setItem(MILA_AUDIO_SETTINGS_KEY, JSON.stringify(this.settings));
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  }

  getSettings() {
    return { ...this.settings };
  }

  setSettings(nextSettings) {
    const previous = this.settings;
    this.settings = this.sanitizeSettings({ ...previous, ...nextSettings });
    this.persistSettings();
    if (previous.speechEnabled && !this.settings.speechEnabled) this.cancelAllSpeech();
    this.resolvePreferredVoices();
    this.settingsListeners.forEach(listener => listener(this.getSettings()));
    return this.getSettings();
  }

  onSettingsChanged(listener) {
    if (typeof listener !== "function") return () => {};
    this.settingsListeners.add(listener);
    return () => this.settingsListeners.delete(listener);
  }

  getSpeechState() {
    return {
      speaking: Boolean(this.activeRequest),
      request: this.activeRequest ? {
        id: this.activeRequest.id,
        text: this.activeRequest.text,
        language: this.activeRequest.language,
        channel: this.activeRequest.channel
      } : undefined
    };
  }

  notifySpeechState() {
    const state = this.getSpeechState();
    this.stateListeners.forEach(listener => listener(state));
  }

  onStateChanged(listener) {
    if (typeof listener !== "function") return () => {};
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  static getVoiceIdentifier(voice) {
    if (!voice) return "auto";
    return [voice.voiceURI || voice.name || "", voice.name || "", voice.lang || ""].map(encodeURIComponent).join("|");
  }

  getVoiceIdentifier(voice) {
    return SpeechService.getVoiceIdentifier(voice);
  }

  getVoices(language) {
    const prefix = language?.toLowerCase().startsWith("tr") ? "tr" : "en";
    return this.voices.filter(voice => (voice.lang || "").toLowerCase().startsWith(prefix));
  }

  findSavedVoice(identifier, language) {
    if (!identifier || identifier === "auto") return undefined;
    return this.getVoices(language).find(voice => this.getVoiceIdentifier(voice) === identifier);
  }

  findAutomaticVoice(language) {
    const prefix = language === "tr" ? "tr" : "en";
    const exactLocales = prefix === "tr" ? ["tr-tr"] : ["en-us", "en-gb"];
    const suitable = this.getVoices(prefix);
    return exactLocales.map(locale => suitable.find(voice => (voice.lang || "").toLowerCase() === locale && voice.localService)).find(Boolean)
      || exactLocales.map(locale => suitable.find(voice => (voice.lang || "").toLowerCase() === locale)).find(Boolean)
      || suitable.find(voice => voice.localService)
      || suitable[0]
      || this.voices.find(voice => voice.default)
      || this.voices[0];
  }

  resolvePreferredVoices() {
    this.turkishVoice = this.findSavedVoice(this.settings.turkishVoice, "tr") || this.findAutomaticVoice("tr");
    this.englishVoice = this.findSavedVoice(this.settings.englishVoice, "en") || this.findAutomaticVoice("en");
  }

  cacheVoices() {
    if (!this.supported) return false;
    let voices = [];
    try {
      voices = this.synthesis.getVoices() || [];
    } catch {
      voices = [];
    }
    const signature = voices.map(voice => `${voice.voiceURI || voice.name}:${voice.lang}:${Boolean(voice.localService)}`).join("|");
    if (signature === this.voiceSignature) return voices.length > 0;
    this.voiceSignature = signature;
    this.voices = voices.filter(voice => voice && typeof voice.lang === "string");
    this.resolvePreferredVoices();
    this.voiceListeners.forEach(listener => listener(this.voices));
    return this.voices.length > 0;
  }

  handleVoicesChanged() {
    this.cacheVoices();
  }

  listenForVoices() {
    if (!this.supported || this.isListeningForVoices) return;
    this.synthesis.addEventListener?.("voiceschanged", this.handleVoicesChanged);
    this.isListeningForVoices = true;
  }

  onVoicesChanged(listener) {
    if (typeof listener !== "function") return () => {};
    this.voiceListeners.add(listener);
    return () => this.voiceListeners.delete(listener);
  }

  getVoice(language) {
    return language?.toLowerCase().startsWith("tr") ? this.turkishVoice : this.englishVoice;
  }

  getRate(channel, language) {
    const base = MILA_SPEECH_RATES[this.settings.speechRate];
    if (language?.toLowerCase().startsWith("en") && channel !== "feedback") return Math.max(.72, Math.min(1.05, base * .9));
    if (channel === "feedback" || channel === "celebration") return Math.max(.85, Math.min(1.1, base));
    return Math.max(.75, Math.min(1.1, base));
  }

  getVolume() {
    return Math.max(0, Math.min(1, MILA_AUDIO_VOLUMES[this.settings.volume]));
  }

  getTurkishNumber(value) {
    const number = Number(value);
    if (Number.isInteger(number) && number >= 0 && number < TURKISH_NUMBER_WORDS.length) return TURKISH_NUMBER_WORDS[number];
    return String(value);
  }

  getEnglishNumber(value) {
    const number = Number(value);
    if (Number.isInteger(number) && number >= 0 && number < ENGLISH_NUMBER_WORDS.length) return ENGLISH_NUMBER_WORDS[number];
    return String(value);
  }

  getTurkishAblative(numberWord) {
    const word = String(numberWord).trim();
    const vowels = [...word].filter(letter => "aeıioöuü".includes(letter.toLowerCase()));
    const lastVowel = vowels.at(-1)?.toLowerCase();
    const backVowel = "aıou".includes(lastVowel);
    const hardConsonant = "fstkçşhp".includes(word.at(-1)?.toLowerCase());
    return `${word}${hardConsonant ? "t" : "d"}${backVowel ? "an" : "en"}`;
  }

  normalizeTurkish(text) {
    let spoken = String(text ?? "");
    Object.entries(TURKISH_PRONUNCIATION_OVERRIDES).forEach(([visible, pronunciation]) => {
      spoken = spoken.replace(new RegExp(`\\b${visible}\\b`, "g"), pronunciation);
    });
    spoken = spoken.replace(/(\d+)\s*\+\s*(\d+)\s*=\s*\?/g, (_, left, right) => `${this.getTurkishNumber(left)} artı ${this.getTurkishNumber(right)} kaç eder?`);
    spoken = spoken.replace(/(\d+)\s*-\s*(\d+)\s*=\s*\?/g, (_, left, right) => `${this.getTurkishAblative(this.getTurkishNumber(left))} ${this.getTurkishNumber(right)} çıkarsa kaç kalır?`);
    spoken = spoken.replace(/\b\d+\b/g, value => this.getTurkishNumber(value));
    return spoken.replace(/\s+/g, " ").replace(/\s+([,.!?])/g, "$1").trim();
  }

  normalizeEnglish(text) {
    let spoken = String(text ?? "");
    Object.entries(ENGLISH_PRONUNCIATION_OVERRIDES).forEach(([visible, pronunciation]) => {
      spoken = spoken.replace(new RegExp(`\\b${visible}\\b`, "gi"), pronunciation);
    });
    spoken = spoken.replace(/\b\d+\b/g, value => this.getEnglishNumber(value));
    return spoken.replace(/\s+/g, " ").replace(/\s+([,.!?])/g, "$1").trim();
  }

  normalizePronunciation(text, language) {
    return language?.toLowerCase().startsWith("tr") ? this.normalizeTurkish(text) : this.normalizeEnglish(text);
  }

  finishActiveRequest(completed = false) {
    const resolve = this.activeResolver;
    this.activeResolver = undefined;
    this.activeRequest = undefined;
    resolve?.(completed);
    this.notifySpeechState();
  }

  speakUtterance(request) {
    if (!this.supported || request.generation !== this.generation) return Promise.resolve(false);
    const normalizedText = this.normalizePronunciation(request.text, request.language);
    if (!normalizedText) return Promise.resolve(false);
    return new Promise(resolve => {
      let finished = false;
      const finish = completed => {
        if (finished) return;
        finished = true;
        if (this.activeRequest?.id === request.id) {
          this.activeRequest = undefined;
          this.activeResolver = undefined;
          this.notifySpeechState();
        }
        resolve(Boolean(completed && request.generation === this.generation));
      };
      const voice = this.getVoice(request.language);
      const isTurkish = request.language.toLowerCase().startsWith("tr");
      const utterance = new this.Utterance(normalizedText);
      utterance.lang = voice?.lang || (isTurkish ? "tr-TR" : "en-US");
      utterance.rate = this.getRate(request.channel, request.language);
      utterance.pitch = 1;
      utterance.volume = this.getVolume();
      if (voice) utterance.voice = voice;
      utterance.onend = () => finish(true);
      utterance.onerror = () => finish(false);
      this.activeRequest = request;
      this.activeResolver = finish;
      this.notifySpeechState();
      try {
        this.synthesis.speak(utterance);
      } catch {
        finish(false);
      }
    });
  }

  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request.generation !== this.generation) {
        request.resolve(false);
        continue;
      }
      const completed = await this.speakUtterance(request);
      request.resolve(completed);
    }
    this.isProcessing = false;
  }

  speak(text, language = "en-US", options = {}) {
    const channel = Object.hasOwn(MILA_SPEECH_PRIORITIES, options.channel) ? options.channel : "instruction";
    const automatic = options.automatic !== false;
    if (!this.supported || !String(text ?? "").trim() || (automatic && !this.settings.speechEnabled)) return Promise.resolve(false);
    const shouldInterrupt = options.interrupt !== false && (options.replay || !this.activeRequest || MILA_SPEECH_PRIORITIES[channel] >= MILA_SPEECH_PRIORITIES[this.activeRequest.channel]);
    if (shouldInterrupt) this.cancelAllSpeech();
    return new Promise(resolve => {
      this.queue.push({
        id: ++this.requestId,
        text: String(text),
        language,
        channel,
        generation: this.generation,
        resolve
      });
      this.processQueue();
    });
  }

  speakTurkish(text, options = {}) {
    return this.speak(text, "tr-TR", options);
  }

  speakEnglish(text, options = {}) {
    return this.speak(text, "en-US", options);
  }

  speakPrompt(text, language = "tr-TR", options = {}) {
    return this.speak(text, language, { ...options, channel: "question" });
  }

  speakAnswerChoice(text, language = "en-US", options = {}) {
    return this.speak(text, language, { interrupt: false, ...options, channel: "answer-choice" });
  }

  speakFeedback(text, options = {}) {
    return this.speakTurkish(text, { ...options, channel: "feedback" });
  }

  speakCelebration(text, options = {}) {
    return this.speakTurkish(text, { ...options, channel: "celebration" });
  }

  speakSystem(text, options = {}) {
    return this.speakTurkish(text, { ...options, channel: "system-navigation" });
  }

  replay(text, language = "tr-TR", options = {}) {
    return this.speak(text, language, { ...options, automatic: false, replay: true, interrupt: true, channel: options.channel || "question" });
  }

  preview(language = "tr-TR") {
    const isTurkish = language.toLowerCase().startsWith("tr");
    return this.replay(isTurkish ? "Merhaba! Birlikte oyun oynayalım." : "Hello! Let's learn together.", language, { channel: "system-navigation" });
  }

  cancelAllSpeech() {
    this.generation += 1;
    this.queue.splice(0).forEach(request => request.resolve(false));
    this.finishActiveRequest(false);
    try {
      this.synthesis?.cancel();
    } catch {
      // Cancellation must remain safe on incomplete browser implementations.
    }
  }

  clear() {
    this.cancelAllSpeech();
  }
}

SpeechService.SETTINGS_KEY = MILA_AUDIO_SETTINGS_KEY;
SpeechService.DEFAULT_SETTINGS = MILA_AUDIO_DEFAULTS;
window.MilaSpeechService = SpeechService;
