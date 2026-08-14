const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const worlds = require("../js/WorldThemes.js");
const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

function createRoot() {
  const attributes = new Map();
  return {
    attributes,
    setAttribute(name, value) { attributes.set(name, value); },
    getAttribute(name) { return attributes.get(name); }
  };
}

function createStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); }
  };
}

test("registry contains exactly the ten complete required worlds", () => {
  assert.equal(worlds.validateRegistry().valid, true);
  assert.deepEqual(worlds.WORLD_THEMES.map(theme => theme.id), worlds.REQUIRED_THEME_IDS);
  assert.equal(new Set(worlds.WORLD_THEMES.map(theme => theme.id)).size, 10);
  worlds.WORLD_THEMES.forEach(theme => {
    assert.ok(theme.name);
    assert.ok(theme.icon);
    assert.ok(theme.subtitle);
    assert.match(css, new RegExp(`data-world-theme="${theme.id}"`));
  });
  assert.equal(worlds.DEFAULT_THEME_ID, "sunny");
  assert.equal(worlds.isValidThemeId(worlds.DEFAULT_THEME_ID), true);
});

test("manager replaces the root theme and repeated switching never stacks classes or nodes", () => {
  const rootElement = createRoot();
  const manager = new worlds.WorldThemeManager({ rootElement });
  worlds.REQUIRED_THEME_IDS.forEach(themeId => {
    assert.equal(manager.apply(themeId), themeId);
    assert.equal(rootElement.getAttribute("data-world-theme"), themeId);
  });
  manager.apply("spring");
  manager.apply("spring");
  assert.equal(rootElement.attributes.size, 1);
  assert.equal((html.match(/class="world-decoration /g) ?? []).length, 5);
  assert.doesNotMatch(app, /appendChild\([^)]*world-decoration/);
});

test("invalid themes fall back safely to Güneşli Dünya", () => {
  const warnings = [];
  const rootElement = createRoot();
  const manager = new worlds.WorldThemeManager({ rootElement, warn: message => warnings.push(message) });
  assert.equal(manager.apply("unknown-world"), "sunny");
  assert.equal(rootElement.getAttribute("data-world-theme"), "sunny");
  assert.equal(warnings.length, 1);
});

test("theme choice persists per player without changing unrelated saved progress", () => {
  const progress = JSON.stringify({ stars: 18, stage: "addition-2" });
  const storage = createStorage({ "mila-learning-progress-Mila": progress });
  const firstRoot = createRoot();
  const manager = new worlds.WorldThemeManager({ rootElement: firstRoot, storage });
  manager.save("space", "Mila");
  manager.save("forest", "Deniz");

  assert.equal(storage.getItem(worlds.playerStorageKey("Mila")), "space");
  assert.equal(storage.getItem(worlds.playerStorageKey("Deniz")), "forest");
  assert.equal(storage.getItem("mila-learning-progress-Mila"), progress);

  const restored = new worlds.WorldThemeManager({ rootElement: createRoot(), storage });
  assert.equal(restored.restore("Mila"), "space");
  assert.equal(restored.restore("Deniz"), "forest");
  assert.equal(restored.restore("Yeni Oyuncu"), "sunny");
});

test("invalid saved data and unavailable storage do not break startup", () => {
  const invalidStorage = createStorage({ [worlds.playerStorageKey("Mila")]: "lava" });
  const manager = new worlds.WorldThemeManager({ rootElement: createRoot(), storage: invalidStorage });
  assert.equal(manager.restore("Mila"), "sunny");

  const failingStorage = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("blocked"); }
  };
  const safeManager = new worlds.WorldThemeManager({ rootElement: createRoot(), storage: failingStorage });
  assert.equal(safeManager.restore("Mila"), "sunny");
  assert.equal(safeManager.save("night", "Mila"), "night");
});

test("global control, accessible dialog, all option rendering and focus lifecycle are wired", () => {
  const fullscreenIndex = html.indexOf('id="fullscreen-button"');
  const worldIndex = html.indexOf('id="world-theme-button"');
  const settingsIndex = html.indexOf('id="settings-button"');
  assert.ok(fullscreenIndex < worldIndex && worldIndex < settingsIndex);
  assert.match(html, /id="world-theme-panel"[\s\S]*role="dialog"[\s\S]*aria-modal="true"/);
  assert.match(html, /id="world-theme-close"[\s\S]*aria-label="Oyun Dünyası seçimini kapat"/);
  assert.match(app, /WORLD_THEMES\.forEach/);
  assert.match(app, /parentWorldTheme\.textContent = worldThemeManager\.getTheme\(\)\?\.name/);
  assert.doesNotMatch(app, /parentWorldTheme\.textContent = worldThemeManager\.getTheme\(\)\?\.title/);
  assert.match(app, /button\.type = "button"/);
  assert.match(app, /setAttribute\("aria-pressed"/);
  assert.match(app, /worldThemeClose\.focus/);
  assert.match(app, /returnTarget\.focus/);
  assert.match(app, /event\.key !== "Tab"/);
  assert.match(app, /event\.key === "Escape"/);
  assert.equal((app.match(/worldThemeButton\.addEventListener/g) ?? []).length, 1);
});

test("decorations are inert and reduced motion keeps static themes", () => {
  assert.match(html, /class="world-decorations" aria-hidden="true"/);
  assert.match(css, /\.world-decorations\{[^}]*pointer-events:none/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)[\s\S]*\.world-decoration\{animation:none!important\}/);
  assert.match(css, /\.world-theme-option:focus-visible/);
  assert.match(css, /\.world-theme-modal\{[^}]*z-index:50/);
});

test("theme switching is isolated from game state and requires no reload, audio or network asset", () => {
  const moduleSource = fs.readFileSync(path.join(root, "js", "WorldThemes.js"), "utf8");
  assert.doesNotMatch(moduleSource, /location\.reload|fetch\(|Audio|question|score|progress/);
  assert.doesNotMatch(css, /url\(/);
  assert.doesNotMatch(app, /selectWorldTheme[\s\S]{0,500}(resetSession|showQuestion|startGame|clearSavedProgress)/);
});
