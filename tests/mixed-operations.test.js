"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const numberLearning = require("../js/NumberLearning.js");
const learningPath = require("../js/LearningPath.js");
const categories = require("../js/LearningCategories.js");

function seeded(seed) {
  return () => {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let value = Math.imul(seed ^ seed >>> 15, 1 | seed);
    value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function createSession(seed = 1) {
  const rng = seeded(seed);
  const plan = numberLearning.createMixedOperationPlan(10, rng);
  const recentEquations = [];
  const rounds = plan.map((entry, index) => {
    const round = numberLearning.createMixedOperationsRound(index + 1, 10, { rng, operationPlan: plan, recentEquations, warn: () => {} });
    recentEquations.unshift(round.operation === "addition" ? `${round.first}+${round.second}` : `${round.first}-${round.removed}`);
    return round;
  });
  return { plan, rounds };
}

function maxStreak(plan) {
  let maximum = 0;
  let current = 0;
  let previous;
  plan.forEach(entry => {
    current = entry.operation === previous ? current + 1 : 1;
    previous = entry.operation;
    maximum = Math.max(maximum, current);
  });
  return maximum;
}

test("mixed operations is implemented as a ten-round playable Learning Path stage", () => {
  const stage = learningPath.stageById("mixed-operations");
  assert.equal(stage.implemented, true);
  assert.equal(stage.learningType, "mixedOperations");
  assert.equal(stage.sessionLength, 10);
  assert.equal(numberLearning.PLAYABLE_STAGE_IDS.includes(stage.id), true);
  assert.equal(learningPath.PLAYABLE_LEARNING_TYPES.has(stage.learningType), true);
});

test("mixed session always balances operations and avoids streaks longer than two", () => {
  for (let seed = 1; seed <= 40; seed += 1) {
    const { plan, rounds } = createSession(seed);
    assert.equal(plan.length, 10);
    assert.equal(plan.filter(entry => entry.operation === "addition").length, 5);
    assert.equal(plan.filter(entry => entry.operation === "subtraction").length, 5);
    assert.equal(maxStreak(plan) <= 2, true);
    assert.equal(numberLearning.validateMixedOperationPlan(plan), true);
    assert.equal(numberLearning.validateMixedSession(rounds), true);
  }
});

test("mixed arithmetic stays correct, unique, visual, story-aligned and inside zero through twenty", () => {
  const { rounds } = createSession(83);
  assert.deepEqual(new Set(rounds.filter(round => round.operation === "addition").map(round => round.family)), new Set(["numeric", "visual", "story"]));
  assert.deepEqual(new Set(rounds.filter(round => round.operation === "subtraction").map(round => round.family)), new Set(["numeric", "visual", "story"]));
  rounds.forEach((round, index) => {
    assert.equal(numberLearning.validateRound(round), true);
    assert.equal(Number.isInteger(round.first), true);
    assert.equal(round.result >= 0 && round.result <= 20, true);
    assert.equal(round.choices.every(value => Number.isInteger(value) && value >= 0 && value <= 20), true);
    assert.equal(new Set(round.choices).size, round.choices.length);
    assert.equal(round.choices.filter(value => value === round.correct).length, 1);
    if (index < 4) assert.equal(round.result <= 5, true);
    if (index >= 4 && index < 7) assert.equal(round.result <= 10, true);
    if (round.operation === "addition") {
      assert.equal(round.result, round.first + round.second);
      assert.equal(round.firstVisual.quantity, round.first);
      assert.equal(round.secondVisual.quantity, round.second);
    } else {
      assert.equal(round.first >= round.removed, true);
      assert.equal(round.result, round.first - round.removed);
      assert.equal(round.startVisual.quantity, round.first);
      assert.equal(round.remainingVisual.quantity, round.result);
    }
    if (round.family === "story") {
      assert.equal(round.story, round.prompt);
      assert.equal(round.storyValues.result, round.result);
    }
  });
});

test("replay creates a fresh mixed plan with both operations", () => {
  const first = createSession(7);
  const replay = createSession(19);
  assert.notDeepEqual(replay.plan, first.plan);
  assert.equal(replay.rounds.some(round => round.operation === "addition"), true);
  assert.equal(replay.rounds.some(round => round.operation === "subtraction"), true);
});

test("six Learning Path groups use playable counts and mixed operations bridges to Think and Find", () => {
  assert.equal(learningPath.GROUPS.length, 6);
  assert.deepEqual(learningPath.GROUPS.map(group => learningPath.getGroupProgress(group.id, { completed: {} }).playable), [4, 6, 6, 7, 7, 8]);
  assert.equal(learningPath.STAGES.filter(learningPath.isPlayableStage).length, 38);
  assert.equal(learningPath.validateRoadmap({ categories: categories.CATEGORIES, warn: () => {} }).valid, true);
  const throughVisual = { completed: Object.fromEntries(learningPath.STAGES.filter(stage => stage.order <= 22).map(stage => [stage.id, true])) };
  assert.equal(learningPath.canLaunchStage("mixed-operations", throughVisual), true);
  assert.equal(learningPath.getRecommendedStage(throughVisual).id, "mixed-operations");
  const afterMixed = { completed: { ...throughVisual.completed, "mixed-operations": true } };
  assert.equal(learningPath.getNextEligibleStage("mixed-operations", afterMixed).id, "odd-one-out");
  assert.equal(learningPath.canLaunchStage("odd-one-out", afterMixed), true);
});

test("recommendation and whole-path completion remain player-specific", () => {
  const allCompleted = { completed: Object.fromEntries(learningPath.STAGES.filter(learningPath.isPlayableStage).map(stage => [stage.id, true])) };
  const anotherPlayer = { completed: { "recognize-colors": true } };
  assert.equal(learningPath.isLearningPathComplete(allCompleted), true);
  assert.equal(learningPath.getRecommendedStage(allCompleted), undefined);
  assert.equal(learningPath.isLearningPathComplete(anotherPlayer), false);
  assert.equal(learningPath.getRecommendedStage(anotherPlayer).id, "recognize-shapes");
  assert.deepEqual(learningPath.getGroupProgress("first-operations", allCompleted), { completed: 7, playable: 7, planned: 0 });
});

test("planned or broken stages cannot launch or block silently", () => {
  const broken = learningPath.STAGES.map(stage => stage.id === "mixed-operations" ? { ...stage, implemented: false } : stage);
  assert.equal(learningPath.canLaunchStage("mixed-operations", { completed: { "visual-subtraction": true } }, broken), false);
  assert.equal(learningPath.validateRoadmap({ stages: broken, categories: categories.CATEGORIES, warn: () => {} }).valid, false);
});

test("UI integration includes fresh plans, help, pause cleanup, safe summary and replay", () => {
  const root = path.resolve(__dirname, "..");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.match(app, /createMixedOperationPlan\(stage\.sessionLength\)/);
  assert.match(app, /operationPlan: numberLearningState\.operationPlan/);
  assert.match(app, /isMixedOperationsRound/);
  assert.match(app, /shouldAdvanceAfterHelp/);
  assert.match(app, /getNextEligibleStage\(activeLearningPathStage\.id, progress\)/);
  assert.match(app, /querySelectorAll\("\.addition-object, \.subtraction-object"\)/);
  assert.match(html, /number-learning-help-button[^>]*>/);
  assert.match(html, /number-learning-pause-button/);
  assert.match(css, /number-learning-visual\.operation-help/);
});
