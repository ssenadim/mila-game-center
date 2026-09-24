"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const content = require("../js/EducationalObjects.js");
const illustrations = require("../js/Illustrations.js");
const games = require("../js/NewMiniGames.js");
const learning = require("../js/LearningCategories.js");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const worker = fs.readFileSync(path.join(root, "sw.js"), "utf8");

const expectedSceneLabels = [
  "Dinozor Vadisi", "Uzay Macerası", "Unicorn Bahçesi", "Deniz Altı Dünyası",
  "Ormanda Piknik", "Çiftlik Sabahı", "Tren İstasyonu", "İnşaat Araçları",
  "Kış Oyun Alanı", "Sıcak Hava Balonları", "Safari Su Başı", "Meyve Pikniği",
  "Deniz Kenarında Kumdan Kale", "Orman Hayvanları", "Renkli Şehir", "Gökkuşağı Bahçesi"
];

function assetPath(source) {
  return path.join(root, source.split("?")[0]);
}

test("Sprint 12.3 exposes one valid semantic registry with at least 48 original local objects", () => {
  const result = content.validate();
  assert.equal(result.valid, true, result.problems.join("\n"));
  assert.ok(content.OBJECTS.length >= 48);
  assert.equal(content.OBJECTS.length, 84);
  assert.equal(new Set(content.OBJECTS.map(item => item.id)).size, content.OBJECTS.length);
  assert.equal(new Set(content.OBJECTS.map(item => item.illustration)).size, content.OBJECTS.length);
  assert.equal(new Set(content.OBJECTS.map(item => item.src)).size, content.OBJECTS.length);
  content.OBJECTS.forEach(item => {
    assert.ok(item.labelTr.trim());
    assert.match(item.initialTr, /^[A-ZÇĞİÖŞÜ]$/u);
    assert.ok(item.categories.length > 0);
    assert.equal(fs.existsSync(assetPath(item.src)), true, item.id);
    assert.equal(illustrations.get(item.illustration)?.src, item.src, item.id);
    assert.doesNotMatch(item.src, /https?:\/\//i);
  });
});

test("all 16 required puzzle scenes are distinct square local SVGs and keep stable legacy IDs", () => {
  assert.equal(content.PUZZLE_SCENES.length, 16);
  assert.deepEqual(content.PUZZLE_SCENES.map(scene => scene.label), expectedSceneLabels);
  assert.equal(new Set(content.PUZZLE_SCENES.map(scene => scene.id)).size, 16);
  assert.equal(new Set(content.PUZZLE_SCENES.map(scene => scene.src)).size, 16);
  content.PUZZLE_SCENES.forEach(scene => {
    const source = fs.readFileSync(assetPath(scene.src), "utf8");
    assert.match(source, /^<svg[^>]+viewBox="0 0 600 600"/);
    assert.doesNotMatch(source, /<(?:script|foreignObject|image)\b|\b(?:href|src)\s*=/i);
    assert.ok(scene.description.length >= 30, scene.id);
    assert.equal(illustrations.get(scene.illustration)?.src, scene.src);
  });
});

test("every scene initializes deterministically at 2x2, intermediate grids and 4x4", () => {
  content.PUZZLE_SCENES.forEach((scene, sceneIndex) => {
    Object.keys(games.PUZZLE_DIFFICULTIES).forEach((difficultyId, difficultyIndex) => {
      const difficulty = games.PUZZLE_DIFFICULTIES[difficultyId];
      const count = difficulty.columns * difficulty.rows;
      const random = () => ((sceneIndex + difficultyIndex + 3) % 11) / 11;
      const pieces = games.createPuzzlePieces(difficultyId, random);
      assert.equal(pieces.length, count, `${scene.id}/${difficultyId}`);
      assert.equal(games.validatePuzzleBoard(pieces, count), true, `${scene.id}/${difficultyId}`);
      pieces.sort((first, second) => first.target - second.target);
      assert.equal(games.isPuzzleComplete(pieces, count), true, `${scene.id}/${difficultyId}`);
    });
  });
});

test("Grupla keeps its exact taxonomy while every production sorting item resolves professional art", () => {
  assert.equal(learning.SORTING_CATEGORIES.length, 16);
  learning.SORTING_CATEGORIES.forEach(category => {
    const resolved = learning.resolveSortingCategoryItems(category);
    assert.ok(resolved.length >= learning.SORTING_ITEMS_PER_CATEGORY, category.id);
    resolved.forEach(item => {
      assert.ok(item.semanticObjectId, `${category.id}/${item.id}`);
      assert.ok(item.illustration && item.illustrationSrc, `${category.id}/${item.id}`);
      assert.equal(content.get(item.semanticObjectId)?.src, item.illustrationSrc);
    });
  });
  ["land-sea-vehicles", "land-air-vehicles", "sea-land-animals", "pets-wild", "fruits-vegetables"]
    .forEach(id => assert.equal(learning.validateSortingPair(learning.SORTING_PAIRS.find(pair => pair.id === id)).valid, true, id));
});

test("selected games share semantic object art and preserve fallback presentation", () => {
  games.MISSING_ITEM_GROUPS.flatMap(group => group.items).forEach(item => assert.ok(item.src || item.visual, item.id));
  assert.ok(games.MISSING_ITEM_GROUPS.flatMap(group => group.items).every(item => item.src));
  assert.ok(games.INITIAL_LETTER_WORDS.filter(item => item.src).length >= 16);
  assert.ok(games.SHADOW_OBJECTS.every(item => item.svg?.startsWith("<svg")));
  assert.ok(games.SHADOW_OBJECTS.every(item => item.src?.startsWith("assets/illustrations/objects/")));
  assert.match(app, /PROFESSIONAL_MATCHING_OBJECTS/);
  assert.match(app, /matchingQuestion\?\.illustrationSrc/);
  assert.match(app, /appendProfessionalObject\(wordVisual, word/);
  assert.match(app, /sortingVisualMarkup[\s\S]*item\.illustrationSrc/);
});

test("content art loads on demand instead of joining the startup app shell", () => {
  assert.match(worker, /js\/EducationalObjects\.js/);
  content.OBJECTS.forEach(item => assert.equal(worker.includes(item.src.split("?")[0]), false, item.id));
  content.PUZZLE_SCENES.forEach(scene => assert.equal(worker.includes(scene.src.split("?")[0]), false, scene.id));
  assert.match(app, /puzzle-selected-preview/);
  assert.doesNotMatch(app, /newMiniGames\.PUZZLES\.forEach\(puzzle => \{[\s\S]{0,500}newMiniGameSvgUrl\(puzzle\.(?:src|svg)/);
});

test("Sprint 12.1 puzzle mechanics and protected reward flow remain wired", () => {
  assert.match(app, /beginPuzzlePointer/);
  assert.match(app, /activatePuzzlePosition/);
  assert.match(app, /swapPuzzlePieces/);
  assert.match(app, /recordNewMiniGameCompleted\(\)[\s\S]*awardSticker\(\)/);
  assert.match(app, /recordMiniGameMissionCompletion\(newMiniGameState\.mode/);
  assert.match(app, /puzzle\.src \|\| puzzle\.svg/);
});
