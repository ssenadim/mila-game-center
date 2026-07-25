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
    this.learningStats = new Map();
    this.difficulty = DEFAULT_DIFFICULTY;
    this.recentResults = [];
    this.resetSession();
  }

  resetSession() {
    this.recentQuestions = [];
    this.recentCategories = [];
    this.recentAnswers = [];
    this.categoryCounts = {};
  }

  getStats(question) {
    if (!this.learningStats.has(question)) this.learningStats.set(question, { mistakes: 0, successes: 0 });
    return this.learningStats.get(question);
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
    const fresh = this.questions.filter(question => !this.recentQuestions.includes(question));
    const categoryBalanced = fresh.filter(question => !this.recentCategories.slice(-RECENT_BALANCE_LIMIT).includes(question.category));
    const answerBalanced = categoryBalanced.filter(question => !this.recentAnswers.slice(-RECENT_BALANCE_LIMIT).includes(question.correct));
    const choices = answerBalanced.length ? answerBalanced : categoryBalanced.length ? categoryBalanced : fresh;
    const question = this.pickWeighted(choices);
    this.remember(question);
    return question;
  }

  remember(question) {
    this.recentQuestions = [...this.recentQuestions, question].slice(-RECENT_QUESTION_LIMIT);
    this.recentCategories = [...this.recentCategories, question.category].slice(-RECENT_BALANCE_LIMIT);
    this.recentAnswers = [...this.recentAnswers, question.correct].slice(-RECENT_BALANCE_LIMIT);
    this.categoryCounts[question.label] = (this.categoryCounts[question.label] ?? 0) + 1;
  }

  getAnswers(question) {
    return window.MilaUtils.shuffle(question.answers);
  }

  getFavoriteCategory() {
    return Object.entries(this.categoryCounts).reduce((favorite, entry) => entry[1] > favorite[1] ? entry : favorite, ["-", 0])[0];
  }
}

window.MilaQuestionEngine = QuestionEngine;
