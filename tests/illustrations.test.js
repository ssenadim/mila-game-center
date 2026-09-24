"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const worker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const illustrations = require(path.join(root, "js", "Illustrations.js"));
const educationalObjects = require(path.join(root, "js", "EducationalObjects.js"));

function localAssetPath(source) {
  return path.join(root, source.split(/[?#]/, 1)[0]);
}

test("illustration registry is centralized, unique, local and complete", () => {
  const result = illustrations.validateRegistry();
  assert.equal(result.valid, true, result.errors.join("\n"));
  const expectedCount = 33 + educationalObjects.OBJECTS.length + educationalObjects.PUZZLE_SCENES.length;
  assert.equal(illustrations.ILLUSTRATIONS.length, expectedCount);
  assert.equal(new Set(illustrations.ILLUSTRATIONS.map(entry => entry.id)).size, expectedCount);
  assert.equal(new Set(illustrations.ILLUSTRATIONS.map(entry => entry.src)).size, expectedCount);
  illustrations.ILLUSTRATIONS.forEach(entry => {
    assert.match(entry.src, /^assets\/illustrations\/.+\.svg\?v=1\.0\.4$/);
    assert.doesNotMatch(entry.src, /^(?:https?:)?\/\//i);
    assert.ok(entry.alt.trim().length >= (entry.category === "educational" ? 2 : 8), entry.id);
    assert.ok(entry.type && entry.theme && entry.category && entry.fallback, entry.id);
  });
});

test("every registered SVG exists, is safe static artwork and stays lightweight", () => {
  let totalBytes = 0;
  illustrations.ILLUSTRATIONS.forEach(entry => {
    const filePath = localAssetPath(entry.src);
    assert.equal(fs.existsSync(filePath), true, entry.src);
    const source = fs.readFileSync(filePath, "utf8");
    const bytes = fs.statSync(filePath).size;
    totalBytes += bytes;
    assert.match(source, /^<svg[^>]+viewBox="0 0 (?:160 120|160 160|600 600)"/);
    assert.doesNotMatch(source, /<(?:script|foreignObject|image|text)\b/i);
    assert.doesNotMatch(source, /\b(?:href|src)\s*=/i);
    assert.doesNotMatch(source.replace("http://www.w3.org/2000/svg", ""), /https?:\/\//i);
    assert.ok(bytes < 12_000, `${entry.id}: ${bytes} bayt`);
  });
  assert.ok(totalBytes < 300_000, `Toplam illüstrasyon boyutu ${totalBytes} bayt`);
});

test("all first-wave child surfaces receive professional illustration identities", () => {
  const staticIds = [
    "home-learn", "home-mini-games", "home-learning-path", "home-rewards",
    "learning-path", "learning-modes", "learning-category-packs", "learning-custom-category",
    "mini-game-matching", "mini-game-listening", "mini-game-number", "mini-game-color", "mini-game-sorting",
    "mini-game-missing", "mini-game-shadow", "mini-game-initial-letter", "mini-game-sound-memory", "mini-game-puzzle",
    "mission-daily", "rewards-stars", "rewards-stickers", "rewards-achievements", "empty-stickers"
  ];
  staticIds.forEach(id => assert.match(html, new RegExp(`data-illustration="${id}"`), id));
  ["first-discoveries", "word-world", "number-world", "first-operations", "think-find", "daily-life"].forEach(id => {
    assert.match(app, /`path-\$\{group\.id\}`/);
    assert.ok(illustrations.get(`path-${id}`));
  });
  assert.equal((html.match(/class="mode-button[^>]+data-illustration="mini-game-/g) || []).length, 10);
  assert.equal((html.match(/class="home-navigation-card[^>]+data-illustration="home-/g) || []).length, 4);
});

test("shared renderer keeps art decorative, lazy by default and falls back safely", () => {
  const source = fs.readFileSync(path.join(root, "js", "Illustrations.js"), "utf8");
  assert.match(source, /frame\.setAttribute\("aria-hidden", "true"\)/);
  assert.match(source, /image\.alt = ""/);
  assert.match(source, /image\.loading = eager \? "eager" : "lazy"/);
  assert.match(source, /frame\.classList\.add\("is-broken"\)/);
  assert.match(css, /\.illustration-frame\.is-broken \.illustration-fallback\{opacity:1\}/);
  assert.doesNotMatch(html, /<img[^>]+alt="(?:Öğren|Mini Oyunlar|Öğrenme Yolu|Kazandıklarım)"/);
});

test("art tokens, responsive grid, reduced motion and offline cache cover the system", () => {
  ["--art-radius-lg", "--art-shadow-soft", "--art-surface", "--art-padding", "--art-card-ratio"].forEach(token => assert.ok(css.includes(token), token));
  assert.match(css, /@media\(max-width:480px\)[\s\S]*\.mini-games-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)[\s\S]*\.home-navigation-card>\.illustration-frame/);
  assert.match(css, /pointer-events:none/);
  assert.match(worker, /\.\.\.ILLUSTRATION_ASSETS/);
  illustrations.ILLUSTRATIONS.filter(entry => illustrations.REQUIRED_FIRST_WAVE_IDS.includes(entry.id)).forEach(entry => {
    const unversioned = `./${entry.src.split("?", 1)[0]}`;
    assert.ok(worker.includes(`"${unversioned}"`), entry.id);
  });
  educationalObjects.OBJECTS.forEach(entry => assert.equal(worker.includes(entry.src.split("?", 1)[0]), false, entry.id));
  educationalObjects.PUZZLE_SCENES.forEach(entry => assert.equal(worker.includes(entry.src.split("?", 1)[0]), false, entry.id));
});

test("gameplay content extends the illustration system without replacing protected mechanics", () => {
  assert.doesNotMatch(html, /data-illustration="mini-game-puzzle"[^>]+(?:puzzle-reference|puzzle-board)/);
  assert.equal(educationalObjects.PUZZLE_SCENES.length, 16);
  assert.match(app, /puzzle\.src \|\| puzzle\.svg/);
  assert.match(app, /beginPuzzlePointer/);
  assert.match(app, /activatePuzzlePosition/);
  assert.match(html, /Mila Oyun Merkezi/);
});
