const RECENT_QUESTION_LIMIT = 5;
const RECENT_BALANCE_LIMIT = 2;
const MINIMUM_WEIGHT = .25;

class QuestionEngine {
  constructor(questions) {
    this.questions = questions;
    this.learningStats = new Map();
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
  }

  getWeight(question) {
    const { mistakes, successes } = this.getStats(question);
    return Math.max(MINIMUM_WEIGHT, 1 + mistakes * 2 - successes * .35);
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
