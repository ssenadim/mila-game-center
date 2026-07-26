(function (root) {
  "use strict";

  const MIN_NUMBER = 0;
  const MAX_NUMBER = 20;
  const NUMBER_STAGE_IDS = Object.freeze([
    "count-objects",
    "order-numbers",
    "previous-next-number",
    "find-greater-number",
    "find-smaller-number",
    "equal-quantities"
  ]);
  const VISUAL_GROUPS = Object.freeze([
    { id: "animals", label: "Hayvanlar", symbols: ["🐶", "🐱", "🐰"] },
    { id: "fruits", label: "Meyveler", symbols: ["🍎", "🍐", "🍓"] },
    { id: "toys", label: "Oyuncaklar", symbols: ["🧸", "⚽", "🪁"] },
    { id: "vehicles", label: "Taşıtlar", symbols: ["🚗", "🚲", "🚂"] },
    { id: "nature", label: "Doğa", symbols: ["🌼", "🍀", "🌟"] },
    { id: "sea", label: "Deniz", symbols: ["🐟", "🐚", "🐙"] },
    { id: "school", label: "Okul", symbols: ["✏️", "📘", "🎒"] },
    { id: "home", label: "Ev", symbols: ["🪑", "🧦", "🔑"] }
  ]);

  function randomIndex(length, rng = Math.random) {
    return Math.min(length - 1, Math.floor(rng() * length));
  }

  function shuffle(values, rng = Math.random) {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(rng() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function range(start, end) {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  function getDifficulty(roundNumber, totalRounds = 10) {
    const ratio = Math.max(0, roundNumber - 1) / Math.max(1, totalRounds);
    if (ratio < 0.34) return { level: 1, min: 0, max: 5, choiceCount: 2, orderCount: 3 };
    if (ratio < 0.67) return { level: 2, min: 0, max: 10, choiceCount: 3, orderCount: 4 };
    return { level: 3, min: 0, max: 20, choiceCount: 3, orderCount: 5 };
  }

  function pickDistinct(count, min, max, rng = Math.random) {
    return shuffle(range(min, max), rng).slice(0, Math.min(count, max - min + 1));
  }

  function makeChoices(correct, count, min, max, rng = Math.random) {
    const distractors = range(min, max).filter(value => value !== correct);
    return shuffle([correct, ...shuffle(distractors, rng).slice(0, count - 1)], rng);
  }

  function createQuantityVisual(quantity, groupIndex = 0, symbolIndex = 0) {
    const group = VISUAL_GROUPS[groupIndex % VISUAL_GROUPS.length];
    const symbol = group.symbols[symbolIndex % group.symbols.length];
    return {
      quantity,
      groupId: group.id,
      groupLabel: group.label,
      symbol,
      rows: quantity === 0 ? [] : Array.from({ length: Math.ceil(quantity / 5) }, (_, row) =>
        Array(Math.min(5, quantity - row * 5)).fill(symbol)
      )
    };
  }

  function createCountingRound(roundNumber, totalRounds = 10, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds);
    const correct = difficulty.min + randomIndex(difficulty.max - difficulty.min + 1, rng);
    return {
      type: "counting",
      prompt: "Kaç tane var?",
      speech: "Nesneleri say. Kaç tane var?",
      correct,
      choices: makeChoices(correct, difficulty.choiceCount, difficulty.min, difficulty.max, rng),
      visual: createQuantityVisual(correct, roundNumber - 1, roundNumber - 1),
      difficulty
    };
  }

  function createOrderingRound(roundNumber, totalRounds = 10, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds);
    const direction = roundNumber % 2 === 0 ? "descending" : "ascending";
    const values = pickDistinct(difficulty.orderCount, difficulty.min, difficulty.max, rng);
    const target = [...values].sort((first, second) => direction === "ascending" ? first - second : second - first);
    let pieces = shuffle(values, rng);
    if (pieces.every((value, index) => value === target[index])) pieces = [...pieces.slice(1), pieces[0]];
    return {
      type: "ordering",
      prompt: direction === "ascending" ? "Küçükten büyüğe sırala." : "Büyükten küçüğe sırala.",
      speech: direction === "ascending" ? "Sayıları küçükten büyüğe sırala." : "Sayıları büyükten küçüğe sırala.",
      direction,
      pieces,
      target,
      difficulty
    };
  }

  function createNeighborRound(roundNumber, totalRounds = 10, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds);
    const mode = roundNumber % 2 === 0 ? "previous" : "next";
    const minimum = mode === "previous" ? 1 : difficulty.min;
    const maximum = mode === "next" ? Math.max(minimum, difficulty.max - 1) : difficulty.max;
    const center = minimum + randomIndex(maximum - minimum + 1, rng);
    const correct = mode === "previous" ? center - 1 : center + 1;
    return {
      type: "neighbor",
      mode,
      center,
      correct,
      prompt: mode === "previous" ? `${center} sayısından önce hangisi gelir?` : `${center} sayısından sonra hangisi gelir?`,
      speech: mode === "previous" ? `${center} sayısından önce hangi sayı gelir?` : `${center} sayısından sonra hangi sayı gelir?`,
      choices: makeChoices(correct, difficulty.choiceCount, difficulty.min, difficulty.max, rng),
      difficulty
    };
  }

  function createComparisonRound(mode, roundNumber, totalRounds = 8, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds);
    const choices = pickDistinct(difficulty.level === 1 ? 2 : 3, difficulty.min, difficulty.max, rng);
    const correct = mode === "greater" ? Math.max(...choices) : Math.min(...choices);
    return {
      type: "comparison",
      mode,
      correct,
      choices: shuffle(choices, rng),
      prompt: mode === "greater" ? "Büyük sayıyı bul." : "Küçük sayıyı bul.",
      speech: mode === "greater" ? "Hangi sayı daha büyük?" : "Hangi sayı daha küçük?",
      difficulty
    };
  }

  function createEqualQuantityRound(roundNumber, totalRounds = 8, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds);
    const sourceQuantity = difficulty.min + randomIndex(difficulty.max - difficulty.min + 1, rng);
    const quantities = makeChoices(sourceQuantity, difficulty.choiceCount, difficulty.min, difficulty.max, rng);
    const groupIndex = (roundNumber - 1) % VISUAL_GROUPS.length;
    return {
      type: "equal-quantity",
      prompt: "Aynı miktardaki grubu bul.",
      speech: "Soldaki grupla aynı miktarda olan grubu bul.",
      correct: sourceQuantity,
      source: createQuantityVisual(sourceQuantity, groupIndex, roundNumber),
      choices: quantities.map((quantity, index) => ({
        value: quantity,
        visual: createQuantityVisual(quantity, groupIndex + index + 1, roundNumber + index + 1)
      })),
      difficulty
    };
  }

  function createRound(stageId, roundNumber, totalRounds, rng = Math.random) {
    if (stageId === "count-objects") return createCountingRound(roundNumber, totalRounds, rng);
    if (stageId === "order-numbers") return createOrderingRound(roundNumber, totalRounds, rng);
    if (stageId === "previous-next-number") return createNeighborRound(roundNumber, totalRounds, rng);
    if (stageId === "find-greater-number") return createComparisonRound("greater", roundNumber, totalRounds, rng);
    if (stageId === "find-smaller-number") return createComparisonRound("smaller", roundNumber, totalRounds, rng);
    if (stageId === "equal-quantities") return createEqualQuantityRound(roundNumber, totalRounds, rng);
    return undefined;
  }

  function createOrderingState(round) {
    return { target: [...round.target], pieces: [...round.pieces], slots: Array(round.target.length).fill(null) };
  }

  function placeOrderingPiece(state, value, slotIndex) {
    if (!state || !state.pieces.includes(value) || slotIndex < 0 || slotIndex >= state.slots.length) return false;
    const oldSlotIndex = state.slots.indexOf(value);
    if (oldSlotIndex >= 0) state.slots[oldSlotIndex] = null;
    state.slots[slotIndex] = value;
    return true;
  }

  function isOrderingComplete(state) {
    return Boolean(state?.slots.every((value, index) => value === state.target[index]));
  }

  function validateRound(round) {
    if (!round || typeof round.prompt !== "string" || typeof round.speech !== "string") return false;
    const validNumber = value => Number.isInteger(value) && value >= MIN_NUMBER && value <= MAX_NUMBER;
    if (round.type === "ordering") {
      return round.pieces.length === round.target.length
        && new Set(round.pieces).size === round.pieces.length
        && round.pieces.every(validNumber)
        && [...round.target].sort((a, b) => a - b).every((value, index) => [...round.pieces].sort((a, b) => a - b)[index] === value);
    }
    if (round.type === "equal-quantity") {
      const values = round.choices.map(choice => choice.value);
      return validNumber(round.correct) && values.filter(value => value === round.correct).length === 1
        && new Set(values).size === values.length && values.every(validNumber);
    }
    return validNumber(round.correct) && Array.isArray(round.choices)
      && round.choices.includes(round.correct) && new Set(round.choices).size === round.choices.length
      && round.choices.every(validNumber);
  }

  function validateContent(warn = console.warn) {
    const problems = [];
    const groupIds = VISUAL_GROUPS.map(group => group.id);
    if (VISUAL_GROUPS.length < 8) problems.push("En az 8 görsel grubu gerekli.");
    if (new Set(groupIds).size !== groupIds.length) problems.push("Tekrarlanan görsel grup kimliği var.");
    VISUAL_GROUPS.forEach(group => {
      if (!group.id || !group.label || !Array.isArray(group.symbols) || group.symbols.length < 1) problems.push(`${group.id || "bilinmeyen"} görsel grubu geçersiz.`);
    });
    NUMBER_STAGE_IDS.forEach(stageId => {
      [1, 4, 8].forEach(roundNumber => {
        const total = ["find-greater-number", "find-smaller-number", "equal-quantities"].includes(stageId) ? 8 : 10;
        if (!validateRound(createRound(stageId, roundNumber, total, () => 0.42))) problems.push(`${stageId} geçerli tur üretemedi.`);
      });
    });
    problems.forEach(problem => warn(`[Sprint 8.3.2 Sayılar] ${problem}`));
    return { valid: problems.length === 0, problems };
  }

  const validation = validateContent();

  root.MilaNumberLearning = {
    MIN_NUMBER, MAX_NUMBER, NUMBER_STAGE_IDS, VISUAL_GROUPS, validation, shuffle, getDifficulty,
    createQuantityVisual, createCountingRound, createOrderingRound, createNeighborRound,
    createComparisonRound, createEqualQuantityRound, createRound, createOrderingState,
    placeOrderingPiece, isOrderingComplete, validateRound, validateContent
  };

  if (typeof module !== "undefined" && module.exports) module.exports = root.MilaNumberLearning;
})(typeof window !== "undefined" ? window : globalThis);
