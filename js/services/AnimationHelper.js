const CELEBRATION_CLASSES = ["celebrate-pop", "celebrate-twirl", "celebrate-bounce"];

class AnimationHelper {
  constructor(visual, celebration) {
    this.visual = visual;
    this.celebration = celebration;
    this.animationTimer = undefined;
  }

  celebrate() {
    window.clearTimeout(this.animationTimer);
    const animationClass = window.MilaUtils.randomItem(CELEBRATION_CLASSES);
    this.visual.classList.remove(...CELEBRATION_CLASSES);
    void this.visual.offsetWidth;
    this.visual.classList.add(animationClass);
    this.animationTimer = window.setTimeout(() => {
      this.visual.classList.remove(animationClass);
      this.animationTimer = undefined;
    }, 800);
    this.celebration.innerHTML = "<span>⭐</span><span>✨</span><span>🌟</span><span>⭐</span><span>✨</span>";
    this.celebration.classList.remove("burst");
    void this.celebration.offsetWidth;
    this.celebration.classList.add("burst");
  }

  clear() {
    window.clearTimeout(this.animationTimer);
    this.animationTimer = undefined;
    this.visual.classList.remove(...CELEBRATION_CLASSES);
    this.celebration.classList.remove("burst");
    this.celebration.textContent = "";
  }
}

window.MilaAnimationHelper = AnimationHelper;
