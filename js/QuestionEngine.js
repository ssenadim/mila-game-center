const RECENT_QUESTION_LIMIT = 5;
const RECENT_BALANCE_LIMIT = 2;
const MINIMUM_WEIGHT = .25;
const MINIMUM_DIFFICULTY = .2;
const MAXIMUM_DIFFICULTY = .8;
const DEFAULT_DIFFICULTY = .5;
const SUCCESS_DIFFICULTY_STEP = .03;
const MISTAKE_DIFFICULTY_STEP = .05;

class QuestionEngine {
  constructor(questions) {
    this.questions = questions;
    this.activeCategories = this.getAvailableCategories().map(category => category.category);
    this.learningStats = new Map();
    this.difficulty = DEFAULT_DIFFICULTY;
    this.recentResults = [];
    this.resetSession();
  }

  resetSession() {
    this.recentQuestions = [];
    this.recentCategories = [];
    this.recentAnswers = [];
    this.recentQuestionTypes = [];
    this.questionTypeCounts = { recognition: 0, selection: 0 };
    this.categoryCounts = {};
  }

  getStats(question) {
    if (!this.learningStats.has(question)) this.learningStats.set(question, { mistakes: 0, successes: 0 });
    return this.learningStats.get(question);
  }

  getAvailableCategories() {
    return [...new Map(this.questions.filter(question => question.category && question.label).map(question => [question.category, { category: question.category, label: question.label }])).values()];
  }

  setActiveCategories(categories) {
    const availableCategories = this.getAvailableCategories().map(category => category.category);
    const selectedCategories = Array.isArray(categories) ? [...new Set(categories.filter(category => availableCategories.includes(category)))] : [];
    this.activeCategories = selectedCategories.length ? selectedCategories : availableCategories;
  }

  recordResult(question, wasCorrect) {
    const stats = this.getStats(question);
    if (wasCorrect) stats.successes += 1;
    else stats.mistakes += 1;
    this.updateDifficulty(wasCorrect);
  }

  updateDifficulty(wasCorrect) {
    const change = wasCorrect ? SUCCESS_DIFFICULTY_STEP : -MISTAKE_DIFFICULTY_STEP;
    this.difficulty = Math.min(MAXIMUM_DIFFICULTY, Math.max(MINIMUM_DIFFICULTY, this.difficulty + change));
    this.recentResults = [...this.recentResults, wasCorrect].slice(-6);
  }

  getDifficultyState() {
    return { difficulty: this.difficulty, recentResults: this.recentResults };
  }

  restoreDifficultyState(savedState) {
    if (!savedState) return;
    this.difficulty = Math.min(MAXIMUM_DIFFICULTY, Math.max(MINIMUM_DIFFICULTY, savedState.difficulty ?? DEFAULT_DIFFICULTY));
    this.recentResults = Array.isArray(savedState.recentResults) ? savedState.recentResults.slice(-6) : [];
  }

  getQuestionKey(question) {
    return `${question.category}:${question.correct}`;
  }

  getLearningStats() {
    return this.questions.reduce((savedStats, question) => {
      const stats = this.getStats(question);
      if (stats.mistakes || stats.successes) savedStats[this.getQuestionKey(question)] = stats;
      return savedStats;
    }, {});
  }

  restoreLearningStats(savedStats) {
    if (!savedStats) return;
    this.questions.forEach(question => {
      const stats = savedStats[this.getQuestionKey(question)];
      if (stats) this.learningStats.set(question, { mistakes: stats.mistakes ?? 0, successes: stats.successes ?? 0 });
    });
  }

  getWeight(question) {
    const { mistakes, successes } = this.getStats(question);
    const practiceWeight = Math.max(MINIMUM_WEIGHT, 1 + mistakes * 2 - successes * .35);
    return practiceWeight * this.getDifficultyMatch(question);
  }

  getDifficultyMatch(question) {
    const promptLength = question.prompt.split(" ").length;
    const answerLength = question.correct.length;
    const questionDifficulty = Math.min(MAXIMUM_DIFFICULTY, Math.max(MINIMUM_DIFFICULTY, .15 + promptLength * .07 + answerLength * .035));
    return Math.max(.55, 1.45 - Math.abs(questionDifficulty - this.difficulty) * 1.7);
  }

  pickWeighted(questions) {
    const totalWeight = questions.reduce((total, question) => total + this.getWeight(question), 0);
    let target = Math.random() * totalWeight;
    return questions.find(question => {
      target -= this.getWeight(question);
      return target <= 0;
    }) ?? questions[questions.length - 1];
  }

  selectQuestion() {
    const playableQuestions = this.questions.filter(question => this.activeCategories.includes(question.category));
    const availableQuestions = playableQuestions.length ? playableQuestions : this.questions;
    const fresh = availableQuestions.filter(question => !this.recentQuestions.includes(question));
    const categoryBalanced = fresh.filter(question => !this.recentCategories.slice(-RECENT_BALANCE_LIMIT).includes(question.category));
    const answerBalanced = categoryBalanced.filter(question => !this.recentAnswers.slice(-RECENT_BALANCE_LIMIT).includes(question.correct));
    const choices = answerBalanced.length ? answerBalanced : categoryBalanced.length ? categoryBalanced : fresh.length ? fresh : availableQuestions;
    const question = this.pickWeighted(choices);
    question.questionType = this.getQuestionType(question);
    question.questionPrompt = this.getQuestionPrompt(question);
    this.remember(question);
    return question;
  }

  canUseRecognition(question) {
    const visual = typeof question.visual === "string" ? question.visual.trim().toLowerCase() : "";
    const correct = typeof question.correct === "string" ? question.correct.trim().toLowerCase() : "";
    return Boolean(visual) && visual !== correct;
  }

  getQuestionType(question) {
    if (!this.canUseRecognition(question)) return "selection";
    const recentTypes = this.recentQuestionTypes.slice(-2);
    if (recentTypes.length === 2 && recentTypes.every(type => type === recentTypes[0])) return recentTypes[0] === "recognition" ? "selection" : "recognition";
    const difference = this.questionTypeCounts.recognition - this.questionTypeCounts.selection;
    if (difference >= 2) return "selection";
    if (difference <= -2) return "recognition";
    return Math.random() < .5 ? "recognition" : "selection";
  }

  getQuestionPrompt(question) {
    if (question.questionType === "recognition") {
      return ({ Fruits: "What fruit is this?", Colors: "What color is this?", Numbers: "What number is this?", Animals: "What animal is this?", Shapes: "What shape is this?" })[question.category] ?? question.prompt;
    }
    const target = question.correct;
    return ({ Fruits: `Touch the ${target}.`, Colors: `Touch ${target}.`, Numbers: `Touch number ${target.toLowerCase()}.`, Animals: `Touch the ${target}.`, Shapes: `Touch the ${target}.`, Letters: `Touch letter ${target}.`, Emoji: `Touch ${target}.` })[question.category] ?? question.prompt;
  }

  remember(question) {
    this.recentQuestions = [...this.recentQuestions, question].slice(-RECENT_QUESTION_LIMIT);
    this.recentCategories = [...this.recentCategories, question.category].slice(-RECENT_BALANCE_LIMIT);
    this.recentAnswers = [...this.recentAnswers, question.correct].slice(-RECENT_BALANCE_LIMIT);
    this.recentQuestionTypes = [...this.recentQuestionTypes, question.questionType].slice(-2);
    this.questionTypeCounts[question.questionType] += 1;
    this.categoryCounts[question.label] = (this.categoryCounts[question.label] ?? 0) + 1;
  }

  getAnswers(question) {
    const answers = Array.isArray(question.answers) ? question.answers : [];
    const categoryAnswers = this.questions.filter(item => item.category === question.category).map(item => item.correct);
    const uniqueAnswers = [...new Set([question.correct, ...answers, ...categoryAnswers].filter(answer => typeof answer === "string" && answer.trim()))];
    return window.MilaUtils.shuffle(uniqueAnswers.slice(0, 4));
  }

  getFavoriteCategory() {
    return Object.entries(this.categoryCounts).reduce((favorite, entry) => entry[1] > favorite[1] ? entry : favorite, ["-", 0])[0];
  }
}

window.MilaQuestionEngine = QuestionEngine;
