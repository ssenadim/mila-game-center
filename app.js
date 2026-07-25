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

const ui = {
  welcome: document.querySelector("#welcome-screen"), quiz: document.querySelector("#quiz-screen"), summary: document.querySelector("#summary-screen"),
  start: document.querySelector("#start-button"), welcomeSound: document.querySelector("#welcome-sound-button"), home: document.querySelector("#home-button"), replay: document.querySelector("#question-sound-button"),
  category: document.querySelector("#category-pill"), visual: document.querySelector("#question-visual"), celebration: document.querySelector("#celebration"), mascot: document.querySelector("#game-mascot"), prompt: document.querySelector("#question-prompt"),
  answers: document.querySelector("#answers"), feedback: document.querySelector("#feedback"), next: document.querySelector("#next-button"), count: document.querySelector("#question-count"), score: document.querySelector("#score"), streak: document.querySelector("#streak"), progress: document.querySelector("#progress-fill"),
  playAgain: document.querySelector("#play-again-button"), summaryHome: document.querySelector("#summary-home-button"), summaryStars: document.querySelector("#summary-stars"), summaryCorrect: document.querySelector("#summary-correct"), summaryStreak: document.querySelector("#summary-streak"), summaryCategory: document.querySelector("#summary-category"), summaryTitle: document.querySelector("#summary-title"), summaryCopy: document.querySelector(".summary-copy"), rewardPopup: document.querySelector("#reward-popup"), rewardSticker: document.querySelector("#reward-sticker"), bonus: document.querySelector("#balloon-bonus"), balloonTarget: document.querySelector("#balloon-target"), balloons: document.querySelector("#balloons"), parentLogo: document.querySelector("#welcome-title"), parentDashboard: document.querySelector("#parent-dashboard"), parentDashboardClose: document.querySelector("#parent-dashboard-close"), parentPlayTime: document.querySelector("#parent-play-time"), parentQuestions: document.querySelector("#parent-questions"), parentCorrect: document.querySelector("#parent-correct"), parentCategory: document.querySelector("#parent-category"), parentStreak: document.querySelector("#parent-streak"), parentDifficultWords: document.querySelector("#parent-difficult-words")
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
let parentData = loadParentData();
let playStartedAt = 0;
let parentHoldTimer;
let sessionCelebrationTimer;

function loadParentData() {
  try {
    return JSON.parse(window.localStorage.getItem(PARENT_DATA_STORAGE_KEY)) ?? { playTime: 0, questionsAnswered: 0, correctAnswers: 0, categoryCounts: {}, difficultWords: {}, bestStreak: 0 };
  } catch {
    return { playTime: 0, questionsAnswered: 0, correctAnswers: 0, categoryCounts: {}, difficultWords: {}, bestStreak: 0 };
  }
}

function saveParentData() {
  try {
    window.localStorage.setItem(PARENT_DATA_STORAGE_KEY, JSON.stringify(parentData));
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
  return run === audioRun;
}

function setInputEnabled(enabled) {
  isSpeaking = !enabled;
  ui.answers.querySelectorAll("button").forEach(button => { button.disabled = !enabled; });
  ui.replay.disabled = !enabled;
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
    const stickers = JSON.parse(window.localStorage.getItem(STICKER_STORAGE_KEY) ?? "[]");
    window.localStorage.setItem(STICKER_STORAGE_KEY, JSON.stringify([...stickers, sticker]));
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

async function startBalloonBonus() {
  isBalloonBonusActive = true;
  clearSpeech();
  const run = audioRun;
  ui.quiz.classList.add("hidden");
  ui.bonus.classList.remove("hidden");
  ui.balloonTarget.textContent = `Pop ${currentQuestion.correct}.`;
  renderBalloons();
  balloonBonusTimer = window.setTimeout(endBalloonBonus, 20000);
  await speech.speak(ui.balloonTarget.textContent, ENGLISH_LANGUAGE);
  if (isBalloonBonusActive && isActiveAudio(run)) {
    ui.balloons.querySelectorAll("button").forEach(balloon => { balloon.disabled = false; });
  }
}

function popBalloon(balloon, answer) {
  if (!isBalloonBonusActive || balloon.disabled) return;
  if (answer === currentQuestion.correct) {
    balloon.classList.add("balloon-pop");
    audio.playSuccess();
    window.setTimeout(endBalloonBonus, 600);
  } else {
    balloon.classList.add("balloon-wiggle");
    window.setTimeout(() => balloon.classList.remove("balloon-wiggle"), 450);
  }
}

function endBalloonBonus() {
  if (!isBalloonBonusActive) return;
  isBalloonBonusActive = false;
  window.clearTimeout(balloonBonusTimer);
  ui.bonus.classList.add("hidden");
  ui.quiz.classList.remove("hidden");
  if (questionNumber >= SESSION_QUESTION_COUNT) showSessionSummary();
  else showQuestion();
}

function renderAnswers() {
  ui.answers.innerHTML = "";
  engine.getAnswers(currentQuestion).forEach(answer => {
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

async function playQuestionSequence() {
  clearSpeech();
  const run = audioRun;
  setInputEnabled(false);
  await speech.speak(currentQuestion.prompt, ENGLISH_LANGUAGE);
  if (!isActiveAudio(run)) return;
  await appUtils.wait(QUESTION_DELAY);
  const answerButtons = getAnswerButtons();
  for (let index = 0; index < answerButtons.length; index += 1) {
    if (!isActiveAudio(run)) return;
    const button = answerButtons[index];
    button.classList.add("speaking-choice");
    await speech.speak(button.textContent, ENGLISH_LANGUAGE);
    button.classList.remove("speaking-choice");
    if (index < answerButtons.length - 1) await appUtils.wait(CHOICE_DELAY);
  }
  await appUtils.wait(QUESTION_DELAY);
  if (!isActiveAudio(run)) return;
  await speech.speak(currentQuestion.prompt, ENGLISH_LANGUAGE);
  if (isActiveAudio(run)) setInputEnabled(true);
}

function showQuestion() {
  clearSpeech();
  currentQuestion = engine.selectQuestion();
  questionNumber += 1;
  ui.category.textContent = currentQuestion.label;
  ui.visual.textContent = currentQuestion.visual;
  ui.prompt.textContent = currentQuestion.prompt;
  ui.feedback.textContent = "";
  ui.feedback.className = "feedback";
  ui.next.classList.add("hidden");
  updateScoreboard();
  renderAnswers();
  playQuestionSequence();
}

async function showSessionSummary() {
  clearSpeech();
  const run = audioRun;
  stopPlayTime();
  const celebrationMessage = appUtils.randomItem(SESSION_CELEBRATION_MESSAGES);
  ui.summaryStars.textContent = stars;
  ui.summaryCorrect.textContent = correctAnswers;
  ui.summaryStreak.textContent = bestStreak;
  ui.summaryCategory.textContent = engine.getFavoriteCategory();
  ui.summaryTitle.innerHTML = celebrationMessage.replace(" Mila!", "<br /><span>Mila!</span>");
  ui.summaryCopy.textContent = `${questionNumber} soru tamamlandı!`;
  ui.quiz.classList.add("hidden");
  ui.summary.classList.remove("hidden");
  animations.celebrate();
  audio.playSuccess();
  await speech.speak(celebrationMessage, TURKISH_LANGUAGE);
  if (!isActiveAudio(run)) return;
  window.clearTimeout(sessionCelebrationTimer);
  sessionCelebrationTimer = window.setTimeout(() => {
    if (isActiveAudio(run)) startGame();
  }, SESSION_CELEBRATION_DURATION);
}

async function handleWrongAnswer(button) {
  clearSpeech();
  const run = audioRun;
  streak = 0;
  engine.recordResult(currentQuestion, false);
  updateParentData(false);
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
  clearSpeech();
  const run = audioRun;
  stars += 1;
  if (stars % 10 === 0) awardSticker();
  streak += 1;
  bestStreak = Math.max(bestStreak, streak);
  correctAnswers += 1;
  engine.recordResult(currentQuestion, true);
  updateParentData(true);
  triggerMascotReaction("mascot-celebrate");
  button.classList.add("correct");
  setInputEnabled(false);
  ui.feedback.textContent = appUtils.randomItem(PRAISE_MESSAGES);
  ui.feedback.className = "feedback success";
  updateScoreboard();
  ui.next.classList.add("hidden");
  animations.celebrate();
  audio.playSuccess();
  await speech.speak(ui.feedback.textContent, TURKISH_LANGUAGE);
  await appUtils.wait(SUCCESS_NEXT_DELAY);
  if (!isActiveAudio(run)) return;
  if (correctAnswers % 10 === 0) startBalloonBonus();
  else if (questionNumber >= SESSION_QUESTION_COUNT) showSessionSummary();
  else showQuestion();
}

function answerQuestion(button, answer) {
  if (isSpeaking || button.disabled) return;
  if (answer === currentQuestion.correct) handleCorrectAnswer(button);
  else handleWrongAnswer(button);
}

function resetSession() {
  stars = 0;
  streak = 0;
  bestStreak = 0;
  correctAnswers = 0;
  questionNumber = 0;
  engine.resetSession();
}

async function startGame() {
  if (isStartingGame) return;
  window.clearTimeout(sessionCelebrationTimer);
  isStartingGame = true;
  try {
    [engine] = await Promise.all([gameReady, speech.ready]);
    ui.welcome.classList.add("hidden");
    ui.summary.classList.add("hidden");
    ui.quiz.classList.remove("hidden");
    resetSession();
    startPlayTime();
    showQuestion();
  } finally {
    isStartingGame = false;
  }
}

function speakWelcome() {
  clearSpeech();
  speech.speak(WELCOME_MESSAGE, TURKISH_LANGUAGE);
}

function goHome() {
  clearSpeech();
  window.clearTimeout(sessionCelebrationTimer);
  stopPlayTime();
  isBalloonBonusActive = false;
  window.clearTimeout(balloonBonusTimer);
  ui.quiz.classList.add("hidden");
  ui.bonus.classList.add("hidden");
  ui.summary.classList.add("hidden");
  ui.welcome.classList.remove("hidden");
  speakWelcome();
}

ui.start.addEventListener("click", startGame);
ui.welcomeSound.addEventListener("click", speakWelcome);
ui.home.addEventListener("click", goHome);
ui.replay.addEventListener("click", () => {
  if (!isSpeaking) playQuestionSequence();
});
ui.next.addEventListener("click", showQuestion);
ui.playAgain.addEventListener("click", startGame);
ui.summaryHome.addEventListener("click", goHome);
ui.parentLogo.addEventListener("pointerdown", () => {
  window.clearTimeout(parentHoldTimer);
  parentHoldTimer = window.setTimeout(openParentDashboard, PARENT_HOLD_DURATION);
});
["pointerup", "pointercancel", "pointerleave"].forEach(eventName => ui.parentLogo.addEventListener(eventName, () => window.clearTimeout(parentHoldTimer)));
ui.parentDashboardClose.addEventListener("click", closeParentDashboard);
window.addEventListener("load", () => window.setTimeout(speakWelcome, 400));
