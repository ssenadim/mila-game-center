const CELEBRATION_CLASSES = ["celebrate-pop", "celebrate-twirl", "celebrate-bounce"];
const MILESTONE_STREAKS = new Set([3, 5, 10]);
const CELEBRATION_SPARKLES = Object.freeze({
  correct: ["✓"],
  milestone: ["⭐", "✨", "🌟"],
  completion: ["⭐", "✨", "🌟", "⭐", "✨"]
});

class AnimationHelper {
  constructor(visual, celebration, { matchMedia = window.matchMedia?.bind(window) } = {}) {
    this.visual = visual;
    this.celebration = celebration;
    this.matchMedia = matchMedia;
    this.animationTimer = undefined;
    this.effectId = 0;
    this.temporaryCleanups = new Set();
  }

  prefersReducedMotion() {
    try {
      return Boolean(this.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
    } catch {
      return false;
    }
  }

  playEffect(level = "completion") {
    this.clear();
    const effectId = ++this.effectId;
    const reducedMotion = this.prefersReducedMotion();
    const sparkles = CELEBRATION_SPARKLES[level] ?? CELEBRATION_SPARKLES.completion;
    const animationClass = level === "correct"
      ? "celebrate-pop"
      : level === "milestone"
        ? "celebrate-bounce"
        : window.MilaUtils.randomItem(CELEBRATION_CLASSES);

    if (!reducedMotion) {
      this.visual.classList.remove(...CELEBRATION_CLASSES);
      void this.visual.offsetWidth;
      this.visual.classList.add(animationClass);
    }
    this.celebration.replaceChildren(...sparkles.map(symbol => {
      const sparkle = document.createElement("span");
      sparkle.textContent = symbol;
      return sparkle;
    }));
    this.celebration.classList.toggle("burst", !reducedMotion);

    const duration = reducedMotion ? 450 : level === "completion" ? 800 : 620;
    this.animationTimer = window.setTimeout(() => {
      if (effectId !== this.effectId) return;
      this.visual.classList.remove(animationClass);
      this.celebration.classList.remove("burst");
      this.celebration.textContent = "";
      this.animationTimer = undefined;
    }, duration);

    return () => {
      if (effectId === this.effectId) this.clear();
    };
  }

  playCorrectFeedback(streak = 0) {
    return this.playEffect(MILESTONE_STREAKS.has(streak) ? "milestone" : "correct");
  }

  playStageCelebration() {
    return this.playEffect("completion");
  }

  playUnlockAnimation(element) {
    return this.playTemporaryClass(element, "unlock-reveal", 700);
  }

  playRewardReveal(element) {
    return this.playTemporaryClass(element, "reward-reveal", 700);
  }

  playTemporaryClass(element, className, duration) {
    if (!element || this.prefersReducedMotion()) return () => {};
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    let timer;
    const cleanup = () => {
      window.clearTimeout(timer);
      element.classList.remove(className);
      this.temporaryCleanups.delete(cleanup);
    };
    timer = window.setTimeout(cleanup, duration);
    this.temporaryCleanups.add(cleanup);
    return cleanup;
  }

  celebrate() {
    return this.playStageCelebration();
  }

  clear() {
    this.effectId += 1;
    window.clearTimeout(this.animationTimer);
    this.animationTimer = undefined;
    this.visual.classList.remove(...CELEBRATION_CLASSES);
    this.celebration.classList.remove("burst");
    this.celebration.textContent = "";
    [...this.temporaryCleanups].forEach(cleanup => cleanup());
  }
}

class CelebrationCoordinator {
  constructor({ setTimer = window.setTimeout.bind(window), clearTimer = window.clearTimeout.bind(window), canStart = () => true } = {}) {
    this.setTimer = setTimer;
    this.clearTimer = clearTimer;
    this.canStart = canStart;
    this.queue = [];
    this.active = undefined;
    this.timer = undefined;
    this.order = 0;
    this.scheduled = false;
  }

  enqueue({ id, group = "default", priority = 0, duration = 0, show = () => {}, hide = () => {}, complete = () => {} } = {}) {
    if (!id || this.active?.id === id || this.queue.some(item => item.id === id)) return false;
    this.queue.push({ id, group, priority, duration, show, hide, complete, order: ++this.order });
    this.schedule();
    return true;
  }

  hold(id, duration = 800) {
    return this.enqueue({ id, group: "major-completion", priority: 100, duration });
  }

  schedule() {
    if (this.scheduled || this.active) return;
    this.scheduled = true;
    Promise.resolve().then(() => {
      this.scheduled = false;
      this.flush();
    });
  }

  flush() {
    if (this.active || !this.queue.length || !this.canStart()) return false;
    this.queue.sort((first, second) => second.priority - first.priority || first.order - second.order);
    const item = this.queue.shift();
    this.active = item;
    try {
      item.show();
    } catch {
      // A visual effect must never block the rest of the queue.
    }
    this.timer = this.setTimer(() => this.finishActive(), Math.max(0, item.duration));
    return true;
  }

  finishActive() {
    const item = this.active;
    if (!item) return;
    this.active = undefined;
    this.timer = undefined;
    try {
      item.hide();
    } finally {
      try {
        item.complete();
      } catch {
        // A completion callback must not strand later celebrations.
      }
      this.schedule();
    }
  }

  cancelGroup(group) {
    this.queue = this.queue.filter(item => item.group !== group);
    if (this.active?.group !== group) return;
    this.clearTimer(this.timer);
    const item = this.active;
    this.active = undefined;
    this.timer = undefined;
    try {
      item.hide();
    } catch {
      // Cancellation remains safe if a popup was already removed.
    }
    this.schedule();
  }

  hasGroup(group) {
    return this.active?.group === group || this.queue.some(item => item.group === group);
  }

  clear() {
    this.clearTimer(this.timer);
    this.timer = undefined;
    const active = this.active;
    this.active = undefined;
    this.queue = [];
    try {
      active?.hide();
    } catch {
      // Navigation cleanup must always finish.
    }
  }
}

window.MilaAnimationHelper = AnimationHelper;
window.MilaCelebrationCoordinator = CelebrationCoordinator;
