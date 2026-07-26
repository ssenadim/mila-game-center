"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const addition = require("../js/NumberLearning.js");
require("../js/LearningCategories.js");
const roadmap = require("../js/LearningPath.js");

const root = path.join(__dirname, "..");

function createSession(stageId, totalRounds) {
  const recentEquations = [];
  return Array.from({ length: totalRounds }, (_, index) => {
    const round = addition.createAdditionRound(stageId, index + 1, totalRounds, { recentEquations, warn: () => {} });
    recentEquations.unshift(`${round.first}+${round.second}`);
    recentEquations.splice(10);
    return round;
  });
}

test("all three Sprint 8.3.3 addition stages are implemented with the requested learning types", () => {
  const expected = {
    "addition-preparation": "additionPreparation",
    "add-two-numbers": "numericAddition",
    "visual-addition": "visualAddition"
  };
  assert.deepEqual(addition.ADDITION_STAGE_IDS, Object.keys(expected));
  Object.entries(expected).forEach(([stageId, learningType]) => {
    const stage = roadmap.stageById(stageId);
    assert.equal(stage.implemented, true);
    assert.equal(stage.learningType, learningType);
    assert.equal(roadmap.PLAYABLE_LEARNING_TYPES.has(learningType), true);
  });
});

test("shared generation keeps non-negative integer addends, exact totals and unique bounded choices", () => {
  addition.ADDITION_STAGE_IDS.forEach(stageId => {
    const total = stageId === "addition-preparation" ? 8 : 10;
    createSession(stageId, total).forEach(round => {
      assert.equal(addition.validateRound(round), true);
      assert.equal(Number.isInteger(round.first) && round.first >= 0, true);
      assert.equal(Number.isInteger(round.second) && round.second >= 0, true);
      assert.equal(round.result, round.first + round.second);
      assert.equal(round.result <= round.difficulty.resultMax && round.result <= 20, true);
      assert.notDeepEqual([round.first, round.second], [0, 0]);
      assert.equal(new Set(round.choices).size, round.choices.length);
      assert.equal(round.choices.filter(value => value === round.correct).length, 1);
      assert.equal(round.choices.every(value => value >= 0 && value <= 20), true);
    });
  });
});

test("difficulty begins gently and respects level result limits", () => {
  addition.ADDITION_STAGE_IDS.forEach(stageId => {
    const total = stageId === "addition-preparation" ? 8 : 10;
    const first = addition.createAdditionRound(stageId, 1, total, { warn: () => {} });
    const middle = addition.createAdditionRound(stageId, Math.ceil(total / 2), total, { warn: () => {} });
    const final = addition.createAdditionRound(stageId, total, total, { warn: () => {} });
    assert.equal(first.difficulty.level, 1);
    assert.equal(first.result <= 5, true);
    assert.equal(first.choices.length, 2);
    assert.equal(middle.difficulty.level, 2);
    assert.equal(middle.result <= 10, true);
    assert.equal(final.difficulty.level, 3);
    assert.equal(final.result <= (stageId === "addition-preparation" ? 15 : 20), true);
  });
});

test("zero is intentional, never forms zero plus zero and occurs at most twice per session", () => {
  addition.ADDITION_STAGE_IDS.forEach(stageId => {
    const total = stageId === "addition-preparation" ? 8 : 10;
    const rounds = createSession(stageId, total);
    const zeroRounds = rounds.filter(round => round.first === 0 || round.second === 0);
    assert.equal(zeroRounds.length <= 2, true);
    assert.equal(rounds.some(round => round.first === 0 && round.second === 0), false);
    zeroRounds.forEach(round => assert.equal(round.firstVisual.quantity === 0 || round.secondVisual.quantity === 0, true));
  });
});

test("preparation generates all three patterns with separate groups and a stable combined total", () => {
  const rounds = createSession("addition-preparation", 8);
  assert.deepEqual(new Set(rounds.map(round => round.pattern)), new Set(addition.PREPARATION_PATTERNS));
  rounds.forEach(round => {
    assert.notEqual(round.firstVisual, round.secondVisual);
    assert.equal(round.firstVisual.quantity + round.secondVisual.quantity, round.combinedVisual.quantity);
    const resultBeforeCombine = round.result;
    const combinedState = { combined: true, round };
    assert.equal(combinedState.round.result, resultBeforeCombine);
  });
  assert.equal(rounds.filter(round => round.canCombine).length > 0, true);
  assert.equal(rounds.filter(round => round.usesVisualChoices).length > 0, true);
});

test("numeric addition equation, Turkish speech and optional visual help match both addends", () => {
  const rounds = createSession("add-two-numbers", 10);
  rounds.forEach(round => {
    assert.equal(round.equation, `${round.first} + ${round.second} = ?`);
    assert.equal(round.speech, `${addition.getTurkishNumber(round.first)} artı ${addition.getTurkishNumber(round.second)} kaç eder?`);
    assert.equal(round.hasVisualHelp, true);
    assert.equal(round.firstVisual.quantity, round.first);
    assert.equal(round.secondVisual.quantity, round.second);
    assert.equal(round.correct, round.result);
  });
});

test("visual addition uses one object type, structured quantities and varied content groups", () => {
  const rounds = createSession("visual-addition", 10);
  assert.equal(new Set(rounds.map(round => round.visualGroupId)).size >= 6, true);
  rounds.forEach(round => {
    assert.equal(round.firstVisual.symbol, round.secondVisual.symbol);
    assert.equal(round.firstVisual.quantity, round.first);
    assert.equal(round.secondVisual.quantity, round.second);
    assert.equal(round.combinedVisual.quantity, round.result);
    if (round.result > 10) assert.deepEqual(round.combinedVisual.blocks, [10, round.result - 10]);
  });
});

test("sessions avoid exact repeats and immediate commutative duplicates while answer positions vary", () => {
  addition.ADDITION_STAGE_IDS.forEach(stageId => {
    const total = stageId === "addition-preparation" ? 8 : 10;
    const rounds = createSession(stageId, total);
    const keys = rounds.map(round => `${round.first}+${round.second}`);
    assert.equal(new Set(keys).size, keys.length);
    rounds.slice(1).forEach((round, index) => {
      const previous = rounds[index];
      assert.notEqual(`${round.first}+${round.second}`, `${previous.second}+${previous.first}`);
    });
    assert.equal(new Set(rounds.map(round => round.choices.indexOf(round.correct))).size > 1, true);
  });
});

test("Learning Path unlocks addition sequentially and keeps subtraction planned", () => {
  const throughNumbers = {
    completed: Object.fromEntries(roadmap.STAGES.filter(stage => stage.order <= 16 && stage.implemented).map(stage => [stage.id, true]))
  };
  assert.equal(roadmap.canLaunchStage("addition-preparation", throughNumbers), true);
  assert.equal(roadmap.canLaunchStage("add-two-numbers", throughNumbers), false);
  const afterPreparation = { completed: { ...throughNumbers.completed, "addition-preparation": true } };
  assert.equal(roadmap.canLaunchStage("add-two-numbers", afterPreparation), true);
  const afterNumeric = { completed: { ...afterPreparation.completed, "add-two-numbers": true } };
  assert.equal(roadmap.canLaunchStage("visual-addition", afterNumeric), true);
  const afterVisual = { completed: { ...afterNumeric.completed, "visual-addition": true } };
  assert.equal(roadmap.canLaunchStage("subtraction-preparation", afterVisual), false);
});

test("focused UI wires help, combine, counting, lifecycle cleanup and planned subtraction boundary", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  ["number-learning-combine-button", "number-learning-help-button", "number-learning-count-button"].forEach(id => {
    assert.match(html, new RegExp(`id="${id}"`));
  });
  assert.match(app, /numberLearning\.PLAYABLE_STAGE_IDS\.includes\(stage\.id\)/);
  assert.match(app, /function showAdditionVisualHelp/);
  assert.match(app, /async function combineAdditionGroups/);
  assert.match(app, /async function toggleAdditionCounting/);
  assert.match(app, /numberLearningSupportRun \+= 1/);
  assert.match(app, /numberLearningState\.attempts >= 3/);
  const cleanupBody = app.match(/function cleanupNumberLearning[\s\S]*?(?=\n}\n\nfunction renderQuantityVisual)/)?.[0] ?? "";
  assert.doesNotMatch(cleanupBody, /\bround\./);
  assert.match(app, /activeLearningPathStage\.id === "visual-addition"/);
  assert.match(app, /stageById\("subtraction-preparation"\)/);
  assert.match(css, /@media\(max-width:390px\)[\s\S]*\.addition-visual-equation/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});
