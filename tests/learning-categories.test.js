const test = require("node:test");
const assert = require("node:assert/strict");

global.window = {
  MilaUtils: {
    randomItem(items) { return items[0]; },
    shuffle(items) { return [...items].reverse(); }
  }
};

const library = require("../js/LearningCategories.js");
require("../js/QuestionEngine.js");
const QuestionEngine = global.window.MilaQuestionEngine;

const REQUIRED = [
  "Colors", "Shapes", "Numbers", "Animals", "Fruits", "Vegetables", "Foods", "Drinks", "Vehicles", "SeaAnimals",
  "Insects", "Dinosaurs", "Birds", "FarmAnimals", "WildAnimals", "Pets", "HomeItems", "KitchenItems", "BathroomItems",
  "Toys", "Clothes", "ShoesAccessories", "Body", "Face", "Jobs", "SchoolItems", "DailyLife", "Nature", "Weather",
  "Seasons", "Space", "Places", "Emotions", "Opposites", "Positions", "Actions", "Letters", "EnglishWords",
  "NumberOrder", "BigSmall"
];

const GENERAL = [
  "Animals", "Fruits", "Vegetables", "Foods", "Drinks", "Vehicles", "SeaAnimals", "Insects", "Dinosaurs", "Birds",
  "FarmAnimals", "WildAnimals", "Pets", "HomeItems", "KitchenItems", "BathroomItems", "Toys", "Clothes",
  "ShoesAccessories", "Body", "Face", "Jobs", "SchoolItems", "DailyLife", "Nature", "Space", "Places", "Actions", "EnglishWords"
];

function category(id) {
  return library.CATEGORIES.find(item => item.id === id);
}

test("exactly the 40 required category IDs exist in valid groups", () => {
  assert.equal(library.CATEGORIES.length, 40);
  assert.deepEqual(new Set(library.CATEGORIES.map(item => item.id)), new Set(REQUIRED));
  assert.equal(new Set(library.CATEGORIES.map(item => item.id)).size, 40);
  const groupIds = new Set(library.GROUPS.map(group => group.id));
  assert.ok(library.CATEGORIES.every(item => groupIds.has(item.group)));
  assert.equal(library.validateCategories(library.CATEGORIES, () => {}).valid, true);
});

test("all general vocabulary categories have 12 unique complete English items", () => {
  GENERAL.forEach(id => {
    const item = category(id);
    assert.ok(item, `${id} missing`);
    assert.ok(item.items.length >= 12, `${id} below minimum`);
    assert.equal(new Set(item.items.map(content => content.id)).size, item.items.length);
    assert.equal(new Set(item.items.map(content => content.wordEn)).size, item.items.length);
    assert.equal(new Set(item.items.map(content => content.visualSvg ?? content.visual)).size, item.items.length);
    assert.ok(item.items.every(content => content.wordEn && content.speechValue && (content.visual || content.visualSvg)));
  });
});

test("concept categories satisfy every numeric and content minimum", () => {
  assert.equal(category("Colors").items.length, 12);
  assert.equal(category("Shapes").items.length, 10);
  assert.deepEqual(category("Numbers").items.map(item => item.numericValue), Array.from({ length: 21 }, (_, index) => index));
  assert.equal(category("Weather").items.length, 10);
  assert.equal(category("Emotions").items.length, 10);
  assert.equal(category("Opposites").items.length, 12);
  assert.equal(category("Positions").items.length, 10);
  assert.equal(category("Letters").items.map(item => item.wordEn).join(""), "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  assert.deepEqual(category("NumberOrder").items.map(item => item.numericValue), Array.from({ length: 21 }, (_, index) => index));
  const seasons = category("Seasons");
  assert.ok(seasons.items.length >= 12);
  ["Spring", "Summer", "Autumn", "Winter"].forEach(season => assert.ok(seasons.items.some(item => item.wordEn === season)));
});

test("generated questions have one correct answer, unique choices and a supported strategy", () => {
  const supported = new Set(["vocabulary", "color", "shape", "number", "weather", "season", "emotion", "opposite", "position", "letter", "ordering", "comparison"]);
  assert.equal(library.questions.length, library.CATEGORIES.reduce((total, item) => total + item.items.length, 0));
  library.questions.forEach(question => {
    assert.ok(supported.has(question.strategy));
    assert.ok(question.prompt);
    assert.ok(question.visual || question.visualSvg);
    assert.equal(new Set(question.answers).size, question.answers.length);
    assert.equal(question.answers.filter(answer => answer === question.correct).length, 1);
  });
});

test("QuestionEngine selects every category and applies progressive unique answers", () => {
  const engine = new QuestionEngine(library.questions);
  REQUIRED.forEach(id => {
    engine.setActiveCategories([id]);
    const question = engine.selectQuestion();
    assert.equal(question.category, id);
    const warmUp = engine.getAnswers(question, { phase: "warm-up" });
    const variety = engine.getAnswers(question, { phase: "variety" });
    assert.equal(warmUp.length, 2);
    assert.equal(variety.length, 3);
    [warmUp, variety].forEach(answers => {
      assert.equal(new Set(answers).size, answers.length);
      assert.equal(answers.filter(answer => answer === question.correct).length, 1);
    });
  });
});

test("opposites, positions, ordering and comparisons remain objectively valid", () => {
  category("Opposites").items.forEach(item => {
    assert.equal(item.pair.length, 2);
    assert.notEqual(item.pair[0], item.pair[1]);
    assert.ok(item.choices.includes(item.pair[0]) && item.choices.includes(item.pair[1]));
  });
  category("Positions").items.forEach(item => assert.match(item.visualSvg, /^<svg/));
  category("NumberOrder").items.forEach(item => {
    assert.ok(Number.isInteger(item.numericValue));
    assert.match(item.visual, /\?/);
  });
  category("BigSmall").items.forEach(item => {
    assert.equal(item.comparisonValues.length, 2);
    assert.notEqual(item.comparisonValues[0], item.comparisonValues[1]);
    assert.ok(item.choices.includes(item.wordEn));
  });
});

test("category packs contain the exact safe pools", () => {
  assert.deepEqual(library.PACKS.mixed, ["Colors", "Shapes", "Numbers", "Animals", "Fruits", "Vegetables", "Vehicles", "SeaAnimals", "Toys", "Body", "Emotions", "Nature"]);
  assert.deepEqual(library.PACKS.words, ["Animals", "Fruits", "Vegetables", "Foods", "Drinks", "Vehicles", "SeaAnimals", "Insects", "Toys", "Clothes", "HomeItems", "Jobs", "Nature", "Space", "Actions"]);
  assert.deepEqual(library.PACKS["colors-shapes"], ["Colors", "Shapes"]);
  assert.deepEqual(library.PACKS.numbers, ["Numbers", "NumberOrder", "BigSmall"]);
  assert.ok(library.CATEGORIES.every(item => library.sanitizeSavedSelection([item.id]).includes(item.id)));
});

test("legacy and corrupted saved selections migrate without affecting valid IDs", () => {
  assert.deepEqual(library.sanitizeSavedSelection(["Colors", "Emoji", "Missing", "Colors", null]), ["Colors", "Emotions"]);
  assert.deepEqual(library.sanitizeSavedSelection(undefined), []);
  assert.deepEqual(library.sanitizeSavedSelection({}), []);
});

test("Mini Game sharing exposes only content that satisfies each eligibility rule", () => {
  const matching = library.getEligibleCategories("matching");
  assert.ok(matching.length > 5);
  assert.ok(matching.every(item => item.items.length >= 8 && item.items.every(content => content.visual || content.visualSvg)));
  const listening = library.getEligibleCategories("listening");
  assert.ok(listening.every(item => item.items.length >= 4 && item.items.every(content => content.speechValue && (content.visual || content.visualSvg))));
  const missing = library.getEligibleCategories("missing-item");
  assert.ok(missing.every(item => item.items.length >= 5 && item.items.every(content => content.visual)));
  assert.ok(!library.getEligibleCategories("unknown").length);
});
