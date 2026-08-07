(function initializeBonusManager(root) {
  "use strict";

  const REQUIRED_BONUS_IDS = Object.freeze(["balloon", "star-rain", "treasure", "quick-match", "color-pop"]);
  const BONUS_REGISTRY = Object.freeze([
    { id: "balloon", title: "Balon Bonusu", icon: "🎈", playable: true, launchStrategy: "balloon", completionStrategy: "target", reward: { stars: 2 } },
    { id: "star-rain", title: "Yıldız Yağmuru", icon: "⭐", playable: true, launchStrategy: "star-rain", completionStrategy: "collect-all", reward: { stars: 2 } },
    { id: "treasure", title: "Hazine Kutuları", icon: "🎁", playable: true, launchStrategy: "treasure", completionStrategy: "choose-positive", reward: { stars: 2 } },
    { id: "quick-match", title: "Hızlı Eşleştir", icon: "🧩", playable: true, launchStrategy: "quick-match", completionStrategy: "match-pairs", reward: { stars: 2 } },
    { id: "color-pop", title: "Renk Patlat", icon: "🎨", playable: true, launchStrategy: "color-pop", completionStrategy: "collect-targets", reward: { stars: 2 } }
  ]);

  function validateRegistry(registry = BONUS_REGISTRY) {
    const errors = [];
    const ids = registry.map(bonus => bonus?.id);
    if (new Set(ids).size !== ids.length) errors.push("Bonus kimlikleri benzersiz olmalı.");
    REQUIRED_BONUS_IDS.forEach(id => { if (!ids.includes(id)) errors.push(`Eksik bonus: ${id}`); });
    registry.forEach(bonus => {
      if (!bonus?.playable || !bonus.launchStrategy || !bonus.completionStrategy) errors.push(`Bonus oynanabilir değil: ${bonus?.id}`);
      if (!Number.isFinite(bonus?.reward?.stars) || bonus.reward.stars < 0 || bonus.reward.stars > 3) errors.push(`Geçersiz bonus ödülü: ${bonus?.id}`);
    });
    return { valid: errors.length === 0, errors };
  }

  class BonusManager {
    constructor({ random = Math.random, sessionCap = 3, minInteractions = 4, maxInteractions = 7, warn = message => console.warn(message) } = {}) {
      this.random = random;
      this.sessionCap = Math.max(1, Math.min(3, Number(sessionCap) || 3));
      this.minInteractions = Math.max(1, Number(minInteractions) || 4);
      this.maxInteractions = Math.max(this.minInteractions, Number(maxInteractions) || 7);
      this.warn = warn;
      this.interactions = 0;
      this.nextThreshold = this.createThreshold();
      this.sessionBonusCount = 0;
      this.recentBonusIds = [];
      this.processedEventIds = new Set();
      this.completedInstanceIds = new Set();
      this.instanceSequence = 0;
      this.active = undefined;
      this.pending = false;
      const validation = validateRegistry();
      if (!validation.valid) validation.errors.forEach(warn);
    }

    createThreshold() {
      return this.minInteractions + Math.floor(this.random() * (this.maxInteractions - this.minInteractions + 1));
    }

    recordEligibleEvent(eventId) {
      if (typeof eventId !== "string" || this.processedEventIds.has(eventId)) return false;
      this.processedEventIds.add(eventId);
      if (this.processedEventIds.size > 100) this.processedEventIds.delete(this.processedEventIds.values().next().value);
      if (this.sessionBonusCount >= this.sessionCap) return false;
      this.interactions += 1;
      if (this.interactions >= this.nextThreshold) this.pending = true;
      return true;
    }

    chooseBonus(eligibleIds = REQUIRED_BONUS_IDS) {
      const available = BONUS_REGISTRY.filter(bonus => bonus.playable && eligibleIds.includes(bonus.id));
      if (!available.length) return undefined;
      const preferred = available.filter(bonus => !this.recentBonusIds.includes(bonus.id));
      const pool = preferred.length ? preferred : available.filter(bonus => bonus.id !== this.recentBonusIds[0]);
      const choices = pool.length ? pool : available;
      return choices[Math.floor(this.random() * choices.length)];
    }

    takePending({ safe = false, eligibleIds = REQUIRED_BONUS_IDS } = {}) {
      if (!safe || !this.pending || this.active || this.sessionBonusCount >= this.sessionCap) return undefined;
      const bonus = this.chooseBonus(eligibleIds);
      if (!bonus) return undefined;
      this.pending = false;
      this.interactions = 0;
      this.nextThreshold = this.createThreshold();
      this.sessionBonusCount += 1;
      const instance = {
        id: `bonus-${++this.instanceSequence}`,
        bonusId: bonus.id,
        title: bonus.title,
        icon: bonus.icon,
        reward: { ...bonus.reward },
        paused: false,
        completed: false,
        rewardGranted: false
      };
      this.active = instance;
      this.recentBonusIds = [bonus.id, ...this.recentBonusIds.filter(id => id !== bonus.id)].slice(0, 2);
      return { ...instance, reward: { ...instance.reward } };
    }

    complete(instanceId) {
      if (!this.active || this.active.id !== instanceId || this.completedInstanceIds.has(instanceId)) return { completed: false, rewardGranted: false };
      this.completedInstanceIds.add(instanceId);
      this.active.completed = true;
      this.active.rewardGranted = true;
      return { completed: true, rewardGranted: true, reward: { ...this.active.reward }, bonusId: this.active.bonusId };
    }

    pause() {
      if (this.active) this.active.paused = true;
    }

    resume() {
      if (this.active) this.active.paused = false;
    }

    finish(instanceId) {
      if (!this.active || this.active.id !== instanceId) return false;
      this.active = undefined;
      return true;
    }

    cancel() {
      this.active = undefined;
    }

    resetSession() {
      this.interactions = 0;
      this.nextThreshold = this.createThreshold();
      this.sessionBonusCount = 0;
      this.recentBonusIds = [];
      this.processedEventIds.clear();
      this.completedInstanceIds.clear();
      this.active = undefined;
      this.pending = false;
    }

    getState() {
      return {
        interactions: this.interactions,
        nextThreshold: this.nextThreshold,
        sessionBonusCount: this.sessionBonusCount,
        pending: this.pending,
        recentBonusIds: [...this.recentBonusIds],
        active: this.active ? { ...this.active, reward: { ...this.active.reward } } : undefined
      };
    }
  }

  const api = { REQUIRED_BONUS_IDS, BONUS_REGISTRY, BonusManager, validateRegistry };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.MilaBonusManager = api;
})(typeof window !== "undefined" ? window : globalThis);
