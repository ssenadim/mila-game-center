const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

global.window = {
  MilaUtils: {
    randomItem(items) { return items[0]; },
    shuffle(items) { return [...items].reverse(); }
  }
};

const categories = require("../js/LearningCategories.js");
const roadmap = require("../js/LearningPath.js");
const numberLearning = require("../js/NumberLearning.js");
require("../js/QuestionEngine.js");
const QuestionEngine = global.window.MilaQuestionEngine;

const REQUIRED_GROUP_TITLES = [
  "İlk Keşifler",
  "Kelime Dünyası",
  "Sayılar Dünyası",
  "İlk İşlemler",
  "Düşün ve Bul",
  "Günlük Hayat"
];

const REQUIRED_STAGE_TITLES = [
  "Renkleri Tanı", "Şekilleri Tanı", "Sayıları Tanı", "Harfleri Tanı",
  "Hayvanlar", "Meyveler ve Sebzeler", "Taşıtlar", "Vücudumuz", "Eşyalar", "Doğa ve Uzay",
  "Nesneleri Say", "Sayıları Sırala", "Önceki ve Sonraki Sayı", "Büyük Sayıyı Bul", "Küçük Sayıyı Bul", "Eşit Miktarları Bul",
  "Toplamaya Hazırlık", "İki Sayıyı Topla", "Görsellerle Toplama", "Çıkarmaya Hazırlık",
  "Büyük Sayıdan Küçük Sayıyı Çıkar", "Görsellerle Çıkarma", "Karışık İşlemler",
  "Hangisi Farklı?", "Hangisi Eksik?", "Örüntüyü Tamamla", "Doğru Sırayı Bul", "Gölgesini Bul", "Aynı Grubu Bul", "Basit Labirent",
  "Duygular", "Hava Durumu", "Mevsimler", "Konum Kavramları", "Zıt Kavramlar", "Günlük Eylemler",
  "Saatlere Hazırlık", "Para Kavramına Hazırlık"
];

function completedThrough(order) {
  return {
    completed: Object.fromEntries(roadmap.STAGES.filter(stage => stage.order <= order && stage.implemented).map(stage => [stage.id, true]))
  };
}

test("roadmap contains all six required groups and all 38 ordered stages", () => {
  assert.equal(roadmap.GROUPS.length, 6);
  assert.equal(roadmap.STAGES.length, 38);
  assert.deepEqual(roadmap.GROUPS.map(group => group.title), REQUIRED_GROUP_TITLES);
  assert.deepEqual(roadmap.STAGES.map(stage => stage.title), REQUIRED_STAGE_TITLES);
  assert.equal(new Set(roadmap.GROUPS.map(group => group.id)).size, 6);
  assert.equal(new Set(roadmap.STAGES.map(stage => stage.id)).size, 38);
  assert.deepEqual(roadmap.STAGES.map(stage => stage.order), Array.from({ length: 38 }, (_, index) => index + 1));
  assert.equal(roadmap.validateRoadmap({ categories: categories.CATEGORIES, warn: () => {} }).valid, true);
});

test("every stage belongs to exactly one group in deterministic order", () => {
  const listedIds = roadmap.GROUPS.flatMap(group => group.stageIds);
  assert.equal(listedIds.length, 38);
  assert.equal(new Set(listedIds).size, 38);
  roadmap.GROUPS.forEach(group => {
    const stages = roadmap.stagesForGroup(group.id);
    assert.deepEqual(stages.map(stage => stage.id), group.stageIds);
    assert.ok(stages.every(stage => stage.groupId === group.id));
    assert.deepEqual(stages.map(stage => stage.order), [...stages.map(stage => stage.order)].sort((a, b) => a - b));
  });
});

test("every implemented stage generates a complete valid Learning Path session", () => {
  const engine = new QuestionEngine(categories.questions);
  const implemented = roadmap.STAGES.filter(stage => stage.implemented);
  assert.equal(implemented.length, 25);
  implemented.filter(stage => !numberLearning.PLAYABLE_STAGE_IDS.includes(stage.id)).forEach(stage => {
    const plan = engine.createSessionPlan(stage.categoryIds, stage.sessionLength, { gentleProgression: true });
    assert.equal(plan.length, stage.sessionLength, `${stage.id} session is incomplete`);
    assert.ok(plan.every(question => stage.categoryIds.includes(question.category)));
    plan.forEach((question, index) => {
      const answers = engine.getAnswers(question, { phase: engine.getSessionPhase(index, stage.sessionLength) });
      assert.ok(answers.includes(question.correct));
      assert.equal(new Set(answers).size, answers.length);
      assert.equal(answers.filter(answer => answer === question.correct).length, 1);
    });
  });
});

test("first stage unlocks normally and completion unlocks the next implemented stage", () => {
  const empty = { completed: {} };
  assert.equal(roadmap.canLaunchStage("recognize-colors", empty), true);
  assert.equal(roadmap.canLaunchStage("recognize-shapes", empty), false);
  assert.equal(roadmap.getRecommendedStage(empty).id, "recognize-colors");
  const afterColors = { completed: { "recognize-colors": true } };
  assert.equal(roadmap.canLaunchStage("recognize-shapes", afterColors), true);
  assert.equal(roadmap.getNextEligibleStage("recognize-colors", afterColors).id, "recognize-shapes");
});

test("number and addition stages unlock sequentially while subtraction remains planned", () => {
  const throughWordWorld = completedThrough(10);
  assert.equal(roadmap.canLaunchStage("count-objects", throughWordWorld), true);
  assert.equal(roadmap.getStageState(roadmap.stageById("count-objects"), throughWordWorld), "current");
  assert.equal(roadmap.canLaunchStage("order-numbers", throughWordWorld), false);
  assert.equal(roadmap.getNextEligibleStage("nature-space", throughWordWorld).id, "count-objects");
  assert.equal(roadmap.getRecommendedStage(throughWordWorld).id, "count-objects");
  assert.equal(roadmap.canLaunchStage("addition-preparation", completedThrough(16)), true);
  assert.equal(roadmap.canLaunchStage("add-two-numbers", completedThrough(16)), false);
  assert.equal(roadmap.canLaunchStage("subtraction-preparation", completedThrough(19)), false);
});

test("completed stages remain replayable while locked stages cannot launch", () => {
  const migrated = { completed: { "recognize-numbers": true } };
  assert.equal(roadmap.canLaunchStage("recognize-numbers", migrated), true);
  assert.equal(roadmap.getStageState(roadmap.stageById("recognize-numbers"), migrated), "completed");
  assert.equal(roadmap.canLaunchStage("animals", migrated), false);
  assert.equal(roadmap.getStageState(roadmap.stageById("animals"), migrated), "locked");
});

test("recommended and group progress count only implemented stages", () => {
  const progress = completedThrough(4);
  assert.equal(roadmap.getRecommendedStage(progress).id, "animals");
  assert.deepEqual(roadmap.getGroupProgress("first-discoveries", progress), { completed: 4, playable: 4, planned: 0 });
  assert.deepEqual(roadmap.getGroupProgress("number-world", progress), { completed: 0, playable: 6, planned: 0 });
  assert.deepEqual(roadmap.getGroupProgress("first-operations", progress), { completed: 0, playable: 3, planned: 4 });
  assert.deepEqual(roadmap.getGroupProgress("daily-life", progress), { completed: 0, playable: 6, planned: 2 });
});

test("legacy progress migrates safely without retaining unknown stage IDs", () => {
  const saved = {
    completed: { colors: true, numbers: true, animals: true, fruits: true, "mixed-review": true, unknown: true },
    unrelatedValue: { keep: true }
  };
  const migrated = roadmap.normalizeProgress(saved);
  assert.deepEqual(migrated.completed, {
    "recognize-colors": true,
    "recognize-numbers": true,
    animals: true,
    "fruits-vegetables": true
  });
  assert.deepEqual(migrated.legacyCompleted, {
    colors: true,
    numbers: true,
    animals: true,
    fruits: true,
    "mixed-review": true
  });
  assert.deepEqual(migrated.unrelatedValue, { keep: true });
  assert.deepEqual(roadmap.normalizeProgress(null), { completed: {} });
});

test("validation rejects duplicate IDs, missing groups, unknown prerequisites and cycles", () => {
  const duplicateStages = [...roadmap.STAGES, { ...roadmap.STAGES[0] }];
  assert.equal(roadmap.validateRoadmap({ stages: duplicateStages, categories: categories.CATEGORIES, warn: () => {} }).valid, false);
  assert.equal(roadmap.validateRoadmap({ groups: roadmap.GROUPS.slice(1), categories: categories.CATEGORIES, warn: () => {} }).valid, false);
  const unknownPrerequisite = roadmap.STAGES.map(stage => stage.id === "recognize-colors" ? { ...stage, prerequisiteStageIds: ["unknown"] } : stage);
  assert.equal(roadmap.validateRoadmap({ stages: unknownPrerequisite, categories: categories.CATEGORIES, warn: () => {} }).valid, false);
  const cyclic = roadmap.STAGES.map(stage => {
    if (stage.id === "recognize-colors") return { ...stage, prerequisiteStageIds: ["recognize-shapes"] };
    return stage;
  });
  assert.equal(roadmap.findPrerequisiteCycle(cyclic), true);
});

test("validation rejects invalid learning types and unsupported playable definitions", () => {
  const invalidType = roadmap.STAGES.map(stage => stage.id === "recognize-colors" ? { ...stage, learningType: "unknownType" } : stage);
  assert.equal(roadmap.validateRoadmap({ stages: invalidType, categories: categories.CATEGORIES, warn: () => {} }).valid, false);
  const noCategories = roadmap.STAGES.map(stage => stage.id === "recognize-colors" ? { ...stage, categoryIds: [] } : stage);
  assert.equal(roadmap.validateRoadmap({ stages: noCategories, categories: categories.CATEGORIES, warn: () => {} }).valid, false);
  const futureAsPlayable = roadmap.STAGES.map(stage => stage.id === "subtraction-preparation" ? { ...stage, implemented: true } : stage);
  assert.equal(roadmap.validateRoadmap({ stages: futureAsPlayable, categories: categories.CATEGORIES, warn: () => {} }).valid, false);
});

test("Learning Path UI wires focused groups, safe stage launches and summary navigation", () => {
  const root = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  [
    "learning-path-group-tabs", "learning-path-group-title", "learning-path-group-progress",
    "learning-path-previous-group", "learning-path-next-group", "learning-path-recommendation"
  ].forEach(id => assert.match(html, new RegExp(`id="${id}"`)));
  assert.match(app, /if \(isPaused \|\| isStartingGame\) return;/);
  assert.match(app, /learningPathModel\.canLaunchStage\(stage\.id, progress\)/);
  assert.match(app, /!activeLearningPathStage && !isMiniGameLaunch && activeCategoryPack === "custom"/);
  assert.match(app, /learningPathModel\.getNextEligibleStage\(activeLearningPathStage\.id, progress\)/);
  assert.match(app, /ui\.learningPathNext\.classList\.toggle\("hidden", !nextStage && !plannedNextStage\)/);
  assert.match(app, /progress\.completed\[activeLearningPathStage\.id\]\) return false;/);
  assert.match(app, /openLearningPath\(\{ focusStageId: activeLearningPathStage\?\.id \}\)/);
  assert.match(app, /if \(activeLearningPathStage\) ui\.quiz\.focus\(\{ preventScroll: true \}\)/);
  assert.doesNotMatch(app, /alert\(/);
});
