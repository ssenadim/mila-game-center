"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const parent = require(path.join(root, "js", "ParentExperience.js"));
const learningPath = require(path.join(root, "js", "LearningPath.js"));

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    get length() { return values.size; },
    key(index) { return [...values.keys()][index] ?? null; },
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    snapshot() { return Object.fromEntries(values); }
  };
}

const validators = {
  validPlayerName: name => typeof name === "string" && name.trim().length > 0 && name.length <= 20,
  validTheme: value => ["sunny", "space"].includes(value),
  validGameMode: value => ["learning", "quick"].includes(value),
  validAudioSettings: value => parent.isPlainObject(value),
  validLearningPath: value => parent.isPlainObject(value) && parent.isPlainObject(value.completed),
  validDailyMission: value => parent.isPlainObject(value) && Array.isArray(value.missions)
};

test("parent gate creates bounded addition and non-negative subtraction without persistence", () => {
  const additionValues = [0.9, 0, 0.99];
  const addition = parent.createGateChallenge(() => additionValues.shift());
  assert.equal(addition.operator, "+");
  assert.ok(addition.answer >= 6 && addition.answer <= 20);
  const subtractionValues = [0.1, 0.99, 0.99];
  const subtraction = parent.createGateChallenge(() => subtractionValues.shift());
  assert.equal(subtraction.operator, "−");
  assert.ok(subtraction.answer >= 0);
  assert.equal(Object.prototype.hasOwnProperty.call(parent, "parentUnlocked"), false);
});

test("question events count one logical answer and recover review evidence across sessions", () => {
  let data = parent.createDefaultParentData(new Date(2026, 7, 10));
  const concept = { id: "word:apple", type: "word", label: "Apple", icon: "🍎", destination: { type: "learning", id: "fruits" } };
  data = parent.recordQuestionEvent(data, { eventId: "q1", sessionId: "s1", correct: false, area: "Meyveler", concept, date: "2026-08-10" }).data;
  data = parent.recordQuestionEvent(data, { eventId: "q1", sessionId: "s1", correct: false, area: "Meyveler", concept, date: "2026-08-10" }).data;
  data = parent.recordQuestionEvent(data, { eventId: "q2", sessionId: "s2", correct: false, area: "Meyveler", concept, date: "2026-08-11" }).data;
  assert.equal(data.questionsAnswered, 2);
  assert.equal(data.conceptReviewScores[concept.id].score, 2);
  assert.deepEqual(data.conceptReviewScores[concept.id].sessions, ["s1", "s2"]);
  assert.equal(parent.getReviewSuggestions(data).length, 1);
  data = parent.recordQuestionEvent(data, { eventId: "q3", sessionId: "s3", correct: true, firstAttempt: true, concept, date: "2026-08-12" }).data;
  assert.equal(data.correctAnswers, 1);
  assert.equal(parent.getReviewSuggestions(data).length, 0);
});

test("daily usage is player-data local, bounded and summarized for today or seven days", () => {
  let data = parent.createDefaultParentData(new Date(2026, 6, 1));
  for (let day = 1; day <= 20; day += 1) data = parent.recordActiveTime(data, 60_000, new Date(2026, 6, day));
  assert.equal(Object.keys(data.dailyUsage).length, parent.MAX_DAILY_RECORDS);
  const today = parent.getPeriodSummary(data, "today", new Date(2026, 6, 20));
  const week = parent.getPeriodSummary(data, "week", new Date(2026, 6, 20));
  assert.equal(today.playTime, 60_000);
  assert.equal(week.playTime, 7 * 60_000);
  assert.equal(parent.formatDuration(70 * 60_000), "1 sa 10 dk");
});

test("completion history and processed event identities remain bounded and duplicate-safe", () => {
  let data = parent.createDefaultParentData();
  for (let index = 0; index < 14; index += 1) {
    data = parent.recordCompletionEvent(data, { kind: "mini-game", eventId: `game-${index}`, id: "matching", label: `Oyun ${index}`, icon: "🎮" }).data;
  }
  const duplicate = parent.recordCompletionEvent(data, { kind: "mini-game", eventId: "game-13", id: "matching", label: "Tekrar", icon: "🎮" });
  assert.equal(duplicate.changed, false);
  assert.equal(data.recentActivities.length, 10);
  assert.equal(data.miniGamesCompleted.matching, 14);
});

test("Learning Path parent denominator excludes planned stages and covers all six groups", () => {
  const progress = learningPath.normalizeProgress({ completed: {} });
  const playable = learningPath.STAGES.filter(learningPath.isPlayableStage);
  assert.equal(learningPath.GROUPS.length, 6);
  assert.ok(playable.length > 0);
  learningPath.GROUPS.forEach(group => {
    const summary = learningPath.getGroupProgress(group.id, progress);
    assert.equal(summary.playable, learningPath.stagesForGroup(group.id).filter(learningPath.isPlayableStage).length);
  });
});

test("backup exports only owned persistent data with versioning and validates strict values", () => {
  const playerKey = parent.playerScopedKey("mila-learning-parent-data", "Mila");
  const storage = createStorage({
    "mila-learning-player": "Mila",
    [playerKey]: JSON.stringify(parent.createDefaultParentData()),
    "mila-learning-progress-Mila": JSON.stringify({ unfinished: true }),
    unrelated: "secret"
  });
  const backup = parent.createBackup(storage, new Date("2026-08-14T12:00:00Z"));
  assert.equal(backup.app, "Mila Oyun Merkezi");
  assert.equal(backup.schemaVersion, 1);
  assert.equal(backup.applicationData[playerKey] !== undefined, true);
  assert.equal(backup.applicationData["mila-learning-progress-Mila"], undefined);
  assert.equal(backup.applicationData.unrelated, undefined);
  assert.equal(parent.validateBackup(backup, validators).valid, true);
  backup.applicationData["mila-learning-game-mode-Mila"] = "unsafe";
  assert.equal(parent.validateBackup(backup, validators).valid, false);
});

test("validated import replaces app data atomically and preserves unrelated storage", () => {
  const storage = createStorage({ "mila-learning-player": "Mila", unrelated: "keep" });
  const replacement = { "mila-learning-player": "Deniz", "mila-learning-parent-settings": JSON.stringify({ breakReminderMinutes: 20 }) };
  assert.equal(parent.applyBackup(storage, replacement), true);
  assert.equal(storage.getItem("mila-learning-player"), "Deniz");
  assert.equal(storage.getItem("unrelated"), "keep");
});

test("selected-player reset removes only progress keys and keeps other players and preferences", () => {
  const milaParent = parent.playerScopedKey("mila-learning-parent-data", "Mila");
  const denizParent = parent.playerScopedKey("mila-learning-parent-data", "Deniz");
  const milaTheme = parent.playerScopedKey("mila-learning-world-theme", "Mila");
  const storage = createStorage({ [milaParent]: "{}", [denizParent]: "{}", [milaTheme]: "space", [parent.SETTINGS_STORAGE_KEY]: JSON.stringify({ breakReminderMinutes: 15 }) });
  assert.equal(parent.resetSelectedPlayer(storage, "Mila"), true);
  assert.equal(storage.getItem(milaParent), null);
  assert.equal(storage.getItem(denizParent), "{}");
  assert.equal(storage.getItem(milaTheme), "space");
  assert.notEqual(storage.getItem(parent.SETTINGS_STORAGE_KEY), null);
});

test("reminder settings allow only Off, 15, 20 and 30 minutes", () => {
  [0, 15, 20, 30].forEach(value => assert.equal(parent.normalizeParentSettings({ breakReminderMinutes: value }).breakReminderMinutes, value));
  assert.equal(parent.normalizeParentSettings({ breakReminderMinutes: 5 }).breakReminderMinutes, 0);
  assert.equal(parent.normalizeParentSettings({ breakReminderMinutes: "broken" }).breakReminderMinutes, 0);
});

test("UI wires seven focused sections, privacy actions, safe reminder and responsive layouts", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.equal((html.match(/data-parent-tab=/g) || []).length, 7);
  ["parent-gate", "parent-export-data", "parent-import-file", "parent-reset-start", "parent-break-reminder", "break-reminder"].forEach(id => assert.match(html, new RegExp(`id="${id}"`)));
  assert.match(app, /document\.visibilityState/);
  assert.match(app, /recordParentGameplayEvent\(type, payload\)/);
  assert.match(app, /parentExperience\.resetSelectedPlayer/);
  assert.match(app, /parentExperience\.validateBackup/);
  assert.match(css, /@media\(max-width:700px\)/);
  assert.match(css, /@media\(max-width:390px\)/);
  assert.doesNotMatch(html, /başarısız|zayıf|düşük performans/i);
});
