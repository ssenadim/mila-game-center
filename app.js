const DATA_INDEX_URL = "./data/index.json";
const SESSION_QUESTION_COUNT = 20;
const QUESTION_DELAY = 800;
const CHOICE_DELAY = 2000;
const SUCCESS_NEXT_DELAY = 1000;
const ENGLISH_LANGUAGE = "en-US";
const TURKISH_LANGUAGE = "tr-TR";
const WELCOME_MESSAGE = "Merhaba! Haydi oynayalım!";
const PRAISE_MESSAGES = ["Harikasın", "Süpersin", "Muhteşemsin", "Aferin", "Çok güzel", "Mükemmel", "Devam et", "Bravo"];
const RETRY_MESSAGES = ["Bir daha deneyelim!", "Yaklaşıyorsun!", "Bir kez daha bakalım.", "Sorun değil.", "Hadi tekrar deneyelim!"];
const STICKERS = ["⭐", "🌈", "🦋", "🦄", "🚀", "🐱", "🐶"];
const STICKER_STORAGE_KEY = "mila-learning-stickers";
const REWARD_POPUP_DURATION = 3000;
const PARENT_DATA_STORAGE_KEY = "mila-learning-parent-data";
const PARENT_HOLD_DURATION = 5000;
const SESSION_CELEBRATION_DURATION = 3500;
const GAME_PROGRESS_STORAGE_KEY = "mila-learning-progress";
const LEARNING_STATS_STORAGE_KEY = "mila-learning-learning-stats";
const BONUS_DURATION = 20000;
const BONUS_CORRECT_ANSWER_INTERVAL = 5;
const LEARNING_MODE = "learning";
const QUICK_MODE = "quick";
const MATCHING_MODE = "matching";
const GAME_MODE_STORAGE_KEY = "mila-learning-game-mode";
const PLAYER_STORAGE_KEY = "mila-learning-player";
const PLAYER_PROGRESS_MIGRATION_STORAGE_KEY = "mila-learning-player-progress-migrated";
const CATEGORY_PACK_STORAGE_KEY = "mila-learning-category-pack";
const ACHIEVEMENT_STORAGE_KEY = "mila-learning-achievements";
const DAILY_GOAL_STORAGE_KEY = "mila-learning-daily-goal";
const DEFAULT_PLAYERS = ["Mila", "Açelya", "Alp", "Aslan Cemal", "Zeynep", "Nova", "Ata", "Hiranur"];
const ACHIEVEMENTS = [
  { id: "first-star", icon: "⭐", title: "İlk Yıldız", description: "İlk doğru cevabını verdin." },
  { id: "five-correct", icon: "🎯", title: "Beş Doğru", description: "Beş doğru cevap verdin." },
  { id: "ten-correct", icon: "🏆", title: "On Doğru", description: "On doğru cevap verdin." },
  { id: "first-bonus", icon: "🎁", title: "İlk Bonus", description: "İlk bonus oyununu tamamladın." },
  { id: "fruit-explorer", icon: "🍎", title: "Meyve Kaşifi", description: "Tüm meyveleri doğru bildin." }
];
const DAILY_GOALS = [
  { id: "ten-correct", icon: "⭐", title: "10 doğru cevap ver", target: 10 },
  { id: "streak-three", icon: "🎯", title: "3 doğru seri yap", target: 3 },
  { id: "complete-bonus", icon: "🎁", title: "Bir Bonus Modu tamamla", target: 1 },
  { id: "five-different", icon: "🍎", title: "5 farklı soruyu doğru bil", target: 5 }
];

const ui = {
  welcome: document.querySelector("#welcome-screen"), quiz: document.querySelector("#quiz-screen"), summary: document.querySelector("#summary-screen"),
  start: document.querySelector("#start-button"), fullscreen: document.querySelector("#fullscreen-button"), achievements: document.querySelector("#achievements-button"), welcomeSound: document.querySelector("#welcome-sound-button"), learningMode: document.querySelector("#learning-mode-button"), quickMode: document.querySelector("#quick-mode-button"), matchingMode: document.querySelector("#matching-mode-button"), playerButtons: document.querySelectorAll(".player-button"), customPlayer: document.querySelector("#custom-player-button"), customPlayerLabel: document.querySelector("#custom-player-label"), customPlayerName: document.querySelector("#custom-player-name"), categoryPackButtons: document.querySelectorAll(".category-pack-button"), customCategoryOptions: document.querySelector("#custom-category-options"), home: document.querySelector("#home-button"), replay: document.querySelector("#question-sound-button"), matching: document.querySelector("#matching-screen"), matchingCards: document.querySelector("#matching-cards"), matchingCelebration: document.querySelector("#matching-celebration"), matchingFeedback: document.querySelector("#matching-feedback"), matchingHome: document.querySelector("#matching-home-button"), matchingPause: document.querySelector("#matching-pause-button"),
  category: document.querySelector("#category-pill"), visual: document.querySelector("#question-visual"), celebration: document.querySelector("#celebration"), mascot: document.querySelector("#game-mascot"), prompt: document.querySelector("#question-prompt"),
  answers: document.querySelector("#answers"), feedback: document.querySelector("#feedback"), next: document.querySelector("#next-button"), count: document.querySelector("#question-count"), score: document.querySelector("#score"), streak: document.querySelector("#streak"), progress: document.querySelector("#progress-fill"),
  playAgain: document.querySelector("#play-again-button"), summaryHome: document.querySelector("#summary-home-button"), summaryStars: document.querySelector("#summary-stars"), summaryCorrect: document.querySelector("#summary-correct"), summaryStreak: document.querySelector("#summary-streak"), summaryCategory: document.querySelector("#summary-category"), summaryTitle: document.querySelector("#summary-title"), summaryCopy: document.querySelector(".summary-copy"), rewardPopup: document.querySelector("#reward-popup"), rewardSticker: document.querySelector("#reward-sticker"), achievementPopup: document.querySelector("#achievement-popup"), achievementPopupIcon: document.querySelector("#achievement-popup-icon"), achievementPopupTitle: document.querySelector("#achievement-popup-title"), dailyGoalCard: document.querySelector("#daily-goal-card"), dailyGoalTitle: document.querySelector("#daily-goal-title"), dailyGoalProgress: document.querySelector("#daily-goal-progress"), dailyGoalPopup: document.querySelector("#daily-goal-popup"), achievementsModal: document.querySelector("#achievements-modal"), achievementsModalClose: document.querySelector("#achievements-modal-close"), achievementsList: document.querySelector("#achievements-list"), rewardsStarCount: document.querySelector("#rewards-star-count"), stickersList: document.querySelector("#stickers-list"), bonus: document.querySelector("#balloon-bonus"), balloonTarget: document.querySelector("#balloon-target"), balloons: document.querySelector("#balloons"), pause: document.querySelector("#pause-button"), bonusPause: document.querySelector("#bonus-pause-button"), pauseOverlay: document.querySelector("#pause-overlay"), resume: document.querySelector("#resume-button"), parentLogo: document.querySelector("#welcome-title"), parentDashboard: document.querySelector("#parent-dashboard"), parentDashboardClose: document.querySelector("#parent-dashboard-close"), parentDashboardTitle: document.querySelector("#parent-dashboard-title"), parentPlayTime: document.querySelector("#parent-play-time"), parentQuestions: document.querySelector("#parent-questions"), parentCorrect: document.querySelector("#parent-correct"), parentCategory: document.querySelector("#parent-category"), parentStreak: document.querySelector("#parent-streak"), parentDifficultWords: document.querySelector("#parent-difficult-words")
};

const appUtils = window.MilaUtils;
const speech = new window.MilaSpeechService();
const audio = new window.MilaAudioHelper();
const animations = new window.MilaAnimationHelper(ui.visual, ui.celebration);
const gameReady = loadQuestionEngine();

let engine;
let currentQuestion;
let stars = 0;
let streak = 0;
let bestStreak = 0;
let correctAnswers = 0;
let questionNumber = 0;
let isSpeaking = false;
let isStartingGame = false;
let audioRun = 0;
let rewardPopupTimer;
let balloonBonusTimer;
let isBalloonBonusActive = false;
let selectedPlayer = getSavedPlayer();
migratePlayerProgress();
let parentData = loadParentData();
let achievementData = loadAchievementData();
let dailyGoalData = loadDailyGoalData();
let playStartedAt = 0;
let parentHoldTimer;
let sessionCelebrationTimer;
let currentAnswers = [];
let isPaused = false;
let bonusEndsAt = 0;
let pausedBonusRemaining = 0;
let balloonPopTimer;
let pendingCorrectTransition = false;
let pendingBonusEnd = false;
let activeGameMode = getSavedGameMode();
let isWelcomeSequenceActive = false;
let activeCategoryPack = "mixed";
let customCategories = [];
let wakeLock;
let wakeLockRequest;
let shouldKeepWakeLock = false;
let achievementQueue = [];
let achievementPopupTimer;
let isAchievementShowing = false;
let dailyGoalPopupTimer;
let isDailyGoalShowing = false;
let pendingDailyGoalPopup = false;
let correctAnswersSinceVoice = 2;
let lastVoiceEncouragement = "";
let wrongAttemptsForQuestion = 0;
let lastRetryMessage = "";
let isRevealingCorrectAnswer = false;
let isMatchingGameActive = false;
let matchingCards = [];
let matchingOpenCards = [];
let matchingPairsFound = 0;
let matchingPendingFlip = false;
let matchingFlipTimer;
let matchingCompletionTimer;

function getValidPlayerName(name) {
  const playerName = typeof name === "string" ? name.trim() : "";
  return playerName.length > 0 && Array.from(playerName).length <= 20 && /^[\p{L} ]+$/u.test(playerName) ? playerName : undefined;
}

function getSavedPlayer() {
  try {
    return getValidPlayerName(window.localStorage.getItem(PLAYER_STORAGE_KEY));
  } catch {
    return undefined;
  }
}

function saveSelectedPlayer() {
  try {
    window.localStorage.setItem(PLAYER_STORAGE_KEY, selectedPlayer);
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function getPlayerStorageKey(storageKey, playerName = selectedPlayer) {
  return playerName ? `${storageKey}-${encodeURIComponent(playerName)}` : undefined;
}

function migratePlayerProgress() {
  try {
    if (window.localStorage.getItem(PLAYER_PROGRESS_MIGRATION_STORAGE_KEY)) return;
    [STICKER_STORAGE_KEY, PARENT_DATA_STORAGE_KEY, GAME_PROGRESS_STORAGE_KEY, LEARNING_STATS_STORAGE_KEY, GAME_MODE_STORAGE_KEY].forEach(storageKey => {
      const existingData = window.localStorage.getItem(storageKey);
      const milaStorageKey = getPlayerStorageKey(storageKey, "Mila");
      if (existingData !== null && window.localStorage.getItem(milaStorageKey) === null) window.localStorage.setItem(milaStorageKey, existingData);
    });
    window.localStorage.setItem(PLAYER_PROGRESS_MIGRATION_STORAGE_KEY, "true");
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function loadAchievementData() {
  try {
    const storageKey = getPlayerStorageKey(ACHIEVEMENT_STORAGE_KEY);
    const savedData = storageKey ? JSON.parse(window.localStorage.getItem(storageKey)) : undefined;
    return savedData && typeof savedData === "object" && !Array.isArray(savedData) && savedData.unlocked && typeof savedData.unlocked === "object" && !Array.isArray(savedData.unlocked) ? { unlocked: savedData.unlocked } : { unlocked: {} };
  } catch {
    return { unlocked: {} };
  }
}

function saveAchievementData() {
  try {
    const storageKey = getPlayerStorageKey(ACHIEVEMENT_STORAGE_KEY);
    if (storageKey) window.localStorage.setItem(storageKey, JSON.stringify(achievementData));
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function getAvailableAchievements() {
  const hasFruits = engine?.questions.some(question => question.category === "Fruits");
  return ACHIEVEMENTS.filter(achievement => achievement.id !== "fruit-explorer" || hasFruits);
}

function getTodayDate() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function getDailyGoal(goalId) {
  return DAILY_GOALS.find(goal => goal.id === goalId);
}

function getNextDailyGoal(previousGoalId) {
  const availableGoals = DAILY_GOALS.filter(goal => goal.id !== previousGoalId);
  return appUtils.randomItem(availableGoals.length ? availableGoals : DAILY_GOALS);
}

function loadDailyGoalData() {
  try {
    const storageKey = getPlayerStorageKey(DAILY_GOAL_STORAGE_KEY);
    const savedData = storageKey ? JSON.parse(window.localStorage.getItem(storageKey)) : undefined;
    return savedData && typeof savedData === "object" && !Array.isArray(savedData) ? savedData : {};
  } catch {
    return {};
  }
}

function saveDailyGoalData() {
  try {
    const storageKey = getPlayerStorageKey(DAILY_GOAL_STORAGE_KEY);
    if (storageKey) window.localStorage.setItem(storageKey, JSON.stringify(dailyGoalData));
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function ensureDailyGoal() {
  if (!selectedPlayer) return false;
  const today = getTodayDate();
  const currentGoal = getDailyGoal(dailyGoalData.goalId);
  if (dailyGoalData.date !== today || !currentGoal) {
    const nextGoal = getNextDailyGoal(currentGoal?.id ?? dailyGoalData.lastGoalId);
    dailyGoalData = { date: today, goalId: nextGoal.id, lastGoalId: currentGoal?.id ?? dailyGoalData.lastGoalId, progress: 0, completed: false, answeredQuestionKeys: [] };
    saveDailyGoalData();
  }
  return true;
}

function renderDailyGoal() {
  const goal = getDailyGoal(dailyGoalData.goalId);
  const hasGoal = Boolean(selectedPlayer && goal);
  ui.dailyGoalCard.classList.toggle("hidden", !hasGoal);
  if (!hasGoal) return;
  const progress = Math.min(Number(dailyGoalData.progress) || 0, goal.target);
  ui.dailyGoalTitle.textContent = `${goal.icon} ${goal.title}`;
  ui.dailyGoalProgress.textContent = dailyGoalData.completed ? "Tamamlandı!" : `${progress}/${goal.target}`;
  ui.dailyGoalCard.classList.toggle("completed", Boolean(dailyGoalData.completed));
}

function resetDailyGoalPopup() {
  pendingDailyGoalPopup = false;
  isDailyGoalShowing = false;
  window.clearTimeout(dailyGoalPopupTimer);
  ui.dailyGoalPopup.classList.add("hidden");
}

function showDailyGoalPopup() {
  if (isAchievementShowing) {
    pendingDailyGoalPopup = true;
    return;
  }
  if (isDailyGoalShowing) return;
  pendingDailyGoalPopup = false;
  isDailyGoalShowing = true;
  ui.dailyGoalPopup.classList.remove("hidden");
  animations.celebrate();
  window.clearTimeout(dailyGoalPopupTimer);
  dailyGoalPopupTimer = window.setTimeout(() => {
    ui.dailyGoalPopup.classList.add("hidden");
    isDailyGoalShowing = false;
  }, 1800);
}

function completeDailyGoal() {
  if (dailyGoalData.completed) return;
  dailyGoalData.completed = true;
  saveDailyGoalData();
  renderDailyGoal();
  showDailyGoalPopup();
}

function updateDailyGoalOnCorrectAnswer() {
  if (!ensureDailyGoal() || dailyGoalData.completed) return;
  const goal = getDailyGoal(dailyGoalData.goalId);
  if (!goal) return;
  if (goal.id === "ten-correct") dailyGoalData.progress = Math.min(goal.target, (Number(dailyGoalData.progress) || 0) + 1);
  if (goal.id === "streak-three") dailyGoalData.progress = Math.max(Number(dailyGoalData.progress) || 0, Math.min(streak, goal.target));
  if (goal.id === "five-different") {
    const questionKey = `${currentQuestion.category}|${currentQuestion.correct}`;
    const answeredQuestionKeys = Array.isArray(dailyGoalData.answeredQuestionKeys) ? dailyGoalData.answeredQuestionKeys : [];
    if (!answeredQuestionKeys.includes(questionKey)) answeredQuestionKeys.push(questionKey);
    dailyGoalData.answeredQuestionKeys = answeredQuestionKeys;
    dailyGoalData.progress = Math.min(goal.target, answeredQuestionKeys.length);
  }
  if ((Number(dailyGoalData.progress) || 0) >= goal.target) completeDailyGoal();
  else {
    saveDailyGoalData();
    renderDailyGoal();
  }
}

function updateDailyGoalOnBonusComplete() {
  if (!ensureDailyGoal() || dailyGoalData.completed || dailyGoalData.goalId !== "complete-bonus") return;
  dailyGoalData.progress = 1;
  completeDailyGoal();
}

function resetAchievementPopup() {
  achievementQueue = [];
  isAchievementShowing = false;
  window.clearTimeout(achievementPopupTimer);
  ui.achievementPopup.classList.add("hidden");
}

function showNextAchievement() {
  if (isAchievementShowing || !achievementQueue.length) return;
  const achievement = achievementQueue.shift();
  isAchievementShowing = true;
  ui.achievementPopupIcon.textContent = achievement.icon;
  ui.achievementPopupTitle.textContent = achievement.title;
  ui.achievementPopup.classList.remove("hidden");
  animations.celebrate();
  achievementPopupTimer = window.setTimeout(() => {
    ui.achievementPopup.classList.add("hidden");
    isAchievementShowing = false;
    showNextAchievement();
    if (!isAchievementShowing && pendingDailyGoalPopup) showDailyGoalPopup();
  }, 1800);
}

function unlockAchievement(achievementId) {
  const achievement = getAvailableAchievements().find(item => item.id === achievementId);
  if (!achievement || achievementData.unlocked[achievementId]) return;
  achievementData.unlocked[achievementId] = true;
  saveAchievementData();
  achievementQueue.push(achievement);
  showNextAchievement();
}

function checkAchievements() {
  if (parentData.correctAnswers >= 1) unlockAchievement("first-star");
  if (parentData.correctAnswers >= 5) unlockAchievement("five-correct");
  if (parentData.correctAnswers >= 10) unlockAchievement("ten-correct");
  const fruitQuestions = engine?.questions.filter(question => question.category === "Fruits") ?? [];
  if (fruitQuestions.length && fruitQuestions.every(question => (engine.learningStats.get(question)?.successes ?? 0) > 0)) unlockAchievement("fruit-explorer");
}

function renderAchievements() {
  ui.achievementsList.textContent = "";
  getAvailableAchievements().forEach(achievement => {
    const item = document.createElement("div");
    const isUnlocked = Boolean(achievementData.unlocked[achievement.id]);
    item.className = `achievement-item${isUnlocked ? "" : " locked"}`;
    const icon = document.createElement("span");
    icon.className = "achievement-item-icon";
    icon.textContent = achievement.icon;
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = achievement.title;
    const description = document.createElement("span");
    description.textContent = isUnlocked ? achievement.description : "Henüz kilitli";
    copy.append(title, description);
    item.append(icon, copy);
    ui.achievementsList.append(item);
  });
}

function getSavedStickers() {
  try {
    const storageKey = getPlayerStorageKey(STICKER_STORAGE_KEY);
    const savedStickers = storageKey ? JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") : [];
    return Array.isArray(savedStickers) ? savedStickers : [];
  } catch {
    return [];
  }
}

function renderRewardsRoom() {
  renderAchievements();
  ui.rewardsStarCount.textContent = parentData.correctAnswers;
  const unlockedStickers = getSavedStickers();
  ui.stickersList.textContent = "";
  STICKERS.forEach(sticker => {
    const item = document.createElement("span");
    item.className = `sticker-album-item${unlockedStickers.includes(sticker) ? "" : " locked"}`;
    item.textContent = sticker;
    ui.stickersList.append(item);
  });
}

function openAchievements() {
  renderRewardsRoom();
  ui.achievementsModal.classList.remove("hidden");
  ui.achievementsModalClose.focus();
}

function closeAchievements() {
  ui.achievementsModal.classList.add("hidden");
}

function getFullscreenElement() {
  return document.fullscreenElement ?? document.webkitFullscreenElement;
}

function updateFullscreenButton() {
  const requestFullscreen = document.documentElement.requestFullscreen ?? document.documentElement.webkitRequestFullscreen;
  const exitFullscreen = document.exitFullscreen ?? document.webkitExitFullscreen;
  const isSupported = typeof requestFullscreen === "function" && typeof exitFullscreen === "function" && document.fullscreenEnabled !== false;
  ui.fullscreen.classList.toggle("hidden", !isSupported);
  if (isSupported) ui.fullscreen.textContent = getFullscreenElement() ? "Tam Ekrandan Çık" : "Tam Ekran";
}

async function toggleFullscreen() {
  const requestFullscreen = document.documentElement.requestFullscreen ?? document.documentElement.webkitRequestFullscreen;
  const exitFullscreen = document.exitFullscreen ?? document.webkitExitFullscreen;
  try {
    if (getFullscreenElement()) await exitFullscreen.call(document);
    else await requestFullscreen.call(document.documentElement);
  } catch {
    // The game continues when fullscreen is unavailable or denied.
  }
  updateFullscreenButton();
}

async function requestWakeLock() {
  if (!shouldKeepWakeLock || wakeLock || wakeLockRequest || !("wakeLock" in navigator) || document.visibilityState !== "visible") return;
  try {
    wakeLockRequest = navigator.wakeLock.request("screen").then(async sentinel => {
      if (!shouldKeepWakeLock || document.visibilityState !== "visible") {
        await sentinel.release();
        return;
      }
      wakeLock = sentinel;
      sentinel.addEventListener("release", () => {
        if (wakeLock !== sentinel) return;
        wakeLock = undefined;
        requestWakeLock();
      });
    }).catch(() => {
      // The game continues when wake lock is unavailable or denied.
    }).finally(() => {
      wakeLockRequest = undefined;
    });
  } catch {
    return;
  }
  await wakeLockRequest;
}

async function releaseWakeLock() {
  const activeWakeLock = wakeLock;
  wakeLock = undefined;
  if (!activeWakeLock) return;
  try {
    await activeWakeLock.release();
  } catch {
    // The game continues when wake lock release is unavailable.
  }
}

function startWakeLock() {
  shouldKeepWakeLock = true;
  requestWakeLock();
}

function stopWakeLock() {
  shouldKeepWakeLock = false;
  releaseWakeLock();
}

function getAvailableCategories() {
  return engine?.getAvailableCategories() ?? [];
}

function getPackCategories(pack = activeCategoryPack) {
  const availableCategories = getAvailableCategories().map(category => category.category);
  if (pack === "words") return availableCategories.filter(category => !["Colors", "Shapes", "Numbers"].includes(category));
  if (pack === "colors-shapes") return availableCategories.filter(category => ["Colors", "Shapes"].includes(category));
  if (pack === "numbers") return availableCategories.filter(category => category === "Numbers");
  if (pack === "custom") return customCategories.filter(category => availableCategories.includes(category));
  return availableCategories;
}

function saveCategoryPack() {
  try {
    const storageKey = getPlayerStorageKey(CATEGORY_PACK_STORAGE_KEY);
    if (storageKey) window.localStorage.setItem(storageKey, JSON.stringify({ pack: activeCategoryPack, categories: customCategories }));
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function restoreCategoryPack() {
  activeCategoryPack = "mixed";
  customCategories = [];
  try {
    const storageKey = getPlayerStorageKey(CATEGORY_PACK_STORAGE_KEY);
    const savedPack = storageKey ? JSON.parse(window.localStorage.getItem(storageKey)) : undefined;
    const availableCategories = getAvailableCategories().map(category => category.category);
    const validPacks = ["mixed", "words", "colors-shapes", "numbers", "custom"];
    customCategories = Array.isArray(savedPack?.categories) ? [...new Set(savedPack.categories.filter(category => availableCategories.includes(category)))] : [];
    activeCategoryPack = validPacks.includes(savedPack?.pack) ? savedPack.pack : "mixed";
    if (!getPackCategories(activeCategoryPack).length) activeCategoryPack = "mixed";
  } catch {
    activeCategoryPack = "mixed";
    customCategories = [];
  }
}

function renderCategoryPackSelection() {
  const availableCategories = getAvailableCategories();
  const availableCategoryNames = availableCategories.map(category => category.category);
  ui.categoryPackButtons.forEach(button => {
    const packCategories = getPackCategories(button.dataset.categoryPack);
    const isAvailable = button.dataset.categoryPack === "mixed" || button.dataset.categoryPack === "custom" || packCategories.length > 0;
    button.classList.toggle("hidden", !isAvailable);
    button.setAttribute("aria-pressed", String(button.dataset.categoryPack === activeCategoryPack));
  });
  ui.customCategoryOptions.textContent = "";
  availableCategories.forEach(category => {
    const button = document.createElement("button");
    button.className = "custom-category-button";
    button.type = "button";
    button.textContent = category.label;
    button.setAttribute("aria-pressed", String(customCategories.includes(category.category)));
    button.addEventListener("click", () => {
      customCategories = customCategories.includes(category.category) ? customCategories.filter(name => name !== category.category) : [...customCategories, category.category];
      saveCategoryPack();
      renderCategoryPackSelection();
    });
    ui.customCategoryOptions.append(button);
  });
  ui.customCategoryOptions.classList.toggle("hidden", activeCategoryPack !== "custom" || availableCategoryNames.length === 0);
  updateStartButton();
}

function setCategoryPack(pack) {
  if (!getPackCategories(pack).length && pack !== "custom") return;
  activeCategoryPack = pack;
  saveCategoryPack();
  renderCategoryPackSelection();
}

function applyCategoryPack() {
  engine?.setActiveCategories(getPackCategories());
}

function updateStartButton() {
  const hasGameMode = activeGameMode === LEARNING_MODE || activeGameMode === QUICK_MODE || activeGameMode === MATCHING_MODE;
  ui.start.disabled = !selectedPlayer || !hasGameMode || (activeGameMode !== MATCHING_MODE && activeCategoryPack === "custom" && !getPackCategories().length);
}

function getPersonalizedWelcomeMessage() {
  return WELCOME_MESSAGE;
}

function getPersonalizedBonusMessage() {
  return selectedPlayer ? `Harika gidiyorsun ${selectedPlayer}! Bonus zamanı!` : "Harika gidiyorsun! Bonus zamanı!";
}

function getPersonalizedSessionMessage() {
  return selectedPlayer ? `Harika ${selectedPlayer}! Bugün çok güzel oynadın.` : "Harika! Bugün çok güzel oynadın.";
}

function getPersonalizedPraiseMessage() {
  const praiseMessage = appUtils.randomItem(PRAISE_MESSAGES);
  return selectedPlayer ? `${praiseMessage} ${selectedPlayer}!` : `${praiseMessage}!`;
}

function getRetryMessage() {
  const messages = RETRY_MESSAGES.filter(message => message !== lastRetryMessage);
  const retryMessage = appUtils.randomItem(messages.length ? messages : RETRY_MESSAGES);
  lastRetryMessage = retryMessage;
  return retryMessage;
}

function shouldPlayVoiceEncouragement() {
  correctAnswersSinceVoice += 1;
  return correctAnswersSinceVoice >= 3 && Math.random() < .3;
}

function getVoiceEncouragementMessage() {
  const messages = PRAISE_MESSAGES.filter(message => message !== lastVoiceEncouragement);
  const encouragement = appUtils.randomItem(messages.length ? messages : PRAISE_MESSAGES);
  return { encouragement, message: selectedPlayer ? `${encouragement} ${selectedPlayer}!` : `${encouragement}!` };
}

function renderPlayerSelection() {
  const isCustomPlayer = selectedPlayer && !DEFAULT_PLAYERS.includes(selectedPlayer);
  ui.playerButtons.forEach(button => {
    const isSelected = button.dataset.playerName === selectedPlayer || (button === ui.customPlayer && isCustomPlayer);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  ui.customPlayerLabel.classList.toggle("hidden", !isCustomPlayer);
  ui.customPlayerName.classList.toggle("hidden", !isCustomPlayer);
  if (isCustomPlayer) ui.customPlayerName.value = selectedPlayer;
  updateStartButton();
}

function selectPlayer(name) {
  selectedPlayer = getValidPlayerName(name);
  if (!selectedPlayer) return;
  ui.customPlayerName.value = "";
  saveSelectedPlayer();
  parentData = loadParentData();
  achievementData = loadAchievementData();
  dailyGoalData = loadDailyGoalData();
  resetAchievementPopup();
  resetDailyGoalPopup();
  ensureDailyGoal();
  renderDailyGoal();
  if (!ui.achievementsModal.classList.contains("hidden")) renderRewardsRoom();
  setGameMode(getSavedGameMode());
  restoreCategoryPack();
  renderCategoryPackSelection();
  renderPlayerSelection();
}

function selectCustomPlayer() {
  selectedPlayer = undefined;
  dailyGoalData = {};
  resetDailyGoalPopup();
  renderDailyGoal();
  ui.playerButtons.forEach(button => button.setAttribute("aria-pressed", "false"));
  ui.customPlayer.setAttribute("aria-pressed", "true");
  ui.customPlayerLabel.classList.remove("hidden");
  ui.customPlayerName.classList.remove("hidden");
  ui.customPlayerName.focus();
  updateStartButton();
}

function updateCustomPlayer() {
  const sanitizedName = Array.from(ui.customPlayerName.value).filter(character => /[\p{L} ]/u.test(character)).slice(0, 20).join("");
  if (ui.customPlayerName.value !== sanitizedName) ui.customPlayerName.value = sanitizedName;
  const playerName = getValidPlayerName(ui.customPlayerName.value);
  selectedPlayer = playerName;
  ui.customPlayer.setAttribute("aria-pressed", String(Boolean(playerName)));
  if (playerName) {
    saveSelectedPlayer();
    parentData = loadParentData();
    achievementData = loadAchievementData();
    dailyGoalData = loadDailyGoalData();
    resetAchievementPopup();
    resetDailyGoalPopup();
    ensureDailyGoal();
    renderDailyGoal();
    if (!ui.achievementsModal.classList.contains("hidden")) renderRewardsRoom();
    setGameMode(getSavedGameMode());
    restoreCategoryPack();
    renderCategoryPackSelection();
  } else {
    dailyGoalData = {};
    resetDailyGoalPopup();
    renderDailyGoal();
  }
  updateStartButton();
}

function getSavedGameMode() {
  try {
    const storageKey = getPlayerStorageKey(GAME_MODE_STORAGE_KEY);
    const savedMode = storageKey && window.localStorage.getItem(storageKey);
    return savedMode === QUICK_MODE || savedMode === LEARNING_MODE || savedMode === MATCHING_MODE ? savedMode : LEARNING_MODE;
  } catch {
    return LEARNING_MODE;
  }
}

function setGameMode(mode) {
  if (isPaused || (mode !== LEARNING_MODE && mode !== QUICK_MODE && mode !== MATCHING_MODE)) return;
  activeGameMode = mode;
  ui.learningMode.setAttribute("aria-pressed", String(mode === LEARNING_MODE));
  ui.quickMode.setAttribute("aria-pressed", String(mode === QUICK_MODE));
  ui.matchingMode.setAttribute("aria-pressed", String(mode === MATCHING_MODE));
  try {
    const storageKey = getPlayerStorageKey(GAME_MODE_STORAGE_KEY);
    if (storageKey) window.localStorage.setItem(storageKey, mode);
  } catch {
    // The game continues when local storage is unavailable.
  }
  updateStartButton();
}

function getSavedProgress() {
  try {
    const storageKey = getPlayerStorageKey(GAME_PROGRESS_STORAGE_KEY);
    return storageKey ? JSON.parse(window.localStorage.getItem(storageKey)) : undefined;
  } catch {
    return undefined;
  }
}

function saveGameProgress(pendingAdvance = false) {
  if (!engine || !currentQuestion) return;
  try {
    const storageKey = getPlayerStorageKey(GAME_PROGRESS_STORAGE_KEY);
    if (!storageKey) return;
    window.localStorage.setItem(storageKey, JSON.stringify({
      stars, streak, bestStreak, correctAnswers, questionNumber, pendingAdvance,
      currentQuestion: { category: currentQuestion.category, correct: currentQuestion.correct },
      currentAnswers, learningStats: engine.getLearningStats(), difficultyState: engine.getDifficultyState()
    }));
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function clearSavedProgress() {
  try {
    const storageKey = getPlayerStorageKey(GAME_PROGRESS_STORAGE_KEY);
    if (storageKey) window.localStorage.removeItem(storageKey);
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function saveLearningStats() {
  if (!engine) return;
  try {
    const storageKey = getPlayerStorageKey(LEARNING_STATS_STORAGE_KEY);
    if (!storageKey) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ learningStats: engine.getLearningStats(), difficultyState: engine.getDifficultyState() }));
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function restoreStoredLearningStats() {
  try {
    const storageKey = getPlayerStorageKey(LEARNING_STATS_STORAGE_KEY);
    const savedData = storageKey ? JSON.parse(window.localStorage.getItem(storageKey)) : undefined;
    engine.learningStats.clear();
    engine.restoreDifficultyState({});
    engine.restoreLearningStats(savedData?.learningStats ?? savedData);
    engine.restoreDifficultyState(savedData?.difficultyState);
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function restoreSavedProgress() {
  const savedProgress = getSavedProgress();
  if (!savedProgress?.currentQuestion) return false;
  engine.restoreLearningStats(savedProgress.learningStats);
  engine.restoreDifficultyState(savedProgress.difficultyState);
  stars = savedProgress.stars ?? 0;
  streak = savedProgress.streak ?? 0;
  bestStreak = savedProgress.bestStreak ?? 0;
  correctAnswers = savedProgress.correctAnswers ?? 0;
  questionNumber = savedProgress.questionNumber ?? 0;
  if (savedProgress.pendingAdvance) {
    ui.welcome.classList.add("hidden");
    ui.summary.classList.add("hidden");
    ui.quiz.classList.remove("hidden");
    startWakeLock();
    if (questionNumber >= SESSION_QUESTION_COUNT) showSessionSummary();
    else showQuestion();
    return true;
  }
  currentQuestion = engine.questions.find(question => question.category === savedProgress.currentQuestion.category && question.correct === savedProgress.currentQuestion.correct);
  if (!currentQuestion) return false;
  currentAnswers = savedProgress.currentAnswers?.length ? savedProgress.currentAnswers : engine.getAnswers(currentQuestion);
  ui.welcome.classList.add("hidden");
  ui.summary.classList.add("hidden");
  ui.quiz.classList.remove("hidden");
  ui.category.textContent = currentQuestion.label;
  ui.visual.textContent = currentQuestion.visual;
  ui.prompt.textContent = currentQuestion.prompt;
  ui.feedback.textContent = "";
  updateScoreboard();
  renderAnswers();
  startPlayTime();
  startWakeLock();
  playQuestionSequence();
  return true;
}

function loadParentData() {
  try {
    const storageKey = getPlayerStorageKey(PARENT_DATA_STORAGE_KEY);
    const savedData = storageKey ? JSON.parse(window.localStorage.getItem(storageKey)) : undefined;
    if (savedData && typeof savedData === "object" && !Array.isArray(savedData)) {
      return {
        playTime: Number.isFinite(savedData.playTime) ? savedData.playTime : 0,
        questionsAnswered: Number.isFinite(savedData.questionsAnswered) ? savedData.questionsAnswered : 0,
        correctAnswers: Number.isFinite(savedData.correctAnswers) ? savedData.correctAnswers : 0,
        categoryCounts: savedData.categoryCounts && typeof savedData.categoryCounts === "object" && !Array.isArray(savedData.categoryCounts) ? savedData.categoryCounts : {},
        difficultWords: savedData.difficultWords && typeof savedData.difficultWords === "object" && !Array.isArray(savedData.difficultWords) ? savedData.difficultWords : {},
        bestStreak: Number.isFinite(savedData.bestStreak) ? savedData.bestStreak : 0,
        matchingPairsCompleted: Number.isFinite(savedData.matchingPairsCompleted) ? savedData.matchingPairsCompleted : 0
      };
    }
    return { playTime: 0, questionsAnswered: 0, correctAnswers: 0, categoryCounts: {}, difficultWords: {}, bestStreak: 0, matchingPairsCompleted: 0 };
  } catch {
    return { playTime: 0, questionsAnswered: 0, correctAnswers: 0, categoryCounts: {}, difficultWords: {}, bestStreak: 0, matchingPairsCompleted: 0 };
  }
}

function saveParentData() {
  try {
    const storageKey = getPlayerStorageKey(PARENT_DATA_STORAGE_KEY);
    if (storageKey) window.localStorage.setItem(storageKey, JSON.stringify(parentData));
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function startPlayTime() {
  if (!playStartedAt) playStartedAt = Date.now();
}

function stopPlayTime() {
  if (!playStartedAt) return;
  parentData.playTime += Date.now() - playStartedAt;
  playStartedAt = 0;
  saveParentData();
}

function getParentFavoriteCategory() {
  return Object.entries(parentData.categoryCounts).reduce((favorite, entry) => entry[1] > favorite[1] ? entry : favorite, ["-", 0])[0];
}

function getDifficultWords() {
  const words = Object.entries(parentData.difficultWords).sort((first, second) => second[1] - first[1]).slice(0, 3).map(entry => entry[0]);
  return words.length ? words.join(", ") : "Henüz yok";
}

function updateParentData(wasCorrect) {
  parentData.questionsAnswered += 1;
  parentData.categoryCounts[currentQuestion.label] = (parentData.categoryCounts[currentQuestion.label] ?? 0) + 1;
  if (wasCorrect) {
    parentData.correctAnswers += 1;
    parentData.bestStreak = Math.max(parentData.bestStreak, streak);
  } else {
    parentData.difficultWords[currentQuestion.correct] = (parentData.difficultWords[currentQuestion.correct] ?? 0) + 1;
  }
  saveParentData();
}

function renderMatchingCards() {
  ui.matchingCards.textContent = "";
  matchingCards.forEach((card, index) => {
    const button = document.createElement("button");
    button.className = `matching-card${card.revealed ? " revealed" : ""}${card.completed ? " completed" : ""}`;
    button.type = "button";
    button.textContent = card.revealed || card.completed ? card.symbol : "?";
    button.setAttribute("aria-label", card.revealed || card.completed ? "Açık kart" : "Kapalı kart");
    button.disabled = isPaused || matchingPendingFlip || card.revealed || card.completed;
    button.addEventListener("click", () => openMatchingCard(index));
    ui.matchingCards.append(button);
  });
}

function flipBackMatchingCards() {
  matchingFlipTimer = undefined;
  if (!isMatchingGameActive || isPaused) return;
  matchingOpenCards.forEach(index => { matchingCards[index].revealed = false; });
  matchingOpenCards = [];
  matchingPendingFlip = false;
  renderMatchingCards();
}

function scheduleMatchingFlip() {
  window.clearTimeout(matchingFlipTimer);
  matchingFlipTimer = window.setTimeout(flipBackMatchingCards, 750);
}

function completeMatchingGame() {
  if (!isMatchingGameActive) return;
  isMatchingGameActive = false;
  matchingPendingFlip = true;
  parentData.matchingPairsCompleted += 1;
  saveParentData();
  ui.matchingFeedback.textContent = "Harika! Tüm eşleri buldun!";
  renderMatchingCards();
  animations.celebrate();
  ui.matchingCelebration.innerHTML = ui.celebration.innerHTML;
  ui.matchingCelebration.classList.remove("burst");
  void ui.matchingCelebration.offsetWidth;
  ui.matchingCelebration.classList.add("burst");
  audio.playCelebration();
  window.clearTimeout(matchingCompletionTimer);
  matchingCompletionTimer = window.setTimeout(goHome, 1400);
}

function openMatchingCard(index) {
  const card = matchingCards[index];
  if (!isMatchingGameActive || isPaused || matchingPendingFlip || !card || card.revealed || card.completed) return;
  card.revealed = true;
  matchingOpenCards.push(index);
  renderMatchingCards();
  if (matchingOpenCards.length < 2) return;
  const [firstIndex, secondIndex] = matchingOpenCards;
  if (matchingCards[firstIndex].symbol === matchingCards[secondIndex].symbol) {
    matchingCards[firstIndex].completed = true;
    matchingCards[secondIndex].completed = true;
    matchingOpenCards = [];
    matchingPairsFound += 1;
    ui.matchingFeedback.textContent = "Eşini buldun!";
    renderMatchingCards();
    audio.playSuccess();
    if (matchingPairsFound === 3) completeMatchingGame();
    return;
  }
  matchingPendingFlip = true;
  ui.matchingFeedback.textContent = "Bir kez daha bakalım.";
  renderMatchingCards();
  scheduleMatchingFlip();
}

function startMatchingGame() {
  isMatchingGameActive = true;
  matchingCards = appUtils.shuffle(["🍎", "🍎", "🐶", "🐶", "⭐", "⭐"]).map(symbol => ({ symbol, revealed: false, completed: false }));
  matchingOpenCards = [];
  matchingPairsFound = 0;
  matchingPendingFlip = false;
  window.clearTimeout(matchingFlipTimer);
  window.clearTimeout(matchingCompletionTimer);
  clearSpeech();
  ui.welcome.classList.add("hidden");
  ui.quiz.classList.add("hidden");
  ui.summary.classList.add("hidden");
  ui.bonus.classList.add("hidden");
  ui.matching.classList.remove("hidden");
  ui.matchingFeedback.textContent = "İki kartı aç.";
  renderMatchingCards();
  startPlayTime();
  startWakeLock();
}

function renderParentDashboard() {
  const activePlayTime = playStartedAt ? Date.now() - playStartedAt : 0;
  const minutes = Math.floor((parentData.playTime + activePlayTime) / 60000);
  ui.parentDashboardTitle.textContent = selectedPlayer ? `${selectedPlayer}'nın öğrenme özeti` : "Öğrenme özeti";
  ui.parentPlayTime.textContent = `${minutes} dk`;
  ui.parentQuestions.textContent = parentData.questionsAnswered;
  ui.parentCorrect.textContent = parentData.correctAnswers;
  ui.parentCategory.textContent = getParentFavoriteCategory();
  ui.parentStreak.textContent = parentData.bestStreak;
  ui.parentDifficultWords.textContent = getDifficultWords();
}

function openParentDashboard() {
  window.clearTimeout(parentHoldTimer);
  renderParentDashboard();
  ui.parentDashboard.classList.remove("hidden");
  ui.parentDashboardClose.focus();
}

function closeParentDashboard() {
  window.clearTimeout(parentHoldTimer);
  ui.parentDashboard.classList.add("hidden");
}

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Unable to load ${url}`);
  return response.json();
}

async function loadQuestionEngine() {
  if (window.location.protocol === "file:") return new window.MilaQuestionEngine(window.MilaOfflineQuestions);
  const index = await loadJson(DATA_INDEX_URL);
  const categoryData = await Promise.all(index.files.map(file => loadJson(`./data/${file}`)));
  return new window.MilaQuestionEngine(categoryData.flat());
}

function clearSpeech() {
  audioRun += 1;
  speech.clear();
}

function isActiveAudio(run) {
  return !isPaused && run === audioRun;
}

function setInputEnabled(enabled) {
  const canUseInput = enabled && !isPaused;
  isSpeaking = !canUseInput;
  ui.answers.querySelectorAll("button").forEach(button => { button.disabled = !canUseInput; });
  ui.replay.disabled = !canUseInput;
}

function setGameActionsEnabled(enabled) {
  ui.home.disabled = !enabled;
  ui.next.disabled = !enabled;
  ui.pause.disabled = !enabled;
  ui.bonusPause.disabled = !enabled;
  ui.matchingHome.disabled = !enabled;
  ui.matchingPause.disabled = !enabled;
}

function pauseGame() {
  if (isPaused || (ui.quiz.classList.contains("hidden") && !isBalloonBonusActive && !isMatchingGameActive)) return;
  isPaused = true;
  clearSpeech();
  stopPlayTime();
  setInputEnabled(false);
  setGameActionsEnabled(false);
  if (isBalloonBonusActive) {
    pausedBonusRemaining = Math.max(0, bonusEndsAt - Date.now());
    window.clearTimeout(balloonBonusTimer);
    window.clearTimeout(balloonPopTimer);
    ui.balloons.querySelectorAll("button").forEach(balloon => { balloon.disabled = true; });
  }
  if (isMatchingGameActive) {
    window.clearTimeout(matchingFlipTimer);
    renderMatchingCards();
  }
  ui.pauseOverlay.classList.remove("hidden");
  ui.resume.focus();
}

function resumeGame() {
  if (!isPaused) return;
  isPaused = false;
  ui.pauseOverlay.classList.add("hidden");
  setGameActionsEnabled(true);
  startPlayTime();
  if (isBalloonBonusActive) {
    if (pausedBonusRemaining <= 0) {
      endBalloonBonus();
      return;
    }
    startBonusTimer(pausedBonusRemaining);
    if (pendingBonusEnd) {
      balloonPopTimer = window.setTimeout(endBalloonBonus, 200);
      return;
    }
    playBalloonPrompt();
    return;
  }
  if (isMatchingGameActive) {
    renderMatchingCards();
    if (matchingPendingFlip) scheduleMatchingFlip();
    return;
  }
  if (isWelcomeSequenceActive) {
    playWelcomeSequence().then(completed => {
      if (completed && !isPaused) showQuestion();
    });
    return;
  }
  if (isRevealingCorrectAnswer) {
    isRevealingCorrectAnswer = false;
    showQuestion();
    return;
  }
  resumeQuestionSequence();
}

async function resumeQuestionSequence() {
  const keepInputDisabled = pendingCorrectTransition;
  const completed = await playQuestionSequence(keepInputDisabled);
  if (!completed || isPaused || !pendingCorrectTransition) return;
  finishCorrectAnswer(audioRun);
}

function getAnswerButtons() {
  return [...ui.answers.querySelectorAll("button")];
}

function updateScoreboard() {
  ui.count.textContent = `Soru ${questionNumber}/${SESSION_QUESTION_COUNT}`;
  ui.score.textContent = `⭐ ${stars}`;
  ui.streak.textContent = `🔥 Seri: ${streak}`;
  ui.progress.style.width = `${(questionNumber / SESSION_QUESTION_COUNT) * 100}%`;
}

function saveSticker(sticker) {
  try {
    const storageKey = getPlayerStorageKey(STICKER_STORAGE_KEY);
    if (!storageKey) return;
    const savedStickers = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    const stickers = Array.isArray(savedStickers) ? savedStickers : [];
    window.localStorage.setItem(storageKey, JSON.stringify([...stickers, sticker]));
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function awardSticker() {
  const sticker = appUtils.randomItem(STICKERS);
  saveSticker(sticker);
  ui.rewardSticker.textContent = sticker;
  ui.rewardPopup.classList.remove("hidden");
  window.clearTimeout(rewardPopupTimer);
  rewardPopupTimer = window.setTimeout(() => ui.rewardPopup.classList.add("hidden"), REWARD_POPUP_DURATION);
}

function renderBalloons() {
  ui.balloons.innerHTML = "";
  engine.getAnswers(currentQuestion).forEach(answer => {
    const balloon = document.createElement("button");
    balloon.className = "balloon";
    balloon.type = "button";
    balloon.textContent = answer;
    balloon.disabled = true;
    balloon.addEventListener("click", () => popBalloon(balloon, answer));
    ui.balloons.append(balloon);
  });
}

function startBonusTimer(duration) {
  window.clearTimeout(balloonBonusTimer);
  pausedBonusRemaining = duration;
  bonusEndsAt = Date.now() + duration;
  balloonBonusTimer = window.setTimeout(endBalloonBonus, duration);
}

async function playBalloonPrompt() {
  const run = audioRun;
  ui.balloons.querySelectorAll("button").forEach(balloon => { balloon.disabled = true; });
  await speech.speak(ui.balloonTarget.textContent, ENGLISH_LANGUAGE);
  if (isBalloonBonusActive && isActiveAudio(run)) {
    ui.balloons.querySelectorAll("button").forEach(balloon => { balloon.disabled = false; });
  }
}

async function startBalloonBonus() {
  if (isPaused) return;
  isBalloonBonusActive = true;
  pendingBonusEnd = false;
  clearSpeech();
  ui.quiz.classList.add("hidden");
  ui.bonus.classList.remove("hidden");
  ui.balloonTarget.textContent = `Pop ${currentQuestion.correct}.`;
  renderBalloons();
  startBonusTimer(BONUS_DURATION);
  speech.speak(getPersonalizedBonusMessage(), TURKISH_LANGUAGE);
  await playBalloonPrompt();
}

function popBalloon(balloon, answer) {
  if (isPaused || !isBalloonBonusActive || balloon.disabled) return;
  if (answer === currentQuestion.correct) {
    balloon.classList.add("balloon-pop");
    audio.playSuccess();
    pendingBonusEnd = true;
    balloonPopTimer = window.setTimeout(endBalloonBonus, 600);
  } else {
    balloon.classList.add("balloon-wiggle");
    window.setTimeout(() => balloon.classList.remove("balloon-wiggle"), 450);
  }
}

function endBalloonBonus() {
  if (isPaused || !isBalloonBonusActive) return;
  const completedBonus = pendingBonusEnd;
  isBalloonBonusActive = false;
  window.clearTimeout(balloonBonusTimer);
  window.clearTimeout(balloonPopTimer);
  pausedBonusRemaining = 0;
  pendingBonusEnd = false;
  ui.bonus.classList.add("hidden");
  ui.quiz.classList.remove("hidden");
  unlockAchievement("first-bonus");
  if (completedBonus) updateDailyGoalOnBonusComplete();
  if (questionNumber >= SESSION_QUESTION_COUNT) showSessionSummary();
  else showQuestion();
}

function renderAnswers() {
  ui.answers.innerHTML = "";
  currentAnswers.forEach(answer => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => answerQuestion(button, answer));
    ui.answers.append(button);
  });
}

function triggerMascotReaction(reactionClass) {
  ui.mascot.classList.remove("mascot-celebrate", "mascot-encourage");
  void ui.mascot.offsetWidth;
  ui.mascot.classList.add(reactionClass);
  window.setTimeout(() => ui.mascot.classList.remove(reactionClass), 800);
}

async function playQuestionSequence(keepInputDisabled = false) {
  if (isPaused || !currentQuestion) return false;
  const isQuickPlay = activeGameMode === QUICK_MODE && !keepInputDisabled;
  clearSpeech();
  const run = audioRun;
  setInputEnabled(false);
  await speech.speak(currentQuestion.questionPrompt ?? currentQuestion.prompt, ENGLISH_LANGUAGE);
  if (!isActiveAudio(run)) return false;
  if (isQuickPlay) setInputEnabled(true);
  await appUtils.wait(QUESTION_DELAY);
  const answerButtons = getAnswerButtons();
  for (let index = 0; index < answerButtons.length; index += 1) {
    if (!isActiveAudio(run)) return false;
    const button = answerButtons[index];
    button.classList.add("speaking-choice");
    await speech.speak(button.textContent, ENGLISH_LANGUAGE);
    button.classList.remove("speaking-choice");
    if (index < answerButtons.length - 1) await appUtils.wait(CHOICE_DELAY);
  }
  await appUtils.wait(QUESTION_DELAY);
  if (!isActiveAudio(run)) return false;
  await speech.speak(currentQuestion.questionPrompt ?? currentQuestion.prompt, ENGLISH_LANGUAGE);
  if (!isActiveAudio(run)) return false;
  if (!keepInputDisabled && !isQuickPlay) setInputEnabled(true);
  return true;
}

async function playWelcomeSequence() {
  if (isPaused || !isWelcomeSequenceActive) return false;
  const run = audioRun;
  const welcomeMessage = getPersonalizedWelcomeMessage();
  ui.feedback.textContent = welcomeMessage;
  ui.feedback.className = "feedback";
  await speech.speak(welcomeMessage, TURKISH_LANGUAGE);
  if (!isWelcomeSequenceActive || !isActiveAudio(run)) return false;
  if (!speech.turkishVoice) await appUtils.wait(400);
  if (!isWelcomeSequenceActive || !isActiveAudio(run)) return false;
  const modeMessage = activeGameMode === LEARNING_MODE ? "Bugün birlikte yeni şeyler öğreneceğiz." : "Hazırsan hızlı oyun başlıyor!";
  ui.feedback.textContent = modeMessage;
  await speech.speak(modeMessage, TURKISH_LANGUAGE);
  if (!isWelcomeSequenceActive || !isActiveAudio(run)) return false;
  if (!speech.turkishVoice) await appUtils.wait(400);
  if (!isWelcomeSequenceActive || !isActiveAudio(run)) return false;
  ui.feedback.textContent = "";
  isWelcomeSequenceActive = false;
  return true;
}

function showQuestion() {
  if (isPaused) return;
  clearSpeech();
  pendingCorrectTransition = false;
  wrongAttemptsForQuestion = 0;
  isRevealingCorrectAnswer = false;
  currentQuestion = engine.selectQuestion();
  currentAnswers = engine.getAnswers(currentQuestion);
  questionNumber += 1;
  ui.category.textContent = currentQuestion.label;
  ui.visual.textContent = currentQuestion.visual;
  ui.prompt.textContent = currentQuestion.questionPrompt ?? currentQuestion.prompt;
  ui.feedback.textContent = "";
  ui.feedback.className = "feedback";
  ui.next.classList.add("hidden");
  updateScoreboard();
  renderAnswers();
  saveGameProgress();
  playQuestionSequence();
}

async function showSessionSummary() {
  clearSpeech();
  stopWakeLock();
  const run = audioRun;
  stopPlayTime();
  clearSavedProgress();
  const celebrationMessage = getPersonalizedSessionMessage();
  ui.summaryStars.textContent = stars;
  ui.summaryCorrect.textContent = correctAnswers;
  ui.summaryStreak.textContent = bestStreak;
  ui.summaryCategory.textContent = engine.getFavoriteCategory();
  ui.summaryTitle.textContent = celebrationMessage;
  ui.summaryCopy.textContent = `${questionNumber} soru tamamlandı!`;
  ui.quiz.classList.add("hidden");
  ui.summary.classList.remove("hidden");
  animations.celebrate();
  audio.playCelebration();
  await appUtils.wait(450);
  if (!isActiveAudio(run)) return;
  await speech.speak(celebrationMessage, TURKISH_LANGUAGE);
  if (!isActiveAudio(run)) return;
  window.clearTimeout(sessionCelebrationTimer);
  sessionCelebrationTimer = window.setTimeout(() => {
    if (isActiveAudio(run)) startGame();
  }, SESSION_CELEBRATION_DURATION);
}

async function handleWrongAnswer(button) {
  if (isPaused || isRevealingCorrectAnswer) return;
  clearSpeech();
  const run = audioRun;
  wrongAttemptsForQuestion += 1;
  streak = 0;
  engine.recordResult(currentQuestion, false);
  updateParentData(false);
  saveLearningStats();
  saveGameProgress();
  triggerMascotReaction("mascot-encourage");
  button.classList.add("try-again-choice");
  ui.feedback.textContent = getRetryMessage();
  ui.feedback.className = "feedback try-again";
  updateScoreboard();
  setInputEnabled(false);
  await speech.speak(ui.feedback.textContent, TURKISH_LANGUAGE);
  if (!isActiveAudio(run)) return;
  button.classList.remove("try-again-choice");
  if (wrongAttemptsForQuestion < 2) {
    playQuestionSequence();
    return;
  }
  const correctButton = getAnswerButtons().find(answerButton => answerButton.textContent === currentQuestion.correct);
  correctButton?.classList.add("correct-answer-reveal");
  isRevealingCorrectAnswer = true;
  await appUtils.wait(900);
  if (!isActiveAudio(run)) return;
  isRevealingCorrectAnswer = false;
  showQuestion();
}

async function handleCorrectAnswer(button) {
  if (isPaused) return;
  clearSpeech();
  const run = audioRun;
  pendingCorrectTransition = true;
  stars += 1;
  if (stars % 10 === 0) awardSticker();
  streak += 1;
  bestStreak = Math.max(bestStreak, streak);
  correctAnswers += 1;
  engine.recordResult(currentQuestion, true);
  updateParentData(true);
  checkAchievements();
  updateDailyGoalOnCorrectAnswer();
  saveLearningStats();
  saveGameProgress(true);
  triggerMascotReaction("mascot-celebrate");
  button.classList.add("correct");
  setInputEnabled(false);
  const voiceEncouragement = shouldPlayVoiceEncouragement() ? getVoiceEncouragementMessage() : undefined;
  ui.feedback.textContent = voiceEncouragement?.message ?? getPersonalizedPraiseMessage();
  ui.feedback.className = "feedback success";
  updateScoreboard();
  ui.next.classList.add("hidden");
  animations.celebrate();
  audio.playSuccess();
  await appUtils.wait(300);
  if (!isActiveAudio(run)) return;
  if (voiceEncouragement) {
    lastVoiceEncouragement = voiceEncouragement.encouragement;
    correctAnswersSinceVoice = 0;
    await speech.speak(ui.feedback.textContent, TURKISH_LANGUAGE);
  }
  await appUtils.wait(SUCCESS_NEXT_DELAY);
  finishCorrectAnswer(run);
}

function finishCorrectAnswer(run) {
  if (!isActiveAudio(run) || !pendingCorrectTransition) return;
  pendingCorrectTransition = false;
  if (correctAnswers % BONUS_CORRECT_ANSWER_INTERVAL === 0) startBalloonBonus();
  else if (questionNumber >= SESSION_QUESTION_COUNT) showSessionSummary();
  else showQuestion();
}

function answerQuestion(button, answer) {
  if (isPaused || isSpeaking || button.disabled || pendingCorrectTransition || isRevealingCorrectAnswer) return;
  if (answer === currentQuestion.correct) handleCorrectAnswer(button);
  else handleWrongAnswer(button);
}

function resetSession() {
  stars = 0;
  streak = 0;
  bestStreak = 0;
  correctAnswers = 0;
  questionNumber = 0;
  currentAnswers = [];
  pendingCorrectTransition = false;
  correctAnswersSinceVoice = 2;
  lastVoiceEncouragement = "";
  wrongAttemptsForQuestion = 0;
  lastRetryMessage = "";
  isRevealingCorrectAnswer = false;
  clearSavedProgress();
  engine.resetSession();
}

async function startGame() {
  if (isPaused || isStartingGame || !selectedPlayer || (activeGameMode !== LEARNING_MODE && activeGameMode !== QUICK_MODE && activeGameMode !== MATCHING_MODE) || (activeGameMode !== MATCHING_MODE && activeCategoryPack === "custom" && !getPackCategories().length)) return;
  ensureDailyGoal();
  renderDailyGoal();
  window.clearTimeout(sessionCelebrationTimer);
  isStartingGame = true;
  try {
    [engine] = await Promise.all([gameReady, speech.ready]);
    if (activeGameMode === MATCHING_MODE) {
      startMatchingGame();
      return;
    }
    restoreStoredLearningStats();
    applyCategoryPack();
    ui.welcome.classList.add("hidden");
    ui.summary.classList.add("hidden");
    ui.quiz.classList.remove("hidden");
    resetSession();
    startPlayTime();
    startWakeLock();
    clearSpeech();
    isWelcomeSequenceActive = true;
    if (await playWelcomeSequence()) showQuestion();
  } finally {
    isStartingGame = false;
  }
}

function speakWelcome() {
  if (isPaused) return;
  clearSpeech();
  speech.speak(WELCOME_MESSAGE, TURKISH_LANGUAGE);
}

function goHome() {
  if (isPaused) return;
  clearSpeech();
  stopWakeLock();
  window.clearTimeout(sessionCelebrationTimer);
  window.clearTimeout(matchingFlipTimer);
  window.clearTimeout(matchingCompletionTimer);
  stopPlayTime();
  if (!ui.quiz.classList.contains("hidden")) saveGameProgress();
  isBalloonBonusActive = false;
  window.clearTimeout(balloonBonusTimer);
  window.clearTimeout(balloonPopTimer);
  pendingBonusEnd = false;
  isWelcomeSequenceActive = false;
  isRevealingCorrectAnswer = false;
  isMatchingGameActive = false;
  matchingCards = [];
  matchingOpenCards = [];
  matchingPendingFlip = false;
  ensureDailyGoal();
  renderDailyGoal();
  resetDailyGoalPopup();
  ui.quiz.classList.add("hidden");
  ui.bonus.classList.add("hidden");
  ui.summary.classList.add("hidden");
  ui.matching.classList.add("hidden");
  ui.welcome.classList.remove("hidden");
  speakWelcome();
}

ui.start.addEventListener("click", startGame);
ui.fullscreen.addEventListener("click", toggleFullscreen);
ui.achievements.addEventListener("click", openAchievements);
ui.welcomeSound.addEventListener("click", speakWelcome);
ui.learningMode.addEventListener("click", () => setGameMode(LEARNING_MODE));
ui.quickMode.addEventListener("click", () => setGameMode(QUICK_MODE));
ui.matchingMode.addEventListener("click", () => setGameMode(MATCHING_MODE));
ui.categoryPackButtons.forEach(button => button.addEventListener("click", () => setCategoryPack(button.dataset.categoryPack)));
ui.playerButtons.forEach(button => button.addEventListener("click", () => {
  if (button === ui.customPlayer) selectCustomPlayer();
  else selectPlayer(button.dataset.playerName);
}));
ui.customPlayerName.addEventListener("input", updateCustomPlayer);
ui.customPlayerName.addEventListener("keydown", event => {
  if (event.key === "Enter" && selectedPlayer && (activeGameMode === LEARNING_MODE || activeGameMode === QUICK_MODE)) startGame();
});
ui.home.addEventListener("click", goHome);
ui.matchingHome.addEventListener("click", goHome);
ui.matchingPause.addEventListener("click", pauseGame);
ui.replay.addEventListener("click", () => {
  if (!isPaused && !isSpeaking) playQuestionSequence();
});
ui.next.addEventListener("click", () => {
  if (!isPaused) showQuestion();
});
ui.playAgain.addEventListener("click", startGame);
ui.summaryHome.addEventListener("click", goHome);
ui.pause.addEventListener("click", pauseGame);
ui.bonusPause.addEventListener("click", pauseGame);
ui.resume.addEventListener("click", resumeGame);
ui.parentLogo.addEventListener("pointerdown", () => {
  window.clearTimeout(parentHoldTimer);
  parentHoldTimer = window.setTimeout(openParentDashboard, PARENT_HOLD_DURATION);
});
["pointerup", "pointercancel", "pointerleave"].forEach(eventName => ui.parentLogo.addEventListener(eventName, () => window.clearTimeout(parentHoldTimer)));
ui.parentDashboardClose.addEventListener("click", closeParentDashboard);
ui.achievementsModalClose.addEventListener("click", closeAchievements);
document.addEventListener("fullscreenchange", updateFullscreenButton);
document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") requestWakeLock();
  else releaseWakeLock();
});
window.addEventListener("pagehide", stopWakeLock);
document.addEventListener("pointerdown", event => {
  if (event.target.closest("button:not(:disabled)")) audio.playButton();
});
window.addEventListener("load", async () => {
  [engine] = await Promise.all([gameReady, speech.ready]);
  setGameMode(activeGameMode);
  restoreCategoryPack();
  applyCategoryPack();
  renderCategoryPackSelection();
  renderPlayerSelection();
  ensureDailyGoal();
  renderDailyGoal();
  restoreStoredLearningStats();
  if (!restoreSavedProgress()) window.setTimeout(speakWelcome, 400);
});

updateFullscreenButton();
