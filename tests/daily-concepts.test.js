const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

global.window = global.window || {};
const categories = require("../js/LearningCategories.js");
global.window.MilaLearningCategories = categories;
const daily = require("../js/DailyConcepts.js");
const roadmap = require("../js/LearningPath.js");
const logic = require("../js/LogicAttention.js");

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => { value = (value * 1664525 + 1013904223) >>> 0; return value / 4294967296; };
}

test("all eight Günlük Hayat stages are implemented with exact learning types and lengths", () => {
  const expected = [
    ["emotions", "emotionRecognition", 8], ["weather", "weatherRecognition", 8], ["seasons", "seasonRecognition", 8],
    ["positions", "positionRecognition", 10], ["opposites", "oppositeRecognition", 10], ["daily-actions", "actionRecognition", 8],
    ["time-preparation", "timePreparation", 8], ["money-preparation", "moneyPreparation", 8]
  ];
  assert.deepEqual(daily.STAGE_IDS, expected.map(([id]) => id));
  expected.forEach(([id, learningType, sessionLength], index) => {
    const stage = roadmap.stageById(id);
    assert.equal(stage.implemented, true, id);
    assert.equal(stage.learningType, learningType, id);
    assert.equal(stage.sessionLength, sessionLength, id);
    assert.equal(stage.order, 31 + index, id);
    assert.equal(roadmap.PLAYABLE_LEARNING_TYPES.has(learningType), true, learningType);
  });
  assert.equal(roadmap.stageById("mixed-operations").implemented, true);
});

test("every strategy generates valid gentle rounds with unique single answers", () => {
  daily.STAGE_IDS.forEach((id, stageIndex) => {
    const total = daily.STAGE_CONFIG[id].rounds;
    const levels = [];
    for (let roundNumber = 1; roundNumber <= total; roundNumber += 1) {
      const round = daily.createRound(id, roundNumber, total, { rng: seededRandom(stageIndex * 50 + roundNumber), warn: () => {} });
      assert.equal(daily.validateRound(round), true, `${id}/${roundNumber}`);
      levels.push(round.difficulty.level);
      if (round.choices) {
        assert.equal(new Set(round.choices.map(choice => choice.id)).size, round.choices.length);
        assert.equal(round.choices.filter(choice => choice.id === round.correctId).length, 1);
      }
    }
    assert.equal(levels[0], 1);
    assert.ok(levels.includes(2));
    assert.equal(levels.at(-1), 3);
  });
  assert.deepEqual(daily.validateContent(() => {}), { valid: true, problems: [] });
});

test("Duygular contains ten required emotions and valid child-safe situations", () => {
  const required = ["Mutlu", "Üzgün", "Kızgın", "Korkmuş", "Şaşırmış", "Heyecanlı", "Yorgun", "Utangaç", "Sakin", "Kafası Karışmış"];
  const items = daily.categoryItems("Emotions");
  required.forEach(label => assert.ok(items.some(item => item.label === label), label));
  assert.equal(daily.EMOTION_SITUATIONS.length, 4);
  daily.EMOTION_SITUATIONS.forEach(scene => assert.ok(items.some(item => item.sourceKey === scene.target)));
  const families = Array.from({ length: 8 }, (_, index) => daily.createEmotionRound(index + 1, 8, seededRandom(index + 1)).family);
  ["findFace", "nameEmotion", "situation"].forEach(family => assert.ok(families.includes(family)));
});

test("Hava Durumu has ten mappings and valid unambiguous clothing associations", () => {
  const items = daily.categoryItems("Weather");
  assert.ok(items.length >= 10);
  ["Güneşli", "Bulutlu", "Yağmurlu", "Karlı", "Rüzgârlı", "Fırtınalı", "Sisli", "Sıcak", "Soğuk", "Gökkuşaklı"].forEach(label => assert.ok(items.some(item => item.label === label)));
  Object.entries(daily.WEATHER_CLOTHES).forEach(([weather, clothing]) => {
    assert.ok(items.some(item => item.sourceKey === weather));
    assert.ok(clothing.id && clothing.visual);
  });
  assert.equal(daily.createWeatherRound(7, 8, seededRandom(7)).family, "clothing");
  assert.deepEqual([1, 2, 3].map(round => daily.createWeatherRound(round, 8, seededRandom(round)).weatherKey), ["Sunny", "Rainy", "Snowy"]);
});

test("Mevsimler has four seasons, valid associations and tap ordering", () => {
  assert.deepEqual(daily.SEASON_ORDER, ["Spring", "Summer", "Autumn", "Winter"]);
  Object.values(daily.SEASON_META).forEach(meta => assert.equal(meta.items.length, 3));
  const ordering = daily.createSeasonRound(8, 8, seededRandom(8));
  assert.equal(ordering.family, "seasonOrder");
  const state = logic.createSequenceState(ordering);
  ordering.target.forEach(id => assert.equal(logic.placeSequenceStep(state, id), true));
  assert.equal(logic.isSequenceCorrect(state), true);
  assert.equal(logic.removeSequenceStep(state, 1), true);
});

test("Konum Kavramları covers ten relations with viewer perspective and tap placement", () => {
  const items = daily.categoryItems("Positions");
  const labels = ["İçinde", "Üstünde", "Altında", "Yukarısında", "Arkasında", "Önünde", "Yanında", "Arasında", "Solunda", "Sağında"];
  labels.forEach(label => assert.ok(items.some(item => item.label === label), label));
  items.forEach(item => assert.equal(daily.positionMatches(item.sourceKey, item.coordinates), true, item.sourceKey));
  Array.from({ length: 10 }, (_, index) => daily.createPositionRound(index + 1, 10, seededRandom(index + 1))).forEach(round => {
    assert.equal(daily.validateRound(round), true);
    if (round.type === "positionRecognition") assert.equal(round.perspective, "viewer");
  });
  const placement = daily.createPositionRound(8, 10, seededRandom(8));
  assert.equal(placement.type, "positionPlacement");
  assert.ok(placement.object && placement.targets.length >= 3);
});

test("Zıt Kavramlar has twelve bidirectional pairs and excludes ambiguous answers", () => {
  assert.equal(daily.OPPOSITE_PAIRS.length, 12);
  daily.OPPOSITE_PAIRS.forEach(pair => {
    assert.equal(daily.oppositeLookup(pair.first.label).id, pair.second.id);
    assert.equal(daily.oppositeLookup(pair.second.label).id, pair.first.id);
    assert.notEqual(pair.first.visual, pair.second.visual, pair.id);
  });
  const matching = daily.createOppositeRound(8, 10, seededRandom(8));
  assert.equal(matching.type, "oppositeMatching");
  assert.equal(matching.choices.filter(choice => choice.id === matching.correctId).length, 1);
});

test("Günlük Eylemler contains all required actions and a valid three-step routine", () => {
  const labels = daily.categoryItems("Actions").map(item => item.label);
  ["Koşmak", "Yürümek", "Zıplamak", "Oturmak", "Ayakta Durmak", "Uyumak", "Yemek Yemek", "Su İçmek", "Kitap Okumak", "Yazı Yazmak", "Yüzmek", "Dans Etmek"].forEach(label => assert.ok(labels.includes(label), label));
  daily.ROUTINES.forEach(routine => assert.equal(routine.steps.length, 3));
  const round = daily.createActionRound(8, 8, seededRandom(8));
  assert.equal(round.family, "routine");
  assert.equal(new Set(round.target).size, 3);
});

test("Saatlere Hazırlık uses readable whole hours only and one correct clock", () => {
  for (let hour = 1; hour <= 12; hour += 1) {
    const clock = daily.createClock(hour);
    assert.equal(clock.minute, 0);
    assert.equal(clock.minuteAngle, 0);
    assert.equal(clock.hourAngle, hour * 30);
  }
  const rounds = Array.from({ length: 8 }, (_, index) => daily.createTimeRound(index + 1, 8, seededRandom(index + 1)));
  assert.deepEqual(rounds.filter(round => round.family === "timeOfDay").map(round => round.timeOfDay), ["morning", "evening", "night", "noon"]);
  rounds.forEach(round => {
    assert.equal(daily.validateRound(round), true);
    if (round.clock) assert.ok(round.clock.hour >= 1 && round.clock.hour <= 12);
    if (round.choices.some(choice => choice.clock)) assert.equal(round.choices.filter(choice => choice.id === round.correctId).length, 1);
  });
});

test("recent challenge history prevents immediate repetition with bounded regeneration", () => {
  const first = daily.createRound("weather", 1, 8, { rng: seededRandom(1), warn: () => {} });
  const next = daily.createRound("weather", 1, 8, { rng: seededRandom(1), recentKeys: [first.key], warn: () => {} });
  assert.notEqual(next.key, first.key);
  assert.equal(daily.isRecentChallenge(next, [first.key]), false);
});

test("Para hazırlığı validates totals, sufficiency and equal amounts without change", () => {
  for (let total = 1; total <= 10; total += 1) {
    const group = daily.tokenGroup(total);
    assert.equal(daily.calculateTokenTotal(group.tokens), total);
    assert.ok(group.tokens.every(token => [1, 5, 10].includes(token.value)));
  }
  const rounds = Array.from({ length: 8 }, (_, index) => daily.createMoneyRound(index + 1, 8, seededRandom(index + 1)));
  rounds.forEach(round => { assert.ok(round.price >= 1 && round.price <= 10); assert.equal(daily.validateRound(round), true); });
  const enough = rounds.find(round => round.family === "enoughMoney");
  assert.equal(enough.enough, enough.paymentTotal >= enough.price);
  const equal = rounds.find(round => round.family === "equalMoney");
  assert.equal(equal.choices.filter(choice => choice.total === equal.price).length, 1);
  const source = fs.readFileSync(path.join(__dirname, "..", "js", "DailyConcepts.js"), "utf8");
  assert.doesNotMatch(source, /change calculation|para üstü|discount|percentage|credit card/i);
});

test("Learning Path unlocks all eight stages in order and completes the group", () => {
  const progress = { completed: Object.fromEntries(roadmap.STAGES.filter(stage => stage.order <= 30 && stage.implemented).map(stage => [stage.id, true])) };
  daily.STAGE_IDS.forEach((id, index) => {
    assert.equal(roadmap.canLaunchStage(id, progress), true, id);
    progress.completed[id] = true;
    const next = daily.STAGE_IDS[index + 1];
    if (next) assert.equal(roadmap.getNextEligibleStage(id, progress).id, next);
  });
  assert.deepEqual(roadmap.getGroupProgress("daily-life", progress), { completed: 8, playable: 8, planned: 0 });
  assert.equal(roadmap.getNextEligibleStage("money-preparation", progress), undefined);
  assert.equal(roadmap.canLaunchStage("mixed-operations", progress), true);
});

test("focused UI wires speech, retry, pause, cleanup, keyboard/tap and responsive visuals", () => {
  const root = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.match(html, /js\/DailyConcepts\.js\?v=8\.3\.5\.2/);
  assert.match(html, /id="logic-attention-feedback"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(app, /dailyConcepts\.STAGE_IDS\.includes\(stage\.id\)/);
  assert.match(app, /clearSpeech\(\)[\s\S]*speech\.speak\(logicAttentionState\.round\.speech, TURKISH_LANGUAGE\)/);
  assert.match(app, /logicAttentionState\.selection = \["positionPlacement", "oppositeMatching"\]/);
  assert.match(app, /aria-pressed/);
  assert.match(app, /Konum sahnesi \$\{index \+ 1\}/);
  assert.match(app, /logic-hint-badge/);
  assert.match(app, /if \(isLogicAttentionActive\)[\s\S]*setLogicAttentionInputEnabled\(false\)/);
  assert.match(app, /cleanupLogicAttention\(\)[\s\S]*logicAttentionSessionId \+= 1/);
  assert.match(app, /completeLearningPathStage\(\)/);
  assert.match(css, /\.daily-clock/);
  assert.match(css, /\.daily-money-token/);
  assert.match(css, /@media\(max-width:480px\)/);
  assert.doesNotMatch(app, /setInterval\([^)]*dailyConcept/i);
});
