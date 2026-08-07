"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const daily = require("../js/DailyMissions.js");
const bonus = require("../js/BonusManager.js");
const root = path.resolve(__dirname, "..");

class MemoryStorage {
  constructor(initial = {}) { this.values = new Map(Object.entries(initial)); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

const context = {
  categories: [{ id: "Animals", label: "Hayvanlar" }, { id: "Colors", label: "Renkler" }, { id: "Numbers", label: "Sayılar" }],
  miniGames: [{ id: "matching", label: "Eşini Bul" }, { id: "listening", label: "Dinle ve Seç" }],
  eligibleStages: [{ id: "numbers", groupId: "numbers-world" }, { id: "logic", groupId: "logic-world" }],
  learningPathGroups: [{ id: "numbers-world", title: "Sayılar Dünyası" }, { id: "logic-world", title: "Düşün ve Bul" }],
  mathStageIds: ["addition", "subtraction"],
  logicStageIds: ["logic"],
  speechAvailable: true
};

function createManager(options = {}) {
  return new daily.DailyMissionManager({
    storage: options.storage ?? new MemoryStorage(),
    playerId: options.playerId ?? "Mila",
    contextProvider: () => options.context ?? context,
    now: () => options.now ?? new Date(2026, 7, 7, 12),
    onReward: options.onReward,
    onComplete: options.onComplete,
    warn: options.warn ?? (() => {})
  });
}

function payloadFor(mission, index) {
  const payload = { eventId: `${mission.id}-${index}`, ...mission.criteria };
  if (mission.uniqueField) payload[mission.uniqueField] = `${mission.uniqueField}-${index}`;
  return payload;
}

function managerWithTemplate(templateId, options = {}) {
  for (let index = 0; index < 2000; index += 1) {
    const playerId = `Oyuncu-${index}`;
    if (daily.generateAssignment(playerId, "2026-08-07", context).some(mission => mission.templateId === templateId)) {
      const manager = createManager({ ...options, playerId });
      manager.ensureToday();
      return manager;
    }
  }
  throw new Error(`Atanabilir görev bulunamadı: ${templateId}`);
}

test("mission registry covers all ten required categories and validates", () => {
  assert.equal(daily.validateRegistry().valid, true);
  assert.deepEqual(new Set(daily.REGISTRY.map(item => item.category)), new Set(daily.MISSION_CATEGORIES));
  assert.equal(daily.MISSION_CATEGORIES.length, 10);
});

test("daily assignment is deterministic, balanced and bounded", () => {
  const first = daily.generateAssignment("Mila", "2026-08-07", context);
  const reload = daily.generateAssignment("Mila", "2026-08-07", context);
  assert.deepEqual(first, reload);
  assert.equal(daily.validateAssignment(first), true);
  assert.equal(first.filter(item => item.difficulty === "easy").length, 2);
  assert.equal(first.filter(item => item.difficulty === "medium").length, 1);
  assert.ok(first.some(item => item.participation));
  assert.ok(new Set(first.map(item => item.area)).size <= 2);
  assert.ok(first.filter(item => item.specific).length <= 1);
});

test("unavailable content and speech-dependent missions are never assigned", () => {
  const limited = daily.generateAssignment("Ada", "2026-08-07", {
    categories: [], miniGames: [], eligibleStages: [], learningPathGroups: [], mathStageIds: [], logicStageIds: [], speechAvailable: false
  });
  assert.equal(daily.validateAssignment(limited), true);
  assert.ok(limited.every(item => !["learning-path", "mini-games", "math", "logic-attention", "listening-replay"].includes(item.category)));
  assert.ok(limited.every(item => item.templateId !== "english-heard-3"));
});

test("local date key uses the device-local calendar day", () => {
  assert.equal(daily.localDateKey(new Date(2026, 0, 2, 0, 1)), "2026-01-02");
  assert.equal(daily.localDateKey(new Date(2026, 11, 31, 23, 59)), "2026-12-31");
});

test("reload preserves assignments and progress while players remain isolated", () => {
  const storage = new MemoryStorage();
  const first = createManager({ storage, playerId: "Mila" });
  const state = first.ensureToday();
  const mission = state.missions[0];
  first.recordEvent(mission.eventType, payloadFor(mission, 0));

  const reload = createManager({ storage, playerId: "Mila" }).ensureToday();
  assert.deepEqual(reload.missions.map(item => item.id), state.missions.map(item => item.id));
  assert.equal(reload.missions[0].progress, 1);

  const other = createManager({ storage, playerId: "Ege" }).ensureToday();
  assert.ok(other.missions.every(item => item.progress === 0));
  assert.notEqual(storage.getItem("mila-learning-daily-goal-Mila"), storage.getItem("mila-learning-daily-goal-Ege"));
});

test("date rollover creates exactly three fresh missions without punishing missed days", () => {
  const storage = new MemoryStorage();
  let now = new Date(2026, 7, 7, 23, 59);
  const manager = new daily.DailyMissionManager({ storage, playerId: "Mila", contextProvider: () => context, now: () => now, warn: () => {} });
  const first = manager.ensureToday();
  manager.recordEvent(first.missions[0].eventType, payloadFor(first.missions[0], 0));
  now = new Date(2026, 7, 8, 0, 1);
  const next = manager.ensureToday();
  assert.equal(next.date, "2026-08-08");
  assert.equal(next.missions.length, 3);
  assert.ok(next.missions.every(item => item.progress === 0 && !item.completed));
  assert.equal("streak" in next, false);
});

test("events, mission rewards and all-complete reward are idempotent", () => {
  const rewards = [];
  const completions = [];
  const manager = createManager({ onReward: reward => rewards.push(reward), onComplete: result => completions.push(result) });
  const state = manager.ensureToday();
  const first = state.missions[0];
  const duplicate = payloadFor(first, 0);
  manager.recordEvent(first.eventType, duplicate);
  manager.recordEvent(first.eventType, duplicate);
  assert.equal(manager.getState().missions.find(item => item.id === first.id).progress, 1);

  manager.getState().missions.forEach(mission => {
    for (let index = 0; index < mission.target + 2; index += 1) manager.recordEvent(mission.eventType, payloadFor(mission, index + 20));
  });
  assert.ok(manager.getState().missions.every(item => item.completed && item.rewardGranted));
  assert.equal(manager.getState().allCompleteRewardGranted, true);
  assert.equal(rewards.filter(item => item.kind === "mission").length, 3);
  assert.equal(rewards.filter(item => item.kind === "all-complete").length, 1);
  assert.ok(completions.length >= 1);

  const before = rewards.length;
  manager.getState().missions.forEach(mission => manager.recordEvent(mission.eventType, payloadFor(mission, 99)));
  assert.equal(rewards.length, before);
});

test("participation accepts an incorrect answer while correct-answer progress does not", () => {
  const participation = managerWithTemplate("questions-3");
  const participationMission = participation.getState().missions.find(item => item.templateId === "questions-3");
  participation.recordEvent("questionAnswered", { eventId: "question-wrong", correct: false });
  assert.equal(participation.getState().missions.find(item => item.id === participationMission.id).progress, 1);

  const correct = managerWithTemplate("correct-3");
  const correctMission = correct.getState().missions.find(item => item.templateId === "correct-3");
  correct.recordEvent("questionAnswered", { eventId: "incorrect", correct: false });
  assert.equal(correct.getState().missions.find(item => item.id === correctMission.id).progress, 0);
  correct.recordEvent("correctAnswer", { eventId: "correct", firstAttempt: true });
  assert.equal(correct.getState().missions.find(item => item.id === correctMission.id).progress, 1);
});

test("Mini Game, Learning Path and unique-target events count one logical completion", () => {
  for (const [templateId, type, payload] of [
    ["mini-game-1", "miniGameCompleted", { eventId: "mini-1", gameId: "matching" }],
    ["learning-path-1", "learningPathStageCompleted", { eventId: "path-1", stageId: "numbers", groupId: "numbers-world" }]
  ]) {
    const manager = managerWithTemplate(templateId);
    const mission = manager.getState().missions.find(item => item.templateId === templateId);
    manager.recordEvent(type, payload);
    manager.recordEvent(type, payload);
    assert.equal(manager.getState().missions.find(item => item.id === mission.id).progress, 1);
  }

  const english = managerWithTemplate("english-heard-3");
  const englishMission = english.getState().missions.find(item => item.templateId === "english-heard-3");
  english.recordEvent("englishTargetHeard", { eventId: "heard-1", targetId: "word:Apple" });
  english.recordEvent("englishTargetHeard", { eventId: "heard-2", targetId: "word:Apple" });
  english.recordEvent("englishTargetHeard", { eventId: "heard-3", targetId: "word:Banana" });
  assert.equal(english.getState().missions.find(item => item.id === englishMission.id).progress, 2);

  const variety = managerWithTemplate("variety-categories-2");
  const varietyMission = variety.getState().missions.find(item => item.templateId === "variety-categories-2");
  variety.recordEvent("categoryQuestionAnswered", { eventId: "category-1", categoryId: "Animals" });
  variety.recordEvent("categoryQuestionAnswered", { eventId: "category-2", categoryId: "Animals" });
  variety.recordEvent("categoryQuestionAnswered", { eventId: "category-3", categoryId: "Colors" });
  assert.equal(variety.getState().missions.find(item => item.id === varietyMission.id).progress, 2);
});

test("legacy single-goal data migrates safely and corrupted data falls back", () => {
  const legacyKey = "mila-learning-daily-goal-Mila";
  const legacyStorage = new MemoryStorage({
    [legacyKey]: JSON.stringify({ date: "2026-08-07", goalId: "ten-correct", progress: 2, completed: false }),
    unrelated: JSON.stringify({ stars: 19, theme: "space" })
  });
  const migrated = createManager({ storage: legacyStorage }).ensureToday();
  assert.equal(migrated.missions.length, 3);
  assert.equal(migrated.legacyMigrated, true);
  assert.ok(migrated.missions.some(item => item.progress === 2));
  assert.deepEqual(JSON.parse(legacyStorage.getItem("unrelated")), { stars: 19, theme: "space" });

  const brokenStorage = new MemoryStorage({ [legacyKey]: "{broken" });
  const recovered = createManager({ storage: brokenStorage }).ensureToday();
  assert.equal(daily.validateAssignment(recovered.missions), true);
});

test("bonus registry contains five fully playable bonuses with modest rewards", () => {
  assert.equal(bonus.validateRegistry().valid, true);
  assert.deepEqual(bonus.BONUS_REGISTRY.map(item => item.id), ["balloon", "star-rain", "treasure", "quick-match", "color-pop"]);
  assert.ok(bonus.BONUS_REGISTRY.every(item => item.playable && item.reward.stars === 2));
});

test("bonus frequency, duplicate protection, variety and session cap are enforced", () => {
  const manager = new bonus.BonusManager({ random: () => 0, minInteractions: 4, maxInteractions: 7, sessionCap: 3, warn: () => {} });
  manager.recordEligibleEvent("one");
  manager.recordEligibleEvent("one");
  manager.recordEligibleEvent("two");
  manager.recordEligibleEvent("three");
  assert.equal(manager.getState().pending, false);
  manager.recordEligibleEvent("four");
  const first = manager.takePending({ safe: true });
  assert.equal(first.bonusId, "balloon");
  const reward = manager.complete(first.id);
  assert.equal(reward.rewardGranted, true);
  assert.equal(manager.complete(first.id).rewardGranted, false);
  manager.finish(first.id);

  const bonusIds = [first.bonusId];
  for (let round = 0; round < 2; round += 1) {
    for (let index = 0; index < 4; index += 1) manager.recordEligibleEvent(`round-${round}-${index}`);
    const instance = manager.takePending({ safe: true });
    bonusIds.push(instance.bonusId);
    manager.complete(instance.id);
    manager.finish(instance.id);
  }
  assert.notEqual(bonusIds[0], bonusIds[1]);
  assert.notEqual(bonusIds[1], bonusIds[2]);
  for (let index = 0; index < 10; index += 1) manager.recordEligibleEvent(`cap-${index}`);
  assert.equal(manager.takePending({ safe: true }), undefined);
  assert.equal(manager.getState().sessionBonusCount, 3);
});

test("bonus pause preserves the same instance and state", () => {
  const manager = new bonus.BonusManager({ random: () => 0, minInteractions: 1, maxInteractions: 1, warn: () => {} });
  manager.recordEligibleEvent("question-1");
  assert.equal(manager.takePending({ safe: false }), undefined);
  const instance = manager.takePending({ safe: true });
  manager.pause();
  assert.equal(manager.getState().active.id, instance.id);
  assert.equal(manager.getState().active.paused, true);
  manager.resume();
  assert.equal(manager.getState().active.id, instance.id);
  assert.equal(manager.getState().active.paused, false);
});

test("application wires mission manager and all five bonus interactions without old fixed trigger", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.match(html, /js\/DailyMissions\.js\?v=8\.5/);
  assert.match(html, /js\/BonusManager\.js\?v=8\.5/);
  assert.doesNotMatch(app, /BONUS_CORRECT_ANSWER_INTERVAL|updateDailyGoalOnBonusComplete/);
  ["collectBonusStar", "chooseTreasure", "chooseQuickMatchCard", "chooseColorPop", "popBalloon"].forEach(name => assert.match(app, new RegExp(`function ${name}`)));
  assert.match(app, /bonusManager\.takePending\(\{ safe: bonusBoundarySafe \}\)/);
  assert.match(app, /bonusManager\.complete\(activeBonusState\.id\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /daily-mission-row/);
});
