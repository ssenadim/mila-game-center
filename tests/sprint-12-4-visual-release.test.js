"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const worker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const educationalObjects = require("../js/EducationalObjects.js");
const illustrations = require("../js/Illustrations.js");
const worlds = require("../js/WorldThemes.js");
const bonuses = require("../js/BonusManager.js");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function sourcePath(source) {
  return source.split("?")[0].replaceAll("/", path.sep);
}

test("Sprint 12.4 visual inventory is complete, local, referenced and lightweight", () => {
  const assetRoot = path.join(root, "assets", "illustrations");
  const files = walk(assetRoot).filter(file => file.endsWith(".svg"));
  const registeredSources = new Set(illustrations.ILLUSTRATIONS.map(item => path.join(root, sourcePath(item.src))));
  assert.equal(files.length, 133);
  assert.equal(illustrations.ILLUSTRATIONS.length, 133);
  assert.deepEqual(new Set(files.map(file => path.resolve(file))), new Set([...registeredSources].map(file => path.resolve(file))));

  const sizes = files.map(file => fs.statSync(file).size);
  // Original local vectors now include the Sprint 13.5 gradient/shadow material.
  assert.ok(sizes.reduce((sum, size) => sum + size, 0) < 185_000);
  assert.ok(Math.max(...sizes) < 4_000);
  files.forEach(file => {
    const source = fs.readFileSync(file, "utf8");
    assert.match(source, /^<svg\b/);
    assert.doesNotMatch(source, /<(?:script|foreignObject|image)\b|\son[a-z]+\s*=|\b(?:href|src)\s*=\s*["'](?:https?:|data:|\/\/)/i, file);
  });
});

test("all semantic objects and puzzle scenes resolve and the potato is visually distinct", () => {
  assert.equal(educationalObjects.OBJECTS.length, 84);
  assert.equal(educationalObjects.PUZZLE_SCENES.length, 16);
  [...educationalObjects.OBJECTS, ...educationalObjects.PUZZLE_SCENES].forEach(item => {
    assert.equal(fs.existsSync(path.join(root, sourcePath(item.src))), true, item.id);
  });
  const potato = fs.readFileSync(path.join(root, "assets", "illustrations", "objects", "object-potato.svg"), "utf8");
  assert.match(potato, /<ellipse\b/g);
  assert.match(potato, /(?:fill|stop-color)="#8f6544"/);
  assert.doesNotMatch(potato, /m55 43 17 6 8-17/);
});

test("small-screen polish protects the Home copy and keeps child controls touch friendly", () => {
  assert.match(css, /#welcome-sound-button\{min-height:44px;padding:8px 14px\}/);
  assert.match(css, /@media\(max-width:360px\)\{\s*\.world-decoration\{display:none\}\s*\}/);
  assert.match(css, /\.game-shell\{overflow:clip\}/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)[\s\S]*animation:none!important/);
});

test("setup-to-play transitions reset scroll without timeouts", () => {
  ["startMatchingSession", "startShadowSession", "startSoundMemorySession", "startPuzzleSession"].forEach(name => {
    const start = app.indexOf(`function ${name}`);
    const end = app.indexOf("\nfunction ", start + 10);
    const body = app.slice(start, end < 0 ? undefined : end);
    assert.match(body, /window\.scrollTo\(\{ top: 0, left: 0, behavior: "auto" \}\)/, name);
    assert.doesNotMatch(body, /setTimeout[^\n]*scroll/i, name);
  });
});

test("ten worlds and five bonus surfaces remain complete after visual polish", () => {
  assert.equal(worlds.WORLD_THEMES.length, 10);
  assert.deepEqual(worlds.WORLD_THEMES.map(theme => theme.id), worlds.REQUIRED_THEME_IDS);
  assert.equal(bonuses.BONUS_REGISTRY.length, 5);
  assert.deepEqual(bonuses.BONUS_REGISTRY.map(bonus => bonus.id), bonuses.REQUIRED_BONUS_IDS);
  bonuses.REQUIRED_BONUS_IDS.forEach(id => assert.match(css, new RegExp(id === "balloon" ? "balloon-bonus" : id)));
  assert.match(css, /\.bonus-choice\.balloon\{font-size:clamp\(1\.05rem,4vw,1\.35rem\)\}/);
});

test("offline shell stays bounded with core objects while other local art is cached on first use", () => {
  assert.match(worker, /const APP_VERSION = "1\.0\.5"/);
  assert.match(worker, /const APP_SHELL = \["\.\/", "\.\/index\.html", \.\.\.VERSIONED_ASSETS, \.\.\.ILLUSTRATION_ASSETS\]/);
  assert.match(worker, /if \(url\.origin === self\.location\.origin\) event\.respondWith\(handleLocalAsset\(request\)\)/);
  const context = { self: { addEventListener() {} } };
  require("node:vm").runInNewContext(worker + ";globalThis.targets = APP_SHELL;", context);
  const targets = new Set(context.targets.map(source => source.replace(/^\.\//, "").split("?")[0]));
  const coreIds = new Set(["apple", "strawberry", "pear", "cat", "rabbit", "fish", "car", "bus", "airplane", "ball", "kite", "pencil", "seahorse", "tree", "broccoli", "dog", "lion"]);
  educationalObjects.OBJECTS.forEach(item => assert.equal(targets.has(sourcePath(item.src).replaceAll(path.sep, "/")), coreIds.has(item.id), item.id));
  assert.equal(coreIds.size, 17);
  educationalObjects.PUZZLE_SCENES.forEach(item => assert.equal(worker.includes(sourcePath(item.src).replaceAll(path.sep, "/")), false, item.id));
});
