(function initializeLogicAttention(root) {
  "use strict";

  const STAGE_IDS = Object.freeze([
    "odd-one-out", "missing-item", "complete-pattern", "sequence-order",
    "shadow-matching", "same-group", "simple-maze"
  ]);

  const STAGE_CONFIG = Object.freeze({
    "odd-one-out": { type: "oddOneOut", rounds: 8, prompt: "Hangisi farklı?" },
    "missing-item": { type: "missingItem", rounds: 8, prompt: "Hangisi eksik?" },
    "complete-pattern": { type: "patternCompletion", rounds: 8, prompt: "Örüntüyü tamamla." },
    "sequence-order": { type: "sequenceOrdering", rounds: 7, prompt: "Doğru sıraya koy." },
    "shadow-matching": { type: "shadowMatching", rounds: 8, prompt: "Gölgesini bul." },
    "same-group": { type: "grouping", rounds: 8, prompt: "Aynı grupta olanı bul." },
    "simple-maze": { type: "simpleMaze", rounds: 5, prompt: "Hedefe giden yolu bul." }
  });

  const GROUPING_CATEGORIES = Object.freeze([
    ["fruits", "Meyveler", [["apple", "Elma", "🍎"], ["banana", "Muz", "🍌"], ["grape", "Üzüm", "🍇"], ["pear", "Armut", "🍐"]]],
    ["vegetables", "Sebzeler", [["carrot", "Havuç", "🥕"], ["broccoli", "Brokoli", "🥦"], ["corn", "Mısır", "🌽"], ["leafy", "Yeşil sebze", "🥬"]]],
    ["animals", "Hayvanlar", [["cat", "Kedi", "🐱"], ["dog", "Köpek", "🐶"], ["rabbit", "Tavşan", "🐰"], ["lion", "Aslan", "🦁"]]],
    ["sea-animals", "Deniz Hayvanları", [["fish", "Balık", "🐟"], ["octopus", "Ahtapot", "🐙"], ["crab", "Yengeç", "🦀"], ["dolphin", "Yunus", "🐬"]]],
    ["vehicles", "Taşıtlar", [["car", "Araba", "🚗"], ["bus", "Otobüs", "🚌"], ["bike", "Bisiklet", "🚲"], ["plane", "Uçak", "✈️"]]],
    ["clothes", "Giysiler", [["shirt", "Tişört", "👕"], ["pants", "Pantolon", "👖"], ["hat", "Şapka", "🧢"], ["sock", "Çorap", "🧦"]]],
    ["household", "Ev Eşyaları", [["chair", "Sandalye", "🪑"], ["lamp", "Lamba", "💡"], ["bed", "Yatak", "🛏️"], ["clock", "Saat", "🕰️"]]],
    ["school", "Okul Eşyaları", [["bag", "Çanta", "🎒"], ["pencil", "Kalem", "✏️"], ["book", "Kitap", "📘"], ["ruler", "Cetvel", "📏"]]],
    ["toys", "Oyuncaklar", [["ball", "Top", "⚽"], ["teddy", "Ayıcık", "🧸"], ["kite", "Uçurtma", "🪁"], ["puzzle", "Yapboz", "🧩"]]],
    ["food", "Yiyecekler", [["bread", "Ekmek", "🍞"], ["cheese", "Peynir", "🧀"], ["rice", "Pilav", "🍚"], ["soup", "Çorba", "🥣"]]],
    ["nature", "Doğa", [["tree", "Ağaç", "🌳"], ["flower", "Çiçek", "🌻"], ["sun", "Güneş", "☀️"], ["cloud", "Bulut", "☁️"]]],
    ["body", "Vücut Bölümleri", [["nose", "Burun", "👃"], ["ear", "Kulak", "👂"], ["foot", "Ayak", "🦶"], ["hand", "El", "🖐️"]]]
  ].map(([id, label, items]) => ({
    id,
    label,
    items: items.map(([itemId, itemLabel, visual]) => ({ id: `${id}-${itemId}`, label: itemLabel, visual, categoryId: id }))
  })));

  const SEQUENCES = Object.freeze([
    { id: "morning", levels: [1], steps: [["wake", "Uyan", "🌅"], ["brush", "Dişlerini fırçala", "🪥"], ["dress", "Giyin", "👕"]] },
    { id: "egg-chick", levels: [1], steps: [["egg", "Yumurta", "🥚"], ["hatch", "Çatlayan yumurta", "🐣"], ["chick", "Civciv", "🐥"]] },
    { id: "weather", levels: [1], steps: [["cloud", "Bulut", "☁️"], ["rain", "Yağmur", "🌧️"], ["rainbow", "Gökkuşağı", "🌈"]] },
    { id: "plant", levels: [2, 3], steps: [["seed", "Tohum", "🌰"], ["sprout", "Filiz", "🌱"], ["plant", "Bitki", "🌿"], ["flower", "Çiçek", "🌻"]] },
    { id: "butterfly", levels: [2, 3], steps: [["egg", "Yaprakta yumurta", "🥚"], ["caterpillar", "Tırtıl", "🐛"], ["cocoon", "Koza", "🟤"], ["butterfly", "Kelebek", "🦋"]] },
    { id: "day", levels: [2, 3], steps: [["sunrise", "Sabah", "🌅"], ["day", "Gündüz", "☀️"], ["evening", "Akşam", "🌇"], ["night", "Gece", "🌙"]] },
    { id: "snowman", levels: [2, 3], steps: [["snow", "Kar", "❄️"], ["ball", "Kar topu", "⚪"], ["body", "Kardan gövde", "⛄"], ["ready", "Kardan adam", "☃️"]] }
  ].map(sequence => ({ ...sequence, steps: sequence.steps.map(([id, label, visual]) => ({ id: `${sequence.id}-${id}`, label, visual })) })));

  const PATTERN_SETS = Object.freeze([
    [{ id: "sun", label: "Güneş", visual: "☀️" }, { id: "cloud", label: "Bulut", visual: "☁️" }, { id: "star", label: "Yıldız", visual: "⭐" }],
    [{ id: "apple", label: "Elma", visual: "🍎" }, { id: "banana", label: "Muz", visual: "🍌" }, { id: "grape", label: "Üzüm", visual: "🍇" }],
    [{ id: "circle", label: "Daire", visual: "●" }, { id: "square", label: "Kare", visual: "■" }, { id: "triangle", label: "Üçgen", visual: "▲" }],
    [{ id: "red", label: "Kırmızı", visual: "🔴" }, { id: "blue", label: "Mavi", visual: "🔵" }, { id: "green", label: "Yeşil", visual: "🟢" }]
  ]);

  const MAZE_THEMES = Object.freeze([
    { id: "rabbit", startVisual: "🐰", startLabel: "Tavşan", goalVisual: "🥕", goalLabel: "Havuç" },
    { id: "bee", startVisual: "🐝", startLabel: "Arı", goalVisual: "🌻", goalLabel: "Çiçek" },
    { id: "fish", startVisual: "🐟", startLabel: "Balık", goalVisual: "💎", goalLabel: "Hazine" },
    { id: "car", startVisual: "🚗", startLabel: "Araba", goalVisual: "🏠", goalLabel: "Ev" },
    { id: "astronaut", startVisual: "🧑‍🚀", startLabel: "Astronot", goalVisual: "🚀", goalLabel: "Roket" },
    { id: "cat", startVisual: "🐱", startLabel: "Kedi", goalVisual: "🧶", goalLabel: "Yün" }
  ]);

  const MAZE_TEMPLATES = Object.freeze({
    1: { size: 4, start: 0, goal: 15, open: [0, 1, 4, 5, 8, 9, 10, 11, 13, 14, 15] },
    2: { size: 5, start: 0, goal: 24, open: [0, 1, 2, 4, 7, 9, 12, 13, 17, 18, 22, 23, 24] },
    3: { size: 6, start: 0, goal: 35, open: [0, 1, 6, 7, 12, 13, 14, 19, 20, 25, 26, 27, 28, 29, 34, 35] }
  });

  function shuffle(items, rng = Math.random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const next = Math.floor(rng() * (index + 1));
      [result[index], result[next]] = [result[next], result[index]];
    }
    return result;
  }

  function getDifficulty(roundNumber, totalRounds) {
    const progress = Math.max(0, Math.min(1, (roundNumber - 1) / Math.max(1, totalRounds - 1)));
    if (progress < 0.34) return { level: 1, choiceCount: 2 };
    if (progress < 0.72) return { level: 2, choiceCount: 3 };
    return { level: 3, choiceCount: 4 };
  }

  function placeCorrect(correct, distractors, count, roundNumber) {
    const choices = distractors.filter(item => item.id !== correct.id).slice(0, count - 1);
    choices.splice((roundNumber - 1) % count, 0, correct);
    return choices;
  }

  function createOddOneOutRound(roundNumber, totalRounds, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds);
    const itemCount = difficulty.level === 1 ? 3 : 4;
    const family = ["category", "color", "shape", "direction", "size"][(roundNumber - 1) % 5];
    let normalItems;
    let oddItem;
    let ruleKey;
    if (family === "category") {
      const normalGroup = GROUPING_CATEGORIES[(roundNumber - 1) % GROUPING_CATEGORIES.length];
      const oddGroup = GROUPING_CATEGORIES[(roundNumber + 2) % GROUPING_CATEGORIES.length];
      ruleKey = `category:${normalGroup.id}`;
      normalItems = normalGroup.items.slice(0, itemCount - 1).map(item => ({ ...item, ruleKey }));
      oddItem = { ...oddGroup.items[0], ruleKey: `category:${oddGroup.id}` };
    } else if (family === "color") {
      ruleKey = "color:blue";
      normalItems = Array.from({ length: itemCount - 1 }, (_, index) => ({ id: `blue-${index}`, label: "Mavi şekil", visual: ["●", "■", "▲"][index % 3], color: "#3f86df", ruleKey }));
      oddItem = { id: "red-odd", label: "Kırmızı şekil", visual: "◆", color: "#e85c67", ruleKey: "color:red" };
    } else if (family === "shape") {
      ruleKey = "shape:circle";
      normalItems = Array.from({ length: itemCount - 1 }, (_, index) => ({ id: `circle-${index}`, label: "Daire", visual: "●", color: ["#e85c67", "#3f86df", "#62ad68"][index % 3], ruleKey }));
      oddItem = { id: "triangle-odd", label: "Üçgen", visual: "▲", color: "#8a65d6", ruleKey: "shape:triangle" };
    } else if (family === "direction") {
      ruleKey = "direction:right";
      normalItems = Array.from({ length: itemCount - 1 }, (_, index) => ({ id: `right-${index}`, label: "Sağa bakan ok", visual: "➡️", ruleKey }));
      oddItem = { id: "left-odd", label: "Sola bakan ok", visual: "⬅️", ruleKey: "direction:left" };
    } else {
      ruleKey = "size:normal";
      normalItems = Array.from({ length: itemCount - 1 }, (_, index) => ({ id: `small-${index}`, label: "Aynı boy top", visual: "⚽", scale: 1, ruleKey }));
      oddItem = { id: "large-odd", label: "Büyük top", visual: "⚽", scale: 1.55, ruleKey: "size:large" };
    }
    const choices = shuffle([...normalItems, oddItem], rng);
    return { type: "oddOneOut", key: `${family}-${roundNumber}`, family, prompt: roundNumber % 2 ? "Hangisi farklı?" : "Diğerlerinden farklı olanı bul.", speech: "Hangisi farklı?", choices, correctId: oddItem.id, sharedRule: ruleKey, difficulty };
  }

  function createMissingItemRound(roundNumber, totalRounds, rng = Math.random) {
    const games = root.MilaNewMiniGames;
    if (!games?.createMissingRound) return undefined;
    const source = games.createMissingRound(roundNumber - 1, rng);
    const difficulty = getDifficulty(roundNumber, totalRounds);
    return { ...source, type: "missingItem", key: `${source.group.id}-${roundNumber}`, prompt: "Hangisi eksik?", speech: "Hangisi eksik?", correctId: source.missing.id, difficulty };
  }

  function createPatternRound(roundNumber, totalRounds, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds);
    const family = difficulty.level === 1 ? "AB" : difficulty.level === 2 ? (roundNumber % 2 ? "AAB" : "ABB") : (roundNumber % 2 ? "ABC" : "growing");
    const tokens = PATTERN_SETS[(roundNumber - 1) % PATTERN_SETS.length];
    let sequence;
    let correct;
    if (family === "AB") {
      sequence = [tokens[0], tokens[1], tokens[0], tokens[1], tokens[0]];
      correct = tokens[1];
    } else if (family === "AAB") {
      sequence = [tokens[0], tokens[0], tokens[1], tokens[0], tokens[0]];
      correct = tokens[1];
    } else if (family === "ABB") {
      sequence = [tokens[0], tokens[1], tokens[1], tokens[0], tokens[1]];
      correct = tokens[1];
    } else if (family === "ABC") {
      sequence = [tokens[0], tokens[1], tokens[2], tokens[0], tokens[1]];
      correct = tokens[2];
    } else {
      const quantities = [1, 2, 3].map(quantity => ({ id: `dots-${quantity}`, label: `${quantity} nokta`, visual: "●".repeat(quantity), quantity }));
      sequence = quantities;
      correct = { id: "dots-4", label: "4 nokta", visual: "●●●●", quantity: 4 };
    }
    const candidates = family === "growing"
      ? [{ id: "dots-2", label: "2 nokta", visual: "●●" }, { id: "dots-3", label: "3 nokta", visual: "●●●" }, { id: "dots-5", label: "5 nokta", visual: "●●●●●" }]
      : tokens.filter(token => token.id !== correct.id).concat(PATTERN_SETS[(roundNumber + 1) % PATTERN_SETS.length][0]);
    const choiceCount = difficulty.level === 1 ? 2 : difficulty.level === 2 ? 3 : Math.min(4, 3 + (roundNumber % 2));
    const choices = placeCorrect(correct, shuffle(candidates, rng), choiceCount, roundNumber);
    return { type: "patternCompletion", key: `${family}-${roundNumber}`, family, sequence, prompt: roundNumber % 2 ? "Örüntüyü tamamla." : "Sırada hangisi var?", speech: "Örüntüyü tamamla.", choices, correctId: correct.id, difficulty };
  }

  function createSequenceRound(roundNumber, totalRounds, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds);
    const eligible = SEQUENCES.filter(sequence => sequence.levels.includes(difficulty.level));
    const sequence = eligible[(roundNumber - 1) % eligible.length];
    const target = sequence.steps.map(step => step.id);
    let pieces = shuffle(sequence.steps, rng);
    if (pieces.every((step, index) => step.id === target[index])) pieces = [...pieces.slice(1), pieces[0]];
    return { type: "sequenceOrdering", key: sequence.id, sequenceId: sequence.id, prompt: roundNumber % 3 === 1 ? "Doğru sıraya koy." : roundNumber % 3 === 2 ? "Önce hangisi olur?" : "Sonra ne olur?", speech: "Doğru sıraya koy.", steps: sequence.steps, target, pieces, difficulty };
  }

  function createShadowRound(roundNumber, totalRounds, rng = Math.random) {
    const games = root.MilaNewMiniGames;
    if (!games?.createShadowRound) return undefined;
    const source = games.createShadowRound(roundNumber - 1, rng);
    return { ...source, type: "shadowMatching", key: source.source.id, prompt: "Gölgesini bul.", speech: "Gölgesini bul.", correctId: source.source.id, difficulty: getDifficulty(roundNumber, totalRounds) };
  }

  function createGroupingRound(roundNumber, totalRounds, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds);
    const category = GROUPING_CATEGORIES[(roundNumber - 1) % GROUPING_CATEGORIES.length];
    const reference = category.items[roundNumber % category.items.length];
    const correct = category.items[(roundNumber + 1) % category.items.length];
    const distractorGroups = shuffle(GROUPING_CATEGORIES.filter(group => group.id !== category.id), rng);
    const distractors = distractorGroups.slice(0, difficulty.choiceCount - 1).map((group, index) => group.items[(roundNumber + index) % group.items.length]);
    const choices = placeCorrect(correct, distractors, difficulty.choiceCount, roundNumber);
    return { type: "grouping", key: `${category.id}-${reference.id}`, categoryId: category.id, categoryLabel: category.label, reference, prompt: "Hangisi aynı grupta?", speech: "Aynı grupta olanı bul.", choices, correctId: correct.id, difficulty };
  }

  function createMazeRound(roundNumber, totalRounds) {
    const difficulty = getDifficulty(roundNumber, totalRounds);
    const template = MAZE_TEMPLATES[difficulty.level];
    const theme = MAZE_THEMES[(roundNumber - 1) % MAZE_THEMES.length];
    const open = new Set(template.open);
    const blocked = Array.from({ length: template.size * template.size }, (_, index) => index).filter(index => !open.has(index));
    return { type: "simpleMaze", key: `${theme.id}-${difficulty.level}`, prompt: "Hedefe giden yolu bul.", speech: "Hedefe giden yolu bul.", ...template, blocked, theme, difficulty };
  }

  function createRound(stageId, roundNumber, totalRounds, { rng = Math.random, warn = console.warn } = {}) {
    let round;
    if (stageId === "odd-one-out") round = createOddOneOutRound(roundNumber, totalRounds, rng);
    else if (stageId === "missing-item") round = createMissingItemRound(roundNumber, totalRounds, rng);
    else if (stageId === "complete-pattern") round = createPatternRound(roundNumber, totalRounds, rng);
    else if (stageId === "sequence-order") round = createSequenceRound(roundNumber, totalRounds, rng);
    else if (stageId === "shadow-matching") round = createShadowRound(roundNumber, totalRounds, rng);
    else if (stageId === "same-group") round = createGroupingRound(roundNumber, totalRounds, rng);
    else if (stageId === "simple-maze") round = createMazeRound(roundNumber, totalRounds);
    if (validateRound(round)) return round;
    warn(`[Sprint 8.3.5.1 Mantık ve Dikkat] ${stageId} için güvenli yedek tur kullanıldı.`);
    const fallbackRound = stageId === "simple-maze" ? createMazeRound(1, totalRounds) : stageId === "sequence-order" ? createSequenceRound(1, totalRounds, () => 0) : stageId === "complete-pattern" ? createPatternRound(1, totalRounds, () => 0) : stageId === "missing-item" ? createMissingItemRound(1, totalRounds, () => 0) : stageId === "shadow-matching" ? createShadowRound(1, totalRounds, () => 0) : stageId === "same-group" ? createGroupingRound(1, totalRounds, () => 0) : createOddOneOutRound(1, totalRounds, () => 0);
    return validateRound(fallbackRound) ? fallbackRound : undefined;
  }

  function createMissingState(round) {
    return { phase: "observe", presentedIds: round.presented.map(item => item.id), missingId: round.missing.id };
  }

  function revealMissingItem(state) {
    if (!state || state.phase !== "observe") return false;
    state.phase = "answer";
    return true;
  }

  function createSequenceState(round) {
    return { target: [...round.target], pieces: round.pieces.map(step => step.id), slots: Array(round.target.length).fill(null) };
  }

  function placeSequenceStep(state, stepId) {
    if (!state || !state.pieces.includes(stepId)) return false;
    const slot = state.slots.indexOf(null);
    if (slot < 0) return false;
    state.pieces.splice(state.pieces.indexOf(stepId), 1);
    state.slots[slot] = stepId;
    return true;
  }

  function removeSequenceStep(state, slotIndex) {
    if (!state || !Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= state.slots.length || state.slots[slotIndex] === null) return false;
    state.pieces.push(state.slots[slotIndex]);
    state.slots[slotIndex] = null;
    return true;
  }

  function isSequenceCorrect(state) {
    return Boolean(state?.slots.every((stepId, index) => stepId === state.target[index]));
  }

  function getMazeNeighbors(index, size) {
    const row = Math.floor(index / size);
    const column = index % size;
    return [[row - 1, column], [row + 1, column], [row, column - 1], [row, column + 1]]
      .filter(([nextRow, nextColumn]) => nextRow >= 0 && nextRow < size && nextColumn >= 0 && nextColumn < size)
      .map(([nextRow, nextColumn]) => nextRow * size + nextColumn);
  }

  function getMazeRoute(round) {
    if (!round || !Number.isInteger(round.size)) return [];
    const blocked = new Set(round.blocked);
    const queue = [[round.start]];
    const visited = new Set([round.start]);
    while (queue.length) {
      const path = queue.shift();
      const current = path[path.length - 1];
      if (current === round.goal) return path;
      getMazeNeighbors(current, round.size).forEach(next => {
        if (!blocked.has(next) && !visited.has(next)) {
          visited.add(next);
          queue.push([...path, next]);
        }
      });
    }
    return [];
  }

  function createMazeState(round) {
    return { current: round.start, pathHistory: [round.start], completed: false, completionCount: 0 };
  }

  function moveMaze(state, round, target) {
    if (!state || !round || state.completed) return { moved: false, reason: "complete", completed: Boolean(state?.completed) };
    if (!Number.isInteger(target) || target < 0 || target >= round.size * round.size) return { moved: false, reason: "outside", completed: false };
    if (!getMazeNeighbors(state.current, round.size).includes(target)) return { moved: false, reason: "not-adjacent", completed: false };
    if (round.blocked.includes(target)) return { moved: false, reason: "blocked", completed: false };
    state.current = target;
    state.pathHistory.push(target);
    if (target === round.goal) {
      state.completed = true;
      state.completionCount += 1;
    }
    return { moved: true, completed: state.completed };
  }

  function moveMazeDirection(state, round, direction) {
    const offsets = { up: -round.size, down: round.size, left: -1, right: 1 };
    if (!(direction in offsets)) return { moved: false, reason: "direction", completed: false };
    const target = state.current + offsets[direction];
    if ((direction === "left" && state.current % round.size === 0) || (direction === "right" && state.current % round.size === round.size - 1)) return { moved: false, reason: "outside", completed: false };
    return moveMaze(state, round, target);
  }

  function restartMaze(state, round) {
    if (!state || !round) return false;
    state.current = round.start;
    state.pathHistory = [round.start];
    state.completed = false;
    state.completionCount = 0;
    return true;
  }

  function uniqueIds(items) {
    return Array.isArray(items) && items.length > 0 && new Set(items.map(item => item.id)).size === items.length;
  }

  function validateMaze(round) {
    if (!round || ![4, 5, 6].includes(round.size)) return false;
    const cellCount = round.size * round.size;
    if (![round.start, round.goal, ...round.blocked].every(index => Number.isInteger(index) && index >= 0 && index < cellCount)) return false;
    if (round.start === round.goal || round.blocked.includes(round.start) || round.blocked.includes(round.goal) || new Set(round.blocked).size !== round.blocked.length) return false;
    const route = getMazeRoute(round);
    return route.length >= 4 && route.length <= cellCount;
  }

  function validateRound(round) {
    if (!round || !round.type || !round.prompt || !round.speech) return false;
    if (round.type === "oddOneOut") {
      const normals = round.choices.filter(choice => choice.id !== round.correctId);
      return uniqueIds(round.choices) && round.choices.filter(choice => choice.id === round.correctId).length === 1 && normals.length >= 2 && normals.every(choice => choice.ruleKey === round.sharedRule) && round.choices.find(choice => choice.id === round.correctId)?.ruleKey !== round.sharedRule;
    }
    if (round.type === "missingItem") {
      return uniqueIds(round.presented) && uniqueIds(round.remaining) && uniqueIds(round.choices) && round.presented.length === round.remaining.length + 1 && round.presented.filter(item => item.id === round.missing.id).length === 1 && !round.remaining.some(item => item.id === round.missing.id) && round.choices.filter(item => item.id === round.missing.id).length === 1;
    }
    if (round.type === "patternCompletion") {
      const minimumEvidence = round.family === "growing" ? 3 : 5;
      return ["AB", "AAB", "ABB", "ABC", "growing"].includes(round.family) && round.sequence.length >= minimumEvidence && uniqueIds(round.choices) && round.choices.filter(item => item.id === round.correctId).length === 1;
    }
    if (round.type === "sequenceOrdering") return uniqueIds(round.steps) && uniqueIds(round.pieces) && round.target.length >= 3 && round.target.length <= 4 && new Set(round.target).size === round.target.length && round.steps.every(step => round.target.includes(step.id)) && round.pieces.every(step => round.target.includes(step.id));
    if (round.type === "shadowMatching") return round.source?.svg?.startsWith("<svg") && uniqueIds(round.choices) && round.choices.every(item => item.svg?.startsWith("<svg")) && round.choices.filter(item => item.id === round.correctId).length === 1;
    if (round.type === "grouping") return uniqueIds(round.choices) && round.reference.categoryId === round.categoryId && round.choices.filter(item => item.categoryId === round.categoryId).length === 1 && round.choices.filter(item => item.id === round.correctId).length === 1;
    if (round.type === "simpleMaze") return validateMaze(round);
    return false;
  }

  function validateContent(warn = console.warn) {
    const problems = [];
    if (GROUPING_CATEGORIES.length < 12) problems.push("Aynı Grubu Bul için en az 12 kategori gerekli.");
    if (GROUPING_CATEGORIES.some(group => group.items.length < 4 || !uniqueIds(group.items))) problems.push("Gruplama kategorileri eksik veya yineleniyor.");
    STAGE_IDS.forEach(stageId => {
      const total = STAGE_CONFIG[stageId].rounds;
      for (let roundNumber = 1; roundNumber <= total; roundNumber += 1) {
        if (!validateRound(createRound(stageId, roundNumber, total, { rng: () => 0.42, warn: () => {} }))) problems.push(`${stageId}/${roundNumber}: geçerli tur üretilemedi.`);
      }
    });
    problems.forEach(problem => warn(`[Sprint 8.3.5.1 Mantık ve Dikkat] ${problem}`));
    return { valid: problems.length === 0, problems };
  }

  root.MilaLogicAttention = {
    STAGE_IDS, STAGE_CONFIG, GROUPING_CATEGORIES, SEQUENCES, PATTERN_SETS, MAZE_THEMES, MAZE_TEMPLATES,
    shuffle, getDifficulty, createOddOneOutRound, createMissingItemRound, createPatternRound,
    createSequenceRound, createShadowRound, createGroupingRound, createMazeRound, createRound,
    createMissingState, revealMissingItem, createSequenceState, placeSequenceStep, removeSequenceStep,
    isSequenceCorrect, getMazeNeighbors, getMazeRoute, createMazeState, moveMaze, moveMazeDirection,
    restartMaze, validateMaze, validateRound, validateContent
  };

  if (typeof module !== "undefined" && module.exports) module.exports = root.MilaLogicAttention;
})(typeof window !== "undefined" ? window : globalThis);
