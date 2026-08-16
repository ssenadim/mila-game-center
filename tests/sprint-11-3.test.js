"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const games = require("../js/NewMiniGames.js");

function seededRandom(seed = 1) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

test("Sprint 11.3 exposes only Kolay 2-choice and Zor 4-choice shadow modes", () => {
  assert.deepEqual(
    Object.fromEntries(Object.values(games.SHADOW_DIFFICULTIES).map(level => [level.id, level.choiceCount])),
    { easy: 2, hard: 4 }
  );
  assert.equal(games.getEligibleShadowTargets("easy").length, 12);
  assert.equal(games.getEligibleShadowTargets("hard").length, 12);
});

test("every shadow target produces one correct local SVG and unique fair choices in both modes", () => {
  Object.values(games.SHADOW_DIFFICULTIES).forEach((difficulty, difficultyIndex) => {
    games.getEligibleShadowTargets(difficulty.id).forEach((target, roundIndex) => {
      const round = games.createShadowRound(roundIndex, difficulty.id, seededRandom(100 + difficultyIndex * 20 + roundIndex));
      assert.equal(round.source.id, target.id);
      assert.equal(games.validateShadowRound(round, difficulty.choiceCount), true);
      assert.equal(round.choices.length, difficulty.choiceCount);
      assert.equal(round.choices.filter(choice => choice.id === target.id).length, 1);
      assert.equal(new Set(round.choices.map(choice => choice.id)).size, difficulty.choiceCount);
      assert.ok(round.choices.every(choice => games.isValidShadowObject(choice)));
    });
  });
});

test("shadow answer positions vary deterministically and recent distractors are avoided", () => {
  for (const difficultyId of ["easy", "hard"]) {
    const positions = new Set();
    for (let seed = 1; seed <= 80; seed += 1) {
      const round = games.createShadowRound(0, difficultyId, seededRandom(seed));
      positions.add(round.choices.findIndex(choice => choice.id === round.source.id));
    }
    assert.equal(positions.size, games.SHADOW_DIFFICULTIES[difficultyId].choiceCount);
  }

  const first = games.createShadowRound(0, "hard", seededRandom(200));
  const next = games.createShadowRound(0, "hard", seededRandom(201), first.distractorIds);
  assert.ok(next.distractorIds.every(id => !first.distractorIds.includes(id)));
});

test("invalid or underpopulated shadow content is excluded without broken four-choice fallback", () => {
  const invalid = { id: "remote", label: "Uzak", category: "bad", svg: '<svg><image href="https://example.com/a.png"/></svg>' };
  const smallPool = [games.SHADOW_OBJECTS[0], games.SHADOW_OBJECTS[1], games.SHADOW_OBJECTS[3], invalid];
  assert.equal(games.getEligibleShadowTargets("hard", smallPool).length, 0);
  assert.equal(games.createShadowRound(0, "hard", seededRandom(300), [], smallPool), undefined);
  assert.ok(games.getEligibleShadowTargets("easy", smallPool).length >= 1);
});

test("every initial-letter round has four unique Turkish letters and one correct answer", () => {
  games.INITIAL_LETTER_WORDS.forEach((word, roundIndex) => {
    const round = games.createLetterRound(roundIndex, seededRandom(400 + roundIndex));
    assert.equal(round.word.id, word.id);
    assert.equal(games.validateLetterRound(round), true);
    assert.equal(round.choices.length, 4);
    assert.equal(new Set(round.choices).size, 4);
    assert.equal(round.choices.filter(letter => letter === word.letter).length, 1);
    assert.equal(word.word[0].toLocaleUpperCase("tr-TR"), word.letter);
    assert.ok(games.TURKISH_INITIAL_LETTERS.includes(word.letter));
  });
});

test("Turkish diacritics remain exact and correct letter reaches all four positions", () => {
  const required = { Ç: "Çiçek", Ş: "Şapka", İ: "İnek", Ö: "Ördek", Ü: "Üzüm" };
  Object.entries(required).forEach(([letter, word]) => {
    const item = games.INITIAL_LETTER_WORDS.find(candidate => candidate.word === word);
    assert.equal(item.letter, letter);
    assert.equal(item.word[0], letter);
  });
  assert.ok(!games.TURKISH_INITIAL_LETTERS.some(letter => ["Q", "W", "X"].includes(letter)));

  const positions = new Set();
  for (let seed = 1; seed <= 100; seed += 1) {
    const round = games.createLetterRound(0, seededRandom(seed));
    positions.add(round.choices.indexOf(round.word.letter));
  }
  assert.equal(positions.size, 4);
});

test("invalid initial-letter items are excluded and cannot create malformed answers", () => {
  const valid = games.INITIAL_LETTER_WORDS.filter(item => ["E", "T", "K", "F", "B", "M"].includes(item.letter));
  const invalid = { id: "bad", word: "  ", letter: "Q", visual: "❓", speech: "bad" };
  const eligible = games.getEligibleInitialLetterWords([invalid, ...valid]);
  assert.ok(!eligible.some(item => item.id === "bad"));
  const round = games.createLetterRound(0, seededRandom(500), [invalid, ...valid]);
  assert.equal(games.validateLetterRound(round), true);
});

test("shared UI wires difficulty setup, stable replay, lifecycle locks and responsive four-choice grids", () => {
  const root = path.resolve(__dirname, "..");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.match(app, /function renderShadowSetup\(\)[\s\S]*SHADOW_DIFFICULTIES[\s\S]*aria-pressed[\s\S]*Oyuna Başla/);
  assert.match(app, /createShadowRound\([\s\S]*newMiniGameState\.shadowDifficulty[\s\S]*recentShadowDistractorIds/);
  assert.match(app, /ariaLabel: `Gölge seçeneği \$\{index \+ 1\}`/);
  assert.match(app, /const shadowDifficulty = newMiniGameState\.shadowDifficulty;[\s\S]*startShadowSession\(\)/);
  assert.match(app, /function chooseShadow[\s\S]*inputLocked[\s\S]*newMiniGameState\.inputLocked = true/);
  assert.match(app, /function chooseInitialLetter[\s\S]*inputLocked[\s\S]*newMiniGameState\.inputLocked = true/);
  assert.match(app, /speakNewMiniGame\(newMiniGameState\.challenge\.word\.speech, TURKISH_LANGUAGE/);
  assert.match(app, /letter-choice-grid four-choice-grid/);
  assert.match(app, /function pauseNewMiniGameState[\s\S]*renderCurrentNewMiniGame\(\)/);
  assert.match(app, /if \(newMiniGameState\.completed\) return;/);
  assert.match(css, /\.shadow-difficulty-options\{display:grid;grid-template-columns:repeat\(2/);
  assert.match(css, /\.four-choice-grid\{grid-template-columns:repeat\(2/);
  assert.match(css, /\.letter-choice\{min-height:100px;font-size:3\.3rem\}/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});
