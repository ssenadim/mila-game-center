(function initializeDailyMissions(root) {
  "use strict";

  const VERSION = 3;
  const MAX_EVENT_IDS = 80;
  const DIFFICULTIES = new Set(["easy", "medium"]);
  const MISSION_CATEGORIES = Object.freeze([
    "questions", "correct-answers", "learning-path", "mini-games", "category-learning",
    "math", "english", "logic-attention", "listening-replay", "variety"
  ]);

  function localDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function hashSeed(value) {
    let hash = 2166136261;
    for (const character of String(value)) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function createRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function choose(items, random) {
    return items.length ? items[Math.floor(random() * items.length)] : undefined;
  }

  function shuffle(items, random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function generic(template) {
    return Object.freeze({ specific: false, participation: false, area: "learning", reward: { stars: 1 }, ...template });
  }

  const REGISTRY = Object.freeze([
    generic({ id: "questions-3", category: "questions", semantic: "questions-played", difficulty: "easy", participation: true, icon: "🎯", label: "3 soru cevapla", target: 3, eventType: "questionAnswered" }),
    generic({ id: "correct-3", category: "correct-answers", semantic: "correct-answers", difficulty: "easy", icon: "⭐", label: "3 doğru cevap ver", target: 3, eventType: "correctAnswer" }),
    generic({ id: "first-try-3", category: "correct-answers", semantic: "first-try", difficulty: "medium", icon: "🌟", label: "3 soruyu ilk denemede bul", target: 3, eventType: "correctAnswer", criteria: { firstAttempt: true } }),
    generic({ id: "learning-path-1", category: "learning-path", semantic: "path-stage", difficulty: "medium", area: "learning-path", icon: "🗺️", label: "1 Öğrenme Yolu bölümü oyna", target: 1, eventType: "learningPathStageCompleted", available: context => context.eligibleStages.length > 0 }),
    generic({ id: "learning-path-group-1", category: "learning-path", semantic: "path-group", difficulty: "medium", area: "learning-path", specific: true, icon: "🧭", target: 1, eventType: "learningPathStageCompleted", create: (context, random) => {
      const stage = choose(context.eligibleStages, random);
      const group = context.learningPathGroups.find(item => item.id === stage?.groupId);
      return stage && group ? { label: `${group.title}'dan 1 bölüm oyna`, criteria: { groupId: group.id }, variant: group.id } : undefined;
    } }),
    generic({ id: "mini-game-1", category: "mini-games", semantic: "mini-game", difficulty: "easy", participation: true, area: "mini-games", icon: "🎮", label: "1 mini oyun tamamla", target: 1, eventType: "miniGameCompleted", available: context => context.miniGames.length > 0 }),
    generic({ id: "mini-game-specific-1", category: "mini-games", semantic: "specific-mini-game", difficulty: "medium", area: "mini-games", specific: true, icon: "🎲", target: 1, eventType: "miniGameCompleted", create: (context, random) => {
      const game = choose(context.miniGames, random);
      return game ? { label: `${game.label} oyna`, criteria: { gameId: game.id }, variant: game.id } : undefined;
    } }),
    generic({ id: "category-questions-3", category: "category-learning", semantic: "specific-category", difficulty: "medium", specific: true, icon: "🧩", target: 3, eventType: "categoryQuestionAnswered", create: (context, random) => {
      const category = choose(context.categories, random);
      return category ? { label: `${category.label} ile 3 soru oyna`, criteria: { categoryId: category.id }, variant: category.id } : undefined;
    } }),
    generic({ id: "math-3", category: "math", semantic: "math", difficulty: "medium", icon: "🔢", label: "3 matematik sorusu çöz", target: 3, eventType: "mathQuestionCompleted", available: context => context.mathStageIds.length > 0 }),
    generic({ id: "addition-3", category: "math", semantic: "addition", difficulty: "medium", specific: true, icon: "➕", label: "3 toplama sorusu çöz", target: 3, eventType: "mathQuestionCompleted", criteria: { operation: "addition" }, available: context => context.mathStageIds.some(id => id.includes("addition")) }),
    generic({ id: "subtraction-3", category: "math", semantic: "subtraction", difficulty: "medium", specific: true, icon: "➖", label: "3 çıkarma sorusu çöz", target: 3, eventType: "mathQuestionCompleted", criteria: { operation: "subtraction" }, available: context => context.mathStageIds.some(id => id.includes("subtraction")) }),
    generic({ id: "english-heard-3", category: "english", semantic: "english-listening", difficulty: "easy", icon: "👂", label: "3 farklı İngilizce kelime dinle", target: 3, eventType: "englishTargetHeard", uniqueField: "targetId", available: context => context.speechAvailable }),
    generic({ id: "english-questions-3", category: "english", semantic: "english-questions", difficulty: "easy", icon: "🔤", label: "3 İngilizce sorusu oyna", target: 3, eventType: "englishQuestionAnswered" }),
    generic({ id: "logic-3", category: "logic-attention", semantic: "logic", difficulty: "medium", icon: "🧠", label: "3 düşünme sorusu çöz", target: 3, eventType: "logicChallengeCompleted", available: context => context.logicStageIds.length > 0 }),
    generic({ id: "replay-2", category: "listening-replay", semantic: "replay", difficulty: "easy", icon: "🔊", label: "2 soruyu tekrar dinle", target: 2, eventType: "replayUsed", uniqueField: "targetId", available: context => context.speechAvailable }),
    generic({ id: "variety-games-2", category: "variety", semantic: "game-variety", difficulty: "medium", area: "mini-games", icon: "🎨", label: "2 farklı mini oyun tamamla", target: 2, eventType: "miniGameCompleted", uniqueField: "gameId", available: context => context.miniGames.length >= 2 }),
    generic({ id: "variety-categories-2", category: "variety", semantic: "category-variety", difficulty: "medium", icon: "🌈", label: "2 farklı kategoriyle oyna", target: 2, eventType: "categoryQuestionAnswered", uniqueField: "categoryId", available: context => context.categories.length >= 2 })
  ]);

  function normalizeContext(context = {}) {
    const list = value => Array.isArray(value) ? value.filter(Boolean) : [];
    return {
      categories: list(context.categories),
      miniGames: list(context.miniGames),
      eligibleStages: list(context.eligibleStages),
      learningPathGroups: list(context.learningPathGroups),
      mathStageIds: list(context.mathStageIds),
      logicStageIds: list(context.logicStageIds),
      speechAvailable: context.speechAvailable !== false
    };
  }

  function validateRegistry(registry = REGISTRY) {
    const errors = [];
    const ids = new Set();
    registry.forEach(template => {
      if (!template?.id || ids.has(template.id)) errors.push(`Geçersiz veya yinelenen görev kimliği: ${template?.id}`);
      ids.add(template?.id);
      if (!MISSION_CATEGORIES.includes(template?.category)) errors.push(`Bilinmeyen görev kategorisi: ${template?.category}`);
      if (!DIFFICULTIES.has(template?.difficulty)) errors.push(`Geçersiz görev zorluğu: ${template?.id}`);
      if (!Number.isFinite(template?.target) || template.target < 1 || template.target > 10) errors.push(`Geçersiz görev hedefi: ${template?.id}`);
      if (!template?.eventType || !template?.label && !template?.create) errors.push(`Eksik görev davranışı: ${template?.id}`);
      if (!Number.isFinite(template?.reward?.stars) || template.reward.stars < 0 || template.reward.stars > 3) errors.push(`Geçersiz görev ödülü: ${template?.id}`);
    });
    return { valid: errors.length === 0, errors };
  }

  function instantiateTemplate(template, context, random, date) {
    if (template.available && !template.available(context)) return undefined;
    const variant = template.create?.(context, random);
    if (template.create && !variant) return undefined;
    return {
      id: `${template.id}:${variant?.variant || "daily"}:${date}`,
      templateId: template.id,
      category: template.category,
      semantic: template.semantic,
      difficulty: template.difficulty,
      area: template.area,
      specific: Boolean(template.specific),
      participation: Boolean(template.participation),
      icon: template.icon,
      label: variant?.label || template.label,
      target: template.target,
      eventType: template.eventType,
      criteria: { ...(template.criteria || {}), ...(variant?.criteria || {}) },
      uniqueField: template.uniqueField,
      reward: { ...template.reward },
      progress: 0,
      completed: false,
      rewardGranted: false,
      uniqueValues: []
    };
  }

  function generateAssignment(playerId, date, rawContext = {}) {
    const context = normalizeContext(rawContext);
    const random = createRandom(hashSeed(`${playerId}|${date}`));
    const candidates = REGISTRY.map(template => instantiateTemplate(template, context, random, date)).filter(Boolean);
    const selected = [];
    const use = candidate => {
      if (!candidate || selected.some(item => item.templateId === candidate.templateId || item.semantic === candidate.semantic)) return false;
      if (selected.some(item => item.eventType === candidate.eventType)) return false;
      if (candidate.specific && selected.some(item => item.specific)) return false;
      const areas = new Set([...selected.map(item => item.area), candidate.area]);
      if (areas.size > 2) return false;
      selected.push(candidate);
      return true;
    };
    use(choose(candidates.filter(item => item.difficulty === "easy" && item.participation), random));
    const easyPool = shuffle(candidates.filter(item => item.difficulty === "easy"), random);
    easyPool.some(use);
    const mediumPool = shuffle(candidates.filter(item => item.difficulty === "medium"), random);
    mediumPool.some(use);
    const fallbacks = ["questions-3", "correct-3", "mini-game-1"];
    fallbacks.forEach(templateId => {
      if (selected.length >= 3) return;
      use(candidates.find(item => item.templateId === templateId));
    });
    candidates.forEach(candidate => { if (selected.length < 3) use(candidate); });
    return selected.slice(0, 3);
  }

  function validateAssignment(missions) {
    const list = Array.isArray(missions) ? missions : [];
    return list.length === 3
      && new Set(list.map(mission => mission.id)).size === 3
      && list.filter(mission => mission.difficulty === "easy").length >= 2
      && list.some(mission => mission.participation)
      && list.filter(mission => mission.specific).length <= 1
      && new Set(list.map(mission => mission.eventType)).size === 3;
  }

  function matchesCriteria(criteria, payload) {
    return Object.entries(criteria || {}).every(([key, value]) => payload?.[key] === value);
  }

  class DailyMissionManager {
    constructor({ storage, storageKey = "mila-learning-daily-goal", playerId, contextProvider = () => ({}), now = () => new Date(), onReward = () => {}, onComplete = () => {}, warn = message => console.warn(message) } = {}) {
      this.storage = storage;
      this.storageKey = storageKey;
      this.playerId = playerId;
      this.contextProvider = contextProvider;
      this.now = now;
      this.onReward = onReward;
      this.onComplete = onComplete;
      this.warn = warn;
      this.state = undefined;
      const validation = validateRegistry();
      if (!validation.valid) validation.errors.forEach(warn);
    }

    setPlayer(playerId) {
      this.playerId = playerId;
      this.state = undefined;
      return this.ensureToday();
    }

    getStorageKey() {
      return this.playerId ? `${this.storageKey}-${encodeURIComponent(this.playerId)}` : undefined;
    }

    read() {
      try {
        const key = this.getStorageKey();
        return key ? JSON.parse(this.storage?.getItem(key) || "null") : undefined;
      } catch {
        return undefined;
      }
    }

    save() {
      try {
        const key = this.getStorageKey();
        if (key) this.storage?.setItem(key, JSON.stringify(this.state));
      } catch {
        // Missions remain playable when storage is unavailable.
      }
    }

    createState(date) {
      const missions = generateAssignment(this.playerId, date, this.contextProvider());
      if (!validateAssignment(missions)) this.warn("Günlük görev ataması doğrulanamadı; güvenli görevler kullanılıyor.");
      return { version: VERSION, date, missions, allCompleteRewardGranted: false, processedEventIds: [] };
    }

    migrateLegacy(legacy, date) {
      const state = this.createState(date);
      const mapping = { "ten-correct": "correct-3", "five-different": "variety-categories-2", "streak-three": "correct-3", "complete-bonus": "mini-game-1" };
      const mission = state.missions.find(item => item.templateId === mapping[legacy.goalId]) || state.missions[0];
      if (mission && legacy.date === date) {
        mission.progress = Math.min(mission.target, Math.max(0, Number(legacy.progress) || 0));
        if (legacy.completed) {
          mission.progress = mission.target;
          mission.completed = true;
          mission.rewardGranted = true;
        }
      }
      state.legacyMigrated = true;
      return state;
    }

    normalizeMission(mission) {
      const template = REGISTRY.find(item => item.id === mission?.templateId);
      if (!template) return undefined;
      const target = Math.min(10, Math.max(1, Number(mission.target) || template.target));
      const progress = Math.min(target, Math.max(0, Number(mission.progress) || 0));
      return {
        ...mission,
        target,
        progress,
        completed: Boolean(mission.completed || progress >= target),
        rewardGranted: Boolean(mission.rewardGranted),
        uniqueValues: Array.isArray(mission.uniqueValues) ? [...new Set(mission.uniqueValues.filter(value => typeof value === "string"))].slice(0, 10) : []
      };
    }

    ensureToday() {
      if (!this.playerId) {
        this.state = undefined;
        return undefined;
      }
      const date = localDateKey(this.now());
      const saved = this.read();
      if (saved?.version === VERSION && saved.date === date && Array.isArray(saved.missions)) {
        const missions = saved.missions.map(mission => this.normalizeMission(mission)).filter(Boolean);
        this.state = validateAssignment(missions) ? {
          version: VERSION,
          date,
          missions,
          allCompleteRewardGranted: Boolean(saved.allCompleteRewardGranted),
          processedEventIds: Array.isArray(saved.processedEventIds) ? saved.processedEventIds.filter(id => typeof id === "string").slice(-MAX_EVENT_IDS) : []
        } : this.createState(date);
      } else if (saved && !saved.version && saved.goalId) this.state = this.migrateLegacy(saved, date);
      else this.state = this.createState(date);
      this.save();
      return this.getState();
    }

    getState() {
      return this.state ? JSON.parse(JSON.stringify(this.state)) : undefined;
    }

    recordEvent(type, payload = {}) {
      this.ensureToday();
      if (!this.state || typeof type !== "string") return { changed: false, completed: [], allCompleted: false };
      const eventId = typeof payload.eventId === "string" ? `${type}:${payload.eventId}` : undefined;
      if (eventId && this.state.processedEventIds.includes(eventId)) return { changed: false, completed: [], allCompleted: this.state.missions.every(mission => mission.completed) };
      if (eventId) this.state.processedEventIds = [...this.state.processedEventIds, eventId].slice(-MAX_EVENT_IDS);
      const completed = [];
      let changed = false;
      this.state.missions.forEach(mission => {
        if (mission.completed || mission.eventType !== type || !matchesCriteria(mission.criteria, payload)) return;
        if (mission.uniqueField) {
          const uniqueValue = payload[mission.uniqueField];
          if (typeof uniqueValue !== "string" || mission.uniqueValues.includes(uniqueValue)) return;
          mission.uniqueValues = [...mission.uniqueValues, uniqueValue].slice(-10);
          mission.progress = Math.min(mission.target, mission.uniqueValues.length);
        } else mission.progress = Math.min(mission.target, mission.progress + 1);
        changed = true;
        if (mission.progress >= mission.target) {
          mission.completed = true;
          completed.push(mission);
        }
      });
      const allCompleted = this.state.missions.every(mission => mission.completed);
      const missionRewards = completed.filter(mission => !mission.rewardGranted);
      missionRewards.forEach(mission => { mission.rewardGranted = true; });
      const grantAllReward = allCompleted && !this.state.allCompleteRewardGranted;
      if (grantAllReward) this.state.allCompleteRewardGranted = true;
      this.save();
      missionRewards.forEach(mission => this.onReward({ kind: "mission", mission, reward: mission.reward }));
      if (grantAllReward) this.onReward({ kind: "all-complete", reward: { sticker: true, stars: 0 } });
      if (completed.length) this.onComplete({ completed: completed.map(mission => ({ ...mission })), allCompleted });
      return { changed, completed: completed.map(mission => ({ ...mission })), allCompleted, grantAllReward };
    }
  }

  const api = { VERSION, REGISTRY, MISSION_CATEGORIES, DailyMissionManager, localDateKey, generateAssignment, validateRegistry, validateAssignment };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.MilaDailyMissions = api;
})(typeof window !== "undefined" ? window : globalThis);
