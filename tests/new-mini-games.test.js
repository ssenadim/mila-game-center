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

test("Sprint 8.1 content validates and satisfies every minimum", () => {
  assert.equal(games.validateContent(() => {} ).valid, true);
  assert.ok(games.MISSING_ITEM_GROUPS.length >= 5);
  assert.ok(games.SHADOW_OBJECTS.length >= 12);
  assert.ok(new Set(games.SHADOW_OBJECTS.map(item => item.category)).size >= 4);
  assert.ok(games.INITIAL_LETTER_WORDS.length >= 24);
  assert.ok(new Set(games.INITIAL_LETTER_WORDS.map(item => item.letter)).size >= 12);
  assert.equal(Object.keys(games.SOUND_DIFFICULTIES).length, 3);
  assert.ok(games.PUZZLES.length >= 8);
  assert.ok(new Set(games.PUZZLES.map(item => item.category)).size >= 6);
});

test("Hangisi Eksik removes exactly one item and creates unique valid choices at every level", () => {
  [
    { round: 0, items: 3, answers: 2 },
    { round: 3, items: 4, answers: 3 },
    { round: 6, items: 5, answers: 4 }
  ].forEach(({ round, items, answers }) => {
    const challenge = games.createMissingRound(round, seededRandom(round + 10));
    assert.equal(challenge.presented.length, items);
    assert.equal(challenge.remaining.length, items - 1);
    assert.equal(challenge.choices.length, answers);
    assert.ok(challenge.presented.some(item => item.id === challenge.missing.id));
    assert.ok(!challenge.remaining.some(item => item.id === challenge.missing.id));
    assert.ok(challenge.choices.some(item => item.id === challenge.missing.id));
    assert.equal(new Set(challenge.choices.map(item => item.id)).size, answers);
  });
});

test("Gölgesini Bul has one correct SVG silhouette and unique distractors", () => {
  for (let round = 0; round < 8; round += 1) {
    const challenge = games.createShadowRound(round, seededRandom(round + 30));
    assert.equal(challenge.choices.filter(item => item.id === challenge.source.id).length, 1);
    assert.equal(new Set(challenge.choices.map(item => item.id)).size, challenge.choiceCount);
    assert.ok(challenge.choices.every(item => item.svg.startsWith("<svg")));
    assert.equal(challenge.choiceCount, round < 3 ? 2 : round < 6 ? 3 : 4);
  }
});

test("İlk Harfi Bul maps every word to its displayed initial and produces unique answers", () => {
  games.INITIAL_LETTER_WORDS.forEach((word, index) => {
    assert.equal(word.word[0].toUpperCase(), word.letter);
    const challenge = games.createLetterRound(index, seededRandom(index + 50));
    assert.ok(challenge.choices.includes(word.letter));
    assert.equal(challenge.choices.length, 3);
    assert.equal(new Set(challenge.choices).size, 3);
  });
});

test("Ses Hafızası creates exact pairs for all three board sizes and honors selection locks", () => {
  const expected = { beginner: 3, standard: 4, advanced: 6 };
  Object.entries(expected).forEach(([difficulty, pairCount], index) => {
    const board = games.createSoundBoard(difficulty, seededRandom(index + 70));
    assert.equal(board.length, pairCount * 2);
    const counts = board.reduce((result, card) => ({ ...result, [card.targetId]: (result[card.targetId] ?? 0) + 1 }), {});
    assert.ok(Object.values(counts).every(count => count === 2));
  });
  assert.equal(games.canSelectSoundCard({ matched: false }, false, false), true);
  assert.equal(games.canSelectSoundCard({ matched: true }, false, false), false);
  assert.equal(games.canSelectSoundCard({ matched: false }, true, false), false);
  assert.equal(games.canSelectSoundCard({ matched: false }, false, true), false);
});

test("Yapboz keeps one target per piece and completes only after every placement", () => {
  Object.entries(games.PUZZLE_DIFFICULTIES).forEach(([difficultyId, difficulty], index) => {
    const pieces = games.createPuzzlePieces(difficultyId, seededRandom(index + 90));
    const count = difficulty.columns * difficulty.rows;
    assert.equal(pieces.length, count);
    assert.equal(new Set(pieces.map(piece => piece.target)).size, count);
    assert.deepEqual([...pieces.map(piece => piece.target)].sort((a, b) => a - b), Array.from({ length: count }, (_, target) => target));
    assert.equal(games.isPuzzleComplete(pieces), false);
    pieces.forEach(piece => { piece.placed = true; });
    assert.equal(games.isPuzzleComplete(pieces), true);
  });
});

test("all five cards and shared cleanup, pause, replay and focused navigation are wired", () => {
  const root = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  [
    "missing-item-mode-button", "shadow-mode-button", "initial-letter-mode-button",
    "sound-memory-mode-button", "puzzle-mode-button"
  ].forEach(id => assert.match(html, new RegExp(`id="${id}"`)));
  assert.match(app, /NEW_MINI_GAME_MODES/);
  assert.match(app, /if \(!selectedPlayer\)/);
  assert.match(app, /isPaused \|\| isStartingGame/);
  assert.match(app, /function cleanupNewMiniGame\(\)[\s\S]*clearNewMiniGameDelay\(\)/);
  assert.match(app, /function speakNewMiniGame[\s\S]*clearSpeech\(\)/);
  assert.match(app, /function replayNewMiniGame[\s\S]*startNewMiniGame\(mode\)/);
  assert.match(app, /newMiniGameHome\.addEventListener\("click", \(\) => leaveGameFor\("games"\)\)/);
  assert.match(app, /if \(isNewMiniGameActive\) pauseNewMiniGameState\(\)/);
  assert.match(app, /if \(isNewMiniGameActive\) \{[\s\S]*resumeNewMiniGameState\(\)/);
  assert.match(app, /ui\.newMiniGame\.classList\.add\("hidden"\)/);
});
