const DATA_INDEX_URL = "./data/index.json";
const SESSION_QUESTION_COUNT = 20;
const QUESTION_DELAY = 800;
const CHOICE_DELAY = 2000;
const SUCCESS_NEXT_DELAY = 1000;
const ENGLISH_LANGUAGE = "en-US";
const TURKISH_LANGUAGE = "tr-TR";
const WELCOME_MESSAGE = "Merhaba! Haydi oynayalım!";
const PRAISE_MESSAGES = [
  "Harika", "Süper", "Çok güzel", "Bravo", "Mükemmel", "Aferin", "İşte bu", "Harika gidiyorsun",
  "Çok iyi düşündün", "Bunu başardın", "Güzel seçim", "Aynen böyle", "Muhteşem", "Şahane",
  "Devam edelim", "Çok güzel ilerliyorsun", "Ne güzel öğrendin", "Çok iyi"
];
const RETRY_MESSAGES = [
  "Bir daha deneyelim 😊", "Yaklaştın!", "Hadi birlikte bulalım.", "Sorun değil.", "Devam edelim.",
  "Bu da öğrenmenin bir parçası.", "Tekrar bakalım.", "Birlikte deneyebiliriz."
];
const MOTIVATION_MESSAGES = ["Harika gidiyorsun!", "Çok güzel ilerliyorsun!", "Biraz daha devam edelim!", "Öğrenmek çok eğlenceli!"];
const COMPLETION_MESSAGES = [
  "Bu etkinliği tamamladın!", "Yeni şeyler öğrendin!", "Seninle gurur duyuyorum!",
  "Harika bir iş çıkardın!", "Çok güzel tamamladın!"
];
const STICKERS = ["⭐", "🌈", "🦋", "🦄", "🚀", "🐱", "🐶"];
const STICKER_STORAGE_KEY = "mila-learning-stickers";
const REWARD_POPUP_DURATION = 3000;
const PARENT_DATA_STORAGE_KEY = "mila-learning-parent-data";
const PARENT_HOLD_DURATION = 5000;
const SESSION_CELEBRATION_DURATION = 3500;
const BONUS_POP_TRANSITION_DELAY = 600;
const BONUS_WRONG_ANIMATION_DURATION = 450;
const GAME_PROGRESS_STORAGE_KEY = "mila-learning-progress";
const LEARNING_STATS_STORAGE_KEY = "mila-learning-learning-stats";
const BONUS_DURATION = 20000;
const BONUS_CORRECT_ANSWER_INTERVAL = 5;
const LEARNING_MODE = "learning";
const QUICK_MODE = "quick";
const MATCHING_MODE = "matching";
const LISTENING_MODE = "listening";
const NUMBER_MATCH_MODE = "number-match";
const COLOR_MATCH_MODE = "color-match";
const SORTING_MODE = "sorting";
const LISTENING_SESSION_ROUNDS = 5;
const NUMBER_MATCH_SESSION_ROUNDS = 10;
const COLOR_MATCH_SESSION_ROUNDS = 10;
const NUMBER_WORDS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const COLOR_MATCH_COLORS = [
  { name: "Red", className: "red" }, { name: "Blue", className: "blue" }, { name: "Green", className: "green" }, { name: "Yellow", className: "yellow" },
  { name: "Orange", className: "orange" }, { name: "Purple", className: "purple" }, { name: "Black", className: "black" }, { name: "White", className: "white" }
];
const SORTING_ITEMS = [
  { name: "Apple", visual: "🍎", group: "fruits" }, { name: "Banana", visual: "🍌", group: "fruits" }, { name: "Orange", visual: "🍊", group: "fruits" }, { name: "Strawberry", visual: "🍓", group: "fruits" },
  { name: "Dog", visual: "🐶", group: "animals" }, { name: "Cat", visual: "🐱", group: "animals" }, { name: "Lion", visual: "🦁", group: "animals" }, { name: "Elephant", visual: "🐘", group: "animals" }
];
const SORTING_DESTINATIONS = { fruits: { icon: "🍎", label: "Meyveler" }, animals: { icon: "🐾", label: "Hayvanlar" } };
const LISTENING_CATEGORIES = ["Fruits", "Animals", "Colors", "Numbers"];
const LISTENING_VISUALS = {
  Apple: "🍎", Banana: "🍌", Grape: "🍇", Grapes: "🍇", Orange: "🍊", Lemon: "🍋", Blueberry: "🫐", Kiwi: "🥝", Cherry: "🍒", Pear: "🍐", Peach: "🍑",
  Lion: "🦁", Elephant: "🐘", Cat: "🐱", Monkey: "🐒", Dog: "🐶", Bird: "🐦", Fish: "🐟", Tiger: "🐯", Bear: "🐻", Rabbit: "🐰"
};
const LISTENING_COLOR_VISUALS = { Blue: "🔵", Yellow: "🟡", Red: "🔴", Green: "🟢", Purple: "🟣", Orange: "🟠", Pink: "🩷", Brown: "🟤" };
const LISTENING_NUMBER_VISUALS = { One: "1️⃣", Two: "2️⃣", Three: "3️⃣", Four: "4️⃣", Five: "5️⃣", Six: "6️⃣", Seven: "7️⃣", Eight: "8️⃣" };
const MATCHING_CATEGORIES = [
  { id: "colors", label: "Renkler", icon: "🎨", symbols: Object.values(LISTENING_COLOR_VISUALS) },
  { id: "animals", label: "Hayvanlar", icon: "🐾", symbols: ["🦁", "🐘", "🐱", "🐒", "🐶", "🐦", "🐟", "🐯"] }
];
const GAME_MODE_STORAGE_KEY = "mila-learning-game-mode";
const PLAYER_STORAGE_KEY = "mila-learning-player";
const PLAYER_PROGRESS_MIGRATION_STORAGE_KEY = "mila-learning-player-progress-migrated";
const CATEGORY_PACK_STORAGE_KEY = "mila-learning-category-pack";
const LEARNING_PATH_PROGRESS_STORAGE_KEY = "mila-learning-path-progress";
const ACHIEVEMENT_STORAGE_KEY = "mila-learning-achievements";
const DAILY_GOAL_STORAGE_KEY = "mila-learning-daily-goal";
const LEARNING_PATH_STAGES = [
  { id: "colors", icon: "🎨", name: "Renkler", categories: ["Colors"] },
  { id: "numbers", icon: "🔢", name: "Sayılar", categories: ["Numbers"] },
  { id: "animals", icon: "🐾", name: "Hayvanlar", categories: ["Animals"] },
  { id: "fruits", icon: "🍎", name: "Meyveler", categories: ["Fruits"] },
  { id: "mixed-review", icon: "🌈", name: "Karışık Tekrar", categories: ["Colors", "Numbers", "Animals", "Fruits"] }
];
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
  shell: document.querySelector(".game-shell"), welcome: document.querySelector("#welcome-screen"), learningPath: document.querySelector("#learning-path-screen"), learningPathStages: document.querySelector("#learning-path-stages"), learningPathGuidance: document.querySelector("#learning-path-guidance"), learningPathEntry: document.querySelector("#learning-path-button"), learningPathHome: document.querySelector("#learning-path-home-button"), learningPathReturn: document.querySelector("#learning-path-return-button"), learningPathNext: document.querySelector("#learning-path-next-button"), learningPathNextLabel: document.querySelector("#learning-path-next-label"), learningPathCompletion: document.querySelector("#learning-path-completion"), learningPathCompletionIcon: document.querySelector("#learning-path-completion-icon"), learningPathCompletionStage: document.querySelector("#learning-path-completion-stage"), learningPathCompletionParticipation: document.querySelector("#learning-path-completion-participation"), learningPathCompletionCorrect: document.querySelector("#learning-path-completion-correct"), quiz: document.querySelector("#quiz-screen"), summary: document.querySelector("#summary-screen"),
  menuButton: document.querySelector("#menu-button"), gameMenu: document.querySelector("#game-menu"), menuItems: document.querySelectorAll("[data-menu-target]"), settings: document.querySelector("#settings-button"),
  start: document.querySelector("#start-button"), fullscreen: document.querySelector("#fullscreen-button"), achievements: document.querySelector("#achievements-button"), welcomeSound: document.querySelector("#welcome-sound-button"), learningMode: document.querySelector("#learning-mode-button"), quickMode: document.querySelector("#quick-mode-button"), matchingMode: document.querySelector("#matching-mode-button"), listeningMode: document.querySelector("#listening-mode-button"), numberMatchMode: document.querySelector("#number-match-mode-button"), colorMatchMode: document.querySelector("#color-match-mode-button"), sortingMode: document.querySelector("#sorting-mode-button"), playerButtons: document.querySelectorAll(".player-button"), customPlayer: document.querySelector("#custom-player-button"), customPlayerLabel: document.querySelector("#custom-player-label"), customPlayerName: document.querySelector("#custom-player-name"), categoryPackButtons: document.querySelectorAll(".category-pack-button"), customCategoryOptions: document.querySelector("#custom-category-options"), home: document.querySelector("#home-button"), replay: document.querySelector("#question-sound-button"), matching: document.querySelector("#matching-screen"), matchingCategorySelection: document.querySelector("#matching-category-selection"), matchingCategoryOptions: document.querySelector("#matching-category-options"), matchingGameArea: document.querySelector("#matching-game-area"), matchingCategoryLabel: document.querySelector("#matching-category-label"), matchingCards: document.querySelector("#matching-cards"), matchingCelebration: document.querySelector("#matching-celebration"), matchingFeedback: document.querySelector("#matching-feedback"), matchingCompletionActions: document.querySelector("#matching-completion-actions"), matchingCompletionTime: document.querySelector("#matching-completion-time"), matchingReplay: document.querySelector("#matching-replay-button"), matchingCategories: document.querySelector("#matching-categories-button"), matchingHome: document.querySelector("#matching-home-button"), matchingPause: document.querySelector("#matching-pause-button"), listening: document.querySelector("#listening-screen"), listeningCards: document.querySelector("#listening-cards"), listeningCelebration: document.querySelector("#listening-celebration"), listeningFeedback: document.querySelector("#listening-feedback"), listeningReplay: document.querySelector("#listening-replay-button"), listeningHome: document.querySelector("#listening-home-button"), listeningPause: document.querySelector("#listening-pause-button"), numberMatch: document.querySelector("#number-match-screen"), numberMatchCards: document.querySelector("#number-match-cards"), numberMatchCelebration: document.querySelector("#number-match-celebration"), numberMatchFeedback: document.querySelector("#number-match-feedback"), numberMatchReplay: document.querySelector("#number-match-replay-button"), numberMatchHome: document.querySelector("#number-match-home-button"), numberMatchPause: document.querySelector("#number-match-pause-button"), colorMatch: document.querySelector("#color-match-screen"), colorMatchCards: document.querySelector("#color-match-cards"), colorMatchCelebration: document.querySelector("#color-match-celebration"), colorMatchFeedback: document.querySelector("#color-match-feedback"), colorMatchWrittenPrompt: document.querySelector("#color-match-written-prompt"), colorMatchPrompt: document.querySelector("#color-match-prompt"), colorMatchWordListen: document.querySelector("#color-match-word-listen-button"), colorMatchReplay: document.querySelector("#color-match-replay-button"), colorMatchHome: document.querySelector("#color-match-home-button"), colorMatchPause: document.querySelector("#color-match-pause-button"), sorting: document.querySelector("#sorting-screen"), sortingItems: document.querySelector("#sorting-items"), sortingDestinations: document.querySelector("#sorting-destinations"), sortingCelebration: document.querySelector("#sorting-celebration"), sortingFeedback: document.querySelector("#sorting-feedback"), sortingHome: document.querySelector("#sorting-home-button"), sortingPause: document.querySelector("#sorting-pause-button"), sortingFinishHome: document.querySelector("#sorting-finish-home-button"),
  category: document.querySelector("#category-pill"), visual: document.querySelector("#question-visual"), celebration: document.querySelector("#celebration"), mascot: document.querySelector("#game-mascot"), prompt: document.querySelector("#question-prompt"),
  answers: document.querySelector("#answers"), feedback: document.querySelector("#feedback"), next: document.querySelector("#next-button"), count: document.querySelector("#question-count"), score: document.querySelector("#score"), streak: document.querySelector("#streak"), progress: document.querySelector("#progress-fill"),
  playAgain: document.querySelector("#play-again-button"), summaryHome: document.querySelector("#summary-home-button"), summaryStats: document.querySelector("#summary-stats"), summaryStars: document.querySelector("#summary-stars"), summaryCorrect: document.querySelector("#summary-correct"), summaryStreak: document.querySelector("#summary-streak"), summaryCategory: document.querySelector("#summary-category"), summaryTitle: document.querySelector("#summary-title"), summaryCopy: document.querySelector(".summary-copy"), rewardPopup: document.querySelector("#reward-popup"), rewardSticker: document.querySelector("#reward-sticker"), achievementPopup: document.querySelector("#achievement-popup"), achievementPopupIcon: document.querySelector("#achievement-popup-icon"), achievementPopupTitle: document.querySelector("#achievement-popup-title"), dailyGoalCard: document.querySelector("#daily-goal-card"), dailyGoalTitle: document.querySelector("#daily-goal-title"), dailyGoalProgress: document.querySelector("#daily-goal-progress"), dailyGoalPopup: document.querySelector("#daily-goal-popup"), achievementsModal: document.querySelector("#achievements-modal"), achievementsModalClose: document.querySelector("#achievements-modal-close"), achievementsList: document.querySelector("#achievements-list"), rewardsStarCount: document.querySelector("#rewards-star-count"), stickersList: document.querySelector("#stickers-list"), bonus: document.querySelector("#balloon-bonus"), balloonHome: document.querySelector("#bonus-home-button"), balloonTarget: document.querySelector("#balloon-target"), balloons: document.querySelector("#balloons"), pause: document.querySelector("#pause-button"), bonusPause: document.querySelector("#bonus-pause-button"), pauseOverlay: document.querySelector("#pause-overlay"), resume: document.querySelector("#resume-button"), parentLogo: document.querySelector("#welcome-title"), parentDashboard: document.querySelector("#parent-dashboard"), parentDashboardClose: document.querySelector("#parent-dashboard-close"), parentDashboardTitle: document.querySelector("#parent-dashboard-title"), parentPlayTime: document.querySelector("#parent-play-time"), parentQuestions: document.querySelector("#parent-questions"), parentCorrect: document.querySelector("#parent-correct"), parentCategory: document.querySelector("#parent-category"), parentStreak: document.querySelector("#parent-streak"), parentDifficultWords: document.querySelector("#parent-difficult-words")
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
let balloonAnimationTimers = new Set();
let pendingCorrectTransition = false;
let pendingBonusEnd = false;
let activeGameMode = LEARNING_MODE;
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
let mascotReactionTimer;
let correctAnswersSinceVoice = 2;
let wrongAttemptsForQuestion = 0;
let encouragementHistory = {};
let isRevealingCorrectAnswer = false;
let isMatchingGameActive = false;
let matchingCards = [];
let matchingOpenCards = [];
let matchingPairsFound = 0;
let matchingPendingFlip = false;
let matchingFlipTimer;
let matchingCompletionTimer;
let matchingSelectedCategory = MATCHING_CATEGORIES[0].id;
let matchingElapsedMs = 0;
let matchingTimerStartedAt = 0;
let isMatchingSessionStarting = false;
let isGameNavigationBusy = false;
let isListeningGameActive = false;
let currentListeningQuestion;
let listeningAnswers = [];
let listeningRound = 0;
let listeningWrongAttempts = 0;
let listeningPreviousQuestion;
let isListeningSpeaking = false;
let isListeningTransitioning = false;
let isListeningRevealing = false;
let listeningWrongIndex;
let isListeningWrongFeedback = false;
let listeningCompletionTimer;
let isNumberMatchGameActive = false;
let numberMatchQuestions = [];
let currentNumberMatchQuestion;
let numberMatchAnswers = [];
let numberMatchRound = 0;
let numberMatchWrongAttempts = 0;
let isNumberMatchSpeaking = false;
let isNumberMatchTransitioning = false;
let isNumberMatchRevealing = false;
let numberMatchWrongIndex;
let isNumberMatchWrongFeedback = false;
let numberMatchCompletionTimer;
let isColorMatchGameActive = false;
let currentColorMatchQuestion;
let colorMatchAnswers = [];
let colorMatchRound = 0;
let colorMatchWrongAttempts = 0;
let colorMatchPreviousQuestion;
let isColorMatchSpeechRound = false;
let isColorMatchSpeaking = false;
let isColorMatchTransitioning = false;
let isColorMatchRevealing = false;
let colorMatchWrongIndex;
let isColorMatchWrongFeedback = false;
let colorMatchCompletionTimer;
let isSortingGameActive = false;
let sortingItems = [];
let sortingDestinationOrder = [];
let selectedSortingItem;
let activeSortingDrag;
let isSortingProcessing = false;
let isSortingCompleted = false;
let activeLearningPathStage;
let learningPathQuestionPlan = [];
let isLearningPathSessionCompleted = false;
let learningPathPreviousGameMode;
let isSessionSummaryShowing = false;
let learningPathConsecutiveMissedQuestions = 0;
let isLearningPathRecoveryQuestion = false;
let learningPathQuestionPhase = "variety";

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

function loadLearningPathProgress() {
  try {
    const storageKey = getPlayerStorageKey(LEARNING_PATH_PROGRESS_STORAGE_KEY);
    const savedData = storageKey ? JSON.parse(window.localStorage.getItem(storageKey)) : undefined;
    const completed = savedData?.completed;
    if (!completed || typeof completed !== "object" || Array.isArray(completed)) return { completed: {} };
    return {
      completed: LEARNING_PATH_STAGES.reduce((validProgress, stage) => {
        if (completed[stage.id] === true) validProgress[stage.id] = true;
        return validProgress;
      }, {})
    };
  } catch {
    return { completed: {} };
  }
}

function completeLearningPathStage() {
  if (!activeLearningPathStage || isLearningPathSessionCompleted) return;
  isLearningPathSessionCompleted = true;
  const progress = loadLearningPathProgress();
  if (progress.completed[activeLearningPathStage.id]) return;
  progress.completed[activeLearningPathStage.id] = true;
  try {
    const storageKey = getPlayerStorageKey(LEARNING_PATH_PROGRESS_STORAGE_KEY);
    if (storageKey) window.localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function getRecommendedLearningPathStage(progress) {
  return LEARNING_PATH_STAGES.find(stage => !progress.completed[stage.id]) ?? LEARNING_PATH_STAGES[LEARNING_PATH_STAGES.length - 1];
}

function renderLearningPath() {
  const progress = loadLearningPathProgress();
  const recommendedStage = getRecommendedLearningPathStage(progress);
  const completedCount = LEARNING_PATH_STAGES.filter(stage => progress.completed[stage.id]).length;
  const allStagesCompleted = completedCount === LEARNING_PATH_STAGES.length;
  ui.learningPathGuidance.textContent = allStagesCompleted
    ? "🌟 Tüm bölümleri tamamladın! İstersen tekrar oynayabilirsin."
    : completedCount > 0
      ? "Harika gidiyorsun! Sıradaki bölüm seni bekliyor."
      : "Bir bölüm seç ve öğrenmeye başla!";
  ui.learningPathStages.textContent = "";
  LEARNING_PATH_STAGES.forEach((stage, index) => {
    const isCompleted = progress.completed[stage.id] === true;
    const isRecommended = stage === recommendedStage;
    const button = document.createElement("button");
    button.className = `learning-path-stage${isCompleted ? " completed" : ""}${isRecommended ? " recommended" : ""}`;
    button.type = "button";
    button.dataset.learningPathStage = stage.id;
    button.setAttribute("aria-label", `${index + 1}. ${stage.name}. ${isCompleted ? `Tamamlandı.${isRecommended ? " Sıradaki." : ""} Tekrar Oyna` : isRecommended ? "Sıradaki. Başla" : "Başla"}.`);
    const completedProgress = isCompleted
      ? `<span class="learning-path-stage-progress" role="progressbar" aria-label="${stage.name} bölümü tamamlandı" aria-valuemin="0" aria-valuemax="${getSessionQuestionCount()}" aria-valuenow="${getSessionQuestionCount()}"><span aria-hidden="true"><i></i></span><small>${getSessionQuestionCount()} / ${getSessionQuestionCount()}</small></span>`
      : "";
    const stageAction = isCompleted
      ? `<span class="learning-path-stage-actions">${isRecommended ? '<span class="learning-path-recommended">⭐ Sıradaki</span>' : ""}<span class="learning-path-stage-action">↻ Tekrar Oyna</span></span>`
      : isRecommended ? '<span class="learning-path-stage-action">⭐ Sıradaki</span>' : "";
    button.innerHTML = `<span class="learning-path-stage-number">${index + 1}</span><span class="learning-path-stage-icon" aria-hidden="true">${stage.icon}</span><span class="learning-path-stage-content"><strong class="learning-path-stage-name">${stage.name}</strong><span class="learning-path-stage-status">${isCompleted ? "✓ Tamamlandı" : "Başla"}</span>${completedProgress}</span>${stageAction}`;
    button.addEventListener("click", () => startLearningPathStage(stage.id));
    ui.learningPathStages.append(button);
  });
}

function renderLearningPathCompletion(completionMessage) {
  const isLearningPathCompletion = Boolean(activeLearningPathStage);
  ui.learningPathCompletion.classList.toggle("hidden", !isLearningPathCompletion);
  ui.summaryStats.classList.toggle("hidden", isLearningPathCompletion);
  ui.learningPathReturn.classList.toggle("hidden", !isLearningPathCompletion);
  ui.learningPathNext.classList.toggle("hidden", !isLearningPathCompletion);
  ui.playAgain.innerHTML = isLearningPathCompletion ? 'Tekrar Oyna <span aria-hidden="true">↻</span>' : 'Yeniden oyna <span aria-hidden="true">↻</span>';
  ui.playAgain.setAttribute("aria-label", isLearningPathCompletion ? `${activeLearningPathStage.name} bölümünü tekrar oyna` : "Yeniden oyna");
  if (!isLearningPathCompletion) return;
  const recommendedStage = getRecommendedLearningPathStage(loadLearningPathProgress());
  ui.summaryTitle.textContent = completionMessage ?? getCompletionMessage();
  ui.summaryCopy.textContent = "Yeni şeyler öğreniyorsun!";
  ui.learningPathCompletionIcon.textContent = activeLearningPathStage.icon;
  ui.learningPathCompletionStage.textContent = `${activeLearningPathStage.name} bölümünü bitirdin!`;
  ui.learningPathCompletionParticipation.textContent = `${questionNumber} soruyu tamamladın`;
  ui.learningPathCompletionCorrect.textContent = `${correctAnswers} doğru cevap`;
  ui.learningPathCompletion.setAttribute("aria-label", `${activeLearningPathStage.name} bölümü tamamlandı. ${questionNumber} soru tamamlandı.`);
  ui.learningPathNext.dataset.learningPathStage = recommendedStage.id;
  ui.learningPathNextLabel.textContent = `Sonraki: ${recommendedStage.icon} ${recommendedStage.name}`;
  ui.learningPathNext.setAttribute("aria-label", `Sıradaki bölüm: ${recommendedStage.name}`);
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
  if (isSupported) ui.fullscreen.textContent = getFullscreenElement() ? "⛶ Tam Ekrandan Çık" : "⛶ Tam Ekran";
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

function getSessionQuestionCount() {
  return SESSION_QUESTION_COUNT;
}

function prepareLearningPathQuestionPlan() {
  learningPathQuestionPlan = activeLearningPathStage ? engine.createSessionPlan(activeLearningPathStage.categories, getSessionQuestionCount(), { gentleProgression: true }) : [];
}

function selectNextQuestion() {
  learningPathQuestionPhase = activeLearningPathStage ? engine.getSessionPhase(questionNumber, getSessionQuestionCount()) : "variety";
  let plannedQuestion = activeLearningPathStage ? learningPathQuestionPlan[questionNumber] : undefined;
  isLearningPathRecoveryQuestion = false;
  if (activeLearningPathStage && learningPathConsecutiveMissedQuestions >= 2) {
    const recoveryCategory = plannedQuestion?.category ?? activeLearningPathStage.categories[0];
    const recoveryQuestion = engine.getFamiliarQuestion(recoveryCategory, currentQuestion);
    if (recoveryQuestion) {
      plannedQuestion = recoveryQuestion;
      isLearningPathRecoveryQuestion = true;
      learningPathConsecutiveMissedQuestions = 0;
    }
  }
  if (plannedQuestion) return engine.prepareQuestion(plannedQuestion);
  if (!activeLearningPathStage) {
    applyCategoryPack();
  } else {
    engine.setActiveCategories(activeLearningPathStage.categories);
  }
  return engine.selectQuestion();
}

function updateStartButton() {
  const hasGameMode = activeGameMode === LEARNING_MODE || activeGameMode === QUICK_MODE || activeGameMode === MATCHING_MODE || activeGameMode === LISTENING_MODE || activeGameMode === NUMBER_MATCH_MODE || activeGameMode === COLOR_MATCH_MODE || activeGameMode === SORTING_MODE;
  ui.start.disabled = !hasGameMode || (activeGameMode !== MATCHING_MODE && activeGameMode !== LISTENING_MODE && activeGameMode !== NUMBER_MATCH_MODE && activeGameMode !== COLOR_MATCH_MODE && activeGameMode !== SORTING_MODE && activeCategoryPack === "custom" && !getPackCategories().length);
}

function getPersonalizedWelcomeMessage() {
  return WELCOME_MESSAGE;
}

function getPersonalizedBonusMessage() {
  return selectedPlayer ? `Harika gidiyorsun ${selectedPlayer}! Bonus zamanı!` : "Harika gidiyorsun! Bonus zamanı!";
}

function getPersonalizedSessionMessage() {
  const completionMessage = getCompletionMessage();
  return selectedPlayer ? `${selectedPlayer}! ${completionMessage}` : completionMessage;
}

function selectEncouragementMessage(messages, kind) {
  if (!messages.length) return "";
  const choices = messages.filter(message => message !== encouragementHistory[kind]);
  const message = appUtils.randomItem(choices.length ? choices : messages);
  encouragementHistory[kind] = message;
  return message;
}

function resetEncouragementState() {
  encouragementHistory = {};
  correctAnswersSinceVoice = 2;
}

function getPersonalizedPraiseMessage() {
  const praiseMessage = selectEncouragementMessage(PRAISE_MESSAGES, "correct");
  return selectedPlayer ? `${praiseMessage} ${selectedPlayer}!` : `${praiseMessage}!`;
}

function getRetryMessage() {
  return selectEncouragementMessage(RETRY_MESSAGES, "retry");
}

function getCompletionMessage() {
  return selectEncouragementMessage(COMPLETION_MESSAGES, "completion");
}

function getCorrectFeedbackMessage(progress = 0, total = 0) {
  const praiseMessage = getPersonalizedPraiseMessage();
  const shouldAddMotivation = total >= 10 && progress > 1 && progress < total && progress % 5 === 0;
  if (!shouldAddMotivation) return praiseMessage;
  return `${praiseMessage} ${selectEncouragementMessage(MOTIVATION_MESSAGES, "motivation")}`;
}

function shouldPlayVoiceEncouragement() {
  correctAnswersSinceVoice += 1;
  return correctAnswersSinceVoice >= 3 && Math.random() < .3;
}

function getVoiceEncouragementMessage() {
  const encouragement = selectEncouragementMessage(PRAISE_MESSAGES, "correct");
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
  resetEncouragementState();
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
  if (!ui.learningPath.classList.contains("hidden")) renderLearningPath();
}

function selectCustomPlayer() {
  selectedPlayer = undefined;
  resetEncouragementState();
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
    resetEncouragementState();
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
    if (!ui.learningPath.classList.contains("hidden")) renderLearningPath();
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
    return savedMode === QUICK_MODE || savedMode === LEARNING_MODE || savedMode === MATCHING_MODE || savedMode === LISTENING_MODE || savedMode === NUMBER_MATCH_MODE || savedMode === COLOR_MATCH_MODE || savedMode === SORTING_MODE ? savedMode : LEARNING_MODE;
  } catch {
    return LEARNING_MODE;
  }
}

function setGameMode(mode) {
  if (isPaused || (mode !== LEARNING_MODE && mode !== QUICK_MODE && mode !== MATCHING_MODE && mode !== LISTENING_MODE && mode !== NUMBER_MATCH_MODE && mode !== COLOR_MATCH_MODE && mode !== SORTING_MODE)) return;
  activeGameMode = mode;
  ui.learningMode.setAttribute("aria-pressed", String(mode === LEARNING_MODE));
  ui.quickMode.setAttribute("aria-pressed", String(mode === QUICK_MODE));
  ui.matchingMode.setAttribute("aria-pressed", String(mode === MATCHING_MODE));
  ui.listeningMode.setAttribute("aria-pressed", String(mode === LISTENING_MODE));
  ui.numberMatchMode.setAttribute("aria-pressed", String(mode === NUMBER_MATCH_MODE));
  ui.colorMatchMode.setAttribute("aria-pressed", String(mode === COLOR_MATCH_MODE));
  ui.sortingMode.setAttribute("aria-pressed", String(mode === SORTING_MODE));
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
    if (questionNumber >= getSessionQuestionCount()) showSessionSummary();
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
  ui.matchingReplay.disabled = isMatchingSessionStarting;
}

function startMatchingTimer() {
  if (!isMatchingGameActive || matchingTimerStartedAt) return;
  matchingTimerStartedAt = Date.now();
}

function stopMatchingTimer() {
  if (!matchingTimerStartedAt) return;
  matchingElapsedMs += Date.now() - matchingTimerStartedAt;
  matchingTimerStartedAt = 0;
}

function formatMatchingTime(milliseconds) {
  const totalSeconds = Math.max(1, Math.round(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes ? `${minutes} dk ${String(seconds).padStart(2, "0")} sn` : `${seconds} saniye`;
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
  stopMatchingTimer();
  isMatchingGameActive = false;
  matchingPendingFlip = true;
  parentData.matchingPairsCompleted += 1;
  saveParentData();
  ui.matchingFeedback.textContent = getCompletionMessage();
  ui.matchingCompletionTime.textContent = `Tamamlama süren: ${formatMatchingTime(matchingElapsedMs)}`;
  ui.matchingCompletionActions.classList.remove("hidden");
  renderMatchingCards();
  animations.celebrate();
  ui.matchingCelebration.innerHTML = ui.celebration.innerHTML;
  ui.matchingCelebration.classList.remove("burst");
  void ui.matchingCelebration.offsetWidth;
  ui.matchingCelebration.classList.add("burst");
  audio.playCelebration();
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
    ui.matchingFeedback.textContent = getCorrectFeedbackMessage();
    renderMatchingCards();
    audio.playSuccess();
    if (matchingPairsFound === 8) completeMatchingGame();
    return;
  }
  matchingPendingFlip = true;
  ui.matchingFeedback.textContent = getRetryMessage();
  renderMatchingCards();
  scheduleMatchingFlip();
}

function renderMatchingCategoryOptions() {
  ui.matchingCategoryOptions.textContent = "";
  MATCHING_CATEGORIES.forEach(category => {
    const button = document.createElement("button");
    button.className = "matching-category-button";
    button.type = "button";
    button.innerHTML = `<span aria-hidden="true">${category.icon}</span>${category.label}`;
    button.disabled = isMatchingSessionStarting;
    button.addEventListener("click", () => startMatchingSession(category.id));
    ui.matchingCategoryOptions.append(button);
  });
}

function showMatchingCategorySelection() {
  stopMatchingTimer();
  isMatchingGameActive = false;
  matchingCards = [];
  matchingOpenCards = [];
  matchingPairsFound = 0;
  matchingPendingFlip = false;
  window.clearTimeout(matchingFlipTimer);
  window.clearTimeout(matchingCompletionTimer);
  ui.matchingCards.textContent = "";
  ui.matchingCelebration.classList.remove("burst");
  ui.matchingCelebration.textContent = "";
  ui.matchingCompletionActions.classList.add("hidden");
  ui.matchingGameArea.classList.add("hidden");
  ui.matchingCategorySelection.classList.remove("hidden");
  ui.matchingPause.disabled = true;
  renderMatchingCategoryOptions();
}

function startMatchingSession(categoryId = matchingSelectedCategory) {
  if (isMatchingSessionStarting || isMatchingGameActive) return;
  const category = MATCHING_CATEGORIES.find(item => item.id === categoryId);
  if (!category || category.symbols.length < 8) return;
  isMatchingSessionStarting = true;
  matchingSelectedCategory = category.id;
  isMatchingGameActive = true;
  matchingCards = appUtils.shuffle(category.symbols.slice(0, 8).flatMap(symbol => [symbol, symbol])).map(symbol => ({ symbol, revealed: false, completed: false }));
  matchingOpenCards = [];
  matchingPairsFound = 0;
  matchingPendingFlip = false;
  matchingElapsedMs = 0;
  matchingTimerStartedAt = 0;
  window.clearTimeout(matchingFlipTimer);
  window.clearTimeout(matchingCompletionTimer);
  clearSpeech();
  animations.clear();
  ui.matchingCelebration.classList.remove("burst");
  ui.matchingCelebration.textContent = "";
  ui.matchingCategorySelection.classList.add("hidden");
  ui.matchingGameArea.classList.remove("hidden");
  ui.matchingCompletionActions.classList.add("hidden");
  ui.matchingCategoryLabel.textContent = category.label;
  ui.matchingFeedback.textContent = "İki kartı aç.";
  ui.matchingPause.disabled = false;
  renderMatchingCards();
  startMatchingTimer();
  isMatchingSessionStarting = false;
}

function startMatchingGame() {
  isGameNavigationBusy = false;
  isMatchingSessionStarting = false;
  matchingElapsedMs = 0;
  matchingTimerStartedAt = 0;
  clearSpeech();
  ui.welcome.classList.add("hidden");
  ui.quiz.classList.add("hidden");
  ui.listening.classList.add("hidden");
  ui.numberMatch.classList.add("hidden");
  ui.colorMatch.classList.add("hidden");
  ui.sorting.classList.add("hidden");
  ui.summary.classList.add("hidden");
  ui.bonus.classList.add("hidden");
  ui.matching.classList.remove("hidden");
  showMatchingCategorySelection();
  startPlayTime();
  startWakeLock();
}

function getListeningVisual(answer, category) {
  const matchingQuestion = engine.questions.find(question => question.category === category && question.correct === answer);
  if (matchingQuestion?.visual) return matchingQuestion.visual;
  if (category === "Colors") return LISTENING_COLOR_VISUALS[answer] ?? "🎨";
  if (category === "Numbers") return LISTENING_NUMBER_VISUALS[answer] ?? "🔢";
  return LISTENING_VISUALS[answer] ?? "❔";
}

function selectListeningQuestion() {
  const questions = engine.questions.filter(question => LISTENING_CATEGORIES.includes(question.category) && new Set([question.correct, ...(question.answers ?? [])]).size >= 4);
  const freshQuestions = questions.filter(question => question !== listeningPreviousQuestion);
  const question = appUtils.randomItem(freshQuestions.length ? freshQuestions : questions);
  listeningPreviousQuestion = question;
  return question;
}

function renderListeningCards() {
  ui.listeningCards.textContent = "";
  listeningAnswers.forEach((answer, index) => {
    const button = document.createElement("button");
    const isCorrect = answer === currentListeningQuestion?.correct;
    button.className = `listening-card${isListeningTransitioning && isCorrect ? " correct" : ""}${isListeningRevealing && isCorrect ? " correct-answer-reveal" : ""}${listeningWrongIndex === index ? " try-again-choice" : ""}`;
    button.type = "button";
    button.textContent = getListeningVisual(answer, currentListeningQuestion.category);
    button.setAttribute("aria-label", "Seçenek");
    button.disabled = isPaused || isListeningSpeaking || isListeningTransitioning || isListeningRevealing;
    button.addEventListener("click", () => answerListeningQuestion(index));
    ui.listeningCards.append(button);
  });
  ui.listeningReplay.disabled = isPaused || isListeningSpeaking || isListeningTransitioning || isListeningRevealing;
}

async function speakListeningWord() {
  if (!isListeningGameActive || isPaused || !currentListeningQuestion) return;
  clearSpeech();
  const run = audioRun;
  isListeningSpeaking = true;
  renderListeningCards();
  await speech.speak(currentListeningQuestion.correct, ENGLISH_LANGUAGE);
  if (!isListeningGameActive || !isActiveAudio(run)) return;
  isListeningSpeaking = false;
  renderListeningCards();
}

function finishListeningGame() {
  if (!isListeningGameActive) return;
  isListeningGameActive = false;
  isListeningTransitioning = true;
  ui.listeningFeedback.textContent = getCompletionMessage();
  renderListeningCards();
  animations.celebrate();
  ui.listeningCelebration.innerHTML = ui.celebration.innerHTML;
  ui.listeningCelebration.classList.remove("burst");
  void ui.listeningCelebration.offsetWidth;
  ui.listeningCelebration.classList.add("burst");
  audio.playCelebration();
  window.clearTimeout(listeningCompletionTimer);
  listeningCompletionTimer = window.setTimeout(goHome, 1400);
}

function showListeningRound() {
  if (!isListeningGameActive || isPaused) return;
  currentListeningQuestion = selectListeningQuestion();
  if (!currentListeningQuestion) {
    finishListeningGame();
    return;
  }
  listeningRound += 1;
  listeningAnswers = appUtils.shuffle([...new Set([currentListeningQuestion.correct, ...(currentListeningQuestion.answers ?? [])])].slice(0, 4));
  listeningWrongAttempts = 0;
  listeningWrongIndex = undefined;
  isListeningTransitioning = false;
  isListeningRevealing = false;
  ui.listeningFeedback.textContent = `Dinle ve doğru resmi seç. ${listeningRound}/${LISTENING_SESSION_ROUNDS}`;
  renderListeningCards();
  speakListeningWord();
}

async function handleListeningWrongAnswer(index) {
  if (!isListeningGameActive || isPaused || isListeningSpeaking || isListeningTransitioning || isListeningRevealing) return;
  clearSpeech();
  const run = audioRun;
  listeningWrongAttempts += 1;
  listeningWrongIndex = index;
  isListeningWrongFeedback = true;
  isListeningSpeaking = true;
  ui.listeningFeedback.textContent = getRetryMessage();
  renderListeningCards();
  await speech.speak(ui.listeningFeedback.textContent, TURKISH_LANGUAGE);
  if (!isListeningGameActive || !isActiveAudio(run)) return;
  listeningWrongIndex = undefined;
  isListeningWrongFeedback = false;
  isListeningSpeaking = false;
  if (listeningWrongAttempts < 2) {
    renderListeningCards();
    return;
  }
  revealListeningAnswer(run);
}

async function revealListeningAnswer(run = audioRun) {
  isListeningRevealing = true;
  renderListeningCards();
  await appUtils.wait(900);
  if (!isListeningGameActive || !isActiveAudio(run)) return;
  showListeningRound();
}

async function handleListeningCorrectAnswer() {
  if (!isListeningGameActive || isPaused || isListeningSpeaking || isListeningTransitioning || isListeningRevealing) return;
  clearSpeech();
  const run = audioRun;
  isListeningTransitioning = true;
  ui.listeningFeedback.textContent = getCorrectFeedbackMessage(listeningRound, LISTENING_SESSION_ROUNDS);
  renderListeningCards();
  animations.celebrate();
  ui.listeningCelebration.innerHTML = ui.celebration.innerHTML;
  ui.listeningCelebration.classList.remove("burst");
  void ui.listeningCelebration.offsetWidth;
  ui.listeningCelebration.classList.add("burst");
  audio.playSuccess();
  await appUtils.wait(800);
  if (!isListeningGameActive || !isActiveAudio(run)) return;
  if (listeningRound >= LISTENING_SESSION_ROUNDS) finishListeningGame();
  else showListeningRound();
}

function answerListeningQuestion(index) {
  if (!isListeningGameActive || isPaused || isListeningSpeaking || isListeningTransitioning || isListeningRevealing) return;
  if (listeningAnswers[index] === currentListeningQuestion.correct) handleListeningCorrectAnswer();
  else handleListeningWrongAnswer(index);
}

function startListeningGame() {
  isListeningGameActive = true;
  currentListeningQuestion = undefined;
  listeningAnswers = [];
  listeningRound = 0;
  listeningWrongAttempts = 0;
  listeningPreviousQuestion = undefined;
  isListeningSpeaking = false;
  isListeningTransitioning = false;
  isListeningRevealing = false;
  listeningWrongIndex = undefined;
  isListeningWrongFeedback = false;
  window.clearTimeout(listeningCompletionTimer);
  clearSpeech();
  ui.welcome.classList.add("hidden");
  ui.quiz.classList.add("hidden");
  ui.matching.classList.add("hidden");
  ui.summary.classList.add("hidden");
  ui.bonus.classList.add("hidden");
  ui.listening.classList.remove("hidden");
  startPlayTime();
  startWakeLock();
  showListeningRound();
}

function renderNumberMatchCards() {
  ui.numberMatchCards.textContent = "";
  numberMatchAnswers.forEach((answer, index) => {
    const button = document.createElement("button");
    const isCorrect = answer === currentNumberMatchQuestion;
    button.className = `number-match-card${isNumberMatchTransitioning && isCorrect ? " correct" : ""}${isNumberMatchRevealing && isCorrect ? " correct-answer-reveal" : ""}${numberMatchWrongIndex === index ? " try-again-choice" : ""}`;
    button.type = "button";
    button.textContent = answer;
    button.setAttribute("aria-label", `${answer}`);
    button.disabled = isPaused || isNumberMatchSpeaking || isNumberMatchTransitioning || isNumberMatchRevealing;
    button.addEventListener("click", () => answerNumberMatchQuestion(index));
    ui.numberMatchCards.append(button);
  });
  ui.numberMatchReplay.disabled = isPaused || isNumberMatchSpeaking || isNumberMatchTransitioning || isNumberMatchRevealing;
}

async function speakNumberMatchNumber() {
  if (!isNumberMatchGameActive || isPaused || !currentNumberMatchQuestion) return;
  clearSpeech();
  const run = audioRun;
  isNumberMatchSpeaking = true;
  renderNumberMatchCards();
  await speech.speak(NUMBER_WORDS[currentNumberMatchQuestion - 1], ENGLISH_LANGUAGE);
  if (!isNumberMatchGameActive || !isActiveAudio(run)) return;
  isNumberMatchSpeaking = false;
  renderNumberMatchCards();
}

function finishNumberMatchGame() {
  if (!isNumberMatchGameActive) return;
  isNumberMatchGameActive = false;
  isNumberMatchTransitioning = true;
  ui.numberMatchFeedback.textContent = getCompletionMessage();
  renderNumberMatchCards();
  animations.celebrate();
  ui.numberMatchCelebration.innerHTML = ui.celebration.innerHTML;
  ui.numberMatchCelebration.classList.remove("burst");
  void ui.numberMatchCelebration.offsetWidth;
  ui.numberMatchCelebration.classList.add("burst");
  audio.playCelebration();
  window.clearTimeout(numberMatchCompletionTimer);
  numberMatchCompletionTimer = window.setTimeout(goHome, 1400);
}

function showNumberMatchRound() {
  if (!isNumberMatchGameActive || isPaused) return;
  currentNumberMatchQuestion = numberMatchQuestions[numberMatchRound];
  if (!currentNumberMatchQuestion) {
    finishNumberMatchGame();
    return;
  }
  numberMatchRound += 1;
  const distractors = appUtils.shuffle(NUMBER_WORDS.map((_, index) => index + 1).filter(number => number !== currentNumberMatchQuestion)).slice(0, 3);
  numberMatchAnswers = appUtils.shuffle([currentNumberMatchQuestion, ...distractors]);
  numberMatchWrongAttempts = 0;
  numberMatchWrongIndex = undefined;
  isNumberMatchTransitioning = false;
  isNumberMatchRevealing = false;
  ui.numberMatchFeedback.textContent = `Sayıyı dinle ve doğru rakamı seç. ${numberMatchRound}/${NUMBER_MATCH_SESSION_ROUNDS}`;
  renderNumberMatchCards();
  speakNumberMatchNumber();
}

async function handleNumberMatchWrongAnswer(index) {
  if (!isNumberMatchGameActive || isPaused || isNumberMatchSpeaking || isNumberMatchTransitioning || isNumberMatchRevealing) return;
  clearSpeech();
  const run = audioRun;
  numberMatchWrongAttempts += 1;
  numberMatchWrongIndex = index;
  isNumberMatchWrongFeedback = true;
  isNumberMatchSpeaking = true;
  ui.numberMatchFeedback.textContent = getRetryMessage();
  renderNumberMatchCards();
  await speech.speak(ui.numberMatchFeedback.textContent, TURKISH_LANGUAGE);
  if (!isNumberMatchGameActive || !isActiveAudio(run)) return;
  numberMatchWrongIndex = undefined;
  isNumberMatchWrongFeedback = false;
  isNumberMatchSpeaking = false;
  if (numberMatchWrongAttempts < 2) {
    renderNumberMatchCards();
    return;
  }
  revealNumberMatchAnswer(run);
}

async function revealNumberMatchAnswer(run = audioRun) {
  isNumberMatchRevealing = true;
  renderNumberMatchCards();
  await appUtils.wait(900);
  if (!isNumberMatchGameActive || !isActiveAudio(run)) return;
  showNumberMatchRound();
}

async function handleNumberMatchCorrectAnswer() {
  if (!isNumberMatchGameActive || isPaused || isNumberMatchSpeaking || isNumberMatchTransitioning || isNumberMatchRevealing) return;
  clearSpeech();
  const run = audioRun;
  isNumberMatchTransitioning = true;
  ui.numberMatchFeedback.textContent = getCorrectFeedbackMessage(numberMatchRound, NUMBER_MATCH_SESSION_ROUNDS);
  renderNumberMatchCards();
  animations.celebrate();
  ui.numberMatchCelebration.innerHTML = ui.celebration.innerHTML;
  ui.numberMatchCelebration.classList.remove("burst");
  void ui.numberMatchCelebration.offsetWidth;
  ui.numberMatchCelebration.classList.add("burst");
  audio.playSuccess();
  await appUtils.wait(800);
  if (!isNumberMatchGameActive || !isActiveAudio(run)) return;
  if (numberMatchRound >= NUMBER_MATCH_SESSION_ROUNDS) finishNumberMatchGame();
  else showNumberMatchRound();
}

function answerNumberMatchQuestion(index) {
  if (!isNumberMatchGameActive || isPaused || isNumberMatchSpeaking || isNumberMatchTransitioning || isNumberMatchRevealing) return;
  if (numberMatchAnswers[index] === currentNumberMatchQuestion) handleNumberMatchCorrectAnswer();
  else handleNumberMatchWrongAnswer(index);
}

function startNumberMatchGame() {
  isNumberMatchGameActive = true;
  numberMatchQuestions = appUtils.shuffle(NUMBER_WORDS.map((_, index) => index + 1));
  currentNumberMatchQuestion = undefined;
  numberMatchAnswers = [];
  numberMatchRound = 0;
  numberMatchWrongAttempts = 0;
  isNumberMatchSpeaking = false;
  isNumberMatchTransitioning = false;
  isNumberMatchRevealing = false;
  numberMatchWrongIndex = undefined;
  isNumberMatchWrongFeedback = false;
  window.clearTimeout(numberMatchCompletionTimer);
  clearSpeech();
  ui.welcome.classList.add("hidden");
  ui.quiz.classList.add("hidden");
  ui.matching.classList.add("hidden");
  ui.listening.classList.add("hidden");
  ui.summary.classList.add("hidden");
  ui.bonus.classList.add("hidden");
  ui.numberMatch.classList.remove("hidden");
  startPlayTime();
  startWakeLock();
  showNumberMatchRound();
}

function renderColorMatchCards() {
  ui.colorMatchCards.textContent = "";
  colorMatchAnswers.forEach((color, index) => {
    const button = document.createElement("button");
    const isCorrect = color === currentColorMatchQuestion;
    button.className = `color-match-card ${color.className}${isColorMatchTransitioning && isCorrect ? " correct" : ""}${isColorMatchRevealing && isCorrect ? " correct-answer-reveal" : ""}${colorMatchWrongIndex === index ? " try-again-choice" : ""}`;
    button.type = "button";
    button.setAttribute("aria-label", color.name);
    button.disabled = isPaused || isColorMatchSpeaking || isColorMatchTransitioning || isColorMatchRevealing;
    button.addEventListener("click", () => answerColorMatchQuestion(index));
    ui.colorMatchCards.append(button);
  });
  const listenDisabled = isPaused || isColorMatchTransitioning || isColorMatchRevealing;
  ui.colorMatchReplay.disabled = listenDisabled;
  ui.colorMatchWordListen.disabled = listenDisabled;
}

async function speakColorMatchColor() {
  if (!isColorMatchGameActive || isPaused || !currentColorMatchQuestion || isColorMatchTransitioning || isColorMatchRevealing) return;
  clearSpeech();
  const run = audioRun;
  isColorMatchSpeaking = true;
  renderColorMatchCards();
  await speech.speak(currentColorMatchQuestion.name, ENGLISH_LANGUAGE);
  if (!isColorMatchGameActive || !isActiveAudio(run)) return;
  isColorMatchSpeaking = false;
  renderColorMatchCards();
}

function finishColorMatchGame() {
  if (!isColorMatchGameActive) return;
  clearSpeech();
  isColorMatchGameActive = false;
  isColorMatchTransitioning = true;
  ui.colorMatchFeedback.textContent = getCompletionMessage();
  renderColorMatchCards();
  animations.celebrate();
  ui.colorMatchCelebration.innerHTML = ui.celebration.innerHTML;
  ui.colorMatchCelebration.classList.remove("burst");
  void ui.colorMatchCelebration.offsetWidth;
  ui.colorMatchCelebration.classList.add("burst");
  audio.playCelebration();
  window.clearTimeout(colorMatchCompletionTimer);
  colorMatchCompletionTimer = window.setTimeout(goHome, 1400);
}

function showColorMatchRound() {
  if (!isColorMatchGameActive || isPaused) return;
  clearSpeech();
  const availableColors = COLOR_MATCH_COLORS.filter(color => color !== colorMatchPreviousQuestion);
  currentColorMatchQuestion = appUtils.randomItem(availableColors.length ? availableColors : COLOR_MATCH_COLORS);
  colorMatchPreviousQuestion = currentColorMatchQuestion;
  colorMatchRound += 1;
  colorMatchAnswers = appUtils.shuffle([currentColorMatchQuestion, ...appUtils.shuffle(COLOR_MATCH_COLORS.filter(color => color !== currentColorMatchQuestion)).slice(0, 3)]);
  colorMatchWrongAttempts = 0;
  colorMatchWrongIndex = undefined;
  isColorMatchSpeechRound = Math.random() < .5;
  isColorMatchTransitioning = false;
  isColorMatchRevealing = false;
  ui.colorMatchPrompt.textContent = currentColorMatchQuestion.name.toUpperCase();
  ui.colorMatchWrittenPrompt.classList.toggle("hidden", isColorMatchSpeechRound);
  ui.colorMatchReplay.classList.toggle("hidden", !isColorMatchSpeechRound);
  ui.colorMatchFeedback.textContent = `${isColorMatchSpeechRound ? "Rengi dinle" : "Rengi oku"} ve doğru kartı seç. ${colorMatchRound}/${COLOR_MATCH_SESSION_ROUNDS}`;
  renderColorMatchCards();
  if (isColorMatchSpeechRound) speakColorMatchColor();
}

async function handleColorMatchWrongAnswer(index) {
  if (!isColorMatchGameActive || isPaused || isColorMatchSpeaking || isColorMatchTransitioning || isColorMatchRevealing) return;
  clearSpeech();
  const run = audioRun;
  colorMatchWrongAttempts += 1;
  colorMatchWrongIndex = index;
  isColorMatchWrongFeedback = true;
  isColorMatchSpeaking = true;
  ui.colorMatchFeedback.textContent = getRetryMessage();
  renderColorMatchCards();
  await speech.speak(ui.colorMatchFeedback.textContent, TURKISH_LANGUAGE);
  if (!isColorMatchGameActive || !isActiveAudio(run)) return;
  colorMatchWrongIndex = undefined;
  isColorMatchWrongFeedback = false;
  isColorMatchSpeaking = false;
  if (colorMatchWrongAttempts < 2) {
    renderColorMatchCards();
    return;
  }
  revealColorMatchAnswer(run);
}

async function revealColorMatchAnswer(run = audioRun) {
  isColorMatchRevealing = true;
  renderColorMatchCards();
  await appUtils.wait(900);
  if (!isColorMatchGameActive || !isActiveAudio(run)) return;
  showColorMatchRound();
}

async function handleColorMatchCorrectAnswer() {
  if (!isColorMatchGameActive || isPaused || isColorMatchSpeaking || isColorMatchTransitioning || isColorMatchRevealing) return;
  clearSpeech();
  const run = audioRun;
  isColorMatchTransitioning = true;
  ui.colorMatchFeedback.textContent = getCorrectFeedbackMessage(colorMatchRound, COLOR_MATCH_SESSION_ROUNDS);
  renderColorMatchCards();
  animations.celebrate();
  ui.colorMatchCelebration.innerHTML = ui.celebration.innerHTML;
  ui.colorMatchCelebration.classList.remove("burst");
  void ui.colorMatchCelebration.offsetWidth;
  ui.colorMatchCelebration.classList.add("burst");
  audio.playSuccess();
  await appUtils.wait(800);
  if (!isColorMatchGameActive || !isActiveAudio(run)) return;
  if (colorMatchRound >= COLOR_MATCH_SESSION_ROUNDS) finishColorMatchGame();
  else showColorMatchRound();
}

function answerColorMatchQuestion(index) {
  if (!isColorMatchGameActive || isPaused || isColorMatchSpeaking || isColorMatchTransitioning || isColorMatchRevealing) return;
  if (colorMatchAnswers[index] === currentColorMatchQuestion) handleColorMatchCorrectAnswer();
  else handleColorMatchWrongAnswer(index);
}

function startColorMatchGame() {
  isColorMatchGameActive = true;
  currentColorMatchQuestion = undefined;
  colorMatchAnswers = [];
  colorMatchRound = 0;
  colorMatchWrongAttempts = 0;
  colorMatchPreviousQuestion = undefined;
  isColorMatchSpeechRound = false;
  isColorMatchSpeaking = false;
  isColorMatchTransitioning = false;
  isColorMatchRevealing = false;
  colorMatchWrongIndex = undefined;
  isColorMatchWrongFeedback = false;
  window.clearTimeout(colorMatchCompletionTimer);
  clearSpeech();
  ui.welcome.classList.add("hidden");
  ui.quiz.classList.add("hidden");
  ui.matching.classList.add("hidden");
  ui.listening.classList.add("hidden");
  ui.numberMatch.classList.add("hidden");
  ui.summary.classList.add("hidden");
  ui.bonus.classList.add("hidden");
  ui.colorMatch.classList.remove("hidden");
  startPlayTime();
  startWakeLock();
  showColorMatchRound();
}

function clearSortingInteraction() {
  if (activeSortingDrag?.button?.hasPointerCapture(activeSortingDrag.pointerId)) activeSortingDrag.button.releasePointerCapture(activeSortingDrag.pointerId);
  activeSortingDrag = undefined;
  selectedSortingItem = undefined;
}

function renderSortingGame() {
  ui.sortingItems.textContent = "";
  ui.sortingDestinations.textContent = "";
  const canInteract = isSortingGameActive && !isPaused && !isSortingProcessing;
  sortingItems.filter(item => !item.completed).forEach(item => {
    const button = document.createElement("button");
    button.className = `sorting-item${selectedSortingItem === item ? " selected" : ""}`;
    button.type = "button";
    button.dataset.sortingItem = item.id;
    button.setAttribute("aria-label", item.name);
    button.innerHTML = `<span aria-hidden="true">${item.visual}</span>${item.name}`;
    button.disabled = !canInteract;
    button.addEventListener("pointerdown", event => startSortingPointer(event, item, button));
    button.addEventListener("pointermove", moveSortingPointer);
    button.addEventListener("pointerup", endSortingPointer);
    button.addEventListener("pointercancel", cancelSortingPointer);
    ui.sortingItems.append(button);
  });
  sortingDestinationOrder.forEach(group => {
    const destination = SORTING_DESTINATIONS[group];
    const button = document.createElement("button");
    const completedItems = sortingItems.filter(item => item.completed && item.group === group);
    button.className = `sorting-destination${selectedSortingItem ? " selected-target" : ""}${completedItems.length ? " completed-target" : ""}`;
    button.type = "button";
    button.dataset.sortingDestination = group;
    button.setAttribute("aria-label", destination.label);
    button.disabled = !canInteract;
    button.innerHTML = `<span aria-hidden="true">${destination.icon}</span><strong>${destination.label}</strong><div class="sorting-sorted-items">${completedItems.map(item => `<span class="sorting-sorted-item" aria-label="${item.name}">${item.visual}</span>`).join("")}</div>`;
    button.addEventListener("click", () => {
      if (selectedSortingItem) placeSortingItem(selectedSortingItem, group);
    });
    ui.sortingDestinations.append(button);
  });
}

function startSortingPointer(event, item, button) {
  if (!isSortingGameActive || isPaused || isSortingProcessing || item.completed || activeSortingDrag) return;
  activeSortingDrag = { item, button, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, dragging: false };
  button.setPointerCapture?.(event.pointerId);
}

function moveSortingPointer(event) {
  if (!activeSortingDrag || event.pointerId !== activeSortingDrag.pointerId || isSortingProcessing) return;
  const moved = Math.hypot(event.clientX - activeSortingDrag.startX, event.clientY - activeSortingDrag.startY) > 8;
  if (!moved) return;
  activeSortingDrag.dragging = true;
  activeSortingDrag.button.classList.add("dragging");
  event.preventDefault();
}

function endSortingPointer(event) {
  if (!activeSortingDrag || event.pointerId !== activeSortingDrag.pointerId) return;
  const { item, button, dragging } = activeSortingDrag;
  if (button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId);
  activeSortingDrag = undefined;
  button.classList.remove("dragging");
  if (!isSortingGameActive || isPaused || isSortingProcessing) return;
  if (!dragging) {
    selectedSortingItem = selectedSortingItem === item ? undefined : item;
    renderSortingGame();
    return;
  }
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-sorting-destination]");
  if (target) placeSortingItem(item, target.dataset.sortingDestination);
}

function cancelSortingPointer(event) {
  if (!activeSortingDrag || event.pointerId !== activeSortingDrag.pointerId) return;
  activeSortingDrag.button.classList.remove("dragging");
  clearSortingInteraction();
  renderSortingGame();
}

function placeSortingItem(item, destinationGroup) {
  if (!isSortingGameActive || isPaused || isSortingProcessing || !item || item.completed || !SORTING_DESTINATIONS[destinationGroup]) return;
  isSortingProcessing = true;
  clearSortingInteraction();
  if (item.group === destinationGroup) {
    item.completed = true;
    ui.sortingFeedback.textContent = getCorrectFeedbackMessage();
    audio.playSuccess();
    if (sortingItems.every(sortingItem => sortingItem.completed)) {
      finishSortingGame();
      return;
    }
  } else {
    ui.sortingFeedback.textContent = getRetryMessage();
  }
  isSortingProcessing = false;
  renderSortingGame();
}

function finishSortingGame() {
  if (!isSortingGameActive) return;
  isSortingGameActive = false;
  isSortingCompleted = true;
  clearSortingInteraction();
  ui.sortingFeedback.textContent = getCompletionMessage();
  animations.celebrate();
  ui.sortingCelebration.innerHTML = ui.celebration.innerHTML;
  ui.sortingCelebration.classList.remove("burst");
  void ui.sortingCelebration.offsetWidth;
  ui.sortingCelebration.classList.add("burst");
  audio.playCelebration();
  renderSortingGame();
}

function startSortingGame() {
  clearSortingInteraction();
  isSortingGameActive = true;
  isSortingProcessing = false;
  isSortingCompleted = false;
  sortingItems = appUtils.shuffle(SORTING_ITEMS.map((item, index) => ({ ...item, id: `sorting-${index}`, completed: false })));
  sortingDestinationOrder = appUtils.shuffle(["fruits", "animals"]);
  clearSpeech();
  ui.welcome.classList.add("hidden");
  ui.quiz.classList.add("hidden");
  ui.matching.classList.add("hidden");
  ui.listening.classList.add("hidden");
  ui.numberMatch.classList.add("hidden");
  ui.colorMatch.classList.add("hidden");
  ui.summary.classList.add("hidden");
  ui.bonus.classList.add("hidden");
  ui.sorting.classList.remove("hidden");
  ui.sortingFeedback.textContent = "Bir nesneye dokun, sonra kutusuna dokun. İstersen sürükle.";
  renderSortingGame();
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
  ui.next.disabled = !enabled;
  ui.pause.disabled = !enabled;
  ui.bonusPause.disabled = !enabled;
  ui.matchingPause.disabled = !enabled;
  ui.listeningPause.disabled = !enabled;
  ui.numberMatchPause.disabled = !enabled;
  ui.colorMatchPause.disabled = !enabled;
  ui.sortingPause.disabled = !enabled;
}

function pauseGame() {
  if (isPaused || (ui.quiz.classList.contains("hidden") && !isBalloonBonusActive && !isMatchingGameActive && !isListeningGameActive && !isNumberMatchGameActive && !isColorMatchGameActive && !isSortingGameActive)) return;
  isPaused = true;
  clearSpeech();
  stopPlayTime();
  setInputEnabled(false);
  setGameActionsEnabled(false);
  if (isBalloonBonusActive) {
    pausedBonusRemaining = Math.max(0, bonusEndsAt - Date.now());
    window.clearTimeout(balloonBonusTimer);
    window.clearTimeout(balloonPopTimer);
    clearBalloonAnimationTimers();
    ui.balloons.querySelectorAll("button").forEach(balloon => { balloon.disabled = true; });
  }
  if (isMatchingGameActive) {
    stopMatchingTimer();
    window.clearTimeout(matchingFlipTimer);
    renderMatchingCards();
  }
  if (isListeningGameActive) renderListeningCards();
  if (isNumberMatchGameActive) renderNumberMatchCards();
  if (isColorMatchGameActive) {
    if (!isColorMatchWrongFeedback) isColorMatchSpeaking = false;
    renderColorMatchCards();
  }
  if (isSortingGameActive) {
    clearSortingInteraction();
    renderSortingGame();
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
    startMatchingTimer();
    renderMatchingCards();
    if (matchingPendingFlip) scheduleMatchingFlip();
    return;
  }
  if (isListeningGameActive) {
    listeningWrongIndex = undefined;
    if (isListeningWrongFeedback) {
      isListeningWrongFeedback = false;
      isListeningSpeaking = false;
      if (listeningWrongAttempts >= 2) revealListeningAnswer();
      else renderListeningCards();
      return;
    }
    if (isListeningTransitioning || isListeningRevealing) {
      if (isListeningTransitioning && listeningRound >= LISTENING_SESSION_ROUNDS) finishListeningGame();
      else showListeningRound();
      return;
    }
    speakListeningWord();
    return;
  }
  if (isNumberMatchGameActive) {
    numberMatchWrongIndex = undefined;
    if (isNumberMatchWrongFeedback) {
      isNumberMatchWrongFeedback = false;
      isNumberMatchSpeaking = false;
      if (numberMatchWrongAttempts >= 2) revealNumberMatchAnswer();
      else renderNumberMatchCards();
      return;
    }
    if (isNumberMatchTransitioning || isNumberMatchRevealing) {
      if (isNumberMatchTransitioning && numberMatchRound >= NUMBER_MATCH_SESSION_ROUNDS) finishNumberMatchGame();
      else showNumberMatchRound();
      return;
    }
    speakNumberMatchNumber();
    return;
  }
  if (isColorMatchGameActive) {
    colorMatchWrongIndex = undefined;
    if (isColorMatchWrongFeedback) {
      isColorMatchWrongFeedback = false;
      isColorMatchSpeaking = false;
      if (colorMatchWrongAttempts >= 2) revealColorMatchAnswer();
      else renderColorMatchCards();
      return;
    }
    if (isColorMatchTransitioning || isColorMatchRevealing) {
      if (isColorMatchTransitioning && colorMatchRound >= COLOR_MATCH_SESSION_ROUNDS) finishColorMatchGame();
      else showColorMatchRound();
      return;
    }
    if (isColorMatchSpeechRound) speakColorMatchColor();
    else renderColorMatchCards();
    return;
  }
  if (isSortingGameActive) {
    renderSortingGame();
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
  const sessionQuestionCount = getSessionQuestionCount();
  ui.count.textContent = `Soru ${questionNumber}/${sessionQuestionCount}`;
  ui.score.textContent = `⭐ ${stars}`;
  ui.streak.textContent = `🔥 Seri: ${streak}`;
  ui.progress.style.width = `${Math.min(100, (questionNumber / sessionQuestionCount) * 100)}%`;
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

function clearBalloonAnimationTimers() {
  balloonAnimationTimers.forEach(timer => window.clearTimeout(timer));
  balloonAnimationTimers.clear();
}

function clearQuestionFeedbackForBonus() {
  window.clearTimeout(mascotReactionTimer);
  mascotReactionTimer = undefined;
  ui.mascot.classList.remove("mascot-celebrate", "mascot-encourage");
  animations.clear();
  ui.feedback.textContent = "";
  ui.feedback.className = "feedback";
  ui.next.classList.add("hidden");
  getAnswerButtons().forEach(button => {
    button.classList.remove("correct", "try-again-choice", "correct-answer-reveal");
  });
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
  if (isPaused || isBalloonBonusActive) return;
  clearSpeech();
  clearQuestionFeedbackForBonus();
  window.clearTimeout(balloonBonusTimer);
  window.clearTimeout(balloonPopTimer);
  clearBalloonAnimationTimers();
  isBalloonBonusActive = true;
  pendingBonusEnd = false;
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
    balloonPopTimer = window.setTimeout(endBalloonBonus, BONUS_POP_TRANSITION_DELAY);
  } else {
    balloon.classList.add("balloon-wiggle");
    const animationTimer = window.setTimeout(() => {
      balloonAnimationTimers.delete(animationTimer);
      if (isBalloonBonusActive) balloon.classList.remove("balloon-wiggle");
    }, BONUS_WRONG_ANIMATION_DURATION);
    balloonAnimationTimers.add(animationTimer);
  }
}

function endBalloonBonus() {
  if (isPaused || !isBalloonBonusActive) return;
  const completedBonus = pendingBonusEnd;
  isBalloonBonusActive = false;
  window.clearTimeout(balloonBonusTimer);
  window.clearTimeout(balloonPopTimer);
  clearBalloonAnimationTimers();
  pausedBonusRemaining = 0;
  pendingBonusEnd = false;
  ui.bonus.classList.add("hidden");
  ui.quiz.classList.remove("hidden");
  unlockAchievement("first-bonus");
  if (completedBonus) updateDailyGoalOnBonusComplete();
  if (questionNumber >= getSessionQuestionCount()) showSessionSummary();
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
  window.clearTimeout(mascotReactionTimer);
  ui.mascot.classList.remove("mascot-celebrate", "mascot-encourage");
  void ui.mascot.offsetWidth;
  ui.mascot.classList.add(reactionClass);
  mascotReactionTimer = window.setTimeout(() => {
    ui.mascot.classList.remove(reactionClass);
    mascotReactionTimer = undefined;
  }, 800);
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
  currentQuestion = selectNextQuestion();
  if (!currentQuestion) {
    goHome(false);
    return;
  }
  currentAnswers = engine.getAnswers(currentQuestion, activeLearningPathStage ? { phase: learningPathQuestionPhase, simplify: isLearningPathRecoveryQuestion } : undefined);
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
  if (isSessionSummaryShowing) return;
  isSessionSummaryShowing = true;
  clearSpeech();
  stopWakeLock();
  const run = audioRun;
  stopPlayTime();
  clearSavedProgress();
  completeLearningPathStage();
  const celebrationMessage = getPersonalizedSessionMessage();
  ui.summaryStars.textContent = stars;
  ui.summaryCorrect.textContent = correctAnswers;
  ui.summaryStreak.textContent = bestStreak;
  ui.summaryCategory.textContent = engine.getFavoriteCategory();
  ui.summaryTitle.textContent = celebrationMessage;
  ui.summaryCopy.textContent = `${questionNumber} soru tamamlandı!`;
  renderLearningPathCompletion(celebrationMessage);
  ui.quiz.classList.add("hidden");
  ui.summary.classList.remove("hidden");
  animations.celebrate();
  audio.playCelebration();
  await appUtils.wait(450);
  if (!isActiveAudio(run)) return;
  await speech.speak(celebrationMessage, TURKISH_LANGUAGE);
  if (!isActiveAudio(run)) return;
  window.clearTimeout(sessionCelebrationTimer);
  if (!activeLearningPathStage) {
    sessionCelebrationTimer = window.setTimeout(() => {
      if (isActiveAudio(run)) startGame();
    }, SESSION_CELEBRATION_DURATION);
  }
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
  if (activeLearningPathStage) learningPathConsecutiveMissedQuestions += 1;
  if (questionNumber >= getSessionQuestionCount()) showSessionSummary();
  else showQuestion();
}

async function handleCorrectAnswer(button) {
  if (isPaused) return;
  clearSpeech();
  const run = audioRun;
  pendingCorrectTransition = true;
  if (activeLearningPathStage) learningPathConsecutiveMissedQuestions = 0;
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
  ui.feedback.textContent = voiceEncouragement?.message ?? getCorrectFeedbackMessage(questionNumber, getSessionQuestionCount());
  ui.feedback.className = "feedback success";
  updateScoreboard();
  ui.next.classList.add("hidden");
  animations.celebrate();
  audio.playSuccess();
  await appUtils.wait(300);
  if (!isActiveAudio(run)) return;
  if (voiceEncouragement) {
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
  else if (questionNumber >= getSessionQuestionCount()) showSessionSummary();
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
  wrongAttemptsForQuestion = 0;
  isRevealingCorrectAnswer = false;
  clearSavedProgress();
  engine.resetSession();
  isLearningPathSessionCompleted = false;
  isSessionSummaryShowing = false;
  learningPathConsecutiveMissedQuestions = 0;
  isLearningPathRecoveryQuestion = false;
  learningPathQuestionPhase = "variety";
  prepareLearningPathQuestionPlan();
}

function setSessionNavigationBusy(isBusy, stageId) {
  ui.learningPath.setAttribute("aria-busy", String(isBusy));
  ui.summary.setAttribute("aria-busy", String(isBusy));
  ui.learningPathStages.querySelectorAll(".learning-path-stage").forEach(button => {
    button.disabled = isBusy;
  });
  [ui.learningPathReturn, ui.learningPathNext, ui.playAgain].forEach(button => {
    button.disabled = isBusy;
  });
  if (!isBusy || !stageId) return;
  const stageButton = ui.learningPathStages.querySelector(`[data-learning-path-stage="${stageId}"]`);
  if (!stageButton) return;
  stageButton.classList.add("loading");
  stageButton.setAttribute("aria-label", `${stageButton.querySelector(".learning-path-stage-name")?.textContent ?? "Bölüm"} hazırlanıyor`);
  const action = stageButton.querySelector(".learning-path-stage-action") ?? stageButton.querySelector(".learning-path-stage-status");
  if (action) action.textContent = "Hazırlanıyor...";
}

function startLearningPathStage(stageId) {
  if (isPaused || isStartingGame) return;
  const stage = LEARNING_PATH_STAGES.find(pathStage => pathStage.id === stageId);
  if (!engine || !stage) return;
  const availableCategories = stage.categories.filter(category => engine.questions.some(question => question.category === category));
  if (!availableCategories.length) return;
  clearSpeech();
  window.clearTimeout(sessionCelebrationTimer);
  if (!activeLearningPathStage) learningPathPreviousGameMode = activeGameMode;
  activeLearningPathStage = { ...stage, categories: availableCategories };
  activeGameMode = LEARNING_MODE;
  ui.shell.classList.remove("learning-path-open");
  startGame({ skipWelcome: true });
}

function startNextLearningPathStage() {
  const stageId = ui.learningPathNext.dataset.learningPathStage;
  if (stageId) startLearningPathStage(stageId);
}

function replaySession() {
  if (activeLearningPathStage) startLearningPathStage(activeLearningPathStage.id);
  else startGame();
}

async function startGame({ skipWelcome = false } = {}) {
  if (isPaused || isStartingGame || (activeGameMode !== LEARNING_MODE && activeGameMode !== QUICK_MODE && activeGameMode !== MATCHING_MODE && activeGameMode !== LISTENING_MODE && activeGameMode !== NUMBER_MATCH_MODE && activeGameMode !== COLOR_MATCH_MODE && activeGameMode !== SORTING_MODE) || (activeGameMode !== MATCHING_MODE && activeGameMode !== LISTENING_MODE && activeGameMode !== NUMBER_MATCH_MODE && activeGameMode !== COLOR_MATCH_MODE && activeGameMode !== SORTING_MODE && activeCategoryPack === "custom" && !getPackCategories().length)) return;
  setGameNavigationBusy(false);
  const startRun = audioRun;
  ensureDailyGoal();
  renderDailyGoal();
  window.clearTimeout(sessionCelebrationTimer);
  isStartingGame = true;
  ui.start.disabled = true;
  setSessionNavigationBusy(true, activeLearningPathStage?.id);
  try {
    [engine] = await Promise.all([gameReady, speech.ready]);
    if (startRun !== audioRun) return;
    resetEncouragementState();
    if (activeGameMode === MATCHING_MODE) {
      startMatchingGame();
      return;
    }
    if (activeGameMode === LISTENING_MODE) {
      startListeningGame();
      return;
    }
    if (activeGameMode === NUMBER_MATCH_MODE) {
      startNumberMatchGame();
      return;
    }
    if (activeGameMode === COLOR_MATCH_MODE) {
      startColorMatchGame();
      return;
    }
    if (activeGameMode === SORTING_MODE) {
      startSortingGame();
      return;
    }
    restoreStoredLearningStats();
    if (activeLearningPathStage) engine.setActiveCategories(activeLearningPathStage.categories);
    else applyCategoryPack();
    ui.welcome.classList.add("hidden");
    ui.learningPath.classList.add("hidden");
    ui.summary.classList.add("hidden");
    ui.quiz.classList.remove("hidden");
    resetSession();
    startPlayTime();
    startWakeLock();
    clearSpeech();
    if (skipWelcome) {
      showQuestion();
      return;
    }
    isWelcomeSequenceActive = true;
    if (await playWelcomeSequence()) showQuestion();
  } catch (error) {
    console.error("Oturum başlatılamadı.", error);
    const returnToLearningPath = Boolean(activeLearningPathStage);
    if (returnToLearningPath) {
      openLearningPath();
      ui.learningPathGuidance.textContent = "Birlikte tekrar deneyelim.";
    }
    else goHome(false);
  } finally {
    isStartingGame = false;
    setSessionNavigationBusy(false);
    updateStartButton();
  }
}

function speakWelcome() {
  if (isPaused) return;
  clearSpeech();
  speech.speak(WELCOME_MESSAGE, TURKISH_LANGUAGE);
}

function goHome(shouldSpeak = true) {
  if (isPaused) return;
  stopMatchingTimer();
  const gameModeToRestore = activeLearningPathStage ? learningPathPreviousGameMode : undefined;
  ui.shell.classList.remove("learning-path-open");
  closeGameMenu();
  clearSpeech();
  setSessionNavigationBusy(false);
  resetEncouragementState();
  stopWakeLock();
  window.clearTimeout(sessionCelebrationTimer);
  window.clearTimeout(matchingFlipTimer);
  window.clearTimeout(matchingCompletionTimer);
  window.clearTimeout(listeningCompletionTimer);
  window.clearTimeout(numberMatchCompletionTimer);
  window.clearTimeout(colorMatchCompletionTimer);
  window.clearTimeout(mascotReactionTimer);
  mascotReactionTimer = undefined;
  ui.mascot.classList.remove("mascot-celebrate", "mascot-encourage");
  animations.clear();
  [ui.matchingCelebration, ui.listeningCelebration, ui.numberMatchCelebration, ui.colorMatchCelebration, ui.sortingCelebration].forEach(celebration => {
    celebration.classList.remove("burst");
    celebration.textContent = "";
  });
  stopPlayTime();
  clearSavedProgress();
  isBalloonBonusActive = false;
  window.clearTimeout(balloonBonusTimer);
  window.clearTimeout(balloonPopTimer);
  clearBalloonAnimationTimers();
  pendingBonusEnd = false;
  isWelcomeSequenceActive = false;
  isRevealingCorrectAnswer = false;
  pendingCorrectTransition = false;
  currentQuestion = undefined;
  currentAnswers = [];
  isSpeaking = false;
  isMatchingGameActive = false;
  matchingCards = [];
  matchingOpenCards = [];
  matchingPairsFound = 0;
  matchingPendingFlip = false;
  matchingElapsedMs = 0;
  matchingTimerStartedAt = 0;
  isMatchingSessionStarting = false;
  isListeningGameActive = false;
  currentListeningQuestion = undefined;
  listeningAnswers = [];
  listeningRound = 0;
  listeningWrongAttempts = 0;
  listeningPreviousQuestion = undefined;
  isListeningSpeaking = false;
  isListeningTransitioning = false;
  isListeningRevealing = false;
  listeningWrongIndex = undefined;
  isListeningWrongFeedback = false;
  isNumberMatchGameActive = false;
  currentNumberMatchQuestion = undefined;
  numberMatchQuestions = [];
  numberMatchAnswers = [];
  numberMatchRound = 0;
  numberMatchWrongAttempts = 0;
  isNumberMatchSpeaking = false;
  isNumberMatchTransitioning = false;
  isNumberMatchRevealing = false;
  numberMatchWrongIndex = undefined;
  isNumberMatchWrongFeedback = false;
  isColorMatchGameActive = false;
  currentColorMatchQuestion = undefined;
  colorMatchAnswers = [];
  colorMatchRound = 0;
  colorMatchWrongAttempts = 0;
  colorMatchPreviousQuestion = undefined;
  isColorMatchSpeechRound = false;
  isColorMatchSpeaking = false;
  isColorMatchTransitioning = false;
  isColorMatchRevealing = false;
  colorMatchWrongIndex = undefined;
  isColorMatchWrongFeedback = false;
  clearSortingInteraction();
  isSortingGameActive = false;
  isSortingProcessing = false;
  isSortingCompleted = false;
  sortingItems = [];
  sortingDestinationOrder = [];
  ui.sortingItems.textContent = "";
  ui.sortingDestinations.textContent = "";
  ui.answers.textContent = "";
  activeLearningPathStage = undefined;
  learningPathQuestionPlan = [];
  isLearningPathSessionCompleted = false;
  isSessionSummaryShowing = false;
  learningPathConsecutiveMissedQuestions = 0;
  isLearningPathRecoveryQuestion = false;
  learningPathQuestionPhase = "variety";
  learningPathPreviousGameMode = undefined;
  if (gameModeToRestore) setGameMode(gameModeToRestore);
  ensureDailyGoal();
  renderDailyGoal();
  resetDailyGoalPopup();
  ui.quiz.classList.add("hidden");
  ui.learningPath.classList.add("hidden");
  ui.bonus.classList.add("hidden");
  ui.summary.classList.add("hidden");
  ui.matching.classList.add("hidden");
  ui.listening.classList.add("hidden");
  ui.numberMatch.classList.add("hidden");
  ui.colorMatch.classList.add("hidden");
  ui.sorting.classList.add("hidden");
  ui.learningPathReturn.classList.add("hidden");
  ui.learningPathNext.classList.add("hidden");
  ui.learningPathCompletion.classList.add("hidden");
  ui.summaryStats.classList.remove("hidden");
  ui.matchingCompletionActions.classList.add("hidden");
  ui.colorMatchWrittenPrompt.classList.add("hidden");
  ui.playAgain.innerHTML = 'Yeniden oyna <span aria-hidden="true">↻</span>';
  ui.playAgain.setAttribute("aria-label", "Yeniden oyna");
  ui.welcome.classList.remove("hidden");
  if (shouldSpeak) speakWelcome();
}

function closeGameMenu() {
  ui.gameMenu.classList.add("hidden");
  ui.menuButton.setAttribute("aria-expanded", "false");
}

function toggleGameMenu() {
  const willOpen = ui.gameMenu.classList.contains("hidden");
  ui.gameMenu.classList.toggle("hidden", !willOpen);
  ui.menuButton.setAttribute("aria-expanded", String(willOpen));
  if (willOpen) ui.gameMenu.querySelector("button")?.focus();
}

function openHomeSection(selector) {
  goHome(false);
  const section = document.querySelector(selector);
  section?.scrollIntoView({ block: "start" });
  section?.querySelector("button, input")?.focus();
}

function setGameNavigationBusy(isBusy) {
  isGameNavigationBusy = isBusy;
  document.querySelectorAll(".game-destination-button").forEach(button => {
    button.disabled = isBusy;
  });
}

function leaveGameFor(destination) {
  if (isPaused || isGameNavigationBusy) return;
  setGameNavigationBusy(true);
  if (destination === "games") openHomeSection(".mini-games-section");
  else goHome(false);
}

function openLearningPath() {
  goHome(false);
  renderLearningPath();
  ui.welcome.classList.add("hidden");
  ui.shell.classList.add("learning-path-open");
  ui.learningPath.classList.remove("hidden");
  ui.learningPathStages.querySelector(".learning-path-stage")?.focus();
}

function handleMenuNavigation(target) {
  closeGameMenu();
  if (target === "rewards") {
    goHome(false);
    openAchievements();
    return;
  }
  if (target === "learning-path") openLearningPath();
  else if (target === "learning") openHomeSection(".game-mode-section");
  else if (target === "mini-games") openHomeSection(".mini-games-section");
  else if (target === "players") openHomeSection(".player-selection");
  else goHome(false);
}

ui.start.addEventListener("click", () => startGame());
ui.learningPathEntry.addEventListener("click", openLearningPath);
ui.learningPathHome.addEventListener("click", () => goHome(false));
ui.learningPathReturn.addEventListener("click", openLearningPath);
ui.learningPathNext.addEventListener("click", startNextLearningPathStage);
ui.fullscreen.addEventListener("click", toggleFullscreen);
ui.settings.addEventListener("click", openParentDashboard);
ui.menuButton.addEventListener("click", toggleGameMenu);
ui.menuItems.forEach(button => button.addEventListener("click", () => handleMenuNavigation(button.dataset.menuTarget)));
ui.welcomeSound.addEventListener("click", speakWelcome);
ui.learningMode.addEventListener("click", () => setGameMode(LEARNING_MODE));
ui.quickMode.addEventListener("click", () => setGameMode(QUICK_MODE));
ui.matchingMode.addEventListener("click", () => setGameMode(MATCHING_MODE));
ui.listeningMode.addEventListener("click", () => setGameMode(LISTENING_MODE));
ui.numberMatchMode.addEventListener("click", () => setGameMode(NUMBER_MATCH_MODE));
ui.colorMatchMode.addEventListener("click", () => setGameMode(COLOR_MATCH_MODE));
ui.sortingMode.addEventListener("click", () => setGameMode(SORTING_MODE));
ui.categoryPackButtons.forEach(button => button.addEventListener("click", () => setCategoryPack(button.dataset.categoryPack)));
ui.playerButtons.forEach(button => button.addEventListener("click", () => {
  if (button === ui.customPlayer) selectCustomPlayer();
  else selectPlayer(button.dataset.playerName);
}));
ui.customPlayerName.addEventListener("input", updateCustomPlayer);
ui.customPlayerName.addEventListener("keydown", event => {
  if (event.key === "Enter" && selectedPlayer && (activeGameMode === LEARNING_MODE || activeGameMode === QUICK_MODE || activeGameMode === MATCHING_MODE || activeGameMode === LISTENING_MODE || activeGameMode === NUMBER_MATCH_MODE || activeGameMode === COLOR_MATCH_MODE || activeGameMode === SORTING_MODE)) startGame();
});
ui.home.addEventListener("click", () => leaveGameFor("home"));
ui.matchingHome.addEventListener("click", () => leaveGameFor("games"));
ui.listeningHome.addEventListener("click", () => leaveGameFor("games"));
ui.numberMatchHome.addEventListener("click", () => leaveGameFor("games"));
ui.colorMatchHome.addEventListener("click", () => leaveGameFor("games"));
ui.sortingHome.addEventListener("click", () => leaveGameFor("games"));
ui.balloonHome.addEventListener("click", () => leaveGameFor("home"));
ui.matchingReplay.addEventListener("click", () => startMatchingSession());
ui.matchingCategories.addEventListener("click", showMatchingCategorySelection);
ui.matchingPause.addEventListener("click", pauseGame);
ui.listeningPause.addEventListener("click", pauseGame);
ui.numberMatchPause.addEventListener("click", pauseGame);
ui.colorMatchPause.addEventListener("click", pauseGame);
ui.sortingPause.addEventListener("click", pauseGame);
ui.listeningReplay.addEventListener("click", () => {
  if (!isPaused && !isListeningSpeaking && !isListeningTransitioning && !isListeningRevealing) speakListeningWord();
});
ui.numberMatchReplay.addEventListener("click", () => {
  if (!isPaused && !isNumberMatchSpeaking && !isNumberMatchTransitioning && !isNumberMatchRevealing) speakNumberMatchNumber();
});
ui.colorMatchReplay.addEventListener("click", () => {
  if (!isPaused && isColorMatchSpeechRound && !isColorMatchTransitioning && !isColorMatchRevealing) speakColorMatchColor();
});
ui.colorMatchWordListen.addEventListener("click", () => {
  if (!isPaused && !isColorMatchSpeechRound && !isColorMatchTransitioning && !isColorMatchRevealing) speakColorMatchColor();
});
ui.replay.addEventListener("click", () => {
  if (!isPaused && !isSpeaking) playQuestionSequence();
});
ui.next.addEventListener("click", () => {
  if (!isPaused) showQuestion();
});
ui.playAgain.addEventListener("click", replaySession);
ui.pause.addEventListener("click", pauseGame);
ui.bonusPause.addEventListener("click", pauseGame);
ui.resume.addEventListener("click", resumeGame);
ui.parentDashboardClose.addEventListener("click", closeParentDashboard);
ui.achievementsModalClose.addEventListener("click", closeAchievements);
document.addEventListener("fullscreenchange", updateFullscreenButton);
document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    requestWakeLock();
    if (isMatchingGameActive && !isPaused) startMatchingTimer();
  } else {
    stopMatchingTimer();
    releaseWakeLock();
  }
});
window.addEventListener("pagehide", stopWakeLock);
document.addEventListener("pointerdown", event => {
  if (!ui.gameMenu.classList.contains("hidden") && !event.target.closest("#game-menu, #menu-button")) closeGameMenu();
  if (event.target.closest("button:not(:disabled)")) audio.playButton();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeGameMenu();
});
window.addEventListener("load", async () => {
  [engine] = await Promise.all([gameReady, speech.ready]);
  setGameMode(LEARNING_MODE);
  restoreCategoryPack();
  applyCategoryPack();
  renderCategoryPackSelection();
  renderPlayerSelection();
  ensureDailyGoal();
  renderDailyGoal();
  restoreStoredLearningStats();
  clearSavedProgress();
  startGame({ skipWelcome: true });
});

updateFullscreenButton();
