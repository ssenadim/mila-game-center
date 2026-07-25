class SpeechService {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.activeResolver = undefined;
    this.englishVoice = undefined;
    this.turkishVoice = undefined;
    this.ready = this.loadVoices();
  }

  findVoice(voices, language) {
    const baseLanguage = language.split("-")[0];
    return voices.find(voice => voice.lang.toLowerCase() === language)
      || voices.find(voice => voice.lang.toLowerCase().startsWith(baseLanguage));
  }

  cacheVoices() {
    const voices = window.speechSynthesis?.getVoices() ?? [];
    this.englishVoice = this.findVoice(voices, "en-us");
    this.turkishVoice = this.findVoice(voices, "tr-tr");
    return voices.length > 0;
  }

  loadVoices() {
    if (!("speechSynthesis" in window)) return Promise.resolve();
    return new Promise(resolve => {
      let fallbackTimer;
      const finish = () => {
        window.clearTimeout(fallbackTimer);
        window.speechSynthesis.onvoiceschanged = null;
        this.cacheVoices();
        resolve();
      };
      if (this.cacheVoices()) finish();
      else {
        window.speechSynthesis.onvoiceschanged = () => {
          if (this.cacheVoices()) finish();
        };
        fallbackTimer = window.setTimeout(finish, 2000);
      }
    });
  }

  getVoice(language) {
    return language.startsWith("tr") ? this.turkishVoice : this.englishVoice;
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
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = .82;
      const voice = this.getVoice(language);
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
