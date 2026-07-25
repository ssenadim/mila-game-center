const SUCCESS_SOUND_PATTERNS = [[523, 659, 784], [659, 784, 1047], [523, 784, 659]];

class AudioHelper {
  constructor() {
    this.context = undefined;
  }

  playSuccess() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.context ??= new AudioContext();
    if (this.context.state === "suspended") this.context.resume();
    const startTime = this.context.currentTime;
    window.MilaUtils.randomItem(SUCCESS_SOUND_PATTERNS).forEach((frequency, index) => this.playTone(frequency, startTime + index * .12));
  }

  playTone(frequency, startTime) {
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(.13, startTime + .02);
    gain.gain.exponentialRampToValueAtTime(.0001, startTime + .18);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + .19);
  }
}

window.MilaAudioHelper = AudioHelper;
