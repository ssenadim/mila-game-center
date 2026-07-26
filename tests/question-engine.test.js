const test = require("node:test");
const assert = require("node:assert/strict");

function createRandom(seed = 1) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function setRandom(seed) {
  const random = createRandom(seed);
  global.window.MilaUtils = {
    randomItem(items) {
      return items.length ? items[Math.floor(random() * items.length)] : undefined;
    },
    shuffle(items) {
      const shuffled = [...items];
      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
      }
      return shuffled;
    }
  };
}

global.window = {};
setRandom(1);
require("../js/QuestionEngine.js");
const QuestionEngine = global.window.MilaQuestionEngine;

const categories = ["Colors", "Numbers", "Animals", "Fruits"];
const questions = categories.flatMap((category, categoryIndex) => Array.from({ length: 3 }, (_, itemIndex) => {
  const correct = `${category}-${itemIndex + 1}`;
  return {
    id: `${category.toLowerCase()}-${itemIndex + 1}`,
    category,
    label: category,
    prompt: `Find ${correct}`,
    visual: `${categoryIndex + 1}-${itemIndex + 1}`,
    correct,
    answers: Array.from({ length: 4 }, (__, answerIndex) => `${category}-${answerIndex + 1}`)
  };
}));

test("uses every unique category question before reuse", () => {
  setRandom(2);
  const engine = new QuestionEngine(questions);
  const plan = engine.createSessionPlan(["Colors"], 6);
  assert.equal(plan.length, 6);
  assert.equal(new Set(plan.slice(0, 3).map(question => question.id)).size, 3);
});

test("avoids consecutive duplicate targets when alternatives exist", () => {
  setRandom(3);
  const engine = new QuestionEngine(questions);
  const plan = engine.createSessionPlan(["Animals"], 15);
  plan.slice(1).forEach((question, index) => assert.notEqual(question.correct, plan[index].correct));
});

test("small content pools safely fill the requested session", () => {
  setRandom(4);
  const singleQuestion = [questions[0]];
  const engine = new QuestionEngine(singleQuestion);
  const plan = engine.createSessionPlan(["Colors"], 20);
  assert.equal(plan.length, 20);
  assert.ok(plan.every(question => question.correct === singleQuestion[0].correct));
});

test("mixed plans include and evenly distribute every available category", () => {
  setRandom(5);
  const engine = new QuestionEngine(questions);
  const plan = engine.createSessionPlan(categories, 10);
  const counts = categories.map(category => plan.filter(question => question.category === category).length);
  assert.ok(counts.every(count => count >= 1));
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1);
});

test("mixed plans avoid category streaks longer than two", () => {
  setRandom(6);
  const engine = new QuestionEngine(questions);
  const plan = engine.createSessionPlan(categories, 40);
  for (let index = 2; index < plan.length; index += 1) {
    assert.ok(!(plan[index].category === plan[index - 1].category && plan[index].category === plan[index - 2].category));
  }
});

test("answer choices contain exactly one correct answer and no duplicates", () => {
  setRandom(7);
  const engine = new QuestionEngine(questions);
  const choices = engine.getAnswers(questions[0]);
  assert.equal(choices.length, 4);
  assert.equal(choices.filter(answer => answer === questions[0].correct).length, 1);
  assert.equal(new Set(choices).size, choices.length);
});

test("correct answer position varies across consecutive questions", () => {
  setRandom(8);
  const engine = new QuestionEngine(questions);
  const firstPosition = engine.getAnswers(questions[0]).indexOf(questions[0].correct);
  const secondPosition = engine.getAnswers(questions[0]).indexOf(questions[0].correct);
  assert.notEqual(firstPosition, secondPosition);
});

test("distractors come from the current logical category", () => {
  setRandom(9);
  const engine = new QuestionEngine(questions);
  const categoryVocabulary = new Set(questions.filter(question => question.category === "Fruits").flatMap(question => [question.correct, ...question.answers]));
  assert.ok(engine.getAnswers(questions.find(question => question.category === "Fruits")).every(answer => categoryVocabulary.has(answer)));
});

test("planning and answer generation do not mutate source content", () => {
  setRandom(10);
  const source = JSON.parse(JSON.stringify(questions));
  const before = JSON.stringify(source);
  const engine = new QuestionEngine(source);
  engine.createSessionPlan(categories, 20);
  engine.getAnswers(source[0]);
  assert.equal(JSON.stringify(source), before);
});

test("replay planning creates a fresh plan", () => {
  setRandom(11);
  const engine = new QuestionEngine(questions);
  const firstPlan = engine.createSessionPlan(categories, 20).map(question => question.id);
  const replayPlan = engine.createSessionPlan(categories, 20).map(question => question.id);
  assert.notDeepEqual(replayPlan, firstPlan);
});

test("planned clones still update the existing learning-stat identity", () => {
  setRandom(12);
  const engine = new QuestionEngine(questions);
  const [plannedQuestion] = engine.createSessionPlan(["Numbers"], 1);
  engine.recordResult(plannedQuestion, true);
  assert.equal(engine.getLearningStats()[`${plannedQuestion.category}:${plannedQuestion.correct}`].successes, 1);
});

test("empty and one-item pools remain valid", () => {
  setRandom(13);
  const emptyEngine = new QuestionEngine([]);
  assert.deepEqual(emptyEngine.createSessionPlan(["Colors"], 10), []);
  assert.deepEqual(emptyEngine.getAnswers(undefined), []);
  const singleQuestion = { ...questions[0], answers: [questions[0].correct] };
  const singleEngine = new QuestionEngine([singleQuestion]);
  assert.equal(singleEngine.createSessionPlan(["Colors"], 7).length, 7);
  assert.deepEqual(singleEngine.getAnswers(singleQuestion), [singleQuestion.correct]);
});
