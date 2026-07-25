const SUCCESS_SOUND_PATTERNS = [[523, 659, 784], [659, 784, 1047], [523, 784, 659]];
const CELEBRATION_SOUND_PATTERNS = [[523, 659, 784, 1047], [659, 784, 988, 1175]];
const BUTTON_SOUND_FREQUENCY = 392;

class AudioHelper {
  constructor() {
    this.context = undefined;
    this.nextSoundTime = 0;
  }

  getContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return undefined;
    this.context ??= new AudioContext();
    if (this.context.state === "suspended") this.context.resume();
    return this.context;
  }

  getStartTime() {
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
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + .015);
    gain.gain.exponentialRampToValueAtTime(.0001, startTime + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + .01);
  }
}

window.MilaAudioHelper = AudioHelper;
