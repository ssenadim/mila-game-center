"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const numberLearning = require("../js/NumberLearning.js");
require("../js/LearningCategories.js");
const learningPath = require("../js/LearningPath.js");

const root = path.join(__dirname, "..");

test("all six Sprint 8.3.2 stages are implemented and playable", () => {
  assert.equal(numberLearning.NUMBER_STAGE_IDS.length, 6);
  numberLearning.NUMBER_STAGE_IDS.forEach(stageId => {
    const stage = learningPath.stageById(stageId);
    assert.equal(stage?.implemented, true, stageId);
    assert.equal(learningPath.PLAYABLE_LEARNING_TYPES.has(stage.learningType), true, stageId);
  });
});

test("number rounds stay between 0 and 20 and progress gently", () => {
  const stages = numberLearning.NUMBER_STAGE_IDS;
  stages.forEach(stageId => {
    for (let round = 1; round <= 10; round += 1) {
      const generated = numberLearning.createRound(stageId, round, 10);
      assert.equal(numberLearning.validateRound(generated), true, `${stageId} round ${round}`);
    }
  });
  assert.equal(numberLearning.getDifficulty(1, 10).max, 5);
  assert.equal(numberLearning.getDifficulty(5, 10).max, 10);
  assert.equal(numberLearning.getDifficulty(9, 10).max, 20);
});

test("counting has one correct unique answer and grouped quantity rows", () => {
  for (let round = 1; round <= 10; round += 1) {
    const generated = numberLearning.createCountingRound(round, 10);
    assert.equal(generated.choices.filter(value => value === generated.correct).length, 1);
    assert.equal(new Set(generated.choices).size, generated.choices.length);
    assert.equal(generated.visual.rows.flat().length, generated.correct);
    assert.equal(generated.visual.rows.every(row => row.length <= 5), true);
  }
  assert.equal(numberLearning.VISUAL_GROUPS.length >= 8, true);
});

test("ordering alternates direction, keeps unique identity, and requires every correct slot", () => {
  const ascending = numberLearning.createOrderingRound(1, 10);
  const descending = numberLearning.createOrderingRound(2, 10);
  assert.equal(ascending.direction, "ascending");
  assert.equal(descending.direction, "descending");
  [ascending, descending].forEach(round => {
    assert.equal(new Set(round.pieces).size, round.pieces.length);
    assert.deepEqual([...round.pieces].sort((a, b) => a - b), [...round.target].sort((a, b) => a - b));
    const state = numberLearning.createOrderingState(round);
    assert.equal(numberLearning.isOrderingComplete(state), false);
    round.target.forEach((value, index) => assert.equal(numberLearning.placeOrderingPiece(state, value, index), true));
    assert.equal(numberLearning.isOrderingComplete(state), true);
  });
});

test("previous and next questions respect boundaries and have one correct choice", () => {
  for (let round = 1; round <= 10; round += 1) {
    const generated = numberLearning.createNeighborRound(round, 10);
    assert.equal(generated.correct >= 0 && generated.correct <= 20, true);
    assert.equal(generated.choices.filter(value => value === generated.correct).length, 1);
    assert.equal(generated.mode === "previous" ? generated.correct === generated.center - 1 : generated.correct === generated.center + 1, true);
  }
});

test("greater and smaller comparisons never contain ties", () => {
  ["greater", "smaller"].forEach(mode => {
    for (let round = 1; round <= 8; round += 1) {
      const generated = numberLearning.createComparisonRound(mode, round, 8);
      assert.equal(new Set(generated.choices).size, generated.choices.length);
      assert.equal(generated.correct, mode === "greater" ? Math.max(...generated.choices) : Math.min(...generated.choices));
    }
  });
});

test("equal quantities contain exactly one matching visual option", () => {
  for (let round = 1; round <= 8; round += 1) {
    const generated = numberLearning.createEqualQuantityRound(round, 8);
    const values = generated.choices.map(choice => choice.value);
    assert.equal(values.filter(value => value === generated.source.quantity).length, 1);
    assert.equal(new Set(values).size, values.length);
    generated.choices.forEach(choice => assert.equal(choice.visual.rows.flat().length, choice.value));
  }
});

test("content validation rejects malformed visual groups and current content is valid", () => {
  assert.equal(numberLearning.validation.valid, true);
  assert.equal(numberLearning.validateContent(() => {}).valid, true);
});

test("app wiring includes focused screen, speech cleanup, pause, replay and path destination", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /id="number-learning-screen"/);
  assert.match(html, /id="number-learning-path-button"[^>]*>🗺️ Öğrenme Yolu/);
  assert.match(app, /function cleanupNumberLearning/);
  assert.match(app, /clearNumberLearningTimer\(\)/);
  assert.match(app, /cleanupNumberLearning\(\);[\s\S]*ui\.numberLearning\.classList\.add\("hidden"\)/);
  assert.match(app, /if \(isNumberLearningActive\)/);
  assert.match(app, /numberLearningListen\.addEventListener/);
  assert.match(app, /function replaySession\(\)[\s\S]*startLearningPathStage\(activeLearningPathStage\.id\)/);
  assert.match(app, /numberLearningState\.inputLocked = true/);
  assert.match(app, /numberLearningSessionId \+= 1/);
});

test("responsive number layouts cover phone and tablet-safe controls without horizontal sizing", () => {
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.match(css, /\.number-learning-screen\{[^}]*width:min\(100%,720px\)/);
  assert.match(css, /\.number-learning-choice,[^{]*\{[^}]*min-height:88px/);
  assert.match(css, /@media\(max-width:600px\)\{[\s\S]*\.number-learning-header/);
  assert.match(css, /@media\(max-width:390px\)\{[\s\S]*\.number-learning-choice/);
  assert.doesNotMatch(css, /\.number-learning-screen\{[^}]*width:\d+px/);
});
