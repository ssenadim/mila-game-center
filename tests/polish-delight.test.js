"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const animationSource = fs.readFileSync(path.join(root, "js", "services", "AnimationHelper.js"), "utf8");
const speechSource = fs.readFileSync(path.join(root, "js", "services", "SpeechService.js"), "utf8");

function createClassList() {
  const values = new Set();
  return {
    add(...names) { names.forEach(name => values.add(name)); },
    remove(...names) { names.forEach(name => values.delete(name)); },
    toggle(name, force) {
      if (force === true || (force === undefined && !values.has(name))) values.add(name);
      else values.delete(name);
    },
    contains(name) { return values.has(name); },
    values
  };
}

function createAnimationEnvironment({ reducedMotion = false, canStart = () => true } = {}) {
  const timers = new Map();
  let timerId = 0;
  const window = {
    MilaUtils: { randomItem(items) { return items[0]; } },
    matchMedia() { return { matches: reducedMotion }; },
    setTimeout(callback) { const id = ++timerId; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); }
  };
  const document = { createElement() { return { textContent: "" }; } };
  vm.runInNewContext(animationSource, { window, document, Promise, console });
  return {
    AnimationHelper: window.MilaAnimationHelper,
    CelebrationCoordinator: window.MilaCelebrationCoordinator,
    timers,
    canStart
  };
}

function createVisuals() {
  const visual = { classList: createClassList(), offsetWidth: 10 };
  const celebration = {
    classList: createClassList(),
    children: [],
    replaceChildren(...children) { this.children = children; },
    get textContent() { return this.children.map(child => child.textContent).join(""); },
    set textContent(value) { if (value === "") this.children = []; }
  };
  return { visual, celebration };
}

test("correct delight stays bounded, cleans up and reduced motion remains functional", () => {
  const environment = createAnimationEnvironment();
  const { visual, celebration } = createVisuals();
  const helper = new environment.AnimationHelper(visual, celebration);
  helper.playCorrectFeedback(3);
  assert.equal(celebration.children.length, 3);
  assert.equal(visual.classList.contains("celebrate-bounce"), true);

  helper.playCorrectFeedback(1);
  assert.equal(celebration.children.length, 1);
  assert.equal(environment.timers.size, 1);
  [...environment.timers.values()][0]();
  assert.equal(celebration.children.length, 0);
  const popup = { classList: createClassList(), offsetWidth: 10 };
  helper.playRewardReveal(popup);
  assert.equal(popup.classList.contains("reward-reveal"), true);
  helper.clear();
  assert.equal(popup.classList.contains("reward-reveal"), false);

  const reduced = createAnimationEnvironment({ reducedMotion: true });
  const reducedVisuals = createVisuals();
  const reducedHelper = new reduced.AnimationHelper(reducedVisuals.visual, reducedVisuals.celebration);
  reducedHelper.playCorrectFeedback(5);
  assert.equal(reducedVisuals.celebration.children.length, 3);
  assert.equal(reducedVisuals.visual.classList.values.size, 0);
});

test("celebration coordination prioritizes completion and safely drains unique lower-priority popups", async () => {
  let allowed = false;
  const environment = createAnimationEnvironment();
  const shown = [];
  const coordinator = new environment.CelebrationCoordinator({
    setTimer: () => 1,
    clearTimer: () => {},
    canStart: () => allowed
  });
  assert.equal(coordinator.enqueue({ id: "sticker", group: "reward", priority: 40, show: () => shown.push("sticker") }), true);
  assert.equal(coordinator.enqueue({ id: "sticker", group: "reward", priority: 40 }), false);
  coordinator.enqueue({ id: "daily", group: "daily-mission", priority: 60, show: () => shown.push("daily") });
  coordinator.enqueue({ id: "achievement", group: "achievement", priority: 80, show: () => shown.push("achievement") });
  coordinator.hold("stage", 900);
  await Promise.resolve();
  assert.deepEqual(shown, []);

  allowed = true;
  coordinator.flush();
  assert.equal(coordinator.active.group, "major-completion");
  coordinator.finishActive();
  await Promise.resolve();
  assert.deepEqual(shown, ["achievement"]);
  coordinator.finishActive();
  await Promise.resolve();
  coordinator.finishActive();
  await Promise.resolve();
  assert.deepEqual(shown, ["achievement", "daily", "sticker"]);
  coordinator.finishActive();
  assert.equal(coordinator.active, undefined);
  assert.equal(coordinator.queue.length, 0);
});

test("SpeechService publishes speaking start, end and cancellation without stale state", async () => {
  const spoken = [];
  class MockUtterance { constructor(text) { this.text = text; } }
  const synthesis = {
    getVoices() { return []; },
    addEventListener() {},
    speak(utterance) { spoken.push(utterance); },
    cancel() {}
  };
  const window = {
    speechSynthesis: synthesis,
    SpeechSynthesisUtterance: MockUtterance,
    localStorage: { getItem() { return null; }, setItem() {} }
  };
  vm.runInNewContext(speechSource, { window, console, encodeURIComponent, setTimeout, clearTimeout });
  const service = new window.MilaSpeechService();
  await service.ready;
  const states = [];
  service.onStateChanged(state => states.push(state.speaking));
  const first = service.replay("Dinle", "tr-TR");
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(states.at(-1), true);
  spoken[0].onend();
  assert.equal(await first, true);
  assert.equal(states.at(-1), false);

  const second = service.replay("Tekrar", "tr-TR");
  await new Promise(resolve => setImmediate(resolve));
  service.cancelAllSpeech();
  assert.equal(await second, false);
  assert.equal(states.at(-1), false);
  assert.equal(service.getSpeechState().speaking, false);
});

test("screen, focus, unlock, layering and fallback polish are wired without changing persistence", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.match(css, /--motion-fast:140ms/);
  assert.match(css, /\.screen:not\(\.hidden\)\{animation:milaScreenEnter/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /--layer-modal:50/);
  assert.match(css, /world-decorations[^}]*pointer-events:none/);
  assert.match(app, /hideAllScreens\(\);[\s\S]{0,500}view\.classList\.remove\("hidden"\)/);
  assert.match(app, /showPrimaryView\(selectedPlayer \? "home" : "players", \{ focus: false \}\)/);
  assert.match(app, /if \(progress\.completed\[activeLearningPathStage\.id\]\) return false;[\s\S]{0,350}pendingLearningPathUnlock/);
  assert.match(app, /speech\.onStateChanged\(updateSpeakingControl\)/);
  assert.match(html, /id="learning-path-unlock"[^>]*class="learning-path-unlock hidden"/);
  assert.match(html, /Henüz sticker kazanmadın\. Oynadıkça burada görünecek!/);
  assert.match(html, /mila-learning-world-theme-\$\{encodeURIComponent\(player\)\}/);
  assert.doesNotMatch(animationSource, /localStorage|sessionStorage/);
});
