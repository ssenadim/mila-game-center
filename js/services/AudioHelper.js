const SUCCESS_SOUND_PATTERNS = [[523, 659, 784], [659, 784, 1047], [523, 784, 659]];
const CELEBRATION_SOUND_PATTERNS = [[523, 659, 784, 1047], [659, 784, 988, 1175]];
const BUTTON_SOUND_FREQUENCY = 392;
const AUDIO_VOLUME_LEVELS = Object.freeze({ low: .45, normal: .75, high: 1 });

class AudioHelper {
  constructor(settingsProvider = () => ({})) {
    this.context = undefined;
    this.nextSoundTime = 0;
    this.activeOscillators = new Set();
    this.settingsProvider = settingsProvider;
  }

  getSettings() {
    const settings = this.settingsProvider?.() ?? {};
    return {
      soundEffectsEnabled: settings.soundEffectsEnabled !== false,
      volume: Object.hasOwn(AUDIO_VOLUME_LEVELS, settings.volume) ? settings.volume : "normal"
    };
  }

  getContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return undefined;
    this.context ??= new AudioContext();
    if (this.context.state === "suspended") this.context.resume()?.catch?.(() => {});
    return this.context;
  }

  getStartTime() {
    if (!this.getSettings().soundEffectsEnabled) return undefined;
    const context = this.getContext();
    if (!context) return undefined;
    const startTime = Math.max(context.currentTime + .015, this.nextSoundTime);
    this.nextSoundTime = startTime;
    return startTime;
  }

  playButton() {
    const startTime = this.getStartTime();
    if (startTime === undefined) return;
    this.playTone(BUTTON_SOUND_FREQUENCY, startTime, .045, .025);
    this.nextSoundTime = startTime + .06;
  }

  playSuccess() {
    const startTime = this.getStartTime();
    if (startTime === undefined) return;
    window.MilaUtils.randomItem(SUCCESS_SOUND_PATTERNS).forEach((frequency, index) => this.playTone(frequency, startTime + index * .1, .14, .075));
    this.nextSoundTime = startTime + .34;
  }

  playCelebration() {
    const startTime = this.getStartTime();
    if (startTime === undefined) return;
    window.MilaUtils.randomItem(CELEBRATION_SOUND_PATTERNS).forEach((frequency, index) => this.playTone(frequency, startTime + index * .11, .2, .07));
    this.nextSoundTime = startTime + .55;
  }

  playTone(frequency, startTime, duration, volume) {
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const volumeMultiplier = AUDIO_VOLUME_LEVELS[this.getSettings().volume];
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(.0001, volume * volumeMultiplier), startTime + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, startTime + duration);
    oscillator.connect(gain).connect(this.context.destination);
    this.activeOscillators.add(oscillator);
    oscillator.onended = () => {
      this.activeOscillators.delete(oscillator);
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + .01);
  }

  stopAll() {
    this.nextSoundTime = 0;
    this.activeOscillators.forEach(oscillator => {
      try {
        oscillator.stop();
      } catch {
        // The oscillator may already have ended.
      }
    });
    this.activeOscillators.clear();
  }

  getCapabilities() {
    return { webAudio: Boolean(window.AudioContext || window.webkitAudioContext) };
  }
}

window.MilaAudioHelper = AudioHelper;
