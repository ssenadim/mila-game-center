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
  const ADDITION_STAGE_IDS = Object.freeze([
    "addition-preparation",
    "add-two-numbers",
    "visual-addition"
  ]);
  const PLAYABLE_STAGE_IDS = Object.freeze([...NUMBER_STAGE_IDS, ...ADDITION_STAGE_IDS]);
  const PREPARATION_PATTERNS = Object.freeze(["combine-groups", "add-more", "find-total"]);
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
      blocks: quantity > 10 ? [10, quantity - 10].filter(Boolean) : [quantity],
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

  function getAdditionDifficulty(stageId, roundNumber, totalRounds) {
    const base = getDifficulty(roundNumber, totalRounds);
    if (base.level === 1) {
      return {
        level: 1,
        addendMin: stageId === "add-two-numbers" ? 0 : 1,
        addendMax: stageId === "addition-preparation" || stageId === "visual-addition" ? 3 : 5,
        resultMax: 5,
        choiceCount: 2,
        allowZero: false
      };
    }
    if (base.level === 2) {
      return {
        level: 2,
        addendMin: 0,
        addendMax: stageId === "add-two-numbers" ? 7 : 5,
        resultMax: 10,
        choiceCount: 3,
        allowZero: [4, 7].includes(roundNumber)
      };
    }
    return {
      level: 3,
      addendMin: stageId === "add-two-numbers" ? 0 : 1,
      addendMax: 10,
      resultMax: stageId === "addition-preparation" ? 15 : 20,
      choiceCount: stageId === "add-two-numbers" && roundNumber === totalRounds ? 4 : 3,
      allowZero: stageId === "add-two-numbers" && [7, 9].includes(roundNumber)
    };
  }

  function makeAdditionChoices(correct, count, first, second, roundNumber) {
    const candidates = [
      first,
      second,
      correct + (roundNumber < 3 ? 2 : 1),
      correct - (roundNumber < 3 ? 2 : 1),
      Math.abs(first - second),
      correct + 2,
      correct - 2,
      ...range(0, MAX_NUMBER)
    ];
    const unique = [...new Set(candidates)].filter(value => Number.isInteger(value) && value >= 0 && value <= MAX_NUMBER && value !== correct);
    const choices = unique.slice(0, count - 1);
    const correctIndex = (roundNumber - 1) % count;
    choices.splice(correctIndex, 0, correct);
    return choices;
  }

  function getTurkishNumber(value) {
    return ["sıfır", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on", "on bir", "on iki", "on üç", "on dört", "on beş", "on altı", "on yedi", "on sekiz", "on dokuz", "yirmi"][value];
  }

  function isRecentEquation(first, second, recentEquations) {
    const orderedKey = `${first}+${second}`;
    const previous = recentEquations[0];
    return recentEquations.includes(orderedKey) || previous === `${second}+${first}`;
  }

  function generateAddends(stageId, roundNumber, totalRounds, recentEquations = [], rng = Math.random) {
    const difficulty = getAdditionDifficulty(stageId, roundNumber, totalRounds);
    const effectiveMin = difficulty.allowZero ? difficulty.addendMin : Math.max(1, difficulty.addendMin);
    for (let attempt = 0; attempt < 18; attempt += 1) {
      let first = effectiveMin + randomIndex(difficulty.addendMax - effectiveMin + 1, rng);
      let second = effectiveMin + randomIndex(difficulty.addendMax - effectiveMin + 1, rng);
      if (difficulty.allowZero && attempt === 0) {
        if (roundNumber % 2 === 0) first = 0;
        else second = 0;
      }
      const result = first + second;
      if (first === 0 && second === 0) continue;
      if (result < 1 || result > difficulty.resultMax || result > MAX_NUMBER) continue;
      if (isRecentEquation(first, second, recentEquations)) continue;
      return { first, second, result, difficulty };
    }
    const safeCandidates = [];
    for (let first = effectiveMin; first <= difficulty.addendMax; first += 1) {
      for (let second = effectiveMin; second <= difficulty.addendMax; second += 1) {
        const result = first + second;
        if (first === 0 && second === 0 || result < 1 || result > difficulty.resultMax || isRecentEquation(first, second, recentEquations)) continue;
        safeCandidates.push({ first, second, result });
      }
    }
    if (safeCandidates.length) {
      const candidate = safeCandidates[(roundNumber - 1) % safeCandidates.length];
      return { ...candidate, difficulty, usedFallback: true };
    }
    const safeFirst = Math.min(difficulty.addendMax, Math.max(1, (roundNumber % Math.max(2, difficulty.resultMax - 1))));
    const safeSecond = Math.max(1, Math.min(difficulty.addendMax, difficulty.resultMax - safeFirst));
    return { first: safeFirst, second: safeSecond, result: safeFirst + safeSecond, difficulty, usedFallback: true };
  }

  function createAdditionRound(stageId, roundNumber, totalRounds, {
    rng = Math.random,
    recentEquations = [],
    warn = console.warn
  } = {}) {
    const generated = generateAddends(stageId, roundNumber, totalRounds, recentEquations, rng);
    if (generated.usedFallback) warn(`[Sprint 8.3.3 Toplama] ${stageId} için güvenli yedek tur kullanıldı.`);
    const { first, second, result, difficulty } = generated;
    const groupIndex = (roundNumber - 1) % VISUAL_GROUPS.length;
    const firstVisual = createQuantityVisual(first, groupIndex, roundNumber - 1);
    const secondVisual = createQuantityVisual(second, groupIndex, roundNumber - 1);
    const pattern = stageId === "addition-preparation" ? PREPARATION_PATTERNS[(roundNumber - 1) % PREPARATION_PATTERNS.length] : undefined;
    const prompt = stageId === "add-two-numbers"
      ? `${first} + ${second} kaç eder?`
      : pattern === "add-more"
        ? "Şimdi kaç tane oldu?"
        : pattern === "find-total"
          ? "Doğru toplamı bul."
          : "Hepsi birlikte kaç tane?";
    const speech = stageId === "add-two-numbers"
      ? `${getTurkishNumber(first)} artı ${getTurkishNumber(second)} kaç eder?`
      : pattern === "add-more"
        ? "Şimdi kaç tane oldu?"
        : "Hepsi birlikte kaç tane?";
    return {
      type: stageId === "addition-preparation" ? "addition-preparation" : stageId === "add-two-numbers" ? "numeric-addition" : "visual-addition",
      stageId,
      first,
      second,
      result,
      correct: result,
      equation: `${first} + ${second} = ?`,
      accessibleEquation: `${getTurkishNumber(first)} ${firstVisual.groupLabel.toLocaleLowerCase("tr-TR")} nesnesi artı ${getTurkishNumber(second)} ${secondVisual.groupLabel.toLocaleLowerCase("tr-TR")} nesnesi. Sonucu seç.`,
      prompt,
      speech,
      choices: makeAdditionChoices(result, difficulty.choiceCount, first, second, roundNumber),
      firstVisual,
      secondVisual,
      combinedVisual: createQuantityVisual(result, groupIndex, roundNumber - 1),
      visualGroupId: firstVisual.groupId,
      pattern,
      usesVisualChoices: stageId === "addition-preparation" && pattern === "find-total",
      canCombine: stageId === "addition-preparation" && pattern !== "find-total",
      hasVisualHelp: stageId === "add-two-numbers",
      hasCountingSupport: stageId !== "add-two-numbers",
      difficulty
    };
  }

  function createRound(stageId, roundNumber, totalRounds, rng = Math.random, context = {}) {
    if (stageId === "count-objects") return createCountingRound(roundNumber, totalRounds, rng);
    if (stageId === "order-numbers") return createOrderingRound(roundNumber, totalRounds, rng);
    if (stageId === "previous-next-number") return createNeighborRound(roundNumber, totalRounds, rng);
    if (stageId === "find-greater-number") return createComparisonRound("greater", roundNumber, totalRounds, rng);
    if (stageId === "find-smaller-number") return createComparisonRound("smaller", roundNumber, totalRounds, rng);
    if (stageId === "equal-quantities") return createEqualQuantityRound(roundNumber, totalRounds, rng);
    if (ADDITION_STAGE_IDS.includes(stageId)) return createAdditionRound(stageId, roundNumber, totalRounds, { ...context, rng });
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
    if (["addition-preparation", "numeric-addition", "visual-addition"].includes(round.type)) {
      return validNumber(round.first)
        && validNumber(round.second)
        && !(round.first === 0 && round.second === 0)
        && round.result === round.first + round.second
        && round.result >= 1
        && round.result <= round.difficulty.resultMax
        && round.firstVisual.quantity === round.first
        && round.secondVisual.quantity === round.second
        && round.combinedVisual.quantity === round.result
        && round.firstVisual.symbol === round.secondVisual.symbol
        && round.choices.filter(value => value === round.correct).length === 1
        && new Set(round.choices).size === round.choices.length
        && round.choices.every(validNumber);
    }
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
    ADDITION_STAGE_IDS.forEach(stageId => {
      const total = stageId === "addition-preparation" ? 8 : 10;
      range(1, total).forEach(roundNumber => {
        if (!validateRound(createAdditionRound(stageId, roundNumber, total, { rng: () => 0.42, warn: () => {} }))) {
          problems.push(`${stageId} geçerli toplama turu üretemedi.`);
        }
      });
    });
    problems.forEach(problem => warn(`[Sprint 8.3.2 Sayılar] ${problem}`));
    return { valid: problems.length === 0, problems };
  }

  const validation = validateContent();

  root.MilaNumberLearning = {
    MIN_NUMBER, MAX_NUMBER, NUMBER_STAGE_IDS, ADDITION_STAGE_IDS, PLAYABLE_STAGE_IDS, PREPARATION_PATTERNS, VISUAL_GROUPS, validation, shuffle, getDifficulty,
    createQuantityVisual, createCountingRound, createOrderingRound, createNeighborRound,
    createComparisonRound, createEqualQuantityRound, getAdditionDifficulty, getTurkishNumber,
    generateAddends, createAdditionRound, createRound, createOrderingState,
    placeOrderingPiece, isOrderingComplete, validateRound, validateContent
  };

  if (typeof module !== "undefined" && module.exports) module.exports = root.MilaNumberLearning;
})(typeof window !== "undefined" ? window : globalThis);
