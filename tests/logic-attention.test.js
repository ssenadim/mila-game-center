const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

global.MilaNewMiniGames = require("../js/NewMiniGames.js");
const logic = require("../js/LogicAttention.js");
const learningPath = require("../js/LearningPath.js");

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

test("all seven Düşün ve Bul stages are implemented with exact strategies, order and session lengths", () => {
  const expected = [
    ["odd-one-out", "oddOneOut", 8],
    ["missing-item", "missingItem", 8],
    ["complete-pattern", "patternCompletion", 8],
    ["sequence-order", "sequenceOrdering", 7],
    ["shadow-matching", "shadowMatching", 8],
    ["same-group", "grouping", 8],
    ["simple-maze", "simpleMaze", 5]
  ];
  const group = learningPath.groupById("think-find");
  assert.deepEqual(group.stageIds, expected.map(([id]) => id));
  expected.forEach(([id, type, rounds], index) => {
    const stage = learningPath.stageById(id);
    assert.equal(stage.implemented, true);
    assert.equal(stage.learningType, type);
    assert.equal(stage.sessionLength, rounds);
    assert.equal(logic.STAGE_CONFIG[id].rounds, rounds);
    if (index > 0) assert.deepEqual(stage.prerequisiteStageIds, [expected[index - 1][0]]);
  });
  assert.deepEqual(learningPath.stageById("odd-one-out").prerequisiteStageIds, ["mixed-operations"]);
  assert.ok(learningPath.stagesForGroup("daily-life").every(stage => stage.implemented === true));
});

test("all strategies generate valid gentle rounds and progress from level 1 without exceeding level 3", () => {
  assert.equal(logic.validateContent(() => {}).valid, true);
  logic.STAGE_IDS.forEach((stageId, stageIndex) => {
    const total = logic.STAGE_CONFIG[stageId].rounds;
    const levels = [];
    for (let roundNumber = 1; roundNumber <= total; roundNumber += 1) {
      const round = logic.createRound(stageId, roundNumber, total, { rng: seededRandom(stageIndex * 20 + roundNumber), warn: () => {} });
      assert.equal(logic.validateRound(round), true, `${stageId}/${roundNumber}`);
      levels.push(round.difficulty.level);
      if (round.choices) assert.ok(round.choices.length <= 4);
    }
    assert.equal(levels[0], 1);
    assert.ok(levels.every((level, index) => index === 0 || level >= levels[index - 1]));
    assert.ok(Math.max(...levels) <= 3);
  });
});

test("Hangisi Farklı covers five defensible families with one odd item and varied positions", () => {
  const families = new Set();
  const positions = new Set();
  for (let roundNumber = 1; roundNumber <= 8; roundNumber += 1) {
    const round = logic.createOddOneOutRound(roundNumber, 8, seededRandom(roundNumber + 40));
    families.add(round.family);
    positions.add(round.choices.findIndex(item => item.id === round.correctId));
    const normal = round.choices.filter(item => item.id !== round.correctId);
    assert.ok(normal.every(item => item.ruleKey === round.sharedRule));
    assert.notEqual(round.choices.find(item => item.id === round.correctId).ruleKey, round.sharedRule);
    assert.equal(new Set(round.choices.map(item => item.id)).size, round.choices.length);
  }
  assert.deepEqual(families, new Set(["category", "color", "shape", "direction", "size"]));
  assert.ok(positions.size > 1);
});

test("Hangisi Eksik removes exactly one item and preserves observation state until the child is ready", () => {
  for (let roundNumber = 1; roundNumber <= 8; roundNumber += 1) {
    const round = logic.createMissingItemRound(roundNumber, 8, seededRandom(roundNumber + 80));
    const state = logic.createMissingState(round);
    assert.equal(state.phase, "observe");
    assert.deepEqual(state.presentedIds, round.presented.map(item => item.id));
    assert.equal(round.presented.length, round.remaining.length + 1);
    assert.equal(round.choices.filter(item => item.id === round.missing.id).length, 1);
    assert.equal(new Set(round.choices.map(item => item.id)).size, round.choices.length);
    assert.equal(logic.revealMissingItem(state), true);
    assert.equal(state.phase, "answer");
    assert.deepEqual(state.presentedIds, round.presented.map(item => item.id));
    assert.equal(logic.revealMissingItem(state), false);
  }
});

test("Örüntüyü Tamamla supports AB, AAB, ABB, ABC and growing patterns and rejects insufficient evidence", () => {
  const families = new Set();
  for (let roundNumber = 1; roundNumber <= 8; roundNumber += 1) {
    const round = logic.createPatternRound(roundNumber, 8, seededRandom(roundNumber + 120));
    families.add(round.family);
    assert.equal(round.choices.filter(item => item.id === round.correctId).length, 1);
    assert.equal(logic.validateRound(round), true);
  }
  assert.deepEqual(families, new Set(["AB", "AAB", "ABB", "ABC", "growing"]));
  const ambiguous = logic.createPatternRound(1, 8, seededRandom(1));
  ambiguous.sequence = ambiguous.sequence.slice(0, 2);
  assert.equal(logic.validateRound(ambiguous), false);
});

test("Doğru Sırayı Bul accepts tap placement, correction and only the unique valid order", () => {
  const round = logic.createSequenceRound(4, 7, seededRandom(160));
  const state = logic.createSequenceState(round);
  const wrongOrder = [...round.target].reverse();
  wrongOrder.forEach(stepId => assert.equal(logic.placeSequenceStep(state, stepId), true));
  assert.equal(logic.isSequenceCorrect(state), false);
  assert.equal(logic.removeSequenceStep(state, 0), true);
  assert.equal(state.slots[0], null);
  const corrected = logic.createSequenceState(round);
  round.target.forEach(stepId => assert.equal(logic.placeSequenceStep(corrected, stepId), true));
  assert.equal(logic.isSequenceCorrect(corrected), true);
  assert.ok(round.target.length >= 3 && round.target.length <= 4);
});

test("Gölgesini Bul uses one correct repository-owned SVG and unique local distractors", () => {
  for (let roundNumber = 1; roundNumber <= 8; roundNumber += 1) {
    const round = logic.createShadowRound(roundNumber, 8, seededRandom(roundNumber + 180));
    assert.equal(round.choices.filter(item => item.id === round.source.id).length, 1);
    assert.equal(new Set(round.choices.map(item => item.id)).size, round.choices.length);
    assert.ok(round.source.svg.startsWith("<svg"));
    assert.ok(round.choices.every(item => item.svg.startsWith("<svg") && !/<image\b[^>]+href=["']https?:\/\//i.test(item.svg)));
  }
});

test("Aynı Grubu Bul centralizes all twelve required families and has one unambiguous relation", () => {
  const required = ["fruits", "vegetables", "animals", "sea-animals", "vehicles", "clothes", "household", "school", "toys", "food", "nature", "body"];
  assert.deepEqual(logic.GROUPING_CATEGORIES.map(group => group.id), required);
  assert.doesNotMatch(JSON.stringify(logic.GROUPING_CATEGORIES), /tomato|domates/i);
  const used = new Set();
  for (let roundNumber = 1; roundNumber <= 12; roundNumber += 1) {
    const round = logic.createGroupingRound(roundNumber, 12, seededRandom(roundNumber + 220));
    used.add(round.categoryId);
    assert.equal(round.reference.categoryId, round.categoryId);
    assert.equal(round.choices.filter(item => item.categoryId === round.categoryId).length, 1);
    assert.ok(round.choices.filter(item => item.categoryId !== round.categoryId).every((item, index, items) => items.findIndex(other => other.categoryId === item.categoryId) === index));
  }
  assert.equal(used.size, 12);
});

test("Basit Labirent stays within 4x4–6x6, is solvable, blocks invalid moves and completes once", () => {
  const sizes = new Set();
  for (let roundNumber = 1; roundNumber <= 5; roundNumber += 1) {
    const round = logic.createMazeRound(roundNumber, 5);
    sizes.add(round.size);
    assert.equal(logic.validateMaze(round), true);
    const route = logic.getMazeRoute(round);
    assert.equal(route[0], round.start);
    assert.equal(route[route.length - 1], round.goal);
    const state = logic.createMazeState(round);
    const snapshot = [...state.pathHistory];
    assert.equal(logic.moveMaze(state, round, -1).moved, false);
    assert.deepEqual(state.pathHistory, snapshot);
    const blocked = logic.getMazeNeighbors(state.current, round.size).find(index => round.blocked.includes(index));
    if (blocked !== undefined) {
      assert.equal(logic.moveMaze(state, round, blocked).moved, false);
      assert.deepEqual(state.pathHistory, snapshot);
    }
    route.slice(1).forEach(target => logic.moveMaze(state, round, target));
    assert.equal(state.completed, true);
    assert.equal(state.completionCount, 1);
    assert.equal(logic.moveMaze(state, round, route[route.length - 2]).moved, false);
    assert.equal(state.completionCount, 1);
    assert.equal(logic.restartMaze(state, round), true);
    assert.equal(state.current, round.start);
    assert.deepEqual(state.pathHistory, [round.start]);
  }
  assert.deepEqual(sizes, new Set([4, 5, 6]));
});

test("Learning Path unlocks the seven stages sequentially and then opens Günlük Hayat", () => {
  const progress = { completed: { "mixed-operations": true } };
  logic.STAGE_IDS.forEach((stageId, index) => {
    assert.equal(learningPath.canLaunchStage(stageId, progress), true, stageId);
    progress.completed[stageId] = true;
    const next = learningPath.getNextEligibleStage(stageId, progress);
    if (index < logic.STAGE_IDS.length - 1) assert.equal(next.id, logic.STAGE_IDS[index + 1]);
    else assert.equal(next.id, "emotions");
  });
  assert.equal(learningPath.getGroupProgress("think-find", progress).completed, 7);
  assert.equal(learningPath.canLaunchStage("emotions", progress), true);
});

test("focused UI wires accessibility, retry, pause, replay, cleanup and player-specific progress", () => {
  const root = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  ["logic-attention-screen", "logic-attention-path-button", "logic-attention-pause-button", "logic-attention-listen-button", "logic-attention-ready-button", "logic-attention-check-button", "logic-attention-restart-button", "logic-attention-feedback"].forEach(id => assert.match(html, new RegExp(`id="${id}"`)));
  assert.match(html, /logic-attention-feedback[^>]+role="status"[^>]+aria-live="polite"/);
  assert.match(app, /logicAttention\.STAGE_IDS\.includes\(stage\.id\)[\s\S]*startLogicAttentionStage\(stage\)/);
  assert.match(app, /function cleanupLogicAttention\(\)[\s\S]*logicAttentionSessionId \+= 1[\s\S]*clearSpeech\(\)/);
  assert.match(app, /if \(isLogicAttentionActive\) \{[\s\S]*setLogicAttentionInputEnabled\(false\)/);
  assert.match(app, /if \(isLogicAttentionActive\) \{[\s\S]*renderLogicAttentionRound\(\)/);
  assert.match(app, /function replaySession\(\)[\s\S]*startLearningPathStage\(activeLearningPathStage\.id\)/);
  assert.match(app, /getPlayerStorageKey\(LEARNING_PATH_PROGRESS_STORAGE_KEY\)/);
  assert.match(app, /pendingResult === "correct"[\s\S]*roundNumber \+= 1/);
  assert.match(app, /logicAttention\.addEventListener\("keydown"[\s\S]*ArrowUp[\s\S]*ArrowRight/);
  assert.match(css, /\.logic-choice\{[^}]*min-height:96px/);
  assert.match(css, /\.logic-maze\{[^}]*grid-template-columns:repeat\(var\(--maze-size\),1fr\)/);
  assert.match(css, /@media\(max-width:480px\)[\s\S]*\.logic-attention-choices/);
  assert.doesNotMatch(app, /setInterval\([^)]*logicAttention|countdown[^\n]*logicAttention/i);
});
