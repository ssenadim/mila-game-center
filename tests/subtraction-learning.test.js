"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const subtraction = require("../js/NumberLearning.js");
require("../js/LearningCategories.js");
const roadmap = require("../js/LearningPath.js");

const root = path.join(__dirname, "..");

function createSession(stageId, totalRounds) {
  const recentEquations = [];
  return Array.from({ length: totalRounds }, (_, index) => {
    const round = subtraction.createSubtractionRound(stageId, index + 1, totalRounds, { recentEquations, warn: () => {} });
    recentEquations.unshift(`${round.first}-${round.removed}`);
    recentEquations.splice(10);
    return round;
  });
}

test("all three Sprint 8.3.4 subtraction stages are implemented and playable", () => {
  const expected = {
    "subtraction-preparation": "subtractionPreparation",
    "subtract-smaller-from-greater": "numericSubtraction",
    "visual-subtraction": "visualSubtraction"
  };
  assert.deepEqual(subtraction.SUBTRACTION_STAGE_IDS, Object.keys(expected));
  Object.entries(expected).forEach(([stageId, learningType]) => {
    const stage = roadmap.stageById(stageId);
    assert.equal(stage.implemented, true);
    assert.equal(stage.learningType, learningType);
    assert.equal(roadmap.PLAYABLE_LEARNING_TYPES.has(learningType), true);
  });
});

test("rounds always subtract a smaller or equal number and never produce a negative result", () => {
  subtraction.SUBTRACTION_STAGE_IDS.forEach(stageId => {
    const total = stageId === "subtraction-preparation" ? 8 : 10;
    createSession(stageId, total).forEach(round => {
      assert.equal(subtraction.validateRound(round), true);
      assert.equal(round.first >= round.removed, true);
      assert.equal(round.result, round.first - round.removed);
      assert.equal(round.result >= 0 && round.result <= 20, true);
      assert.notDeepEqual([round.first, round.removed], [0, 0]);
      assert.equal(new Set(round.choices).size, round.choices.length);
      assert.equal(round.choices.filter(value => value === round.correct).length, 1);
    });
  });
});

test("difficulty starts gently, grows progressively and limits intentional zero cases", () => {
  subtraction.SUBTRACTION_STAGE_IDS.forEach(stageId => {
    const total = stageId === "subtraction-preparation" ? 8 : 10;
    const rounds = createSession(stageId, total);
    assert.equal(rounds[0].difficulty.level, 1);
    assert.equal(rounds[0].first <= 5, true);
    assert.equal(rounds[0].choices.length, 2);
    assert.equal(rounds.at(-1).difficulty.level, 3);
    assert.equal(rounds.at(-1).first <= (stageId === "subtraction-preparation" ? 15 : 20), true);
    assert.equal(rounds.filter(round => round.removed === 0 || round.result === 0).length <= 2, true);
  });
});

test("preparation covers four patterns and manual removal caps, toggles and confirms safely", () => {
  const rounds = createSession("subtraction-preparation", 8);
  assert.deepEqual(new Set(rounds.map(round => round.pattern)), new Set(subtraction.SUBTRACTION_PATTERNS));
  const manualRound = rounds.find(round => round.manualRemoval);
  assert.ok(manualRound);
  const state = subtraction.createRemovalState(manualRound);
  for (let index = 0; index < manualRound.removed; index += 1) {
    assert.equal(subtraction.toggleRemovalSelection(state, index), true);
  }
  assert.equal(subtraction.isRemovalSelectionComplete(state), true);
  if (manualRound.removed < manualRound.first) {
    assert.equal(subtraction.toggleRemovalSelection(state, manualRound.removed), false);
  }
  assert.equal(subtraction.toggleRemovalSelection(state, 0), true);
  assert.equal(subtraction.isRemovalSelectionComplete(state), false);
});

test("numeric and visual subtraction keep equation, speech and visual quantities aligned", () => {
  ["subtract-smaller-from-greater", "visual-subtraction"].forEach(stageId => {
    createSession(stageId, 10).forEach(round => {
      assert.equal(round.equation, `${round.first} − ${round.removed} = ?`);
      assert.equal(round.startVisual.quantity, round.first);
      assert.equal(round.removedVisual.quantity, round.removed);
      assert.equal(round.remainingVisual.quantity, round.result);
      assert.equal(round.startVisual.symbol, round.remainingVisual.symbol);
      assert.match(round.speech, /kaç/i);
      if (round.first > 10) assert.deepEqual(round.startVisual.blocks, [10, round.first - 10]);
    });
  });
});

test("sessions vary equations and answer positions without repeating a starting number immediately", () => {
  subtraction.SUBTRACTION_STAGE_IDS.forEach(stageId => {
    const total = stageId === "subtraction-preparation" ? 8 : 10;
    const rounds = createSession(stageId, total);
    assert.equal(new Set(rounds.map(round => `${round.first}-${round.removed}`)).size, rounds.length);
    rounds.slice(1).forEach((round, index) => assert.notEqual(round.first, rounds[index].first));
    assert.equal(new Set(rounds.map(round => round.choices.indexOf(round.correct))).size > 1, true);
  });
});

test("Learning Path ends this sprint at visual subtraction and keeps mixed operations planned", () => {
  const throughAddition = {
    completed: Object.fromEntries(roadmap.STAGES.filter(stage => stage.order <= 19 && stage.implemented).map(stage => [stage.id, true]))
  };
  assert.equal(roadmap.canLaunchStage("subtraction-preparation", throughAddition), true);
  const afterPreparation = { completed: { ...throughAddition.completed, "subtraction-preparation": true } };
  assert.equal(roadmap.canLaunchStage("subtract-smaller-from-greater", afterPreparation), true);
  const afterNumeric = { completed: { ...afterPreparation.completed, "subtract-smaller-from-greater": true } };
  assert.equal(roadmap.canLaunchStage("visual-subtraction", afterNumeric), true);
  const afterVisual = { completed: { ...afterNumeric.completed, "visual-subtraction": true } };
  assert.equal(roadmap.canLaunchStage("mixed-operations", afterVisual), false);
});

test("focused UI provides tap removal, remaining-only counting, cleanup, pause and boundary behavior", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.match(app, /function toggleSubtractionObject/);
  assert.match(app, /function checkSubtractionRemoval/);
  assert.match(app, /\.subtraction-object\.remaining:not\(\.removed\)/);
  assert.match(app, /numberLearningSupportRun \+= 1/);
  assert.match(app, /clearNumberLearningTimer\(\)/);
  assert.match(app, /const nextStage = learningPathModel\.getNextEligibleStage/);
  assert.match(app, /logicAttention\.STAGE_IDS\.includes\(stage\.id\)/);
  assert.match(html, /id="number-learning-path-button"[\s\S]*Öğrenme Yolu/);
  assert.match(html, /id="number-learning-pause-button"/);
  assert.match(css, /\.subtraction-object\{[\s\S]*min-width:44px;min-height:44px/);
  assert.match(css, /@media\(max-width:390px\)[\s\S]*\.subtraction-object-group/);
});
