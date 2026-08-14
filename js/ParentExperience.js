(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MilaParentExperience = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const APP_NAME = "Mila Oyun Merkezi";
  const APP_ID = "mila-oyun-merkezi";
  const APP_VERSION = "1.0.0";
  const SCHEMA_VERSION = 1;
  const SETTINGS_STORAGE_KEY = "mila-learning-parent-settings";
  const MAX_RECENT_ACTIVITIES = 10;
  const MAX_DAILY_RECORDS = 14;
  const MAX_PROCESSED_EVENTS = 240;
  const MAX_REVIEW_CONCEPTS = 40;
  const ALLOWED_REMINDER_MINUTES = Object.freeze([0, 15, 20, 30]);
  const PLAYER_SCOPED_BASE_KEYS = Object.freeze([
    "mila-learning-stickers",
    "mila-learning-parent-data",
    "mila-learning-progress",
    "mila-learning-learning-stats",
    "mila-learning-game-mode",
    "mila-learning-category-pack",
    "mila-learning-path-progress",
    "mila-learning-achievements",
    "mila-learning-daily-goal",
    "mila-learning-world-theme"
  ]);
  const EXPORTABLE_GLOBAL_KEYS = new Set([
    "mila-learning-player",
    "mila-learning-player-progress-migrated",
    "mila-learning-audio-settings",
    "mila-learning-world-theme",
    SETTINGS_STORAGE_KEY
  ]);
  const TRANSIENT_BASE_KEYS = new Set(["mila-learning-progress"]);

  function isPlainObject(value) {
    return Boolean(value && typeof value === "object" && !Array.isArray(value));
  }

  function safeNumber(value, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(maximum, Math.max(minimum, number)) : minimum;
  }

  function boundedObject(value, maximum = 100) {
    if (!isPlainObject(value)) return {};
    return Object.fromEntries(Object.entries(value).slice(-maximum));
  }

  function localDateKey(date = new Date()) {
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    const safeDate = date instanceof Date && Number.isFinite(date.getTime()) ? date : new Date();
    const year = safeDate.getFullYear();
    const month = String(safeDate.getMonth() + 1).padStart(2, "0");
    const day = String(safeDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function recentDateKeys(days = 7, now = new Date()) {
    return Array.from({ length: days }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - index - 1));
      return localDateKey(date);
    });
  }

  function normalizeDailyEntry(value) {
    const source = isPlainObject(value) ? value : {};
    return {
      playTime: safeNumber(source.playTime),
      questionsAnswered: safeNumber(source.questionsAnswered),
      correctAnswers: safeNumber(source.correctAnswers),
      miniGamesCompleted: safeNumber(source.miniGamesCompleted),
      learningPathCompleted: safeNumber(source.learningPathCompleted),
      activityCounts: Object.fromEntries(Object.entries(boundedObject(source.activityCounts, 20)).map(([key, count]) => [key, safeNumber(count)]))
    };
  }

  function pruneDailyMap(value, maximum = MAX_DAILY_RECORDS) {
    if (!isPlainObject(value)) return {};
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => /^\d{4}-\d{2}-\d{2}$/.test(key))
      .sort(([first], [second]) => first.localeCompare(second))
      .slice(-maximum)
      .map(([key, entry]) => [key, normalizeDailyEntry(entry)]));
  }

  function normalizeReviewConcepts(value) {
    if (!isPlainObject(value)) return {};
    const entries = Object.entries(value).slice(-MAX_REVIEW_CONCEPTS).flatMap(([id, entry]) => {
      if (!id || !isPlainObject(entry) || typeof entry.label !== "string") return [];
      const score = safeNumber(entry.score, 0, 5);
      if (!score) return [];
      return [[id, {
        id,
        type: typeof entry.type === "string" ? entry.type : "concept",
        label: entry.label.slice(0, 80),
        icon: typeof entry.icon === "string" ? entry.icon.slice(0, 8) : "❤️",
        score,
        sessions: Array.isArray(entry.sessions) ? [...new Set(entry.sessions.filter(item => typeof item === "string"))].slice(-5) : [],
        destination: isPlainObject(entry.destination) && typeof entry.destination.type === "string" && typeof entry.destination.id === "string"
          ? { type: entry.destination.type, id: entry.destination.id }
          : undefined,
        updatedOn: typeof entry.updatedOn === "string" ? entry.updatedOn : undefined
      }]];
    });
    return Object.fromEntries(entries);
  }

  function normalizeRecentActivities(value) {
    if (!Array.isArray(value)) return [];
    return value.flatMap(item => {
      if (!isPlainObject(item) || typeof item.label !== "string" || typeof item.kind !== "string") return [];
      return [{
        kind: item.kind.slice(0, 30),
        id: typeof item.id === "string" ? item.id.slice(0, 100) : "",
        label: item.label.slice(0, 80),
        icon: typeof item.icon === "string" ? item.icon.slice(0, 8) : "🎮",
        date: /^\d{4}-\d{2}-\d{2}$/.test(item.date) ? item.date : undefined
      }];
    }).slice(-MAX_RECENT_ACTIVITIES);
  }

  function createDefaultParentData(date = new Date()) {
    return {
      schemaVersion: SCHEMA_VERSION,
      trackingStartedOn: localDateKey(date),
      playTime: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      rewardStars: 0,
      categoryCounts: {},
      difficultWords: {},
      bestStreak: 0,
      matchingPairsCompleted: 0,
      miniGamesStarted: {},
      miniGamesCompleted: {},
      categoryProgress: {},
      activityCounts: {},
      conceptReviewScores: {},
      recentActivities: [],
      dailyUsage: {},
      processedEventIds: []
    };
  }

  function normalizeParentData(value, date = new Date()) {
    const source = isPlainObject(value) ? value : {};
    const defaults = createDefaultParentData(date);
    return {
      ...defaults,
      playTime: safeNumber(source.playTime),
      questionsAnswered: safeNumber(source.questionsAnswered),
      correctAnswers: safeNumber(source.correctAnswers),
      rewardStars: safeNumber(source.rewardStars),
      categoryCounts: Object.fromEntries(Object.entries(boundedObject(source.categoryCounts, 80)).map(([key, count]) => [key, safeNumber(count)])),
      difficultWords: Object.fromEntries(Object.entries(boundedObject(source.difficultWords, 40)).map(([key, count]) => [key, safeNumber(count, 0, 20)])),
      bestStreak: safeNumber(source.bestStreak),
      matchingPairsCompleted: safeNumber(source.matchingPairsCompleted),
      miniGamesStarted: Object.fromEntries(Object.entries(boundedObject(source.miniGamesStarted, 30)).map(([key, count]) => [key, safeNumber(count)])),
      miniGamesCompleted: Object.fromEntries(Object.entries(boundedObject(source.miniGamesCompleted, 30)).map(([key, count]) => [key, safeNumber(count)])),
      categoryProgress: boundedObject(source.categoryProgress, 80),
      activityCounts: Object.fromEntries(Object.entries(boundedObject(source.activityCounts, 30)).map(([key, count]) => [key, safeNumber(count)])),
      conceptReviewScores: normalizeReviewConcepts(source.conceptReviewScores),
      recentActivities: normalizeRecentActivities(source.recentActivities),
      dailyUsage: pruneDailyMap(source.dailyUsage),
      processedEventIds: Array.isArray(source.processedEventIds) ? source.processedEventIds.filter(item => typeof item === "string").slice(-MAX_PROCESSED_EVENTS) : [],
      schemaVersion: SCHEMA_VERSION,
      trackingStartedOn: /^\d{4}-\d{2}-\d{2}$/.test(source.trackingStartedOn) ? source.trackingStartedOn : defaults.trackingStartedOn
    };
  }

  function rememberEvent(data, eventKey) {
    if (!eventKey || data.processedEventIds.includes(eventKey)) return false;
    data.processedEventIds = [...data.processedEventIds, eventKey].slice(-MAX_PROCESSED_EVENTS);
    return true;
  }

  function getDailyEntry(data, date = new Date()) {
    const key = typeof date === "string" ? date : localDateKey(date);
    data.dailyUsage = pruneDailyMap(data.dailyUsage);
    data.dailyUsage[key] = normalizeDailyEntry(data.dailyUsage[key]);
    data.dailyUsage = pruneDailyMap(data.dailyUsage);
    return data.dailyUsage[key];
  }

  function recordActivity(data, area, dailyEntry, amount = 1) {
    if (!area) return;
    data.activityCounts[area] = safeNumber(data.activityCounts[area]) + amount;
    dailyEntry.activityCounts[area] = safeNumber(dailyEntry.activityCounts[area]) + amount;
  }

  function updateReviewConcept(data, concept, { eventId, sessionId, correct, firstAttempt, date }) {
    if (!concept?.id || !concept.label) return;
    const reviewKey = `${correct ? "review-success" : "review-retry"}:${eventId}:${concept.id}`;
    if (!rememberEvent(data, reviewKey)) return;
    const existing = data.conceptReviewScores[concept.id] || {
      id: concept.id,
      type: concept.type || "concept",
      label: concept.label,
      icon: concept.icon || "❤️",
      score: 0,
      sessions: [],
      destination: concept.destination
    };
    if (correct && firstAttempt) {
      existing.score = Math.max(0, existing.score - 1);
    } else if (!correct) {
      const evidenceSession = sessionId || eventId;
      if (!existing.sessions.includes(evidenceSession)) {
        existing.sessions = [...existing.sessions, evidenceSession].slice(-5);
        existing.score = Math.min(5, existing.score + 1);
      }
    }
    existing.updatedOn = typeof date === "string" ? date : localDateKey(date);
    if (existing.score <= 0) delete data.conceptReviewScores[concept.id];
    else data.conceptReviewScores[concept.id] = existing;
    data.conceptReviewScores = normalizeReviewConcepts(data.conceptReviewScores);
    if (existing.type === "word") {
      if (existing.score > 0) data.difficultWords[existing.label] = existing.score;
      else delete data.difficultWords[existing.label];
    }
  }

  function recordQuestionEvent(value, payload = {}) {
    const data = normalizeParentData(value, payload.date);
    if (typeof payload.eventId !== "string" || !payload.eventId) return { data, changed: false };
    const dailyEntry = getDailyEntry(data, payload.date);
    let changed = false;
    if (rememberEvent(data, `question:${payload.eventId}`)) {
      data.questionsAnswered += 1;
      dailyEntry.questionsAnswered += 1;
      recordActivity(data, payload.area, dailyEntry);
      if (payload.categoryLabel) data.categoryCounts[payload.categoryLabel] = safeNumber(data.categoryCounts[payload.categoryLabel]) + 1;
      changed = true;
    }
    if (payload.correct && rememberEvent(data, `correct:${payload.eventId}`)) {
      data.correctAnswers += 1;
      dailyEntry.correctAnswers += 1;
      changed = true;
    }
    const beforeReview = JSON.stringify(data.conceptReviewScores);
    updateReviewConcept(data, payload.concept, payload);
    if (beforeReview !== JSON.stringify(data.conceptReviewScores)) changed = true;
    return { data, changed };
  }

  function recordCompletionEvent(value, payload = {}) {
    const data = normalizeParentData(value, payload.date);
    if (!payload.kind || !payload.eventId || !rememberEvent(data, `completion:${payload.kind}:${payload.eventId}`)) return { data, changed: false };
    const dailyEntry = getDailyEntry(data, payload.date);
    if (payload.kind === "mini-game") {
      data.miniGamesCompleted[payload.id] = safeNumber(data.miniGamesCompleted[payload.id]) + 1;
      dailyEntry.miniGamesCompleted += 1;
    } else if (payload.kind === "learning-path") dailyEntry.learningPathCompleted += 1;
    recordActivity(data, payload.area, dailyEntry);
    data.recentActivities = normalizeRecentActivities([...data.recentActivities, {
      kind: payload.kind,
      id: payload.id,
      label: payload.label,
      icon: payload.icon,
      date: typeof payload.date === "string" ? payload.date : localDateKey(payload.date)
    }]);
    return { data, changed: true };
  }

  function recordActiveTime(value, milliseconds, date = new Date()) {
    const data = normalizeParentData(value, date);
    const elapsed = safeNumber(milliseconds, 0, 24 * 60 * 60 * 1000);
    if (!elapsed) return data;
    data.playTime += elapsed;
    getDailyEntry(data, date).playTime += elapsed;
    data.dailyUsage = pruneDailyMap(data.dailyUsage);
    return data;
  }

  function getPeriodSummary(value, period = "today", now = new Date()) {
    const data = normalizeParentData(value, now);
    const keys = period === "week" ? recentDateKeys(7, now) : [localDateKey(now)];
    return keys.reduce((summary, key) => {
      const entry = normalizeDailyEntry(data.dailyUsage[key]);
      summary.playTime += entry.playTime;
      summary.questionsAnswered += entry.questionsAnswered;
      summary.correctAnswers += entry.correctAnswers;
      summary.miniGamesCompleted += entry.miniGamesCompleted;
      summary.learningPathCompleted += entry.learningPathCompleted;
      Object.entries(entry.activityCounts).forEach(([area, count]) => { summary.activityCounts[area] = safeNumber(summary.activityCounts[area]) + count; });
      return summary;
    }, { playTime: 0, questionsAnswered: 0, correctAnswers: 0, miniGamesCompleted: 0, learningPathCompleted: 0, activityCounts: {} });
  }

  function getReviewSuggestions(value, maximum = 5) {
    const data = normalizeParentData(value);
    return Object.values(data.conceptReviewScores)
      .filter(item => item.score >= 2 && item.sessions.length >= 2)
      .sort((first, second) => second.score - first.score || first.label.localeCompare(second.label, "tr"))
      .slice(0, Math.min(5, Math.max(1, maximum)));
  }

  function getTopActivities(value, maximum = 4) {
    const data = normalizeParentData(value);
    return Object.entries(data.activityCounts).filter(([, count]) => count > 0)
      .sort((first, second) => second[1] - first[1])
      .slice(0, maximum)
      .map(([label, count]) => ({ label, count }));
  }

  function formatDuration(milliseconds) {
    const minutes = Math.max(0, Math.round(safeNumber(milliseconds) / 60000));
    if (minutes < 60) return `${minutes} dk`;
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return remainder ? `${hours} sa ${remainder} dk` : `${hours} sa`;
  }

  function createGateChallenge(rng = Math.random) {
    const random = typeof rng === "function" ? rng : Math.random;
    const addition = random() >= .35;
    if (addition) {
      const first = 6 + Math.floor(random() * 9);
      const second = 3 + Math.floor(random() * Math.max(1, 21 - first - 3));
      return { first, second, operator: "+", answer: first + second, prompt: `${first} + ${second} = ?` };
    }
    const first = 12 + Math.floor(random() * 9);
    const second = 2 + Math.floor(random() * Math.min(8, first - 2));
    return { first, second, operator: "−", answer: first - second, prompt: `${first} − ${second} = ?` };
  }

  function normalizeParentSettings(value) {
    const source = isPlainObject(value) ? value : {};
    const requested = Number(source.breakReminderMinutes);
    return { breakReminderMinutes: ALLOWED_REMINDER_MINUTES.includes(requested) ? requested : 0 };
  }

  function playerScopedKey(baseKey, playerName) {
    return `${baseKey}-${encodeURIComponent(playerName)}`;
  }

  function getScopedBaseKey(key) {
    return PLAYER_SCOPED_BASE_KEYS.find(base => key.startsWith(`${base}-`));
  }

  function isExportableKey(key) {
    const base = getScopedBaseKey(key);
    return EXPORTABLE_GLOBAL_KEYS.has(key) || Boolean(base && !TRANSIENT_BASE_KEYS.has(base));
  }

  function createBackup(storage, now = new Date()) {
    const applicationData = {};
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key && isExportableKey(key)) applicationData[key] = storage.getItem(key);
    }
    return { app: APP_NAME, appId: APP_ID, appVersion: APP_VERSION, schemaVersion: SCHEMA_VERSION, exportedAt: now.toISOString(), applicationData };
  }

  function validateStoredValue(key, rawValue, validators = {}) {
    if (typeof rawValue !== "string" || rawValue.length > 2_000_000) return false;
    if (key === "mila-learning-player") return Boolean(validators.validPlayerName?.(rawValue));
    if (key === SETTINGS_STORAGE_KEY) {
      try { return JSON.stringify(normalizeParentSettings(JSON.parse(rawValue))) === JSON.stringify(JSON.parse(rawValue)); } catch { return false; }
    }
    if (key === "mila-learning-audio-settings") {
      try { return Boolean(validators.validAudioSettings?.(JSON.parse(rawValue))); } catch { return false; }
    }
    if (key === "mila-learning-world-theme" || key.startsWith("mila-learning-world-theme-")) return Boolean(validators.validTheme?.(rawValue));
    const base = getScopedBaseKey(key);
    if (!base) return key === "mila-learning-player-progress-migrated" && ["true", "false"].includes(rawValue);
    const encodedName = key.slice(base.length + 1);
    let playerName;
    try { playerName = decodeURIComponent(encodedName); } catch { return false; }
    if (!validators.validPlayerName?.(playerName)) return false;
    if (base === "mila-learning-game-mode") return Boolean(validators.validGameMode?.(rawValue));
    if (base === "mila-learning-world-theme") return Boolean(validators.validTheme?.(rawValue));
    try {
      const parsed = JSON.parse(rawValue);
      if (base === "mila-learning-parent-data") return isPlainObject(parsed);
      if (base === "mila-learning-path-progress") return Boolean(validators.validLearningPath?.(parsed));
      if (base === "mila-learning-daily-goal") return Boolean(validators.validDailyMission?.(parsed));
      if (base === "mila-learning-achievements") return isPlainObject(parsed) && isPlainObject(parsed.unlocked);
      if (base === "mila-learning-stickers") return Array.isArray(parsed) && parsed.length <= 500 && parsed.every(item => typeof item === "string" && item.length <= 16);
      return isPlainObject(parsed);
    } catch {
      return false;
    }
  }

  function validateBackup(value, validators = {}) {
    if (!isPlainObject(value) || value.app !== APP_NAME || value.appId !== APP_ID || value.schemaVersion !== SCHEMA_VERSION || !isPlainObject(value.applicationData)) return { valid: false };
    if (value.appVersion !== undefined && (typeof value.appVersion !== "string" || !/^\d+\.\d+\.\d+$/.test(value.appVersion))) return { valid: false };
    const entries = Object.entries(value.applicationData);
    if (entries.length > 300 || entries.some(([key, raw]) => !isExportableKey(key) || !validateStoredValue(key, raw, validators))) return { valid: false };
    return { valid: true, applicationData: Object.fromEntries(entries) };
  }

  function applyBackup(storage, validatedData) {
    const previous = {};
    const appKeys = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key && (key.startsWith("mila-learning-") || key === SETTINGS_STORAGE_KEY)) {
        appKeys.push(key);
        previous[key] = storage.getItem(key);
      }
    }
    try {
      appKeys.forEach(key => storage.removeItem(key));
      Object.entries(validatedData).forEach(([key, raw]) => storage.setItem(key, raw));
      return true;
    } catch {
      try {
        const currentKeys = [];
        for (let index = 0; index < storage.length; index += 1) currentKeys.push(storage.key(index));
        currentKeys.filter(key => key?.startsWith("mila-learning-")).forEach(key => storage.removeItem(key));
        Object.entries(previous).forEach(([key, raw]) => storage.setItem(key, raw));
      } catch {
        // Best-effort rollback for restricted or full storage.
      }
      return false;
    }
  }

  function resetSelectedPlayer(storage, playerName) {
    if (!playerName) return false;
    const progressKeys = [
      "mila-learning-stickers",
      "mila-learning-parent-data",
      "mila-learning-progress",
      "mila-learning-learning-stats",
      "mila-learning-path-progress",
      "mila-learning-achievements",
      "mila-learning-daily-goal"
    ];
    progressKeys.forEach(base => storage.removeItem(playerScopedKey(base, playerName)));
    return true;
  }

  return {
    APP_NAME, APP_ID, APP_VERSION, SCHEMA_VERSION, SETTINGS_STORAGE_KEY, MAX_RECENT_ACTIVITIES, MAX_DAILY_RECORDS,
    MAX_PROCESSED_EVENTS, MAX_REVIEW_CONCEPTS, ALLOWED_REMINDER_MINUTES, PLAYER_SCOPED_BASE_KEYS,
    isPlainObject, localDateKey, recentDateKeys, normalizeDailyEntry, pruneDailyMap, createDefaultParentData,
    normalizeParentData, recordQuestionEvent, recordCompletionEvent, recordActiveTime, getPeriodSummary,
    getReviewSuggestions, getTopActivities, formatDuration, createGateChallenge, normalizeParentSettings,
    playerScopedKey, isExportableKey, createBackup, validateBackup, applyBackup, resetSelectedPlayer
  };
});
