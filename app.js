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
const MISSING_ITEM_MODE = "missing-item";
const SHADOW_MODE = "shadow";
const INITIAL_LETTER_MODE = "initial-letter";
const SOUND_MEMORY_MODE = "sound-memory";
const PUZZLE_MODE = "puzzle";
const NEW_MINI_GAME_MODES = [MISSING_ITEM_MODE, SHADOW_MODE, INITIAL_LETTER_MODE, SOUND_MEMORY_MODE, PUZZLE_MODE];
const MINI_GAME_MODES = [MATCHING_MODE, LISTENING_MODE, NUMBER_MATCH_MODE, COLOR_MATCH_MODE, SORTING_MODE, ...NEW_MINI_GAME_MODES];
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
const LISTENING_CATEGORIES = ["Fruits", "Animals", "Colors", "Numbers", "Vegetables", "Foods", "Drinks", "Vehicles", "SeaAnimals", "Birds", "FarmAnimals", "Toys", "Clothes", "Jobs", "Nature", "Space", "Actions", "Emotions"];
const LISTENING_VISUALS = {
  Apple: "🍎", Banana: "🍌", Grape: "🍇", Grapes: "🍇", Orange: "🍊", Lemon: "🍋", Blueberry: "🫐", Kiwi: "🥝", Cherry: "🍒", Pear: "🍐", Peach: "🍑",
  Lion: "🦁", Elephant: "🐘", Cat: "🐱", Monkey: "🐒", Dog: "🐶", Bird: "🐦", Fish: "🐟", Tiger: "🐯", Bear: "🐻", Rabbit: "🐰"
};
const LISTENING_COLOR_VISUALS = { Blue: "🔵", Yellow: "🟡", Red: "🔴", Green: "🟢", Purple: "🟣", Orange: "🟠", Pink: "🩷", Brown: "🟤" };
const LISTENING_NUMBER_VISUALS = { One: "1️⃣", Two: "2️⃣", Three: "3️⃣", Four: "4️⃣", Five: "5️⃣", Six: "6️⃣", Seven: "7️⃣", Eight: "8️⃣" };
const MATCHING_PAIR_COUNT = 8;
const BASE_MATCHING_CATEGORY_DEFINITIONS = [
  { id: "colors", label: "Renkler", icon: "🎨", items: Object.values(LISTENING_COLOR_VISUALS) },
  { id: "animals", label: "Hayvanlar", icon: "🐾", items: ["🦁", "🐘", "🐱", "🐒", "🐶", "🐦", "🐟", "🐯"] },
  { id: "fruits", label: "Meyveler", icon: "🍎", items: ["🍎", "🍌", "🍊", "🍓", "🍇", "🍋", "🥝", "🍒"] },
  { id: "vehicles", label: "Taşıtlar", icon: "🚗", items: ["🚗", "🚌", "🚂", "✈️", "🚁", "🚲", "🚢", "🚜"] },
  { id: "sea-creatures", label: "Deniz Canlıları", icon: "🐬", items: ["🐟", "🐬", "🐳", "🐙", "🦀", "🐢", "🦈", "🦐"] },
  { id: "insects", label: "Böcekler", icon: "🦋", items: ["🦋", "🐞", "🐝", "🐜", "🕷️", "🪲", "🦗", "🐌"] },
  { id: "dinosaurs", label: "Dinozorlar", icon: "🦕", items: ["🦕", "🦖"] },
  { id: "home-items", label: "Ev Eşyaları", icon: "🏠", items: ["🪑", "🛏️", "💡", "⏰", "📺", "☎️", "🔑", "🛁"] },
  { id: "toys", label: "Oyuncaklar", icon: "🧸", items: ["⚽", "🧸", "🚗", "🪁", "🧩", "🪀", "🧱", "🪆"] },
  { id: "clothes", label: "Giysiler", icon: "👕", items: ["👕", "👖", "👗", "👟", "🧢", "🧦", "🧥", "🧤"] },
  { id: "foods", label: "Yiyecekler", icon: "🍞", items: ["🍞", "🧀", "🥚", "🍕", "🥪", "🍲", "🍚", "🍪"] },
  { id: "nature", label: "Doğa", icon: "🌳", items: ["🌳", "🌻", "⛰️", "☀️", "🌙", "☁️", "🌈", "❄️"] },
  { id: "space", label: "Uzay", icon: "🚀", items: ["🚀", "🪐", "🧑‍🚀", "🛰️", "⭐", "🌙", "☄️", "🛸"] },
  { id: "buildings", label: "Binalar", icon: "🏠", items: ["🏠", "🏫", "🏥", "🏰", "🏭", "🏨", "🏦", "🏪"] }
];
const SHARED_MATCHING_CATEGORY_IDS = ["Vegetables", "Birds", "FarmAnimals", "WildAnimals", "KitchenItems", "SchoolItems", "Weather", "Emotions"];
const MATCHING_CATEGORY_DEFINITIONS = [
  ...BASE_MATCHING_CATEGORY_DEFINITIONS,
  ...window.MilaLearningCategories.CATEGORIES
    .filter(category => SHARED_MATCHING_CATEGORY_IDS.includes(category.id))
    .map(category => ({
      id: `learning-${category.id}`,
      label: category.title,
      icon: category.icon,
      items: category.items.filter(item => item.visual).map(item => ({ id: item.id, visual: item.visual }))
    }))
];

function getMatchingItemId(item) {
  return typeof item === "string" ? item : item?.id;
}

function getMatchingItemVisual(item) {
  return typeof item === "string" ? item : item?.visual;
}

function isMatchingCategoryPlayable(category) {
  if (!category?.id || !category.label || !Array.isArray(category.items) || category.items.length < MATCHING_PAIR_COUNT) return false;
  const itemIds = category.items.map(getMatchingItemId);
  const itemVisuals = category.items.map(getMatchingItemVisual);
  return itemIds.every(itemId => typeof itemId === "string" && itemId.trim())
    && itemVisuals.every(visual => typeof visual === "string" && visual.trim())
    && new Set(itemIds).size === category.items.length
    && new Set(itemVisuals).size === category.items.length;
}

const MATCHING_CATEGORIES = MATCHING_CATEGORY_DEFINITIONS.filter(isMatchingCategoryPlayable);
const GAME_MODE_STORAGE_KEY = "mila-learning-game-mode";
const PLAYER_STORAGE_KEY = "mila-learning-player";
const PLAYER_PROGRESS_MIGRATION_STORAGE_KEY = "mila-learning-player-progress-migrated";
const CATEGORY_PACK_STORAGE_KEY = "mila-learning-category-pack";
const LEARNING_PATH_PROGRESS_STORAGE_KEY = "mila-learning-path-progress";
const ACHIEVEMENT_STORAGE_KEY = "mila-learning-achievements";
const DAILY_GOAL_STORAGE_KEY = "mila-learning-daily-goal";
const learningPathModel = window.MilaLearningPath;
const LEARNING_PATH_STAGES = learningPathModel.STAGES;
const DEFAULT_PLAYERS = ["Mila", "Deniz", "Elis", "Açelya", "Alp", "Aslan Cemal", "Zeynep", "Nova", "Ata", "Hiranur"];
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
  shell: document.querySelector(".game-shell"), welcome: document.querySelector("#welcome-screen"), learningCenter: document.querySelector("#learning-center-screen"), miniGames: document.querySelector("#mini-games-screen"), playerSelectionScreen: document.querySelector("#player-selection-screen"), playerSelection: document.querySelector(".player-selection"), playerGuidance: document.querySelector("#player-selection-guidance"), selectedPlayerSummary: document.querySelector("#selected-player-summary"), homePlayerChange: document.querySelector("#home-player-change-button"), homeNavigationCards: document.querySelectorAll("[data-home-target]"), learningCenterHome: document.querySelector("#learning-center-home-button"), miniGamesHome: document.querySelector("#mini-games-home-button"), playerSelectionHome: document.querySelector("#player-selection-home-button"), customPlayerConfirm: document.querySelector("#custom-player-confirm-button"), miniGamesSection: document.querySelector(".mini-games-section"), miniGameButtons: document.querySelectorAll(".mini-games-grid .mode-button"), learningPath: document.querySelector("#learning-path-screen"), learningPathStages: document.querySelector("#learning-path-stages"), learningPathGuidance: document.querySelector("#learning-path-guidance"), learningPathRecommendation: document.querySelector("#learning-path-recommendation"), learningPathGroupTabs: document.querySelector("#learning-path-group-tabs"), learningPathGroupTitle: document.querySelector("#learning-path-group-title"), learningPathGroupIcon: document.querySelector("#learning-path-group-icon"), learningPathGroupDescription: document.querySelector("#learning-path-group-description"), learningPathGroupProgress: document.querySelector("#learning-path-group-progress"), learningPathPreviousGroup: document.querySelector("#learning-path-previous-group"), learningPathNextGroup: document.querySelector("#learning-path-next-group"), learningPathEntry: document.querySelector("#learning-path-button"), learningPathHome: document.querySelector("#learning-path-home-button"), learningPathReturn: document.querySelector("#learning-path-return-button"), learningPathNext: document.querySelector("#learning-path-next-button"), learningPathNextLabel: document.querySelector("#learning-path-next-label"), learningPathCompletion: document.querySelector("#learning-path-completion"), learningPathCompletionIcon: document.querySelector("#learning-path-completion-icon"), learningPathCompletionStage: document.querySelector("#learning-path-completion-stage"), learningPathCompletionParticipation: document.querySelector("#learning-path-completion-participation"), learningPathCompletionCorrect: document.querySelector("#learning-path-completion-correct"), quiz: document.querySelector("#quiz-screen"), summary: document.querySelector("#summary-screen"),
  menuButton: document.querySelector("#menu-button"), gameMenu: document.querySelector("#game-menu"), menuItems: document.querySelectorAll("[data-menu-target]"), settings: document.querySelector("#settings-button"),
  start: document.querySelector("#start-button"), fullscreen: document.querySelector("#fullscreen-button"), achievements: document.querySelector("#achievements-button"), welcomeSound: document.querySelector("#welcome-sound-button"), learningMode: document.querySelector("#learning-mode-button"), quickMode: document.querySelector("#quick-mode-button"), matchingMode: document.querySelector("#matching-mode-button"), listeningMode: document.querySelector("#listening-mode-button"), numberMatchMode: document.querySelector("#number-match-mode-button"), colorMatchMode: document.querySelector("#color-match-mode-button"), sortingMode: document.querySelector("#sorting-mode-button"), missingItemMode: document.querySelector("#missing-item-mode-button"), shadowMode: document.querySelector("#shadow-mode-button"), initialLetterMode: document.querySelector("#initial-letter-mode-button"), soundMemoryMode: document.querySelector("#sound-memory-mode-button"), puzzleMode: document.querySelector("#puzzle-mode-button"), playerButtons: document.querySelectorAll(".player-button"), customPlayer: document.querySelector("#custom-player-button"), customPlayerLabel: document.querySelector("#custom-player-label"), customPlayerName: document.querySelector("#custom-player-name"), categoryPackButtons: document.querySelectorAll(".category-pack-button"), customCategoryOptions: document.querySelector("#custom-category-options"), home: document.querySelector("#home-button"), replay: document.querySelector("#question-sound-button"), matching: document.querySelector("#matching-screen"), matchingCategorySelection: document.querySelector("#matching-category-selection"), matchingCategoryOptions: document.querySelector("#matching-category-options"), matchingGameArea: document.querySelector("#matching-game-area"), matchingCategoryLabel: document.querySelector("#matching-category-label"), matchingCards: document.querySelector("#matching-cards"), matchingCelebration: document.querySelector("#matching-celebration"), matchingFeedback: document.querySelector("#matching-feedback"), matchingCompletionActions: document.querySelector("#matching-completion-actions"), matchingCompletionTime: document.querySelector("#matching-completion-time"), matchingReplay: document.querySelector("#matching-replay-button"), matchingCategories: document.querySelector("#matching-categories-button"), matchingHome: document.querySelector("#matching-home-button"), matchingPause: document.querySelector("#matching-pause-button"), listening: document.querySelector("#listening-screen"), listeningCards: document.querySelector("#listening-cards"), listeningCelebration: document.querySelector("#listening-celebration"), listeningFeedback: document.querySelector("#listening-feedback"), listeningReplay: document.querySelector("#listening-replay-button"), listeningHome: document.querySelector("#listening-home-button"), listeningPause: document.querySelector("#listening-pause-button"), numberMatch: document.querySelector("#number-match-screen"), numberMatchCards: document.querySelector("#number-match-cards"), numberMatchCelebration: document.querySelector("#number-match-celebration"), numberMatchFeedback: document.querySelector("#number-match-feedback"), numberMatchReplay: document.querySelector("#number-match-replay-button"), numberMatchHome: document.querySelector("#number-match-home-button"), numberMatchPause: document.querySelector("#number-match-pause-button"), colorMatch: document.querySelector("#color-match-screen"), colorMatchCards: document.querySelector("#color-match-cards"), colorMatchCelebration: document.querySelector("#color-match-celebration"), colorMatchFeedback: document.querySelector("#color-match-feedback"), colorMatchWrittenPrompt: document.querySelector("#color-match-written-prompt"), colorMatchPrompt: document.querySelector("#color-match-prompt"), colorMatchWordListen: document.querySelector("#color-match-word-listen-button"), colorMatchReplay: document.querySelector("#color-match-replay-button"), colorMatchHome: document.querySelector("#color-match-home-button"), colorMatchPause: document.querySelector("#color-match-pause-button"), sorting: document.querySelector("#sorting-screen"), sortingItems: document.querySelector("#sorting-items"), sortingDestinations: document.querySelector("#sorting-destinations"), sortingCelebration: document.querySelector("#sorting-celebration"), sortingFeedback: document.querySelector("#sorting-feedback"), sortingHome: document.querySelector("#sorting-home-button"), sortingPause: document.querySelector("#sorting-pause-button"), sortingFinishHome: document.querySelector("#sorting-finish-home-button"),
  newMiniGame: document.querySelector("#new-mini-game-screen"), newMiniGameEyebrow: document.querySelector("#new-mini-game-eyebrow"), newMiniGameTitle: document.querySelector("#new-mini-game-title"), newMiniGameHome: document.querySelector("#new-mini-game-home-button"), newMiniGamePause: document.querySelector("#new-mini-game-pause-button"), newMiniGameSetup: document.querySelector("#new-mini-game-setup"), newMiniGameArea: document.querySelector("#new-mini-game-area"), newMiniGameProgressLabel: document.querySelector("#new-mini-game-progress-label"), newMiniGameProgressFill: document.querySelector("#new-mini-game-progress-fill"), newMiniGamePrompt: document.querySelector("#new-mini-game-prompt"), newMiniGameListen: document.querySelector("#new-mini-game-listen-button"), newMiniGameVisual: document.querySelector("#new-mini-game-visual"), newMiniGameChoices: document.querySelector("#new-mini-game-choices"), newMiniGameFeedback: document.querySelector("#new-mini-game-feedback"), newMiniGameCompletion: document.querySelector("#new-mini-game-completion"), newMiniGameCompletionCopy: document.querySelector("#new-mini-game-completion-copy"), newMiniGameReplay: document.querySelector("#new-mini-game-replay-button"), newMiniGameChange: document.querySelector("#new-mini-game-change-button"), newMiniGameCompletionHome: document.querySelector("#new-mini-game-completion-home-button"),
  numberLearning: document.querySelector("#number-learning-screen"), numberLearningTitle: document.querySelector("#number-learning-title"), numberLearningPath: document.querySelector("#number-learning-path-button"), numberLearningPause: document.querySelector("#number-learning-pause-button"), numberLearningProgressLabel: document.querySelector("#number-learning-progress-label"), numberLearningProgressFill: document.querySelector("#number-learning-progress-fill"), numberLearningScore: document.querySelector("#number-learning-score"), numberLearningListen: document.querySelector("#number-learning-listen-button"), numberLearningPrompt: document.querySelector("#number-learning-prompt"), numberLearningVisual: document.querySelector("#number-learning-visual"), numberLearningSupportActions: document.querySelector("#number-learning-support-actions"), numberLearningCombine: document.querySelector("#number-learning-combine-button"), numberLearningHelp: document.querySelector("#number-learning-help-button"), numberLearningCount: document.querySelector("#number-learning-count-button"), numberLearningAnswers: document.querySelector("#number-learning-answers"), numberLearningCheck: document.querySelector("#number-learning-check-button"), numberLearningFeedback: document.querySelector("#number-learning-feedback"),
  customCategoryBrowser: document.querySelector("#custom-category-browser"), categoryGroupTabs: document.querySelector("#category-group-tabs"), customCategoryCount: document.querySelector("#custom-category-count"), customCategoryReset: document.querySelector("#custom-category-reset-button"),
  category: document.querySelector("#category-pill"), visual: document.querySelector("#question-visual"), celebration: document.querySelector("#celebration"), mascot: document.querySelector("#game-mascot"), prompt: document.querySelector("#question-prompt"),
  answers: document.querySelector("#answers"), feedback: document.querySelector("#feedback"), next: document.querySelector("#next-button"), count: document.querySelector("#question-count"), score: document.querySelector("#score"), streak: document.querySelector("#streak"), progress: document.querySelector("#progress-fill"),
  playAgain: document.querySelector("#play-again-button"), summaryHome: document.querySelector("#summary-home-button"), summaryStats: document.querySelector("#summary-stats"), summaryStars: document.querySelector("#summary-stars"), summaryCorrect: document.querySelector("#summary-correct"), summaryStreak: document.querySelector("#summary-streak"), summaryCategory: document.querySelector("#summary-category"), summaryTitle: document.querySelector("#summary-title"), summaryCopy: document.querySelector(".summary-copy"), rewardPopup: document.querySelector("#reward-popup"), rewardSticker: document.querySelector("#reward-sticker"), achievementPopup: document.querySelector("#achievement-popup"), achievementPopupIcon: document.querySelector("#achievement-popup-icon"), achievementPopupTitle: document.querySelector("#achievement-popup-title"), dailyGoalCard: document.querySelector("#daily-goal-card"), dailyGoalTitle: document.querySelector("#daily-goal-title"), dailyGoalProgress: document.querySelector("#daily-goal-progress"), dailyGoalPopup: document.querySelector("#daily-goal-popup"), achievementsModal: document.querySelector("#achievements-modal"), achievementsModalClose: document.querySelector("#achievements-modal-close"), achievementsList: document.querySelector("#achievements-list"), rewardsStarCount: document.querySelector("#rewards-star-count"), stickersList: document.querySelector("#stickers-list"), bonus: document.querySelector("#balloon-bonus"), balloonHome: document.querySelector("#bonus-home-button"), balloonTarget: document.querySelector("#balloon-target"), balloons: document.querySelector("#balloons"), pause: document.querySelector("#pause-button"), bonusPause: document.querySelector("#bonus-pause-button"), pauseOverlay: document.querySelector("#pause-overlay"), resume: document.querySelector("#resume-button"), parentLogo: document.querySelector("#welcome-title"), parentDashboard: document.querySelector("#parent-dashboard"), parentDashboardClose: document.querySelector("#parent-dashboard-close"), parentDashboardTitle: document.querySelector("#parent-dashboard-title"), parentPlayTime: document.querySelector("#parent-play-time"), parentQuestions: document.querySelector("#parent-questions"), parentCorrect: document.querySelector("#parent-correct"), parentCategory: document.querySelector("#parent-category"), parentStreak: document.querySelector("#parent-streak"), parentDifficultWords: document.querySelector("#parent-difficult-words")
};

const appUtils = window.MilaUtils;
const newMiniGames = window.MilaNewMiniGames;
const numberLearning = window.MilaNumberLearning;
const learningCategories = window.MilaLearningCategories;
newMiniGames.validateContent();
learningCategories.validateCategories();
learningPathModel.validateRoadmap({ categories: learningCategories.CATEGORIES });
numberLearning.validateContent();
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
let activeCategoryGroup = learningCategories.GROUPS[0].id;
let activeLearningSessionCategories = [];
let activeLearningSessionType;
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
let isNewMiniGameActive = false;
let newMiniGameSessionId = 0;
let newMiniGameState = createEmptyNewMiniGameState();
let isNumberLearningActive = false;
let numberLearningSessionId = 0;
let numberLearningTimer;
let numberLearningState;
let numberLearningSupportRun = 0;
let activeLearningPathStage;
let activeLearningPathGroupId = learningPathModel.GROUPS[0].id;
let learningPathQuestionPlan = [];
let isLearningPathSessionCompleted = false;
let learningPathPreviousGameMode;
let isSessionSummaryShowing = false;
let learningPathConsecutiveMissedQuestions = 0;
let isLearningPathRecoveryQuestion = false;
let learningPathQuestionPhase = "variety";
let activePrimaryView = "home";
let rewardsReturnFocus;

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
    return learningPathModel.normalizeProgress(savedData);
  } catch {
    return { completed: {} };
  }
}

function saveLearningPathProgress(progress) {
  try {
    const storageKey = getPlayerStorageKey(LEARNING_PATH_PROGRESS_STORAGE_KEY);
    if (storageKey) window.localStorage.setItem(storageKey, JSON.stringify(learningPathModel.normalizeProgress(progress)));
  } catch {
    // The game continues when local storage is unavailable.
  }
}

function completeLearningPathStage() {
  if (!activeLearningPathStage || isLearningPathSessionCompleted) return false;
  isLearningPathSessionCompleted = true;
  const progress = loadLearningPathProgress();
  if (progress.completed[activeLearningPathStage.id]) return false;
  progress.completed[activeLearningPathStage.id] = true;
  saveLearningPathProgress(progress);
  return true;
}

function getRecommendedLearningPathStage(progress) {
  return learningPathModel.getRecommendedStage(progress);
}

function getLearningPathLockedReason(stage, progress) {
  const incompletePrerequisite = stage.prerequisiteStageIds
    .map(stageId => learningPathModel.stageById(stageId))
    .find(prerequisite => prerequisite && progress.completed[prerequisite.id] !== true);
  return incompletePrerequisite ? `Önce ${incompletePrerequisite.title}` : "Önceki bölümü tamamla";
}

function renderLearningPathGroupTabs() {
  ui.learningPathGroupTabs.textContent = "";
  learningPathModel.GROUPS.forEach((group, index) => {
    const button = document.createElement("button");
    button.id = `learning-path-group-${group.id}`;
    button.className = "learning-path-group-tab";
    button.type = "button";
    button.role = "tab";
    button.setAttribute("aria-selected", String(group.id === activeLearningPathGroupId));
    button.setAttribute("aria-controls", "learning-path-stages");
    button.tabIndex = group.id === activeLearningPathGroupId ? 0 : -1;
    button.innerHTML = `<span aria-hidden="true">${group.icon}</span>${group.title}`;
    button.addEventListener("click", () => selectLearningPathGroup(group.id, { focusTab: true }));
    button.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const groups = learningPathModel.GROUPS;
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? groups.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + groups.length) % groups.length;
      selectLearningPathGroup(groups[nextIndex].id, { focusTab: true });
    });
    ui.learningPathGroupTabs.append(button);
  });
}

function selectLearningPathGroup(groupId, { focusTab = false, focusHeading = false } = {}) {
  if (!learningPathModel.groupById(groupId)) return;
  clearSpeech();
  activeLearningPathGroupId = groupId;
  renderLearningPath();
  if (focusTab) ui.learningPathGroupTabs.querySelector(`#learning-path-group-${groupId}`)?.focus();
  else if (focusHeading) ui.learningPathGroupTitle.focus({ preventScroll: true });
}

function moveLearningPathGroup(direction) {
  const currentIndex = learningPathModel.GROUPS.findIndex(group => group.id === activeLearningPathGroupId);
  const nextIndex = currentIndex + direction;
  const nextGroup = learningPathModel.GROUPS[nextIndex];
  if (nextGroup) selectLearningPathGroup(nextGroup.id, { focusHeading: true });
}

function renderLearningPath({ focusStageId } = {}) {
  const progress = loadLearningPathProgress();
  const recommendedStage = getRecommendedLearningPathStage(progress);
  const implementedStages = LEARNING_PATH_STAGES.filter(stage => stage.implemented);
  const completedCount = implementedStages.filter(stage => progress.completed[stage.id]).length;
  const allStagesCompleted = completedCount === implementedStages.length;
  if (!learningPathModel.groupById(activeLearningPathGroupId)) activeLearningPathGroupId = recommendedStage?.groupId ?? learningPathModel.GROUPS[0].id;
  const activeGroup = learningPathModel.groupById(activeLearningPathGroupId);
  const activeGroupIndex = learningPathModel.GROUPS.findIndex(group => group.id === activeGroup.id);
  const groupProgress = learningPathModel.getGroupProgress(activeGroup.id, progress);
  ui.learningPathGuidance.textContent = allStagesCompleted
    ? "🌟 Tüm hazır bölümleri tamamladın! İstersen tekrar oynayabilirsin."
    : completedCount > 0
      ? "Harika gidiyorsun! Sıradaki bölüm seni bekliyor."
      : "Bir bölüm seç ve öğrenmeye başla!";
  ui.learningPathRecommendation.textContent = allStagesCompleted
    ? `${selectedPlayer ? `${selectedPlayer}, ` : ""}tüm hazır bölümleri tamamladın!`
    : `${selectedPlayer ? `${selectedPlayer}, ` : ""}sıradaki bölümün: ${recommendedStage.icon} ${recommendedStage.title}`;
  renderLearningPathGroupTabs();
  ui.learningPathGroupTitle.textContent = activeGroup.title;
  ui.learningPathGroupIcon.textContent = activeGroup.icon;
  ui.learningPathGroupDescription.textContent = activeGroup.description;
  ui.learningPathGroupProgress.textContent = groupProgress.playable
    ? `${groupProgress.completed} / ${groupProgress.playable} hazır bölüm tamamlandı${groupProgress.planned ? ` · ${groupProgress.planned} yeni bölüm yakında` : ""}`
    : `${groupProgress.planned} yeni bölüm yakında`;
  ui.learningPathPreviousGroup.disabled = activeGroupIndex === 0;
  ui.learningPathNextGroup.disabled = activeGroupIndex === learningPathModel.GROUPS.length - 1;
  ui.learningPathPreviousGroup.setAttribute("aria-label", activeGroupIndex > 0 ? `Önceki grup: ${learningPathModel.GROUPS[activeGroupIndex - 1].title}` : "İlk Öğrenme Yolu grubundasın");
  ui.learningPathNextGroup.setAttribute("aria-label", activeGroupIndex < learningPathModel.GROUPS.length - 1 ? `Sonraki grup: ${learningPathModel.GROUPS[activeGroupIndex + 1].title}` : "Son Öğrenme Yolu grubundasın");
  ui.learningPathStages.setAttribute("aria-labelledby", `learning-path-group-${activeGroup.id}`);
  ui.learningPathStages.textContent = "";
  learningPathModel.stagesForGroup(activeGroup.id).forEach(stage => {
    const state = learningPathModel.getStageState(stage, progress, recommendedStage);
    const isInteractive = state !== "planned";
    const card = document.createElement(isInteractive ? "button" : "div");
    card.className = `learning-path-stage ${state}`;
    card.dataset.learningPathStage = stage.id;
    if (isInteractive) card.type = "button";
    else card.setAttribute("role", "group");
    const lockedReason = state === "locked" ? getLearningPathLockedReason(stage, progress) : "";
    const stateLabel = state === "completed"
      ? "Tamamlandı. Tekrar Oyna"
      : state === "current"
        ? "Sıradaki Bölüm. Başla"
        : state === "unlocked"
          ? "Hazır. Başla"
          : state === "locked"
            ? `Kilitli. ${lockedReason}`
            : "Yakında. Yeni bölüm hazırlanıyor";
    card.setAttribute("aria-label", `${stage.order}. ${stage.title}. ${stateLabel}.`);
    if (state === "locked") card.disabled = true;
    const status = state === "completed"
      ? "✓ Tamamlandı"
      : state === "current"
        ? "⭐ Sıradaki Bölüm"
        : state === "unlocked"
          ? "Hazır"
          : state === "locked"
            ? `🔒 ${lockedReason}`
            : "🛠️ Yakında";
    const action = state === "completed"
      ? "↻ Tekrar Oyna"
      : state === "current" || state === "unlocked"
        ? "Başla"
        : state === "locked"
          ? "Kilitli"
          : "Yeni bölüm hazırlanıyor";
    card.innerHTML = `<span class="learning-path-stage-number">${stage.order}</span><span class="learning-path-stage-icon" aria-hidden="true">${stage.icon}</span><span class="learning-path-stage-content"><strong class="learning-path-stage-name">${stage.title}</strong><span class="learning-path-stage-description">${stage.description}</span><span class="learning-path-stage-status">${status}</span></span><span class="learning-path-stage-action">${action}</span>`;
    if (learningPathModel.canLaunchStage(stage.id, progress)) card.addEventListener("click", () => startLearningPathStage(stage.id));
    ui.learningPathStages.append(card);
  });
  if (focusStageId) ui.learningPathStages.querySelector(`[data-learning-path-stage="${focusStageId}"]:not(:disabled)`)?.focus({ preventScroll: true });
}

function renderLearningPathCompletion(completionMessage) {
  const isLearningPathCompletion = Boolean(activeLearningPathStage);
  ui.learningPathCompletion.classList.toggle("hidden", !isLearningPathCompletion);
  ui.summaryStats.classList.toggle("hidden", isLearningPathCompletion);
  ui.learningPathReturn.classList.toggle("hidden", !isLearningPathCompletion);
  ui.playAgain.innerHTML = isLearningPathCompletion ? 'Tekrar Oyna <span aria-hidden="true">↻</span>' : 'Yeniden oyna <span aria-hidden="true">↻</span>';
  ui.playAgain.setAttribute("aria-label", isLearningPathCompletion ? `${activeLearningPathStage.title} bölümünü tekrar oyna` : "Yeniden oyna");
  if (!isLearningPathCompletion) {
    ui.learningPathNext.classList.add("hidden");
    ui.learningPathNext.removeAttribute("data-learning-path-stage");
    return;
  }
  const progress = loadLearningPathProgress();
  const isOperationsBoundary = activeLearningPathStage.id === "visual-subtraction";
  const plannedNextStage = isOperationsBoundary ? learningPathModel.stageById("mixed-operations") : undefined;
  const nextStage = isOperationsBoundary ? undefined : learningPathModel.getNextEligibleStage(activeLearningPathStage.id, progress);
  ui.summaryTitle.textContent = completionMessage ?? getCompletionMessage();
  ui.summaryCopy.textContent = "Yeni şeyler öğreniyorsun!";
  ui.learningPathCompletionIcon.textContent = activeLearningPathStage.icon;
  ui.learningPathCompletionStage.textContent = `${activeLearningPathStage.title} bölümünü bitirdin!`;
  ui.learningPathCompletionParticipation.textContent = `${questionNumber} soruyu tamamladın`;
  ui.learningPathCompletionCorrect.textContent = `${correctAnswers} doğru cevap`;
  ui.learningPathCompletion.setAttribute("aria-label", `${activeLearningPathStage.title} bölümü tamamlandı. ${questionNumber} soru tamamlandı. ${correctAnswers} doğru cevap.`);
  ui.learningPathNext.classList.toggle("hidden", !nextStage && !plannedNextStage);
  ui.learningPathNext.disabled = Boolean(plannedNextStage);
  if (nextStage) {
    ui.learningPathNext.dataset.learningPathStage = nextStage.id;
    ui.learningPathNextLabel.textContent = `Sonraki: ${nextStage.icon} ${nextStage.title}`;
    ui.learningPathNext.setAttribute("aria-label", `Sıradaki bölüm: ${nextStage.title}`);
  } else if (plannedNextStage) {
    ui.learningPathNext.removeAttribute("data-learning-path-stage");
    ui.learningPathNextLabel.textContent = `Sonraki: ${plannedNextStage.icon} ${plannedNextStage.title} · Yakında`;
    ui.learningPathNext.setAttribute("aria-label", `Sıradaki bölüm ${plannedNextStage.title}, yakında`);
  } else {
    ui.learningPathNext.removeAttribute("data-learning-path-stage");
    ui.learningPathNextLabel.textContent = "";
  }
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
  rewardsReturnFocus = document.activeElement;
  ui.achievementsModal.classList.remove("hidden");
  ui.achievementsModalClose.focus();
}

function closeAchievements() {
  ui.achievementsModal.classList.add("hidden");
  const returnTarget = rewardsReturnFocus && !rewardsReturnFocus.closest(".hidden") ? rewardsReturnFocus : getPrimaryViewHeading(activePrimaryView);
  returnTarget?.focus({ preventScroll: true });
  rewardsReturnFocus = undefined;
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
  if (pack === "custom") return customCategories.filter(category => availableCategories.includes(category));
  const packDefinition = learningCategories.PACKS[pack] ?? learningCategories.PACKS.mixed;
  return packDefinition.filter(category => availableCategories.includes(category));
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
  activeCategoryGroup = learningCategories.GROUPS[0].id;
  try {
    const storageKey = getPlayerStorageKey(CATEGORY_PACK_STORAGE_KEY);
    const savedPack = storageKey ? JSON.parse(window.localStorage.getItem(storageKey)) : undefined;
    const availableCategories = getAvailableCategories().map(category => category.category);
    const validPacks = ["mixed", "words", "colors-shapes", "numbers", "custom"];
    customCategories = learningCategories.sanitizeSavedSelection(savedPack?.categories).filter(category => availableCategories.includes(category));
    activeCategoryPack = validPacks.includes(savedPack?.pack) ? savedPack.pack : "mixed";
    if (!getPackCategories(activeCategoryPack).length) activeCategoryPack = "mixed";
  } catch {
    activeCategoryPack = "mixed";
    customCategories = [];
  }
}

function getCategoriesForGroup(groupId) {
  const available = new Set(getAvailableCategories().map(category => category.category));
  return learningCategories.CATEGORIES.filter(category => category.group === groupId && available.has(category.id));
}

function selectCategoryGroup(groupId, { focusCategory = false } = {}) {
  if (!learningCategories.GROUPS.some(group => group.id === groupId)) return;
  clearSpeech();
  activeCategoryGroup = groupId;
  renderCategoryPackSelection();
  if (focusCategory) ui.customCategoryOptions.querySelector("button")?.focus();
}

function renderCategoryGroupTabs() {
  ui.categoryGroupTabs.textContent = "";
  learningCategories.GROUPS.forEach((group, index) => {
    const button = document.createElement("button");
    button.id = `category-group-${group.id}`;
    button.className = "category-group-tab";
    button.type = "button";
    button.role = "tab";
    button.setAttribute("aria-selected", String(group.id === activeCategoryGroup));
    button.setAttribute("aria-controls", "custom-category-options");
    button.tabIndex = group.id === activeCategoryGroup ? 0 : -1;
    button.innerHTML = `<span aria-hidden="true">${group.icon}</span>${group.title}`;
    button.addEventListener("click", () => selectCategoryGroup(group.id));
    button.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const groups = learningCategories.GROUPS;
      const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? groups.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + groups.length) % groups.length;
      selectCategoryGroup(groups[nextIndex].id);
      ui.categoryGroupTabs.querySelector(`#category-group-${groups[nextIndex].id}`)?.focus();
    });
    ui.categoryGroupTabs.append(button);
  });
  ui.customCategoryOptions.setAttribute("aria-labelledby", `category-group-${activeCategoryGroup}`);
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
  renderCategoryGroupTabs();
  ui.customCategoryOptions.textContent = "";
  getCategoriesForGroup(activeCategoryGroup).forEach(category => {
    const button = document.createElement("button");
    button.className = "custom-category-button";
    button.type = "button";
    button.setAttribute("aria-pressed", String(customCategories.includes(category.id)));
    button.setAttribute("aria-label", `${category.title}, ${customCategories.includes(category.id) ? "seçildi" : "seçilmedi"}`);
    button.innerHTML = `<span class="custom-category-button-icon" aria-hidden="true">${category.icon}</span><span class="custom-category-button-copy"><strong>${category.title}</strong><small>${category.description}</small></span><span class="custom-category-button-check" aria-hidden="true">${customCategories.includes(category.id) ? "✓" : "+"}</span>`;
    button.addEventListener("click", () => {
      customCategories = customCategories.includes(category.id) ? customCategories.filter(name => name !== category.id) : [...customCategories, category.id];
      saveCategoryPack();
      renderCategoryPackSelection();
      ui.customCategoryOptions.querySelector(`[aria-label^="${category.title},"]`)?.focus();
    });
    ui.customCategoryOptions.append(button);
  });
  ui.customCategoryCount.textContent = `${customCategories.length} kategori seçildi`;
  ui.customCategoryReset.disabled = customCategories.length === 0;
  ui.customCategoryBrowser.classList.toggle("hidden", activeCategoryPack !== "custom" || availableCategoryNames.length === 0);
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
  return activeLearningPathStage?.sessionLength ?? SESSION_QUESTION_COUNT;
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
  const hasLearningMode = activeGameMode === LEARNING_MODE || activeGameMode === QUICK_MODE;
  ui.start.disabled = !selectedPlayer || !hasLearningMode || (activeCategoryPack === "custom" && !getPackCategories().length);
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
  const isCustomPlayer = Boolean(selectedPlayer && !DEFAULT_PLAYERS.includes(selectedPlayer));
  ui.playerButtons.forEach(button => {
    const isSelected = Boolean(button.dataset.playerName && button.dataset.playerName === selectedPlayer) || (button === ui.customPlayer && isCustomPlayer);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  ui.customPlayerLabel.classList.toggle("hidden", !isCustomPlayer);
  ui.customPlayerName.classList.toggle("hidden", !isCustomPlayer);
  if (isCustomPlayer) ui.customPlayerName.value = selectedPlayer;
  ui.customPlayerConfirm.classList.toggle("hidden", !isCustomPlayer);
  ui.customPlayerConfirm.disabled = !selectedPlayer;
  ui.selectedPlayerSummary.textContent = selectedPlayer ? `👤 ${selectedPlayer} oynuyor` : "Henüz bir oyuncu seçilmedi";
  updateStartButton();
}

function clearPlayerSelectionGuidance() {
  ui.playerGuidance.classList.add("hidden");
}

function showPlayerSelectionGuidance() {
  ui.playerGuidance.classList.remove("hidden");
  showPrimaryView("players");
}

function selectPlayer(name) {
  selectedPlayer = getValidPlayerName(name);
  if (!selectedPlayer) return;
  clearPlayerSelectionGuidance();
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
  if (!ui.learningPath.classList.contains("hidden")) {
    activeLearningPathGroupId = getRecommendedLearningPathStage(loadLearningPathProgress())?.groupId ?? learningPathModel.GROUPS[0].id;
    renderLearningPath();
  }
}

function selectCustomPlayer() {
  selectedPlayer = undefined;
  clearPlayerSelectionGuidance();
  resetEncouragementState();
  dailyGoalData = {};
  resetDailyGoalPopup();
  renderDailyGoal();
  ui.playerButtons.forEach(button => button.setAttribute("aria-pressed", "false"));
  ui.customPlayer.setAttribute("aria-pressed", "true");
  ui.customPlayerLabel.classList.remove("hidden");
  ui.customPlayerName.classList.remove("hidden");
  ui.customPlayerConfirm.classList.remove("hidden");
  ui.customPlayerConfirm.disabled = true;
  ui.customPlayerName.focus();
  updateStartButton();
}

function updateCustomPlayer() {
  const sanitizedName = Array.from(ui.customPlayerName.value).filter(character => /[\p{L} ]/u.test(character)).slice(0, 20).join("");
  if (ui.customPlayerName.value !== sanitizedName) ui.customPlayerName.value = sanitizedName;
  const playerName = getValidPlayerName(ui.customPlayerName.value);
  selectedPlayer = playerName;
  ui.customPlayer.setAttribute("aria-pressed", String(Boolean(playerName)));
  ui.customPlayerConfirm.disabled = !playerName;
  if (playerName) {
    clearPlayerSelectionGuidance();
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
    if (!ui.learningPath.classList.contains("hidden")) {
      activeLearningPathGroupId = getRecommendedLearningPathStage(loadLearningPathProgress())?.groupId ?? learningPathModel.GROUPS[0].id;
      renderLearningPath();
    }
  } else {
    dailyGoalData = {};
    resetDailyGoalPopup();
    renderDailyGoal();
  }
  ui.selectedPlayerSummary.textContent = selectedPlayer ? `👤 ${selectedPlayer} oynuyor` : "Henüz bir oyuncu seçilmedi";
  updateStartButton();
}

function getSavedGameMode() {
  try {
    const storageKey = getPlayerStorageKey(GAME_MODE_STORAGE_KEY);
    const savedMode = storageKey && window.localStorage.getItem(storageKey);
    return savedMode === QUICK_MODE || savedMode === LEARNING_MODE ? savedMode : LEARNING_MODE;
  } catch {
    return LEARNING_MODE;
  }
}

function setGameMode(mode) {
  if (isPaused || (mode !== LEARNING_MODE && mode !== QUICK_MODE)) return;
  activeGameMode = mode;
  ui.learningMode.setAttribute("aria-pressed", String(mode === LEARNING_MODE));
  ui.quickMode.setAttribute("aria-pressed", String(mode === QUICK_MODE));
  try {
    const storageKey = getPlayerStorageKey(GAME_MODE_STORAGE_KEY);
    if (storageKey) window.localStorage.setItem(storageKey, mode);
  } catch {
    // The game continues when local storage is unavailable.
  }
  updateStartButton();
}

function setMiniGameLaunchBusy(isBusy) {
  ui.miniGamesSection.setAttribute("aria-busy", String(isBusy));
  ui.miniGameButtons.forEach(button => {
    button.disabled = isBusy;
  });
}

function launchMiniGame(mode) {
  if (isPaused || isStartingGame || !MINI_GAME_MODES.includes(mode)) return;
  clearSpeech();
  closeGameMenu();
  if (!selectedPlayer) {
    showPlayerSelectionGuidance();
    return;
  }
  clearPlayerSelectionGuidance();
  startGame({ miniGameMode: mode });
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
    hideAllScreens();
    ui.quiz.classList.remove("hidden");
    startWakeLock();
    if (questionNumber >= getSessionQuestionCount()) showSessionSummary();
    else showQuestion();
    return true;
  }
  currentQuestion = engine.questions.find(question => question.category === savedProgress.currentQuestion.category && question.correct === savedProgress.currentQuestion.correct);
  if (!currentQuestion) return false;
  currentAnswers = savedProgress.currentAnswers?.length ? savedProgress.currentAnswers : engine.getAnswers(currentQuestion);
  hideAllScreens();
  ui.quiz.classList.remove("hidden");
  ui.category.textContent = currentQuestion.label;
  renderQuestionVisual(currentQuestion);
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
        matchingPairsCompleted: Number.isFinite(savedData.matchingPairsCompleted) ? savedData.matchingPairsCompleted : 0,
        miniGamesStarted: savedData.miniGamesStarted && typeof savedData.miniGamesStarted === "object" && !Array.isArray(savedData.miniGamesStarted) ? savedData.miniGamesStarted : {},
        miniGamesCompleted: savedData.miniGamesCompleted && typeof savedData.miniGamesCompleted === "object" && !Array.isArray(savedData.miniGamesCompleted) ? savedData.miniGamesCompleted : {},
        categoryProgress: savedData.categoryProgress && typeof savedData.categoryProgress === "object" && !Array.isArray(savedData.categoryProgress) ? savedData.categoryProgress : {}
      };
    }
    return { playTime: 0, questionsAnswered: 0, correctAnswers: 0, categoryCounts: {}, difficultWords: {}, bestStreak: 0, matchingPairsCompleted: 0, miniGamesStarted: {}, miniGamesCompleted: {}, categoryProgress: {} };
  } catch {
    return { playTime: 0, questionsAnswered: 0, correctAnswers: 0, categoryCounts: {}, difficultWords: {}, bestStreak: 0, matchingPairsCompleted: 0, miniGamesStarted: {}, miniGamesCompleted: {}, categoryProgress: {} };
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

function getCategoryProgress(categoryId) {
  parentData.categoryProgress = parentData.categoryProgress && typeof parentData.categoryProgress === "object" ? parentData.categoryProgress : {};
  const saved = parentData.categoryProgress[categoryId];
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
    parentData.categoryProgress[categoryId] = { played: 0, questions: 0, correct: 0, completions: 0, sessionTypes: {} };
  }
  const progress = parentData.categoryProgress[categoryId];
  progress.sessionTypes = progress.sessionTypes && typeof progress.sessionTypes === "object" ? progress.sessionTypes : {};
  return progress;
}

function recordLearningSessionStarted(categories, sessionType) {
  activeLearningSessionCategories = [...new Set(categories)];
  activeLearningSessionType = sessionType;
  activeLearningSessionCategories.forEach(categoryId => {
    const progress = getCategoryProgress(categoryId);
    progress.played = (Number(progress.played) || 0) + 1;
    const typeProgress = progress.sessionTypes[sessionType] && typeof progress.sessionTypes[sessionType] === "object" ? progress.sessionTypes[sessionType] : {};
    typeProgress.started = (Number(typeProgress.started) || 0) + 1;
    progress.sessionTypes[sessionType] = typeProgress;
  });
  saveParentData();
}

function recordLearningSessionCompleted() {
  if (!activeLearningSessionCategories.length || !activeLearningSessionType) return;
  activeLearningSessionCategories.forEach(categoryId => {
    const progress = getCategoryProgress(categoryId);
    progress.completions = (Number(progress.completions) || 0) + 1;
    const typeProgress = progress.sessionTypes[activeLearningSessionType] && typeof progress.sessionTypes[activeLearningSessionType] === "object" ? progress.sessionTypes[activeLearningSessionType] : {};
    typeProgress.completed = (Number(typeProgress.completed) || 0) + 1;
    progress.sessionTypes[activeLearningSessionType] = typeProgress;
  });
  saveParentData();
  activeLearningSessionCategories = [];
  activeLearningSessionType = undefined;
}

function updateParentData(wasCorrect) {
  parentData.questionsAnswered += 1;
  parentData.categoryCounts[currentQuestion.label] = (parentData.categoryCounts[currentQuestion.label] ?? 0) + 1;
  const categoryProgress = getCategoryProgress(currentQuestion.category);
  categoryProgress.questions = (Number(categoryProgress.questions) || 0) + 1;
  if (wasCorrect) {
    parentData.correctAnswers += 1;
    parentData.bestStreak = Math.max(parentData.bestStreak, streak);
    categoryProgress.correct = (Number(categoryProgress.correct) || 0) + 1;
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
  if (matchingCards[firstIndex].itemId === matchingCards[secondIndex].itemId) {
    matchingCards[firstIndex].completed = true;
    matchingCards[secondIndex].completed = true;
    matchingOpenCards = [];
    matchingPairsFound += 1;
    ui.matchingFeedback.textContent = getCorrectFeedbackMessage();
    renderMatchingCards();
    audio.playSuccess();
    if (matchingPairsFound === MATCHING_PAIR_COUNT) completeMatchingGame();
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
    button.innerHTML = `<span aria-hidden="true">${category.icon ?? "🧩"}</span>${category.label}`;
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
  if (!category || !isMatchingCategoryPlayable(category)) return;
  isMatchingSessionStarting = true;
  matchingSelectedCategory = category.id;
  isMatchingGameActive = true;
  const matchingItems = category.items.slice(0, MATCHING_PAIR_COUNT);
  matchingCards = appUtils.shuffle(matchingItems.flatMap(item => [item, item])).map(item => ({
    itemId: getMatchingItemId(item),
    symbol: getMatchingItemVisual(item),
    revealed: false,
    completed: false
  }));
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

function replayMatchingWithNewCategory() {
  const otherCategories = MATCHING_CATEGORIES.filter(category => category.id !== matchingSelectedCategory);
  const nextCategory = appUtils.randomItem(otherCategories);
  startMatchingSession(nextCategory?.id ?? matchingSelectedCategory);
}

function startMatchingGame() {
  isGameNavigationBusy = false;
  isMatchingSessionStarting = false;
  matchingElapsedMs = 0;
  matchingTimerStartedAt = 0;
  clearSpeech();
  hideAllScreens();
  ui.matching.classList.remove("hidden");
  showMatchingCategorySelection();
  startPlayTime();
  startWakeLock();
}

function getListeningVisual(answer, category) {
  const matchingQuestion = engine.questions.find(question => question.category === category && question.correct === answer);
  if (matchingQuestion?.visualSvg) return { svg: matchingQuestion.visualSvg };
  if (matchingQuestion?.visual) return { visual: matchingQuestion.visual };
  if (category === "Colors") return { visual: LISTENING_COLOR_VISUALS[answer] ?? "🎨" };
  if (category === "Numbers") return { visual: LISTENING_NUMBER_VISUALS[answer] ?? "🔢" };
  return { visual: LISTENING_VISUALS[answer] ?? "❔" };
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
    const visual = getListeningVisual(answer, currentListeningQuestion.category);
    if (visual.svg) {
      button.classList.add("listening-card-svg");
      button.innerHTML = visual.svg;
    } else button.textContent = visual.visual;
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
  hideAllScreens();
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
  hideAllScreens();
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
  hideAllScreens();
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
  hideAllScreens();
  ui.sorting.classList.remove("hidden");
  ui.sortingFeedback.textContent = "Bir nesneye dokun, sonra kutusuna dokun. İstersen sürükle.";
  renderSortingGame();
  startPlayTime();
  startWakeLock();
}

const NEW_MINI_GAME_CONFIG = {
  [MISSING_ITEM_MODE]: { eyebrow: "HANGİSİ EKSİK?", title: "Kaybolanı bul!", rounds: 8 },
  [SHADOW_MODE]: { eyebrow: "GÖLGESİNİ BUL", title: "Doğru gölgeyi bul!", rounds: 8 },
  [INITIAL_LETTER_MODE]: { eyebrow: "İLK HARFİ BUL", title: "İlk harfi seç!", rounds: 10 },
  [SOUND_MEMORY_MODE]: { eyebrow: "SES HAFIZASI", title: "Aynı sesleri bul!" },
  [PUZZLE_MODE]: { eyebrow: "YAPBOZ", title: "Resmi tamamla!" }
};

function createEmptyNewMiniGameState(mode) {
  return {
    mode, sessionId: ++newMiniGameSessionId, round: 0, correct: 0, streak: 0,
    inputLocked: false, speaking: false, completed: false, pendingDelay: undefined,
    challenge: undefined, board: [], firstCard: undefined, attempts: 0,
    elapsedMs: 0, timerStartedAt: 0, soundDifficulty: "standard",
    puzzleDifficulty: "easy", puzzleId: newMiniGames?.PUZZLES?.[0]?.id, pieces: [],
    selectedPieceId: undefined, draggedPieceId: undefined
  };
}

function newMiniGameSvgUrl(svgMarkup) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;
}

function scheduleNewMiniGame(callback, delay) {
  clearNewMiniGameDelay();
  const sessionId = newMiniGameState.sessionId;
  const pending = { callback, remaining: delay, dueAt: Date.now() + delay, timer: undefined };
  pending.timer = window.setTimeout(() => {
    if (newMiniGameState.sessionId !== sessionId || isPaused) return;
    newMiniGameState.pendingDelay = undefined;
    callback();
  }, delay);
  newMiniGameState.pendingDelay = pending;
}

function clearNewMiniGameDelay() {
  if (newMiniGameState.pendingDelay?.timer) window.clearTimeout(newMiniGameState.pendingDelay.timer);
  newMiniGameState.pendingDelay = undefined;
}

function pauseNewMiniGameState() {
  const pending = newMiniGameState.pendingDelay;
  if (pending?.timer) {
    window.clearTimeout(pending.timer);
    pending.timer = undefined;
    pending.remaining = Math.max(0, pending.dueAt - Date.now());
  }
  if (newMiniGameState.timerStartedAt) {
    newMiniGameState.elapsedMs += Date.now() - newMiniGameState.timerStartedAt;
    newMiniGameState.timerStartedAt = 0;
  }
  newMiniGameState.speaking = false;
  renderCurrentNewMiniGame();
}

function resumeNewMiniGameState() {
  if (newMiniGameState.pendingDelay) {
    const pending = newMiniGameState.pendingDelay;
    pending.dueAt = Date.now() + pending.remaining;
    const sessionId = newMiniGameState.sessionId;
    pending.timer = window.setTimeout(() => {
      if (newMiniGameState.sessionId !== sessionId || isPaused) return;
      newMiniGameState.pendingDelay = undefined;
      pending.callback();
    }, pending.remaining);
  }
  if (newMiniGameState.mode === SOUND_MEMORY_MODE && newMiniGameState.board.length && !newMiniGameState.completed) newMiniGameState.timerStartedAt = Date.now();
  renderCurrentNewMiniGame();
}

function cleanupNewMiniGame() {
  clearNewMiniGameDelay();
  newMiniGameState.sessionId += 1;
  newMiniGameState.inputLocked = false;
  newMiniGameState.speaking = false;
  newMiniGameState.selectedPieceId = undefined;
  newMiniGameState.draggedPieceId = undefined;
  newMiniGameState.timerStartedAt = 0;
  isNewMiniGameActive = false;
  ui.newMiniGameSetup.textContent = "";
  ui.newMiniGameVisual.textContent = "";
  ui.newMiniGameChoices.textContent = "";
  ui.newMiniGameCompletion.classList.add("hidden");
}

async function speakNewMiniGame(text, language = TURKISH_LANGUAGE) {
  if (!text || isPaused || !isNewMiniGameActive) return false;
  const sessionId = newMiniGameState.sessionId;
  clearSpeech();
  newMiniGameState.speaking = true;
  renderCurrentNewMiniGame();
  await speech.speak(text, language);
  if (sessionId !== newMiniGameState.sessionId || isPaused || !isNewMiniGameActive) return false;
  newMiniGameState.speaking = false;
  renderCurrentNewMiniGame();
  return true;
}

function updateNewMiniGameProgress(current, total) {
  ui.newMiniGameProgressLabel.textContent = total ? `${current}/${total}` : "";
  ui.newMiniGameProgressFill.style.width = total ? `${Math.min(100, (current / total) * 100)}%` : "0";
}

function resetNewMiniGameView() {
  ui.newMiniGameSetup.classList.add("hidden");
  ui.newMiniGameArea.classList.remove("hidden");
  ui.newMiniGameCompletion.classList.add("hidden");
  ui.newMiniGameListen.classList.add("hidden");
  ui.newMiniGameVisual.className = "new-mini-game-visual";
  ui.newMiniGameChoices.className = "new-mini-game-choices";
  ui.newMiniGameVisual.textContent = "";
  ui.newMiniGameChoices.textContent = "";
  ui.newMiniGameFeedback.textContent = "";
  ui.newMiniGameFeedback.className = "matching-feedback";
  ui.newMiniGameChange.classList.add("hidden");
}

function addNewMiniGameChoice({ label, visual, className = "", disabled = false, onClick, ariaLabel = label }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `new-mini-game-choice ${className}`.trim();
  button.disabled = disabled || isPaused;
  button.setAttribute("aria-label", ariaLabel);
  if (visual) button.innerHTML = `<span class="choice-visual" aria-hidden="true">${visual}</span><span>${label}</span>`;
  else button.textContent = label;
  button.addEventListener("click", onClick);
  ui.newMiniGameChoices.append(button);
  return button;
}

function recordNewMiniGameStarted(mode) {
  parentData.miniGamesStarted = parentData.miniGamesStarted && typeof parentData.miniGamesStarted === "object" ? parentData.miniGamesStarted : {};
  parentData.miniGamesStarted[mode] = (Number(parentData.miniGamesStarted[mode]) || 0) + 1;
  saveParentData();
}

function updateDailyGoalForMiniGame(key) {
  if (!ensureDailyGoal() || dailyGoalData.completed) return;
  const goal = getDailyGoal(dailyGoalData.goalId);
  if (!goal) return;
  if (goal.id === "ten-correct") dailyGoalData.progress = Math.min(goal.target, (Number(dailyGoalData.progress) || 0) + 1);
  if (goal.id === "streak-three") dailyGoalData.progress = Math.max(Number(dailyGoalData.progress) || 0, Math.min(newMiniGameState.streak, goal.target));
  if (goal.id === "five-different") {
    const answered = Array.isArray(dailyGoalData.answeredQuestionKeys) ? dailyGoalData.answeredQuestionKeys : [];
    const questionKey = `mini-game|${newMiniGameState.mode}|${key}`;
    if (!answered.includes(questionKey)) answered.push(questionKey);
    dailyGoalData.answeredQuestionKeys = answered;
    dailyGoalData.progress = Math.min(goal.target, answered.length);
  }
  if ((Number(dailyGoalData.progress) || 0) >= goal.target) completeDailyGoal();
  else {
    saveDailyGoalData();
    renderDailyGoal();
  }
}

function recordNewMiniGameCorrect(key) {
  newMiniGameState.correct += 1;
  newMiniGameState.streak += 1;
  parentData.questionsAnswered += 1;
  parentData.correctAnswers += 1;
  parentData.bestStreak = Math.max(parentData.bestStreak, newMiniGameState.streak);
  const label = NEW_MINI_GAME_CONFIG[newMiniGameState.mode].eyebrow;
  parentData.categoryCounts[label] = (parentData.categoryCounts[label] ?? 0) + 1;
  saveParentData();
  updateDailyGoalForMiniGame(key);
  checkAchievements();
}

function recordNewMiniGameWrong() {
  newMiniGameState.streak = 0;
  parentData.questionsAnswered += 1;
  saveParentData();
}

function recordNewMiniGameCompleted() {
  const mode = newMiniGameState.mode;
  parentData.miniGamesCompleted = parentData.miniGamesCompleted && typeof parentData.miniGamesCompleted === "object" ? parentData.miniGamesCompleted : {};
  parentData.miniGamesCompleted[mode] = (Number(parentData.miniGamesCompleted[mode]) || 0) + 1;
  saveParentData();
  awardSticker();
}

function celebrateNewMiniGame() {
  animations.celebrate();
  audio.playCelebration();
}

function finishNewMiniGame(copy) {
  if (newMiniGameState.completed) return;
  clearNewMiniGameDelay();
  if (newMiniGameState.timerStartedAt) {
    newMiniGameState.elapsedMs += Date.now() - newMiniGameState.timerStartedAt;
    newMiniGameState.timerStartedAt = 0;
  }
  newMiniGameState.completed = true;
  newMiniGameState.inputLocked = true;
  isNewMiniGameActive = false;
  ui.newMiniGameArea.classList.add("hidden");
  ui.newMiniGameSetup.classList.add("hidden");
  ui.newMiniGameCompletion.classList.remove("hidden");
  ui.newMiniGameCompletionCopy.textContent = copy;
  ui.newMiniGamePause.disabled = true;
  ui.newMiniGameChange.classList.toggle("hidden", ![SOUND_MEMORY_MODE, PUZZLE_MODE].includes(newMiniGameState.mode));
  ui.newMiniGameChange.textContent = newMiniGameState.mode === SOUND_MEMORY_MODE ? "Zorluk Seç" : "Başka Yapboz Seç";
  recordNewMiniGameCompleted();
  celebrateNewMiniGame();
  ui.newMiniGameReplay.focus();
}

function showMissingItemRound() {
  if (!isNewMiniGameActive || isPaused) return;
  if (newMiniGameState.round >= NEW_MINI_GAME_CONFIG[MISSING_ITEM_MODE].rounds) {
    finishNewMiniGame(`${newMiniGameState.correct} kayıp resmi buldun.`);
    return;
  }
  resetNewMiniGameView();
  newMiniGameState.challenge = newMiniGames.createMissingRound(newMiniGameState.round);
  newMiniGameState.round += 1;
  newMiniGameState.inputLocked = true;
  updateNewMiniGameProgress(newMiniGameState.round, 8);
  ui.newMiniGamePrompt.textContent = "Resimlere dikkat et.";
  newMiniGameState.challenge.presented.forEach(item => {
    const card = document.createElement("span");
    card.className = "missing-item";
    card.setAttribute("aria-hidden", "true");
    card.textContent = item.visual;
    ui.newMiniGameVisual.append(card);
  });
  speakNewMiniGame("Resimlere dikkat et.");
  scheduleNewMiniGame(revealMissingItemChoices, 1800);
}

function revealMissingItemChoices() {
  if (!isNewMiniGameActive || isPaused) return;
  const challenge = newMiniGameState.challenge;
  ui.newMiniGameVisual.textContent = "";
  challenge.remaining.forEach(item => {
    const card = document.createElement("span");
    card.className = "missing-item";
    card.textContent = item.visual;
    ui.newMiniGameVisual.append(card);
  });
  const gone = document.createElement("span");
  gone.className = "missing-item gone";
  gone.textContent = "?";
  ui.newMiniGameVisual.append(gone);
  ui.newMiniGamePrompt.textContent = "Hangisi eksik?";
  newMiniGameState.inputLocked = false;
  renderMissingItemChoices();
  speakNewMiniGame("Hangisi eksik?");
}

function renderMissingItemChoices(wrongId) {
  const challenge = newMiniGameState.challenge;
  ui.newMiniGameChoices.textContent = "";
  challenge.choices.forEach(item => addNewMiniGameChoice({
    label: item.label, visual: item.visual, className: wrongId === item.id ? "try-again-choice" : "",
    disabled: newMiniGameState.inputLocked || newMiniGameState.speaking,
    onClick: () => chooseMissingItem(item.id)
  }));
}

async function chooseMissingItem(itemId) {
  if (!isNewMiniGameActive || isPaused || newMiniGameState.inputLocked || newMiniGameState.speaking) return;
  if (itemId !== newMiniGameState.challenge.missing.id) {
    recordNewMiniGameWrong();
    ui.newMiniGameFeedback.textContent = "Bir daha bakalım.";
    ui.newMiniGameFeedback.className = "matching-feedback try-again";
    renderMissingItemChoices(itemId);
    await speakNewMiniGame("Bir daha bakalım.");
    renderMissingItemChoices();
    return;
  }
  newMiniGameState.inputLocked = true;
  recordNewMiniGameCorrect(newMiniGameState.challenge.missing.id);
  ui.newMiniGameFeedback.textContent = "Harika, kaybolanı buldun!";
  ui.newMiniGameFeedback.className = "matching-feedback success";
  audio.playSuccess();
  renderMissingItemChoices();
  await speakNewMiniGame("Harika!");
  scheduleNewMiniGame(showMissingItemRound, 450);
}

function showShadowRound() {
  if (!isNewMiniGameActive || isPaused) return;
  if (newMiniGameState.round >= 8) {
    finishNewMiniGame(`${newMiniGameState.correct} doğru gölgeyi buldun.`);
    return;
  }
  resetNewMiniGameView();
  newMiniGameState.challenge = newMiniGames.createShadowRound(newMiniGameState.round);
  newMiniGameState.round += 1;
  newMiniGameState.inputLocked = false;
  updateNewMiniGameProgress(newMiniGameState.round, 8);
  ui.newMiniGamePrompt.textContent = `${newMiniGameState.challenge.source.label} hangisinin gölgesi?`;
  const source = document.createElement("img");
  source.className = "shadow-source";
  source.src = newMiniGameSvgUrl(newMiniGameState.challenge.source.svg);
  source.alt = "";
  ui.newMiniGameVisual.append(source);
  renderShadowChoices();
  speakNewMiniGame("Doğru gölgeyi bul.");
}

function renderShadowChoices(wrongId) {
  ui.newMiniGameChoices.textContent = "";
  newMiniGameState.challenge.choices.forEach(item => {
    const button = addNewMiniGameChoice({
      label: "", className: `shadow-choice${wrongId === item.id ? " try-again-choice" : ""}`,
      ariaLabel: "Gölge seçeneği", disabled: newMiniGameState.inputLocked || newMiniGameState.speaking,
      onClick: () => chooseShadow(item.id)
    });
    const image = document.createElement("img");
    image.src = newMiniGameSvgUrl(item.svg);
    image.alt = "";
    button.append(image);
  });
}

async function chooseShadow(itemId) {
  if (!isNewMiniGameActive || isPaused || newMiniGameState.inputLocked || newMiniGameState.speaking) return;
  if (itemId !== newMiniGameState.challenge.source.id) {
    recordNewMiniGameWrong();
    ui.newMiniGameFeedback.textContent = "Çok yaklaştın, bir daha dene.";
    renderShadowChoices(itemId);
    await speakNewMiniGame("Bir daha bakalım.");
    renderShadowChoices();
    return;
  }
  newMiniGameState.inputLocked = true;
  recordNewMiniGameCorrect(itemId);
  ui.newMiniGameFeedback.textContent = "Evet, gölgesi bu!";
  audio.playSuccess();
  renderShadowChoices();
  await speakNewMiniGame("Harika!");
  scheduleNewMiniGame(showShadowRound, 450);
}

function showInitialLetterRound() {
  if (!isNewMiniGameActive || isPaused) return;
  if (newMiniGameState.round >= 10) {
    finishNewMiniGame(`${newMiniGameState.correct} kelimenin ilk harfini buldun.`);
    return;
  }
  resetNewMiniGameView();
  newMiniGameState.challenge = newMiniGames.createLetterRound(newMiniGameState.round);
  newMiniGameState.round += 1;
  newMiniGameState.inputLocked = false;
  updateNewMiniGameProgress(newMiniGameState.round, 10);
  const { word } = newMiniGameState.challenge;
  ui.newMiniGamePrompt.textContent = `${word.word} hangi harfle başlıyor?`;
  ui.newMiniGameListen.classList.remove("hidden");
  ui.newMiniGameListen.setAttribute("aria-label", `${word.word} kelimesini tekrar dinle`);
  ui.newMiniGameVisual.innerHTML = `<span><span class="letter-word-visual" aria-hidden="true">${word.visual}</span><span class="letter-word-label">${word.word}</span></span>`;
  renderInitialLetterChoices();
  speakInitialLetterWord();
}

async function speakInitialLetterWord() {
  if (!newMiniGameState.challenge?.word) return;
  await speakNewMiniGame(newMiniGameState.challenge.word.speech, ENGLISH_LANGUAGE);
}

function renderInitialLetterChoices(wrongLetter) {
  ui.newMiniGameChoices.textContent = "";
  newMiniGameState.challenge.choices.forEach(letter => addNewMiniGameChoice({
    label: letter, className: `letter-choice${wrongLetter === letter ? " try-again-choice" : ""}`,
    ariaLabel: `${letter} harfi`, disabled: newMiniGameState.inputLocked || newMiniGameState.speaking,
    onClick: () => chooseInitialLetter(letter)
  }));
  ui.newMiniGameListen.disabled = isPaused || newMiniGameState.inputLocked || newMiniGameState.speaking;
}

async function chooseInitialLetter(letter) {
  if (!isNewMiniGameActive || isPaused || newMiniGameState.inputLocked || newMiniGameState.speaking) return;
  const word = newMiniGameState.challenge.word;
  if (letter !== word.letter) {
    recordNewMiniGameWrong();
    ui.newMiniGameFeedback.textContent = "Bir daha dinleyelim.";
    renderInitialLetterChoices(letter);
    await speakNewMiniGame("Bir daha dinleyelim.");
    await speakInitialLetterWord();
    renderInitialLetterChoices();
    return;
  }
  newMiniGameState.inputLocked = true;
  recordNewMiniGameCorrect(word.id);
  ui.newMiniGameFeedback.textContent = `Evet! ${word.word}, ${word.letter} harfiyle başlıyor.`;
  audio.playSuccess();
  renderInitialLetterChoices();
  await speakNewMiniGame("Harika!");
  scheduleNewMiniGame(showInitialLetterRound, 450);
}

function renderSoundMemorySetup() {
  resetNewMiniGameView();
  ui.newMiniGameArea.classList.add("hidden");
  ui.newMiniGameSetup.classList.remove("hidden");
  ui.newMiniGameSetup.innerHTML = "<h3>Kaç ses çifti bulalım?</h3>";
  const options = document.createElement("div");
  options.className = "setup-options";
  Object.values(newMiniGames.SOUND_DIFFICULTIES).forEach(difficulty => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "setup-choice";
    button.setAttribute("aria-pressed", String(newMiniGameState.soundDifficulty === difficulty.id));
    button.textContent = `${difficulty.label} · ${difficulty.pairs} çift`;
    button.addEventListener("click", () => {
      newMiniGameState.soundDifficulty = difficulty.id;
      renderSoundMemorySetup();
    });
    options.append(button);
  });
  const start = document.createElement("button");
  start.type = "button";
  start.className = "primary-button";
  start.textContent = "Oyunu Başlat";
  start.addEventListener("click", startSoundMemorySession);
  ui.newMiniGameSetup.append(options, start);
}

function startSoundMemorySession() {
  clearSpeech();
  newMiniGameState.board = newMiniGames.createSoundBoard(newMiniGameState.soundDifficulty);
  newMiniGameState.firstCard = undefined;
  newMiniGameState.attempts = 0;
  newMiniGameState.correct = 0;
  newMiniGameState.inputLocked = false;
  newMiniGameState.completed = false;
  newMiniGameState.elapsedMs = 0;
  newMiniGameState.timerStartedAt = Date.now();
  ui.newMiniGameSetup.classList.add("hidden");
  ui.newMiniGameArea.classList.remove("hidden");
  renderSoundMemoryBoard();
}

function renderSoundMemoryBoard() {
  resetNewMiniGameView();
  const matchedPairs = newMiniGameState.board.filter(card => card.matched).length / 2;
  const totalPairs = newMiniGameState.board.length / 2;
  updateNewMiniGameProgress(matchedPairs, totalPairs);
  ui.newMiniGamePrompt.textContent = "Kartlara dokun, aynı sesleri bul.";
  ui.newMiniGameVisual.classList.add("hidden");
  ui.newMiniGameChoices.className = "new-mini-game-choices sound-memory-board";
  newMiniGameState.board.forEach((card, index) => {
    addNewMiniGameChoice({
      label: card.revealed || card.matched ? "🔊" : "?",
      className: `sound-card${card.revealed ? " open" : ""}${card.matched ? " matched" : ""}`,
      ariaLabel: card.matched ? `Eşleşen ses kartı ${index + 1}` : card.revealed ? `Açık ses kartı ${index + 1}, tekrar dinle` : `Kapalı ses kartı ${index + 1}`,
      disabled: card.matched || newMiniGameState.inputLocked || newMiniGameState.speaking,
      onClick: () => openSoundMemoryCard(index)
    });
  });
  ui.newMiniGameFeedback.textContent = newMiniGameState.attempts ? `${newMiniGameState.attempts} deneme` : "İlk kartı aç.";
}

async function openSoundMemoryCard(index) {
  const card = newMiniGameState.board[index];
  if (!isNewMiniGameActive || isPaused || !newMiniGames.canSelectSoundCard(card, newMiniGameState.inputLocked, newMiniGameState.speaking)) return;
  if (card.revealed) {
    await speakNewMiniGame(card.speech, ENGLISH_LANGUAGE);
    return;
  }
  card.revealed = true;
  renderSoundMemoryBoard();
  if (!await speakNewMiniGame(card.speech, ENGLISH_LANGUAGE)) return;
  if (newMiniGameState.firstCard === undefined) {
    newMiniGameState.firstCard = index;
    renderSoundMemoryBoard();
    return;
  }
  const firstIndex = newMiniGameState.firstCard;
  const first = newMiniGameState.board[firstIndex];
  newMiniGameState.firstCard = undefined;
  newMiniGameState.attempts += 1;
  newMiniGameState.inputLocked = true;
  if (first.targetId === card.targetId) {
    first.matched = true;
    card.matched = true;
    recordNewMiniGameCorrect(card.targetId);
    audio.playSuccess();
    ui.newMiniGameFeedback.textContent = "Aynı sesi buldun!";
    if (newMiniGameState.board.every(item => item.matched)) {
      const elapsed = newMiniGameState.elapsedMs + (Date.now() - newMiniGameState.timerStartedAt);
      finishNewMiniGame(`${newMiniGameState.attempts} denemede, ${formatMatchingTime(elapsed)} içinde tamamladın.`);
      return;
    }
  } else {
    recordNewMiniGameWrong();
    ui.newMiniGameFeedback.textContent = "Sesler farklı, yeniden dinleyelim.";
  }
  renderSoundMemoryBoard();
  scheduleNewMiniGame(() => {
    first.revealed = first.matched;
    card.revealed = card.matched;
    newMiniGameState.inputLocked = false;
    renderSoundMemoryBoard();
  }, 700);
}

function renderPuzzleSetup() {
  resetNewMiniGameView();
  ui.newMiniGameArea.classList.add("hidden");
  ui.newMiniGameSetup.classList.remove("hidden");
  ui.newMiniGameSetup.innerHTML = "<h3>Bir resim seç</h3>";
  const puzzles = document.createElement("div");
  puzzles.className = "setup-options puzzle-selector";
  newMiniGames.PUZZLES.forEach(puzzle => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "setup-choice";
    button.setAttribute("aria-pressed", String(newMiniGameState.puzzleId === puzzle.id));
    button.innerHTML = `<img src="${newMiniGameSvgUrl(puzzle.svg)}" alt=""><span>${puzzle.label}</span>`;
    button.addEventListener("click", () => {
      newMiniGameState.puzzleId = puzzle.id;
      renderPuzzleSetup();
    });
    puzzles.append(button);
  });
  const difficultyTitle = document.createElement("h3");
  difficultyTitle.textContent = "Zorluk seç";
  const difficulties = document.createElement("div");
  difficulties.className = "setup-options";
  Object.values(newMiniGames.PUZZLE_DIFFICULTIES).forEach(difficulty => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "setup-choice";
    button.setAttribute("aria-pressed", String(newMiniGameState.puzzleDifficulty === difficulty.id));
    button.textContent = `${difficulty.label} · ${difficulty.columns} × ${difficulty.rows}`;
    button.addEventListener("click", () => {
      newMiniGameState.puzzleDifficulty = difficulty.id;
      renderPuzzleSetup();
    });
    difficulties.append(button);
  });
  const start = document.createElement("button");
  start.type = "button";
  start.className = "primary-button";
  start.textContent = "Yapbozu Başlat";
  start.addEventListener("click", startPuzzleSession);
  ui.newMiniGameSetup.append(puzzles, difficultyTitle, difficulties, start);
}

function startPuzzleSession() {
  newMiniGameState.pieces = newMiniGames.createPuzzlePieces(newMiniGameState.puzzleDifficulty);
  newMiniGameState.selectedPieceId = undefined;
  newMiniGameState.draggedPieceId = undefined;
  newMiniGameState.correct = 0;
  newMiniGameState.completed = false;
  newMiniGameState.inputLocked = false;
  ui.newMiniGameSetup.classList.add("hidden");
  ui.newMiniGameArea.classList.remove("hidden");
  renderPuzzleGame();
}

function puzzlePieceStyle(piece, puzzle, difficulty) {
  const x = difficulty.columns === 1 ? 0 : (piece.column / (difficulty.columns - 1)) * 100;
  const y = difficulty.rows === 1 ? 0 : (piece.row / (difficulty.rows - 1)) * 100;
  return `background-image:url("${newMiniGameSvgUrl(puzzle.svg)}");background-size:${difficulty.columns * 100}% ${difficulty.rows * 100}%;background-position:${x}% ${y}%`;
}

function createPuzzlePieceButton(piece, puzzle, difficulty, inTray = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `puzzle-piece${newMiniGameState.selectedPieceId === piece.id ? " selected" : ""}`;
  button.style.cssText = puzzlePieceStyle(piece, puzzle, difficulty);
  button.setAttribute("aria-label", `Yapboz parçası ${piece.target + 1}${inTray ? ", seçmek için dokun" : ", yerleştirildi"}`);
  button.disabled = isPaused || piece.placed;
  if (inTray) {
    button.draggable = true;
    button.addEventListener("dragstart", event => {
      newMiniGameState.draggedPieceId = piece.id;
      event.dataTransfer?.setData("text/plain", piece.id);
    });
    button.addEventListener("dragend", () => { newMiniGameState.draggedPieceId = undefined; });
    button.addEventListener("click", () => {
      newMiniGameState.selectedPieceId = newMiniGameState.selectedPieceId === piece.id ? undefined : piece.id;
      renderPuzzleGame();
    });
  }
  return button;
}

function renderPuzzleGame() {
  resetNewMiniGameView();
  const puzzle = newMiniGames.PUZZLES.find(item => item.id === newMiniGameState.puzzleId) ?? newMiniGames.PUZZLES[0];
  const difficulty = newMiniGames.PUZZLE_DIFFICULTIES[newMiniGameState.puzzleDifficulty];
  const placedCount = newMiniGameState.pieces.filter(piece => piece.placed).length;
  updateNewMiniGameProgress(placedCount, newMiniGameState.pieces.length);
  ui.newMiniGamePrompt.textContent = "Parçayı seç, sonra doğru yere dokun. İstersen sürükle.";
  ui.newMiniGameVisual.innerHTML = `<img class="puzzle-reference" src="${newMiniGameSvgUrl(puzzle.svg)}" alt=""><strong>${puzzle.label}</strong>`;
  ui.newMiniGameChoices.className = "new-mini-game-choices puzzle-layout";
  const board = document.createElement("div");
  board.className = "puzzle-board";
  board.style.gridTemplateColumns = `repeat(${difficulty.columns},1fr)`;
  board.style.gridTemplateRows = `repeat(${difficulty.rows},1fr)`;
  Array.from({ length: difficulty.columns * difficulty.rows }, (_, target) => {
    const placed = newMiniGameState.pieces.find(piece => piece.target === target && piece.placed);
    const slot = document.createElement(placed ? "div" : "button");
    if (!placed) slot.type = "button";
    slot.className = `puzzle-slot${placed ? " filled" : ""}`;
    slot.setAttribute("aria-label", placed ? `Dolu yapboz yeri ${target + 1}` : `Boş yapboz yeri ${target + 1}`);
    if (placed) slot.append(createPuzzlePieceButton(placed, puzzle, difficulty));
    else {
      slot.disabled = isPaused;
      slot.textContent = target + 1;
      slot.addEventListener("click", () => placePuzzlePiece(newMiniGameState.selectedPieceId, target));
      slot.addEventListener("dragover", event => event.preventDefault());
      slot.addEventListener("drop", event => {
        event.preventDefault();
        placePuzzlePiece(event.dataTransfer?.getData("text/plain") || newMiniGameState.draggedPieceId, target);
      });
    }
    board.append(slot);
  });
  const tray = document.createElement("div");
  tray.className = "puzzle-tray";
  tray.setAttribute("aria-label", "Yapboz parçaları");
  newMiniGameState.pieces.filter(piece => !piece.placed).forEach(piece => tray.append(createPuzzlePieceButton(piece, puzzle, difficulty, true)));
  ui.newMiniGameChoices.append(board, tray);
  ui.newMiniGameFeedback.textContent = newMiniGameState.selectedPieceId ? "Şimdi parçanın yerini seç." : "Bir parça seç.";
}

async function placePuzzlePiece(pieceId, target) {
  if (!isNewMiniGameActive || isPaused || newMiniGameState.inputLocked || !pieceId) return;
  const piece = newMiniGameState.pieces.find(item => item.id === pieceId && !item.placed);
  if (!piece) return;
  newMiniGameState.selectedPieceId = undefined;
  newMiniGameState.draggedPieceId = undefined;
  if (piece.target !== target) {
    recordNewMiniGameWrong();
    ui.newMiniGameFeedback.textContent = "Bu parça başka bir yere ait. Yeniden deneyelim.";
    await speakNewMiniGame("Başka bir yere bakalım.");
    renderPuzzleGame();
    return;
  }
  piece.placed = true;
  recordNewMiniGameCorrect(piece.id);
  audio.playSuccess();
  renderPuzzleGame();
  if (newMiniGames.isPuzzleComplete(newMiniGameState.pieces)) {
    finishNewMiniGame(`${newMiniGameState.pieces.length} parçayı doğru yerleştirdin.`);
  }
}

function renderCurrentNewMiniGame() {
  if (!ui.newMiniGame || newMiniGameState.completed) return;
  if (newMiniGameState.mode === MISSING_ITEM_MODE && newMiniGameState.challenge?.missing && ui.newMiniGamePrompt.textContent === "Hangisi eksik?") renderMissingItemChoices();
  else if (newMiniGameState.mode === SHADOW_MODE && newMiniGameState.challenge) renderShadowChoices();
  else if (newMiniGameState.mode === INITIAL_LETTER_MODE && newMiniGameState.challenge) renderInitialLetterChoices();
  else if (newMiniGameState.mode === SOUND_MEMORY_MODE && newMiniGameState.board.length) renderSoundMemoryBoard();
  else if (newMiniGameState.mode === PUZZLE_MODE && newMiniGameState.pieces.length) renderPuzzleGame();
}

function startNewMiniGame(mode) {
  if (!NEW_MINI_GAME_MODES.includes(mode)) return;
  cleanupNewMiniGame();
  newMiniGameState = createEmptyNewMiniGameState(mode);
  isNewMiniGameActive = true;
  const config = NEW_MINI_GAME_CONFIG[mode];
  ui.newMiniGameEyebrow.textContent = config.eyebrow;
  ui.newMiniGameTitle.textContent = config.title;
  ui.newMiniGamePause.disabled = false;
  clearSpeech();
  hideAllScreens();
  ui.newMiniGame.classList.remove("hidden");
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  recordNewMiniGameStarted(mode);
  startPlayTime();
  startWakeLock();
  if (mode === MISSING_ITEM_MODE) showMissingItemRound();
  else if (mode === SHADOW_MODE) showShadowRound();
  else if (mode === INITIAL_LETTER_MODE) showInitialLetterRound();
  else if (mode === SOUND_MEMORY_MODE) renderSoundMemorySetup();
  else renderPuzzleSetup();
  ui.newMiniGameTitle.focus({ preventScroll: true });
}

function replayNewMiniGame() {
  const mode = newMiniGameState.mode;
  if (NEW_MINI_GAME_MODES.includes(mode)) startNewMiniGame(mode);
}

function changeNewMiniGameSetup() {
  const mode = newMiniGameState.mode;
  if (mode === SOUND_MEMORY_MODE || mode === PUZZLE_MODE) startNewMiniGame(mode);
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
  if (learningCategories?.questions?.length) return new window.MilaQuestionEngine(learningCategories.questions);
  if (window.location.protocol === "file:") return new window.MilaQuestionEngine(window.MilaOfflineQuestions);
  const index = await loadJson(DATA_INDEX_URL);
  const categoryData = await Promise.all(index.files.map(file => loadJson(`./data/${file}`)));
  return new window.MilaQuestionEngine(categoryData.flat());
}

function createEmptyNumberLearningState() {
  return {
    stageId: undefined,
    roundNumber: 0,
    totalRounds: 0,
    round: undefined,
    ordering: undefined,
    selectedNumber: undefined,
    inputLocked: false,
    speaking: false,
    pendingResult: undefined,
    attempts: 0,
    helpShown: false,
    combined: false,
    counting: false,
    removal: undefined,
    removalConfirmed: false,
    recentEquations: []
  };
}

function clearNumberLearningTimer() {
  window.clearTimeout(numberLearningTimer);
  numberLearningTimer = undefined;
}

function cleanupNumberLearning({ preserveStage = false } = {}) {
  numberLearningSessionId += 1;
  numberLearningSupportRun += 1;
  clearNumberLearningTimer();
  if (isNumberLearningActive) clearSpeech();
  isNumberLearningActive = false;
  numberLearningState = createEmptyNumberLearningState();
  if (!preserveStage) ui.numberLearning.classList.add("hidden");
  ui.numberLearningVisual.textContent = "";
  ui.numberLearningAnswers.textContent = "";
  ui.numberLearningAnswers.classList.remove("visual-total-answers");
  ui.numberLearningFeedback.textContent = "";
  ui.numberLearningCheck.classList.add("hidden");
  ui.numberLearningCombine.classList.add("hidden");
  ui.numberLearningHelp.classList.add("hidden");
  ui.numberLearningCount.classList.add("hidden");
  ui.numberLearningCount.setAttribute("aria-pressed", "false");
}

function renderQuantityVisual(container, visual, { neutralLabel } = {}) {
  container.className = "quantity-visual";
  container.setAttribute("role", "img");
  container.setAttribute("aria-label", neutralLabel ?? `${visual.quantity} tane ${visual.groupLabel.toLocaleLowerCase("tr-TR")} nesnesi`);
  if (visual.quantity === 0) {
    const empty = document.createElement("span");
    empty.className = "quantity-zero";
    empty.textContent = "Boş";
    container.append(empty);
    return;
  }
  visual.rows.forEach(row => {
    const rowElement = document.createElement("span");
    rowElement.className = "quantity-row";
    rowElement.setAttribute("aria-hidden", "true");
    rowElement.textContent = row.join(" ");
    container.append(rowElement);
  });
}

function setNumberLearningInputEnabled(enabled) {
  if (!numberLearningState) return;
  const canUse = enabled && !isPaused && !numberLearningState.inputLocked && !numberLearningState.speaking;
  ui.numberLearning.querySelectorAll("button").forEach(button => {
    if (button === ui.numberLearningPath || button === ui.numberLearningPause) return;
    if (button === ui.numberLearningCount && numberLearningState.counting) {
      button.disabled = isPaused;
      return;
    }
    const orderingIncomplete = button === ui.numberLearningCheck && numberLearningState.ordering?.slots.some(value => value === null);
    button.disabled = !canUse || orderingIncomplete;
  });
  ui.numberLearningPath.disabled = isPaused;
  ui.numberLearningPause.disabled = isPaused;
}

async function speakNumberLearningPrompt() {
  if (!isNumberLearningActive || isPaused || !numberLearningState?.round || numberLearningState.speaking) return;
  clearSpeech();
  const sessionId = numberLearningSessionId;
  const run = audioRun;
  numberLearningState.speaking = true;
  setNumberLearningInputEnabled(false);
  await speech.speak(numberLearningState.round.speech, TURKISH_LANGUAGE);
  if (!isNumberLearningActive || isPaused || sessionId !== numberLearningSessionId || run !== audioRun) return;
  numberLearningState.speaking = false;
  setNumberLearningInputEnabled(true);
}

function renderNumberLearningOrdering() {
  const state = numberLearningState.ordering;
  const tray = document.createElement("div");
  tray.className = "number-ordering-tray";
  tray.setAttribute("aria-label", "Sıralanacak sayılar");
  state.pieces.forEach(value => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `number-learning-choice number-piece${numberLearningState.selectedNumber === value ? " selected" : ""}`;
    button.textContent = value;
    button.draggable = true;
    button.setAttribute("aria-label", `${value} sayısını seç`);
    button.setAttribute("aria-pressed", String(numberLearningState.selectedNumber === value));
    button.addEventListener("click", () => {
      if (numberLearningState.inputLocked || isPaused) return;
      numberLearningState.selectedNumber = value;
      renderNumberLearningRound();
    });
    button.addEventListener("dragstart", event => {
      if (numberLearningState.inputLocked || isPaused) return event.preventDefault();
      numberLearningState.selectedNumber = value;
      event.dataTransfer?.setData("text/plain", String(value));
    });
    tray.append(button);
  });
  const slots = document.createElement("div");
  slots.className = "number-ordering-slots";
  slots.setAttribute("aria-label", "Sıralama kutuları");
  state.slots.forEach((value, index) => {
    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = `number-ordering-slot${value === null ? "" : " filled"}`;
    slot.textContent = value === null ? `${index + 1}` : value;
    slot.setAttribute("aria-label", value === null ? `${index + 1}. boş kutu` : `${index + 1}. kutuda ${value}`);
    slot.addEventListener("click", () => placeSelectedNumber(index));
    slot.addEventListener("dragover", event => event.preventDefault());
    slot.addEventListener("drop", event => {
      event.preventDefault();
      const draggedValue = Number(event.dataTransfer?.getData("text/plain"));
      if (Number.isInteger(draggedValue)) numberLearningState.selectedNumber = draggedValue;
      placeSelectedNumber(index);
    });
    slots.append(slot);
  });
  ui.numberLearningAnswers.append(tray, slots);
  ui.numberLearningCheck.classList.remove("hidden");
  ui.numberLearningCheck.disabled = state.slots.some(value => value === null) || numberLearningState.inputLocked || isPaused;
}

function placeSelectedNumber(slotIndex) {
  if (numberLearningState.inputLocked || isPaused || !Number.isInteger(numberLearningState.selectedNumber)) return;
  numberLearning.placeOrderingPiece(numberLearningState.ordering, numberLearningState.selectedNumber, slotIndex);
  numberLearningState.selectedNumber = undefined;
  renderNumberLearningRound();
}

function createNumberChoice(value, accessibleLabel, onSelect) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "number-learning-choice";
  button.textContent = value;
  button.dataset.numberValue = String(value);
  button.setAttribute("aria-label", accessibleLabel);
  button.addEventListener("click", () => onSelect(button));
  return button;
}

function renderAdditionQuantity(container, visual, { neutralLabel, groupLabel } = {}) {
  container.className = "addition-quantity";
  container.setAttribute("role", "img");
  container.setAttribute("aria-label", neutralLabel ?? `${visual.quantity} tane ${groupLabel ?? visual.groupLabel.toLocaleLowerCase("tr-TR")} nesnesi`);
  if (visual.quantity === 0) {
    const empty = document.createElement("span");
    empty.className = "addition-empty-group";
    empty.textContent = "0 tane · boş";
    empty.setAttribute("aria-hidden", "true");
    container.append(empty);
    return;
  }
  let objectIndex = 0;
  visual.blocks.forEach((blockSize, blockIndex) => {
    const block = document.createElement("span");
    block.className = `addition-quantity-block${blockSize === 10 ? " ten-block" : ""}`;
    block.setAttribute("aria-hidden", "true");
    for (let index = 0; index < blockSize; index += 1) {
      const object = document.createElement("span");
      object.className = "addition-object";
      object.dataset.countIndex = String(objectIndex);
      object.textContent = visual.symbol;
      block.append(object);
      objectIndex += 1;
    }
    if (blockIndex > 0) block.classList.add("remainder-block");
    container.append(block);
  });
}

function createAdditionSymbol(symbol, label) {
  const element = document.createElement("span");
  element.className = "addition-symbol";
  element.textContent = symbol;
  element.setAttribute("role", "img");
  element.setAttribute("aria-label", label);
  return element;
}

function renderAdditionGroups(round, { help = false } = {}) {
  const equation = document.createElement("div");
  equation.className = `addition-visual-equation${numberLearningState.combined ? " combined" : ""}${help ? " help-equation" : ""}`;
  equation.setAttribute("aria-label", round.accessibleEquation);
  const firstGroup = document.createElement("div");
  firstGroup.className = "addition-group first-group";
  renderAdditionQuantity(firstGroup, round.firstVisual);
  const secondGroup = document.createElement("div");
  secondGroup.className = "addition-group second-group";
  renderAdditionQuantity(secondGroup, round.secondVisual);
  equation.append(firstGroup, createAdditionSymbol("+", "artı"), secondGroup);
  if (round.type === "visual-addition" || help) {
    equation.append(createAdditionSymbol("=", "eşittir"));
    const result = document.createElement("span");
    result.className = "addition-result-question";
    result.textContent = "?";
    result.setAttribute("role", "img");
    result.setAttribute("aria-label", "sonuç");
    equation.append(result);
  }
  return equation;
}

function renderAdditionRoundVisual(round) {
  if (round.type === "numeric-addition") {
    const equation = document.createElement("div");
    equation.className = "numeric-addition-equation";
    equation.setAttribute("role", "img");
    equation.setAttribute("aria-label", `${numberLearning.getTurkishNumber(round.first)} artı ${numberLearning.getTurkishNumber(round.second)} eşittir sonuç`);
    [
      { text: round.first, label: `${round.first}` },
      { text: "+", label: "artı" },
      { text: round.second, label: `${round.second}` },
      { text: "=", label: "eşittir" },
      { text: "?", label: "sonuç" }
    ].forEach(part => {
      const span = document.createElement("span");
      span.textContent = part.text;
      span.setAttribute("aria-label", part.label);
      equation.append(span);
    });
    ui.numberLearningVisual.append(equation);
    if (numberLearningState.helpShown) ui.numberLearningVisual.append(renderAdditionGroups(round, { help: true }));
    return;
  }
  ui.numberLearningVisual.append(renderAdditionGroups(round));
}

function renderAdditionSupport(round) {
  ui.numberLearningCombine.textContent = "🤝 Birleştir";
  ui.numberLearningCombine.classList.toggle("hidden", !round.canCombine || numberLearningState.combined);
  ui.numberLearningHelp.classList.toggle("hidden", !round.hasVisualHelp);
  ui.numberLearningHelp.classList.toggle("emphasized", round.hasVisualHelp && numberLearningState.attempts > 0 && !numberLearningState.helpShown);
  ui.numberLearningHelp.setAttribute("aria-pressed", String(numberLearningState.helpShown));
  ui.numberLearningCount.classList.toggle("hidden", !round.hasCountingSupport);
  ui.numberLearningCount.setAttribute("aria-pressed", String(numberLearningState.counting));
  ui.numberLearningCount.textContent = numberLearningState.counting ? "■ Saymayı Durdur" : "👆 Birlikte Say";
}

function toggleSubtractionObject(itemIndex) {
  if (!isNumberLearningActive || isPaused || numberLearningState.inputLocked || numberLearningState.speaking || numberLearningState.removalConfirmed) return;
  const changed = numberLearning.toggleRemovalSelection(numberLearningState.removal, itemIndex);
  if (!changed) {
    ui.numberLearningFeedback.textContent = `${numberLearningState.round.removed} nesne göndermen yeterli.`;
    return;
  }
  renderNumberLearningRound();
  const selectedCount = numberLearningState.removal.selectedIndices.length;
  ui.numberLearningFeedback.textContent = selectedCount === numberLearningState.round.removed
    ? "Hazır! Şimdi kontrol edebilirsin."
    : `${numberLearningState.round.removed - selectedCount} nesne daha seç.`;
}

function renderSubtractionObjects(container, round, { interactive = false, remainingOnly = false } = {}) {
  container.className = "subtraction-object-group";
  const selected = new Set(numberLearningState.removal?.selectedIndices ?? []);
  const useManualSelection = round.manualRemoval && selected.size > 0;
  container.setAttribute("aria-label", interactive
    ? `${round.first} nesne. Gidecek ${round.removed} nesneyi seç.`
    : remainingOnly ? "Kalan nesneler" : `${round.first} nesneden ${round.removed} tanesi gidiyor.`);
  if (remainingOnly && round.result === 0) {
    const empty = document.createElement("span");
    empty.className = "addition-empty-group";
    empty.textContent = "Hiç kalmadı · 0";
    container.append(empty);
    return;
  }
  const count = remainingOnly ? round.result : round.first;
  for (let index = 0; index < count; index += 1) {
    const isRemoved = !remainingOnly && (interactive || useManualSelection ? selected.has(index) : index >= round.result);
    const object = document.createElement(interactive ? "button" : "span");
    if (interactive) {
      object.type = "button";
      object.setAttribute("aria-pressed", String(isRemoved));
      object.setAttribute("aria-label", `${index + 1}. nesne, ${isRemoved ? "gidecek olarak seçildi" : "seçilmedi"}`);
      object.addEventListener("click", () => toggleSubtractionObject(index));
    } else {
      object.setAttribute("aria-hidden", "true");
    }
    object.className = `subtraction-object ${isRemoved ? "removed" : "remaining"}`;
    object.dataset.countIndex = String(index);
    object.textContent = round.startVisual.symbol;
    container.append(object);
  }
}

function renderSubtractionVisualAid(round, { help = false } = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = `subtraction-visual-equation${help ? " help-equation" : ""}`;
  wrapper.setAttribute("aria-label", round.accessibleEquation);
  if (round.pattern === "before-after" && !round.manualRemoval) {
    const before = document.createElement("div");
    before.className = "subtraction-group before-group";
    renderSubtractionObjects(before, round);
    before.querySelectorAll(".removed").forEach(object => object.classList.remove("removed"));
    const arrow = createAdditionSymbol("→", "sonra");
    const after = document.createElement("div");
    after.className = "subtraction-group remaining-group";
    renderSubtractionObjects(after, round, { remainingOnly: true });
    wrapper.append(before, arrow, after);
    return wrapper;
  }
  const group = document.createElement("div");
  group.className = "subtraction-group";
  renderSubtractionObjects(group, round, { interactive: round.manualRemoval && !numberLearningState.removalConfirmed });
  wrapper.append(group);
  const equationHint = document.createElement("span");
  equationHint.className = "subtraction-result-question";
  equationHint.textContent = `${round.first} − ${round.removed} = ?`;
  equationHint.setAttribute("aria-hidden", "true");
  wrapper.append(equationHint);
  return wrapper;
}

function renderSubtractionRoundVisual(round) {
  if (round.type === "numeric-subtraction") {
    const equation = document.createElement("div");
    equation.className = "numeric-addition-equation numeric-subtraction-equation";
    equation.setAttribute("role", "img");
    equation.setAttribute("aria-label", `${round.first} eksi ${round.removed} eşittir sonuç`);
    equation.textContent = round.equation;
    ui.numberLearningVisual.append(equation);
    if (numberLearningState.helpShown) ui.numberLearningVisual.append(renderSubtractionVisualAid(round, { help: true }));
    return;
  }
  ui.numberLearningVisual.append(renderSubtractionVisualAid(round));
}

function renderSubtractionSupport(round) {
  const awaitingRemoval = round.manualRemoval && !numberLearningState.removalConfirmed;
  ui.numberLearningCombine.textContent = "👋 Gidenleri Ayır";
  ui.numberLearningCombine.classList.toggle("hidden", !awaitingRemoval);
  ui.numberLearningHelp.classList.toggle("hidden", !round.hasVisualHelp);
  ui.numberLearningHelp.classList.toggle("emphasized", round.hasVisualHelp && numberLearningState.attempts > 0 && !numberLearningState.helpShown);
  ui.numberLearningHelp.setAttribute("aria-pressed", String(numberLearningState.helpShown));
  const canCount = round.hasCountingSupport && !awaitingRemoval || round.hasVisualHelp && numberLearningState.helpShown;
  ui.numberLearningCount.classList.toggle("hidden", !canCount);
  ui.numberLearningCount.setAttribute("aria-pressed", String(numberLearningState.counting));
  ui.numberLearningCount.textContent = numberLearningState.counting ? "■ Saymayı Durdur" : "👆 Kalanları Say";
  if (awaitingRemoval) {
    ui.numberLearningCheck.textContent = "Gidenleri Kontrol Et";
    ui.numberLearningCheck.classList.remove("hidden");
  }
}

function showAdditionVisualHelp() {
  if (!isNumberLearningActive || isPaused || numberLearningState.inputLocked || numberLearningState.speaking) return;
  clearSpeech();
  numberLearningSupportRun += 1;
  numberLearningState.helpShown = true;
  numberLearningState.counting = false;
  renderNumberLearningRound();
  ui.numberLearningFeedback.textContent = "Nesneleri tek tek sayabilirsin.";
  ui.numberLearningFeedback.className = "matching-feedback";
}

function showArithmeticVisualHelp() {
  showAdditionVisualHelp();
}

async function combineAdditionGroups() {
  if (!isNumberLearningActive || isPaused || numberLearningState.inputLocked || numberLearningState.speaking) return;
  if (numberLearning.SUBTRACTION_STAGE_IDS.includes(numberLearningState.stageId)) {
    if (!numberLearningState.round.manualRemoval || numberLearningState.removalConfirmed) return;
    numberLearningState.removal.selectedIndices = Array.from({ length: numberLearningState.round.removed }, (_, index) => numberLearningState.round.first - index - 1);
    renderNumberLearningRound();
    ui.numberLearningFeedback.textContent = "Gidecek nesneler ayrıldı. Şimdi kontrol et.";
    return;
  }
  if (numberLearningState.combined) return;
  clearSpeech();
  const sessionId = numberLearningSessionId;
  numberLearningState.combined = true;
  numberLearningState.speaking = true;
  renderNumberLearningRound();
  await speech.speak("Grupları birleştirelim.", TURKISH_LANGUAGE);
  if (!isNumberLearningActive || isPaused || sessionId !== numberLearningSessionId) return;
  numberLearningState.speaking = false;
  setNumberLearningInputEnabled(true);
}

async function toggleAdditionCounting() {
  if (!isNumberLearningActive || isPaused || numberLearningState.inputLocked) return;
  numberLearningSupportRun += 1;
  const supportRun = numberLearningSupportRun;
  clearSpeech();
  if (numberLearningState.counting) {
    numberLearningState.counting = false;
    numberLearningState.speaking = false;
    ui.numberLearningVisual.querySelectorAll(".addition-object, .subtraction-object").forEach(object => object.classList.remove("counting-active"));
    renderAdditionSupport(numberLearningState.round);
    setNumberLearningInputEnabled(true);
    ui.numberLearningFeedback.textContent = "Saymayı istediğinde yeniden başlatabilirsin.";
    return;
  }
  numberLearningState.counting = true;
  numberLearningState.speaking = true;
  renderAdditionSupport(numberLearningState.round);
  setNumberLearningInputEnabled(false);
  const isSubtractionRound = numberLearning.SUBTRACTION_STAGE_IDS.includes(numberLearningState.stageId);
  const subtractionVisual = ui.numberLearningVisual.querySelector(".subtraction-visual-equation:last-child");
  const explicitRemaining = subtractionVisual ? [...subtractionVisual.querySelectorAll(".remaining-group .subtraction-object.remaining")] : [];
  const objects = isSubtractionRound
    ? explicitRemaining.length
      ? explicitRemaining
      : [...(subtractionVisual?.querySelectorAll(".subtraction-group .subtraction-object.remaining:not(.removed)") ?? [])]
    : [...ui.numberLearningVisual.querySelectorAll(".addition-group .addition-object")];
  for (let index = 0; index < objects.length; index += 1) {
    if (!isNumberLearningActive || isPaused || supportRun !== numberLearningSupportRun) return;
    objects.forEach(object => object.classList.remove("counting-active"));
    objects[index].classList.add("counting-active");
    await speech.speak(numberLearning.getTurkishNumber(index + 1), TURKISH_LANGUAGE);
    if (!isNumberLearningActive || isPaused || supportRun !== numberLearningSupportRun) return;
    await appUtils.wait(120);
  }
  objects.forEach(object => object.classList.remove("counting-active"));
  if (!isNumberLearningActive || isPaused || supportRun !== numberLearningSupportRun) return;
  numberLearningState.counting = false;
  numberLearningState.speaking = false;
  renderAdditionSupport(numberLearningState.round);
  setNumberLearningInputEnabled(true);
  ui.numberLearningFeedback.textContent = isSubtractionRound ? "Şimdi kalan sayıyı seçebilirsin." : "Şimdi toplamı seçebilirsin.";
}

function renderNumberLearningRound() {
  if (!isNumberLearningActive || !numberLearningState?.round) return;
  const round = numberLearningState.round;
  ui.numberLearningTitle.textContent = `${activeLearningPathStage.icon} ${activeLearningPathStage.title}`;
  ui.numberLearningProgressLabel.textContent = `${numberLearningState.roundNumber} / ${numberLearningState.totalRounds}`;
  ui.numberLearningProgressFill.style.width = `${(numberLearningState.roundNumber / numberLearningState.totalRounds) * 100}%`;
  ui.numberLearningScore.textContent = `⭐ ${stars}`;
  ui.numberLearningPrompt.textContent = round.prompt;
  ui.numberLearningVisual.textContent = "";
  ui.numberLearningAnswers.textContent = "";
  ui.numberLearningAnswers.setAttribute("aria-label", "Cevap seçenekleri");
  ui.numberLearningAnswers.classList.toggle("visual-total-answers", Boolean(round.usesVisualChoices));
  ui.numberLearningCheck.classList.add("hidden");
  ui.numberLearningCheck.textContent = "Kontrol Et";
  ui.numberLearningCombine.classList.add("hidden");
  ui.numberLearningHelp.classList.add("hidden");
  ui.numberLearningCount.classList.add("hidden");
  ui.numberLearningFeedback.className = "matching-feedback";

  const isAdditionRound = ["addition-preparation", "numeric-addition", "visual-addition"].includes(round.type);
  const isSubtractionRound = ["subtraction-preparation", "numeric-subtraction", "visual-subtraction"].includes(round.type);
  if (isAdditionRound) {
    renderAdditionRoundVisual(round);
    renderAdditionSupport(round);
  }
  if (isSubtractionRound) {
    renderSubtractionRoundVisual(round);
    renderSubtractionSupport(round);
  }
  if (round.type === "counting") renderQuantityVisual(ui.numberLearningVisual, round.visual);
  if (round.type === "neighbor") {
    const sequence = document.createElement("div");
    sequence.className = "number-neighbor-sequence";
    sequence.setAttribute("role", "img");
    sequence.setAttribute("aria-label", round.mode === "previous" ? `Boş kutu, ${round.center}` : `${round.center}, boş kutu`);
    sequence.innerHTML = round.mode === "previous" ? `<span>?</span><i>→</i><span>${round.center}</span>` : `<span>${round.center}</span><i>→</i><span>?</span>`;
    ui.numberLearningVisual.append(sequence);
  }
  if (round.type === "equal-quantity") {
    const source = document.createElement("div");
    source.className = "number-equal-source";
    renderQuantityVisual(source, round.source);
    ui.numberLearningVisual.append(source);
  }
  if (round.type === "ordering") {
    renderNumberLearningOrdering();
  } else if (round.manualRemoval && !numberLearningState.removalConfirmed) {
    ui.numberLearningAnswers.setAttribute("aria-label", "Kalan sayı seçenekleri, nesneler gönderildikten sonra açılır");
  } else if (isAdditionRound && round.usesVisualChoices) {
    round.choices.forEach((value, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "number-learning-choice quantity-choice addition-total-choice";
      button.dataset.numberValue = String(value);
      button.setAttribute("aria-label", `Toplam seçeneği ${index + 1}`);
      const visual = document.createElement("span");
      renderAdditionQuantity(visual, numberLearning.createQuantityVisual(value, numberLearning.VISUAL_GROUPS.findIndex(group => group.id === round.visualGroupId), numberLearningState.roundNumber - 1), { neutralLabel: `Toplam seçeneği ${index + 1}` });
      button.append(visual);
      button.addEventListener("click", () => answerNumberLearning(button, value));
      ui.numberLearningAnswers.append(button);
    });
  } else if (round.type === "equal-quantity") {
    round.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "number-learning-choice quantity-choice";
      button.dataset.numberValue = String(choice.value);
      button.setAttribute("aria-label", `Miktar seçeneği ${index + 1}`);
      const visual = document.createElement("span");
      renderQuantityVisual(visual, choice.visual, { neutralLabel: `Miktar seçeneği ${index + 1}` });
      button.append(visual);
      button.addEventListener("click", () => answerNumberLearning(button, choice.value));
      ui.numberLearningAnswers.append(button);
    });
  } else {
    round.choices.forEach(value => ui.numberLearningAnswers.append(createNumberChoice(value, `${value} sayısı`, button => answerNumberLearning(button, value))));
  }
  setNumberLearningInputEnabled(true);
}

function beginNumberLearningRound() {
  if (!isNumberLearningActive || isPaused) return;
  clearNumberLearningTimer();
  clearSpeech();
  numberLearningState.inputLocked = false;
  numberLearningState.speaking = false;
  numberLearningState.selectedNumber = undefined;
  numberLearningState.attempts = 0;
  numberLearningState.helpShown = false;
  numberLearningState.combined = false;
  numberLearningState.counting = false;
  numberLearningState.removal = undefined;
  numberLearningState.removalConfirmed = false;
  numberLearningSupportRun += 1;
  numberLearningState.round = numberLearning.createRound(
    numberLearningState.stageId,
    numberLearningState.roundNumber,
    numberLearningState.totalRounds,
    Math.random,
    { recentEquations: numberLearningState.recentEquations }
  );
  if (!numberLearning.validateRound(numberLearningState.round)) {
    console.warn(`[Sayı Öğrenme] ${numberLearningState.stageId} için tur üretilemedi.`);
    openLearningPath({ focusStageId: numberLearningState.stageId });
    return;
  }
  if (numberLearning.ADDITION_STAGE_IDS.includes(numberLearningState.stageId)) {
    const equationKey = `${numberLearningState.round.first}+${numberLearningState.round.second}`;
    numberLearningState.recentEquations = [equationKey, ...numberLearningState.recentEquations].slice(0, 10);
  }
  if (numberLearning.SUBTRACTION_STAGE_IDS.includes(numberLearningState.stageId)) {
    const equationKey = `${numberLearningState.round.first}-${numberLearningState.round.removed}`;
    numberLearningState.recentEquations = [equationKey, ...numberLearningState.recentEquations].slice(0, 10);
    numberLearningState.removal = numberLearning.createRemovalState(numberLearningState.round);
  }
  numberLearningState.ordering = numberLearningState.round.type === "ordering" ? numberLearning.createOrderingState(numberLearningState.round) : undefined;
  questionNumber = numberLearningState.roundNumber;
  renderNumberLearningRound();
  speakNumberLearningPrompt();
}

function recordNumberLearningInteraction(wasCorrect, answerValue) {
  currentQuestion = {
    label: activeLearningPathStage.title,
    category: `LearningPath:${activeLearningPathStage.id}`,
    correct: String(numberLearningState.round.correct ?? numberLearningState.round.target?.join("-") ?? answerValue)
  };
  if (!wasCorrect) {
    streak = 0;
    updateParentData(false);
    return;
  }
  stars += 1;
  if (stars % 10 === 0) awardSticker();
  streak += 1;
  bestStreak = Math.max(bestStreak, streak);
  correctAnswers += 1;
  updateParentData(true);
  checkAchievements();
  updateDailyGoalOnCorrectAnswer();
}

async function answerNumberLearning(button, value) {
  if (!isNumberLearningActive || isPaused || numberLearningState.inputLocked || numberLearningState.speaking) return;
  const isCorrect = value === numberLearningState.round.correct;
  const isAdditionRound = numberLearning.ADDITION_STAGE_IDS.includes(numberLearningState.stageId);
  const isSubtractionRound = numberLearning.SUBTRACTION_STAGE_IDS.includes(numberLearningState.stageId);
  const isArithmeticRound = isAdditionRound || isSubtractionRound;
  if (!isCorrect && isArithmeticRound) numberLearningState.attempts += 1;
  numberLearningState.inputLocked = true;
  numberLearningState.pendingResult = isCorrect ? "correct" : isArithmeticRound && numberLearningState.attempts >= 3 ? "advance" : "wrong";
  clearSpeech();
  numberLearningSupportRun += 1;
  numberLearningState.counting = false;
  if (!isCorrect && isArithmeticRound && numberLearningState.attempts >= 2) {
    if (numberLearningState.round.hasVisualHelp) numberLearningState.helpShown = true;
    if (numberLearningState.round.canCombine) numberLearningState.combined = true;
  }
  recordNumberLearningInteraction(isCorrect, value);
  renderNumberLearningRound();
  const matchingButton = ui.numberLearningAnswers.querySelector(`[data-number-value="${value}"]`) ?? button;
  matchingButton?.classList.add(isCorrect ? "correct" : "try-again-choice");
  const correctMessage = isAdditionRound ? "Toplamı buldun!" : isSubtractionRound ? "Kalanları buldun!" : "Harika!";
  const retryMessage = isArithmeticRound
    ? numberLearningState.attempts >= 3
      ? isSubtractionRound ? "Birlikte bulduk. Doğru kalanı görelim." : "Birlikte bulduk. Doğru toplamı görelim."
      : numberLearningState.attempts === 2
        ? isSubtractionRound ? "Kalan nesnelerden yardım alabilirsin." : "Nesnelerden yardım alabilirsin."
        : "Bir daha sayalım."
    : "Bir daha düşünelim.";
  ui.numberLearningFeedback.textContent = isCorrect ? correctMessage : retryMessage;
  ui.numberLearningFeedback.className = `matching-feedback ${isCorrect ? "success" : "try-again"}`;
  if (isCorrect) {
    animations.celebrate();
    audio.playSuccess();
    await advanceNumberLearningAfterFeedback(correctMessage);
  } else {
    const sessionId = numberLearningSessionId;
    if (isArithmeticRound && numberLearningState.attempts >= 3) {
      const correctButton = ui.numberLearningAnswers.querySelector(`[data-number-value="${numberLearningState.round.correct}"]`);
      correctButton?.classList.add("correct-answer-reveal");
      await advanceNumberLearningAfterFeedback("Birlikte bulduk. Şimdi devam edelim.");
      return;
    }
    await speech.speak(retryMessage, TURKISH_LANGUAGE);
    if (!isNumberLearningActive || isPaused || sessionId !== numberLearningSessionId) return;
    numberLearningState.inputLocked = false;
    numberLearningState.pendingResult = undefined;
    renderNumberLearningRound();
    ui.numberLearningFeedback.textContent = isArithmeticRound ? "Tekrar seçebilirsin." : "Tekrar deneyebilirsin.";
  }
}

async function checkSubtractionRemoval() {
  if (!isNumberLearningActive || isPaused || numberLearningState.inputLocked || numberLearningState.speaking || !numberLearningState.round?.manualRemoval) return;
  const sessionId = numberLearningSessionId;
  numberLearningState.inputLocked = true;
  setNumberLearningInputEnabled(false);
  if (!numberLearning.isRemovalSelectionComplete(numberLearningState.removal)) {
    const missing = numberLearningState.round.removed - numberLearningState.removal.selectedIndices.length;
    const message = missing > 0 ? `${missing} nesne daha seç.` : "Giden nesnelere bir daha bakalım.";
    ui.numberLearningFeedback.textContent = message;
    ui.numberLearningFeedback.className = "matching-feedback try-again";
    clearSpeech();
    await speech.speak(message, TURKISH_LANGUAGE);
    if (!isNumberLearningActive || isPaused || sessionId !== numberLearningSessionId) return;
    numberLearningState.inputLocked = false;
    setNumberLearningInputEnabled(true);
    return;
  }
  clearSpeech();
  numberLearningState.removalConfirmed = true;
  numberLearningState.speaking = true;
  numberLearningState.round.prompt = "Kaç tane kaldı?";
  numberLearningState.round.speech = "Kaç tane kaldı?";
  renderNumberLearningRound();
  ui.numberLearningFeedback.textContent = "Harika ayırdın. Şimdi kalanları bul.";
  await speech.speak("Şimdi kaç tane kaldı?", TURKISH_LANGUAGE);
  if (!isNumberLearningActive || isPaused || sessionId !== numberLearningSessionId) return;
  numberLearningState.speaking = false;
  numberLearningState.inputLocked = false;
  setNumberLearningInputEnabled(true);
}

function checkFocusedNumberLearning() {
  if (numberLearningState.round?.manualRemoval && !numberLearningState.removalConfirmed) {
    checkSubtractionRemoval();
    return;
  }
  checkNumberLearningOrdering();
}

async function checkNumberLearningOrdering() {
  if (!isNumberLearningActive || isPaused || numberLearningState.inputLocked || numberLearningState.ordering.slots.some(value => value === null)) return;
  const isCorrect = numberLearning.isOrderingComplete(numberLearningState.ordering);
  numberLearningState.inputLocked = true;
  numberLearningState.pendingResult = isCorrect ? "correct" : "wrong";
  clearSpeech();
  recordNumberLearningInteraction(isCorrect, numberLearningState.ordering.slots.join("-"));
  renderNumberLearningRound();
  ui.numberLearningFeedback.textContent = isCorrect ? "Sıralama tamam!" : "Sıraya bir daha bakalım.";
  ui.numberLearningFeedback.className = `matching-feedback ${isCorrect ? "success" : "try-again"}`;
  if (isCorrect) {
    animations.celebrate();
    audio.playSuccess();
    await advanceNumberLearningAfterFeedback("Sıralama tamam!");
  } else {
    const sessionId = numberLearningSessionId;
    await speech.speak("Sıraya bir daha bakalım.", TURKISH_LANGUAGE);
    if (!isNumberLearningActive || isPaused || sessionId !== numberLearningSessionId) return;
    numberLearningState.inputLocked = false;
    numberLearningState.pendingResult = undefined;
    renderNumberLearningRound();
  }
}

async function advanceNumberLearningAfterFeedback(message) {
  const sessionId = numberLearningSessionId;
  await speech.speak(message, TURKISH_LANGUAGE);
  if (!isNumberLearningActive || isPaused || sessionId !== numberLearningSessionId) return;
  if (numberLearningState.roundNumber >= numberLearningState.totalRounds) {
    numberLearningState.pendingResult = undefined;
    finishNumberLearningStage();
    return;
  }
  numberLearningTimer = window.setTimeout(() => {
    if (!isNumberLearningActive || isPaused || sessionId !== numberLearningSessionId) return;
    numberLearningState.pendingResult = undefined;
    numberLearningState.roundNumber += 1;
    beginNumberLearningRound();
  }, 450);
}

async function finishNumberLearningStage() {
  if (!isNumberLearningActive || isSessionSummaryShowing) return;
  isSessionSummaryShowing = true;
  recordLearningSessionCompleted();
  clearNumberLearningTimer();
  clearSpeech();
  stopWakeLock();
  stopPlayTime();
  completeLearningPathStage();
  const celebrationMessage = getPersonalizedSessionMessage();
  ui.summaryStars.textContent = stars;
  ui.summaryCorrect.textContent = correctAnswers;
  ui.summaryStreak.textContent = bestStreak;
  ui.summaryCategory.textContent = activeLearningPathStage.title;
  ui.summaryTitle.textContent = celebrationMessage;
  ui.summaryCopy.textContent = `${questionNumber} etkinlik tamamlandı!`;
  renderLearningPathCompletion(celebrationMessage);
  isNumberLearningActive = false;
  ui.numberLearning.classList.add("hidden");
  ui.summary.classList.remove("hidden");
  animations.celebrate();
  audio.playCelebration();
  await speech.speak(celebrationMessage, TURKISH_LANGUAGE);
}

function startNumberLearningStage(stage) {
  cleanupNumberLearning();
  clearSpeech();
  window.clearTimeout(sessionCelebrationTimer);
  if (!activeLearningPathStage) learningPathPreviousGameMode = activeGameMode;
  activeLearningPathStage = { ...stage, categories: [] };
  activeGameMode = LEARNING_MODE;
  resetSession();
  numberLearningSessionId += 1;
  isNumberLearningActive = true;
  numberLearningState = createEmptyNumberLearningState();
  numberLearningState.stageId = stage.id;
  numberLearningState.roundNumber = 1;
  numberLearningState.totalRounds = stage.sessionLength;
  recordLearningSessionStarted(
    [`LearningPath:${stage.id}`],
    numberLearning.ADDITION_STAGE_IDS.includes(stage.id)
      ? "learning-path-addition"
      : numberLearning.SUBTRACTION_STAGE_IDS.includes(stage.id)
        ? "learning-path-subtraction"
        : "learning-path-number"
  );
  ensureDailyGoal();
  renderDailyGoal();
  hideAllScreens();
  ui.shell.classList.remove("learning-path-open");
  ui.numberLearning.classList.remove("hidden");
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  ui.numberLearningTitle.focus({ preventScroll: true });
  startPlayTime();
  startWakeLock();
  beginNumberLearningRound();
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
  ui.newMiniGamePause.disabled = !enabled;
  ui.numberLearningPause.disabled = !enabled;
}

function pauseGame() {
  if (isPaused || (ui.quiz.classList.contains("hidden") && !isBalloonBonusActive && !isMatchingGameActive && !isListeningGameActive && !isNumberMatchGameActive && !isColorMatchGameActive && !isSortingGameActive && !isNewMiniGameActive && !isNumberLearningActive)) return;
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
  if (isNewMiniGameActive) pauseNewMiniGameState();
  if (isNumberLearningActive) {
    clearNumberLearningTimer();
    numberLearningSupportRun += 1;
    numberLearningState.counting = false;
    numberLearningState.speaking = false;
    ui.numberLearningVisual.querySelectorAll(".addition-object").forEach(object => object.classList.remove("counting-active"));
    setNumberLearningInputEnabled(false);
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
  if (isNewMiniGameActive) {
    resumeNewMiniGameState();
    return;
  }
  if (isNumberLearningActive) {
    numberLearningState.speaking = false;
    if (numberLearningState.pendingResult === "wrong") {
      numberLearningState.pendingResult = undefined;
      numberLearningState.inputLocked = false;
    } else if (numberLearningState.pendingResult === "correct" || numberLearningState.pendingResult === "advance") {
      numberLearningState.pendingResult = undefined;
      if (numberLearningState.roundNumber >= numberLearningState.totalRounds) finishNumberLearningStage();
      else {
        numberLearningState.roundNumber += 1;
        beginNumberLearningRound();
      }
      return;
    }
    renderNumberLearningRound();
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
  ui.progress.parentElement?.setAttribute("aria-label", `${sessionQuestionCount} soruluk tur ilerlemesi`);
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

function renderQuestionVisual(question) {
  ui.visual.textContent = "";
  ui.visual.classList.toggle("question-visual-svg", Boolean(question?.visualSvg));
  if (question?.visualSvg) ui.visual.innerHTML = question.visualSvg;
  else ui.visual.textContent = question?.visual ?? "";
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
  await speech.speak(currentQuestion.questionPrompt ?? currentQuestion.prompt, currentQuestion.promptLanguage ?? ENGLISH_LANGUAGE);
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
  await speech.speak(currentQuestion.questionPrompt ?? currentQuestion.prompt, currentQuestion.promptLanguage ?? ENGLISH_LANGUAGE);
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
  renderQuestionVisual(currentQuestion);
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
  recordLearningSessionCompleted();
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
  if (!selectedPlayer) {
    showPlayerSelectionGuidance();
    return;
  }
  const stage = learningPathModel.stageById(stageId);
  const progress = loadLearningPathProgress();
  if (!engine || !stage || !learningPathModel.canLaunchStage(stage.id, progress)) return;
  if (numberLearning.PLAYABLE_STAGE_IDS.includes(stage.id)) {
    startNumberLearningStage(stage);
    return;
  }
  const availableCategories = stage.categoryIds.filter(category => engine.questions.some(question => question.category === category));
  const validationPlan = engine.createSessionPlan(availableCategories, stage.sessionLength, { gentleProgression: true });
  if (availableCategories.length !== stage.categoryIds.length || validationPlan.length !== stage.sessionLength) {
    console.warn(`[Sprint 8.3.1 Öğrenme Yolu] ${stage.id} için tamamlanabilir oturum üretilemedi.`);
    ui.learningPathGuidance.textContent = "Bu bölüm hazırlanıyor. Başka bir hazır bölüm seçebilirsin.";
    return;
  }
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

async function startGame({ skipWelcome = false, miniGameMode } = {}) {
  const gameMode = miniGameMode ?? activeGameMode;
  const isMiniGameLaunch = MINI_GAME_MODES.includes(gameMode);
  if (!selectedPlayer) {
    showPlayerSelectionGuidance();
    return;
  }
  if (isPaused || isStartingGame || (!isMiniGameLaunch && gameMode !== LEARNING_MODE && gameMode !== QUICK_MODE) || (!activeLearningPathStage && !isMiniGameLaunch && activeCategoryPack === "custom" && !getPackCategories().length)) return;
  setGameNavigationBusy(false);
  const startRun = audioRun;
  ensureDailyGoal();
  renderDailyGoal();
  window.clearTimeout(sessionCelebrationTimer);
  isStartingGame = true;
  ui.start.disabled = true;
  setMiniGameLaunchBusy(isMiniGameLaunch);
  setSessionNavigationBusy(true, activeLearningPathStage?.id);
  try {
    [engine] = await Promise.all([gameReady, speech.ready]);
    if (startRun !== audioRun) return;
    resetEncouragementState();
    if (gameMode === MATCHING_MODE) {
      startMatchingGame();
      return;
    }
    if (gameMode === LISTENING_MODE) {
      startListeningGame();
      return;
    }
    if (gameMode === NUMBER_MATCH_MODE) {
      startNumberMatchGame();
      return;
    }
    if (gameMode === COLOR_MATCH_MODE) {
      startColorMatchGame();
      return;
    }
    if (gameMode === SORTING_MODE) {
      startSortingGame();
      return;
    }
    if (NEW_MINI_GAME_MODES.includes(gameMode)) {
      startNewMiniGame(gameMode);
      return;
    }
    restoreStoredLearningStats();
    if (activeLearningPathStage) engine.setActiveCategories(activeLearningPathStage.categories);
    else applyCategoryPack();
    recordLearningSessionStarted(activeLearningPathStage ? activeLearningPathStage.categories : getPackCategories(), activeLearningPathStage ? "learning-path" : gameMode);
    hideAllScreens();
    ui.quiz.classList.remove("hidden");
    if (activeLearningPathStage) ui.quiz.focus({ preventScroll: true });
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
    setMiniGameLaunchBusy(false);
    setSessionNavigationBusy(false);
    updateStartButton();
  }
}

function speakWelcome() {
  if (isPaused) return;
  clearSpeech();
  speech.speak(WELCOME_MESSAGE, TURKISH_LANGUAGE);
}

function goHome(shouldSpeak = true, destination = "home") {
  if (isPaused) return;
  stopMatchingTimer();
  const gameModeToRestore = activeLearningPathStage ? learningPathPreviousGameMode : undefined;
  ui.shell.classList.remove("learning-path-open");
  closeGameMenu();
  clearSpeech();
  cleanupNewMiniGame();
  cleanupNumberLearning();
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
  activeLearningSessionCategories = [];
  activeLearningSessionType = undefined;
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
  ui.newMiniGame.classList.add("hidden");
  ui.numberLearning.classList.add("hidden");
  ui.learningPathReturn.classList.add("hidden");
  ui.learningPathNext.classList.add("hidden");
  ui.learningPathCompletion.classList.add("hidden");
  ui.summaryStats.classList.remove("hidden");
  ui.matchingCompletionActions.classList.add("hidden");
  ui.colorMatchWrittenPrompt.classList.add("hidden");
  ui.playAgain.innerHTML = 'Yeniden oyna <span aria-hidden="true">↻</span>';
  ui.playAgain.setAttribute("aria-label", "Yeniden oyna");
  setMiniGameLaunchBusy(false);
  showPrimaryView(destination);
  if (shouldSpeak && destination === "home") speakWelcome();
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

const PRIMARY_VIEWS = {
  home: ui.welcome,
  learning: ui.learningCenter,
  "mini-games": ui.miniGames,
  players: ui.playerSelectionScreen,
  "learning-path": ui.learningPath
};

function getPrimaryViewHeading(viewName) {
  return PRIMARY_VIEWS[viewName]?.querySelector("h1, h2");
}

function hideAllScreens() {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.add("hidden"));
}

function showPrimaryView(viewName, { focus = true } = {}) {
  const view = PRIMARY_VIEWS[viewName] ?? ui.welcome;
  const resolvedViewName = PRIMARY_VIEWS[viewName] ? viewName : "home";
  closeGameMenu();
  clearSpeech();
  if (resolvedViewName !== "players") clearPlayerSelectionGuidance();
  hideAllScreens();
  ui.shell.classList.toggle("learning-path-open", resolvedViewName === "learning-path");
  view.classList.remove("hidden");
  activePrimaryView = resolvedViewName;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  if (focus) getPrimaryViewHeading(resolvedViewName)?.focus({ preventScroll: true });
}

function navigateToPrimaryView(viewName) {
  closeGameMenu();
  if (viewName === "rewards") {
    if (!Object.values(PRIMARY_VIEWS).some(view => !view.classList.contains("hidden"))) goHome(false, "home");
    openAchievements();
    return;
  }
  if (!selectedPlayer && ["learning", "mini-games", "learning-path"].includes(viewName)) {
    showPlayerSelectionGuidance();
    return;
  }
  if (viewName === "learning-path") {
    openLearningPath();
    return;
  }
  goHome(false, viewName);
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
  goHome(false, destination === "games" ? "mini-games" : "home");
}

function openLearningPath(options = {}) {
  if (!selectedPlayer) {
    showPlayerSelectionGuidance();
    return;
  }
  const focusStageId = typeof options.focusStageId === "string" ? options.focusStageId : undefined;
  const progress = loadLearningPathProgress();
  const focusStage = focusStageId ? learningPathModel.stageById(focusStageId) : undefined;
  const recommendedStage = getRecommendedLearningPathStage(progress);
  activeLearningPathGroupId = focusStage?.groupId ?? recommendedStage?.groupId ?? learningPathModel.GROUPS[0].id;
  goHome(false, "learning-path");
  renderLearningPath({ focusStageId });
}

function handleMenuNavigation(target) {
  navigateToPrimaryView(target);
}

ui.start.addEventListener("click", () => startGame());
ui.learningPathEntry.addEventListener("click", () => openLearningPath());
ui.learningPathHome.addEventListener("click", () => goHome(false));
ui.learningPathReturn.addEventListener("click", () => openLearningPath({ focusStageId: activeLearningPathStage?.id }));
ui.learningPathNext.addEventListener("click", startNextLearningPathStage);
ui.learningPathPreviousGroup.addEventListener("click", () => moveLearningPathGroup(-1));
ui.learningPathNextGroup.addEventListener("click", () => moveLearningPathGroup(1));
ui.fullscreen.addEventListener("click", toggleFullscreen);
ui.settings.addEventListener("click", openParentDashboard);
ui.menuButton.addEventListener("click", toggleGameMenu);
ui.menuItems.forEach(button => button.addEventListener("click", () => handleMenuNavigation(button.dataset.menuTarget)));
ui.homeNavigationCards.forEach(button => button.addEventListener("click", () => navigateToPrimaryView(button.dataset.homeTarget)));
ui.homePlayerChange.addEventListener("click", () => navigateToPrimaryView("players"));
ui.learningCenterHome.addEventListener("click", () => navigateToPrimaryView("home"));
ui.miniGamesHome.addEventListener("click", () => navigateToPrimaryView("home"));
ui.playerSelectionHome.addEventListener("click", () => navigateToPrimaryView("home"));
ui.welcomeSound.addEventListener("click", speakWelcome);
ui.learningMode.addEventListener("click", () => setGameMode(LEARNING_MODE));
ui.quickMode.addEventListener("click", () => setGameMode(QUICK_MODE));
ui.matchingMode.addEventListener("click", () => launchMiniGame(MATCHING_MODE));
ui.listeningMode.addEventListener("click", () => launchMiniGame(LISTENING_MODE));
ui.numberMatchMode.addEventListener("click", () => launchMiniGame(NUMBER_MATCH_MODE));
ui.colorMatchMode.addEventListener("click", () => launchMiniGame(COLOR_MATCH_MODE));
ui.sortingMode.addEventListener("click", () => launchMiniGame(SORTING_MODE));
ui.missingItemMode.addEventListener("click", () => launchMiniGame(MISSING_ITEM_MODE));
ui.shadowMode.addEventListener("click", () => launchMiniGame(SHADOW_MODE));
ui.initialLetterMode.addEventListener("click", () => launchMiniGame(INITIAL_LETTER_MODE));
ui.soundMemoryMode.addEventListener("click", () => launchMiniGame(SOUND_MEMORY_MODE));
ui.puzzleMode.addEventListener("click", () => launchMiniGame(PUZZLE_MODE));
ui.categoryPackButtons.forEach(button => button.addEventListener("click", () => setCategoryPack(button.dataset.categoryPack)));
ui.customCategoryReset.addEventListener("click", () => {
  if (!customCategories.length) return;
  customCategories = [];
  saveCategoryPack();
  renderCategoryPackSelection();
  ui.customCategoryReset.focus();
});
ui.playerButtons.forEach(button => button.addEventListener("click", () => {
  if (button === ui.customPlayer) selectCustomPlayer();
  else {
    selectPlayer(button.dataset.playerName);
    navigateToPrimaryView("home");
  }
}));
ui.customPlayerName.addEventListener("input", updateCustomPlayer);
ui.customPlayerName.addEventListener("keydown", event => {
  if (event.key === "Enter" && selectedPlayer) navigateToPrimaryView("home");
});
ui.customPlayerConfirm.addEventListener("click", () => {
  if (selectedPlayer) navigateToPrimaryView("home");
});
ui.home.addEventListener("click", () => leaveGameFor("home"));
ui.matchingHome.addEventListener("click", () => leaveGameFor("games"));
ui.listeningHome.addEventListener("click", () => leaveGameFor("games"));
ui.numberMatchHome.addEventListener("click", () => leaveGameFor("games"));
ui.colorMatchHome.addEventListener("click", () => leaveGameFor("games"));
ui.sortingHome.addEventListener("click", () => leaveGameFor("games"));
ui.newMiniGameHome.addEventListener("click", () => leaveGameFor("games"));
ui.newMiniGameCompletionHome.addEventListener("click", () => leaveGameFor("games"));
ui.balloonHome.addEventListener("click", () => leaveGameFor("home"));
ui.matchingReplay.addEventListener("click", replayMatchingWithNewCategory);
ui.matchingCategories.addEventListener("click", showMatchingCategorySelection);
ui.matchingPause.addEventListener("click", pauseGame);
ui.listeningPause.addEventListener("click", pauseGame);
ui.numberMatchPause.addEventListener("click", pauseGame);
ui.colorMatchPause.addEventListener("click", pauseGame);
ui.sortingPause.addEventListener("click", pauseGame);
ui.newMiniGamePause.addEventListener("click", pauseGame);
ui.numberLearningPause.addEventListener("click", pauseGame);
ui.numberLearningPath.addEventListener("click", () => openLearningPath({ focusStageId: activeLearningPathStage?.id }));
ui.numberLearningListen.addEventListener("click", speakNumberLearningPrompt);
ui.numberLearningCheck.addEventListener("click", checkFocusedNumberLearning);
ui.numberLearningHelp.addEventListener("click", showArithmeticVisualHelp);
ui.numberLearningCombine.addEventListener("click", combineAdditionGroups);
ui.numberLearningCount.addEventListener("click", toggleAdditionCounting);
ui.newMiniGameReplay.addEventListener("click", replayNewMiniGame);
ui.newMiniGameChange.addEventListener("click", changeNewMiniGameSetup);
ui.newMiniGameListen.addEventListener("click", () => {
  if (newMiniGameState.mode === INITIAL_LETTER_MODE && !isPaused && !newMiniGameState.inputLocked && !newMiniGameState.speaking) speakInitialLetterWord();
});
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
  setGameMode(getSavedGameMode());
  restoreCategoryPack();
  applyCategoryPack();
  renderCategoryPackSelection();
  renderPlayerSelection();
  ensureDailyGoal();
  renderDailyGoal();
  restoreStoredLearningStats();
  clearSavedProgress();
  showPrimaryView(selectedPlayer ? "home" : "players");
  if (!selectedPlayer) ui.playerGuidance.classList.remove("hidden");
});

updateFullscreenButton();
