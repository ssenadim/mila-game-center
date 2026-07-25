const CELEBRATION_CLASSES = ["celebrate-pop", "celebrate-twirl", "celebrate-bounce"];

class AnimationHelper {
  constructor(visual, celebration) {
    this.visual = visual;
    this.celebration = celebration;
  }

  celebrate() {
    const animationClass = window.MilaUtils.randomItem(CELEBRATION_CLASSES);
    this.visual.classList.remove(...CELEBRATION_CLASSES);
    void this.visual.offsetWidth;
    this.visual.classList.add(animationClass);
    window.setTimeout(() => this.visual.classList.remove(animationClass), 800);
    this.celebration.innerHTML = "<span>⭐</span><span>✨</span><span>🌟</span><span>⭐</span><span>✨</span>";
    this.celebration.classList.remove("burst");
    void this.celebration.offsetWidth;
    this.celebration.classList.add("burst");
  }
}

window.MilaAnimationHelper = AnimationHelper;
