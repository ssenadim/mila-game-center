const DATA_INDEX_URL = "./data/index.json";
const SESSION_QUESTION_COUNT = 20;
const QUESTION_DELAY = 800;
const CHOICE_DELAY = 2000;
const SUCCESS_NEXT_DELAY = 1000;
const ENGLISH_LANGUAGE = "en-US";
const TURKISH_LANGUAGE = "tr-TR";
const WELCOME_MESSAGE = "Merhaba Mila. Hoş geldin. Bu eğlenceli oyunu seni çok seven baban senin için hazırladı. Haydi başlayalım.";
const SUMMARY_MESSAGE = "Harika Mila! Yirmi soruluk macerayı tamamladın. Çok güzel öğrendin!";
const PRAISE_MESSAGES = ["Harika Mila!", "Süpersin Mila!", "Aferin Mila!", "Muhteşemsin Mila!"];
const RETRY_MESSAGES = ["Hadi tekrar deneyelim.", "Harika gidiyorsun.", "Bir kez daha bakalım."];
const STICKERS = ["⭐", "🌈", "🦋", "🦄", "🚀", "🐱", "🐶"];
const STICKER_STORAGE_KEY = "mila-learning-stickers";
const REWARD_POPUP_DURATION = 3000;
const PARENT_DATA_STORAGE_KEY = "mila-learning-parent-data";
const PARENT_HOLD_DURATION = 5000;
const SESSION_CELEBRATION_DURATION = 3500;
const SESSION_CELEBRATION_MESSAGES = ["Harika Mila!", "Bugün çok güzel oynadın!", "Süpersin Mila!", "Ne güzel öğrendin Mila!"];
const GAME_PROGRESS_STORAGE_KEY = "mila-learning-progress";
const LEARNING_STATS_STORAGE_KEY = "mila-learning-learning-stats";
const BONUS_DURATION = 20000;
const BONUS_CORRECT_ANSWER_INTERVAL = 5;
const LEARNING_MODE = "learning";
const QUICK_MODE = "quick";
const GAME_MODE_STORAGE_KEY = "mila-learning-game-mode";
const PLAYER_STORAGE_KEY = "mila-learning-player";
const PLAYER_PROGRESS_MIGRATION_STORAGE_KEY = "mila-learning-player-progress-migrated";
const DEFAULT_PLAYERS = ["Mila", "Açelya", "Alp", "Aslan Cemal", "Zeynep", "Nova", "Ata", "Hiranur"];

const ui = {
  welcome: document.querySelector("#welcome-screen"), quiz: document.querySelector("#quiz-screen"), summary: document.querySelector("#summary-screen"),
  start: document.querySelector("#start-button"), welcomeSound: document.querySelector("#welcome-sound-button"), learningMode: document.querySelector("#learning-mode-button"), quickMode: document.querySelector("#quick-mode-button"), playerButtons: document.querySelectorAll(".player-button"), customPlayer: document.querySelector("#custom-player-button"), customPlayerLabel: document.querySelector("#custom-player-label"), customPlayerName: document.querySelector("#custom-player-name"), home: document.querySelector("#home-button"), replay: document.querySelector("#question-sound-button"),
  category: document.querySelector("#category-pill"), visual: document.querySelector("#question-visual"), celebration: document.querySelector("#celebration"), mascot: document.querySelector("#game-mascot"), prompt: document.querySelector("#question-prompt"),
  answers: document.querySelector("#answers"), feedback: document.querySelector("#feedback"), next: document.querySelector("#next-button"), count: document.querySelector("#question-count"), score: document.querySelector("#score"), streak: document.querySelector("#streak"), progress: document.querySelector("#progress-fill"),
  playAgain: document.querySelector("#play-again-button"), summaryHome: document.querySelector("#summary-home-button"), summaryStars: document.querySelector("#summary-stars"), summaryCorrect: document.querySelector("#summary-correct"), summaryStreak: document.querySelector("#summary-streak"), summaryCategory: document.querySelector("#summary-category"), summaryTitle: document.querySelector("#summary-title"), summaryCopy: document.querySelector(".summary-copy"), rewardPopup: document.querySelector("#reward-popup"), rewardSticker: document.querySelector("#reward-sticker"), bonus: document.querySelector("#balloon-bonus"), balloonTarget: document.querySelector("#balloon-target"), balloons: document.querySelector("#balloons"), pause: document.querySelector("#pause-button"), bonusPause: document.querySelector("#bonus-pause-button"), pauseOverlay: document.querySelector("#pause-overlay"), resume: document.querySelector("#resume-button"), parentLogo: document.querySelector("#welcome-title"), parentDashboard: document.querySelector("#parent-dashboard"), parentDashboardClose: document.querySelector("#parent-dashboard-close"), parentPlayTime: document.querySelector("#parent-play-time"), parentQuestions: document.querySelector("#parent-questions"), parentCorrect: document.querySelector("#parent-correct"), parentCategory: document.querySelector("#parent-category"), parentStreak: document.querySelector("#parent-streak"), parentDifficultWords: document.querySelector("#parent-difficult-words")
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

function updateStartButton() {
  const hasGameMode = activeGameMode === LEARNING_MODE || activeGameMode === QUICK_MODE;
  ui.start.disabled = !selectedPlayer || !hasGameMode;
}

function getPersonalizedWelcomeMessage() {
  return selectedPlayer ? `Merhaba ${selectedPlayer}! Hazır mısın? Haydi başlayalım!` : "Merhaba! Hazır mısın? Haydi başlayalım!";
}

function getPersonalizedBonusMessage() {
  return selectedPlayer ? `Harika gidiyorsun ${selectedPlayer}! Bonus zamanı!` : "Harika gidiyorsun! Bonus zamanı!";
}

function getPersonalizedSessionMessage() {
  return selectedPlayer ? `Harika ${selectedPlayer}! Bugün çok güzel oynadın.` : "Harika! Bugün çok güzel oynadın.";
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
  setGameMode(getSavedGameMode());
  renderPlayerSelection();
}

function selectCustomPlayer() {
  selectedPlayer = undefined;
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
    setGameMode(getSavedGameMode());
  }
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
        bestStreak: Number.isFinite(savedData.bestStreak) ? savedData.bestStreak : 0
      };
    }
    return { playTime: 0, questionsAnswered: 0, correctAnswers: 0, categoryCounts: {}, difficultWords: {}, bestStreak: 0 };
  } catch {
    return { playTime: 0, questionsAnswered: 0, correctAnswers: 0, categoryCounts: {}, difficultWords: {}, bestStreak: 0 };
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

function renderParentDashboard() {
  const activePlayTime = playStartedAt ? Date.now() - playStartedAt : 0;
  const minutes = Math.floor((parentData.playTime + activePlayTime) / 60000);
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
}

function pauseGame() {
  if (isPaused || (ui.quiz.classList.contains("hidden") && !isBalloonBonusActive)) return;
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
  if (isWelcomeSequenceActive) {
    playWelcomeSequence().then(completed => {
      if (completed && !isPaused) showQuestion();
    });
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
  isBalloonBonusActive = false;
  window.clearTimeout(balloonBonusTimer);
  window.clearTimeout(balloonPopTimer);
  pausedBonusRemaining = 0;
  pendingBonusEnd = false;
  ui.bonus.classList.add("hidden");
  ui.quiz.classList.remove("hidden");
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
  await speech.speak(currentQuestion.prompt, ENGLISH_LANGUAGE);
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
  await speech.speak(currentQuestion.prompt, ENGLISH_LANGUAGE);
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
  currentQuestion = engine.selectQuestion();
  currentAnswers = engine.getAnswers(currentQuestion);
  questionNumber += 1;
  ui.category.textContent = currentQuestion.label;
  ui.visual.textContent = currentQuestion.visual;
  ui.prompt.textContent = currentQuestion.prompt;
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
  if (isPaused) return;
  clearSpeech();
  const run = audioRun;
  streak = 0;
  engine.recordResult(currentQuestion, false);
  updateParentData(false);
  saveLearningStats();
  saveGameProgress();
  triggerMascotReaction("mascot-encourage");
  button.classList.add("try-again-choice");
  ui.feedback.textContent = appUtils.randomItem(RETRY_MESSAGES);
  ui.feedback.className = "feedback try-again";
  updateScoreboard();
  setInputEnabled(false);
  await speech.speak(ui.feedback.textContent, TURKISH_LANGUAGE);
  if (!isActiveAudio(run)) return;
  button.classList.remove("try-again-choice");
  playQuestionSequence();
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
  saveLearningStats();
  saveGameProgress(true);
  triggerMascotReaction("mascot-celebrate");
  button.classList.add("correct");
  setInputEnabled(false);
  ui.feedback.textContent = appUtils.randomItem(PRAISE_MESSAGES);
  ui.feedback.className = "feedback success";
  updateScoreboard();
  ui.next.classList.add("hidden");
  animations.celebrate();
  audio.playSuccess();
  await appUtils.wait(300);
  if (!isActiveAudio(run)) return;
  await speech.speak(ui.feedback.textContent, TURKISH_LANGUAGE);
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
  if (isPaused || isSpeaking || button.disabled || pendingCorrectTransition) return;
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
  clearSavedProgress();
  engine.resetSession();
}

async function startGame() {
  if (isPaused || isStartingGame || !selectedPlayer || (activeGameMode !== LEARNING_MODE && activeGameMode !== QUICK_MODE)) return;
  window.clearTimeout(sessionCelebrationTimer);
  isStartingGame = true;
  try {
    [engine] = await Promise.all([gameReady, speech.ready]);
    restoreStoredLearningStats();
    ui.welcome.classList.add("hidden");
    ui.summary.classList.add("hidden");
    ui.quiz.classList.remove("hidden");
    resetSession();
    startPlayTime();
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
  window.clearTimeout(sessionCelebrationTimer);
  stopPlayTime();
  if (!ui.quiz.classList.contains("hidden")) saveGameProgress();
  isBalloonBonusActive = false;
  window.clearTimeout(balloonBonusTimer);
  window.clearTimeout(balloonPopTimer);
  pendingBonusEnd = false;
  isWelcomeSequenceActive = false;
  ui.quiz.classList.add("hidden");
  ui.bonus.classList.add("hidden");
  ui.summary.classList.add("hidden");
  ui.welcome.classList.remove("hidden");
  speakWelcome();
}

ui.start.addEventListener("click", startGame);
ui.welcomeSound.addEventListener("click", speakWelcome);
ui.learningMode.addEventListener("click", () => setGameMode(LEARNING_MODE));
ui.quickMode.addEventListener("click", () => setGameMode(QUICK_MODE));
ui.playerButtons.forEach(button => button.addEventListener("click", () => {
  if (button === ui.customPlayer) selectCustomPlayer();
  else selectPlayer(button.dataset.playerName);
}));
ui.customPlayerName.addEventListener("input", updateCustomPlayer);
ui.customPlayerName.addEventListener("keydown", event => {
  if (event.key === "Enter" && selectedPlayer && (activeGameMode === LEARNING_MODE || activeGameMode === QUICK_MODE)) startGame();
});
ui.home.addEventListener("click", goHome);
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
document.addEventListener("pointerdown", event => {
  if (event.target.closest("button:not(:disabled)")) audio.playButton();
});
window.addEventListener("load", async () => {
  [engine] = await Promise.all([gameReady, speech.ready]);
  setGameMode(activeGameMode);
  renderPlayerSelection();
  restoreStoredLearningStats();
  if (!restoreSavedProgress()) window.setTimeout(speakWelcome, 400);
});
