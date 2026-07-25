class SpeechService {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.activeResolver = undefined;
    this.englishVoice = undefined;
    this.turkishVoice = undefined;
    this.voiceSignature = "";
    this.voiceReadyResolver = undefined;
    this.voiceFallbackTimer = undefined;
    this.handleVoicesChanged = this.handleVoicesChanged.bind(this);
    this.ready = this.loadVoices();
  }

  findVoice(voices, language) {
    const languages = language === "en" ? ["en-us", "en-gb"] : ["tr-tr"];
    const getLanguage = voice => (voice.lang ?? "").toLowerCase();
    return languages.map(preferredLanguage => voices.find(voice => getLanguage(voice) === preferredLanguage)).find(Boolean)
      || voices.find(voice => getLanguage(voice).startsWith(language));
  }

  cacheVoices() {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    const signature = voices.map(voice => `${voice.voiceURI}:${voice.lang}`).join("|");
    if (signature === this.voiceSignature) return voices.length > 0;
    this.voiceSignature = signature;
    this.englishVoice = this.findVoice(voices, "en");
    this.turkishVoice = this.findVoice(voices, "tr");
    return voices.length > 0;
  }

  handleVoicesChanged() {
    if (!this.cacheVoices() || !this.voiceReadyResolver) return;
    window.clearTimeout(this.voiceFallbackTimer);
    const resolve = this.voiceReadyResolver;
    this.voiceReadyResolver = undefined;
    resolve();
  }

  listenForVoices() {
    if (!window.speechSynthesis || this.isListeningForVoices) return;
    window.speechSynthesis.addEventListener("voiceschanged", this.handleVoicesChanged);
    this.isListeningForVoices = true;
  }

  loadVoices() {
    if (!("speechSynthesis" in window)) return Promise.resolve();
    this.listenForVoices();
    if (this.cacheVoices()) return Promise.resolve();
    return new Promise(resolve => {
      this.voiceReadyResolver = resolve;
      this.voiceFallbackTimer = window.setTimeout(() => {
        this.voiceReadyResolver = undefined;
        resolve();
      }, 2000);
    });
  }

  getVoice(language) {
    return language.toLowerCase().startsWith("tr") ? this.turkishVoice : this.englishVoice;
  }

  speakUtterance(text, language) {
    if (!("speechSynthesis" in window)) return Promise.resolve();
    return new Promise(resolve => {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        if (this.activeResolver === finish) this.activeResolver = undefined;
        resolve();
      };
      const isTurkish = language.toLowerCase().startsWith("tr");
      const voice = this.getVoice(language);
      if (isTurkish && !voice) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voice?.lang || (isTurkish ? "tr-TR" : "en-US");
      utterance.rate = .8;
      utterance.volume = .88;
      if (voice) utterance.voice = voice;
      utterance.onend = utterance.onerror = finish;
      this.activeResolver = finish;
      window.speechSynthesis.speak(utterance);
    });
  }

  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    await this.ready;
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      await this.speakUtterance(request.text, request.language);
      request.resolve();
      if (this.queue.length > 0) await new Promise(resolve => window.setTimeout(resolve, 90));
    }
    this.isProcessing = false;
  }

  speak(text, language = "en-US") {
    return new Promise(resolve => {
      this.queue.push({ text, language, resolve });
      this.processQueue();
    });
  }

  clear() {
    this.queue.splice(0).forEach(request => request.resolve());
    this.activeResolver?.();
    window.speechSynthesis?.cancel();
  }
}

window.MilaSpeechService = SpeechService;
