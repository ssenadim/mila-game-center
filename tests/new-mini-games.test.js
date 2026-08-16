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
  Object.values(games.SHADOW_DIFFICULTIES).forEach((difficulty, difficultyIndex) => {
    for (let round = 0; round < 8; round += 1) {
      const challenge = games.createShadowRound(round, difficulty.id, seededRandom(round + 30 + difficultyIndex));
      assert.equal(challenge.choices.filter(item => item.id === challenge.source.id).length, 1);
      assert.equal(new Set(challenge.choices.map(item => item.id)).size, difficulty.choiceCount);
      assert.ok(challenge.choices.every(item => item.svg.startsWith("<svg")));
      assert.equal(challenge.choiceCount, difficulty.choiceCount);
    }
  });
});

test("İlk Harfi Bul maps every word to its displayed initial and produces unique answers", () => {
  games.INITIAL_LETTER_WORDS.forEach((word, index) => {
    assert.equal(word.word[0].toLocaleUpperCase("tr-TR"), word.letter);
    const challenge = games.createLetterRound(index, seededRandom(index + 50));
    assert.ok(challenge.choices.includes(word.letter));
    assert.equal(challenge.choices.length, 4);
    assert.equal(new Set(challenge.choices).size, 4);
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

test("Sprint 11.1 exposes exactly 16 distinct local puzzle scenes and the 4x4 Çok Zor level", () => {
  assert.equal(games.PUZZLES.length, 16);
  assert.equal(new Set(games.PUZZLES.map(puzzle => puzzle.id)).size, 16);
  assert.equal(new Set(games.PUZZLES.map(puzzle => puzzle.svg)).size, 16);
  games.PUZZLES.forEach(puzzle => {
    assert.equal(games.isPlayablePuzzle(puzzle), true, puzzle.id);
    assert.match(puzzle.svg, /^<svg/);
    assert.doesNotMatch(puzzle.svg, /<image\b|\bhref\s*=/i);
    assert.ok(puzzle.description.length > 0);
  });
  assert.deepEqual(
    Object.fromEntries(Object.values(games.PUZZLE_DIFFICULTIES).map(level => [level.id, level.columns * level.rows])),
    { easy: 4, medium: 6, hard: 9, veryHard: 16 }
  );
  assert.equal(games.PUZZLE_DIFFICULTIES.veryHard.label, "🔥 Çok Zor");
  assert.equal(games.PUZZLE_DIFFICULTIES.veryHard.pieceLabel, "16 Parça");
});

test("4x4 shuffle is a bounded, meaningful permutation and avoids the previous layout", () => {
  const pieces = games.createPuzzlePieces("veryHard", seededRandom(111));
  const order = pieces.map(piece => piece.target);
  assert.equal(order.length, 16);
  assert.deepEqual([...order].sort((a, b) => a - b), Array.from({ length: 16 }, (_, index) => index));
  assert.equal(order.every((target, index) => target === index), false);
  assert.ok(order.filter((target, index) => target === index).length <= 4);

  const nextOrder = games.createPuzzlePieces("veryHard", seededRandom(111), order).map(piece => piece.target);
  assert.notDeepEqual(nextOrder, order);
  assert.equal(games.isMeaningfulPuzzleOrder(nextOrder, "veryHard", order), true);

  let calls = 0;
  const identityRandom = () => { calls += 1; return 0.999999; };
  const fallback = games.createPuzzlePieces("veryHard", identityRandom).map(piece => piece.target);
  assert.equal(calls, 12 * 15);
  assert.equal(fallback.every((target, index) => target === index), false);
  assert.ok(fallback.filter((target, index) => target === index).length <= 4);
});

test("puzzle completion requires the exact expected unique set and every placed piece", () => {
  const pieces = games.createPuzzlePieces("veryHard", seededRandom(222));
  assert.equal(games.isPuzzleComplete(pieces, 16), false);
  pieces.forEach(piece => { piece.placed = true; });
  assert.equal(games.isPuzzleComplete(pieces, 16), true);
  pieces[7].placed = false;
  assert.equal(games.isPuzzleComplete(pieces, 16), false);
  pieces[7].placed = true;
  pieces[7].target = pieces[6].target;
  assert.equal(games.isPuzzleComplete(pieces, 16), false);
  assert.equal(games.isPuzzleComplete(pieces.slice(0, 15), 16), false);
});

test("puzzle image selection is deterministic, excludes invalid entries and avoids the last three images", () => {
  const recent = games.PUZZLES.slice(0, 3).map(puzzle => puzzle.id);
  assert.equal(games.selectPuzzle(recent, () => 0).id, games.PUZZLES[3].id);
  assert.equal(games.selectPuzzle(games.PUZZLES.map(puzzle => puzzle.id), () => 0).id, games.PUZZLES[0].id);

  const invalid = { id: "remote", label: "Uzak", description: "Uzak görsel", svg: '<svg><image href="https://example.com/a.png"/></svg>' };
  assert.equal(games.selectPuzzle([], () => 0, [invalid, games.PUZZLES[5]]).id, games.PUZZLES[5].id);
  assert.equal(games.selectPuzzle([], () => 0, [invalid]), undefined);

  const selectedIds = new Set(games.PUZZLES.map((_, index) => games.selectPuzzle([], () => (index + 0.01) / games.PUZZLES.length).id));
  assert.equal(selectedIds.size, 16);
});

test("Sprint 11.1 puzzle UI wires replay, rapid-tap locks, completed image and responsive 4x4 styles", () => {
  const root = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.match(html, /id="new-mini-game-completion-image"/);
  assert.match(app, /previousPuzzleOrders\.get\(difficulty\.id\)/);
  assert.match(app, /recentPuzzleIds[\s\S]*\.slice\(-3\)/);
  assert.match(app, /placePuzzlePiece[\s\S]*newMiniGameState\.inputLocked = true/);
  assert.match(app, /if \(newMiniGameState\.completed\) return;/);
  assert.match(app, /mode !== PUZZLE_MODE[\s\S]*puzzleDifficulty[\s\S]*startPuzzleSession\(\)/);
  assert.match(app, /isPuzzleComplete\(newMiniGameState\.pieces, difficultyPieceCount\(\)\)/);
  assert.match(app, /aria-pressed/);
  assert.match(css, /\.puzzle-tray\.grid-4\{grid-template-columns:repeat\(4/);
  assert.match(css, /\.puzzle-layout-4 \.puzzle-board/);
  assert.match(css, /@media\(max-width:600px\)[\s\S]*\.puzzle-layout\{grid-template-columns:1fr\}/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
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
