(function initializeNewMiniGames(root) {
  "use strict";

  const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${body}</svg>`;
  const scene = (sky, ground, body) => svg(`<rect width="120" height="120" rx="14" fill="${sky}"/><rect y="82" width="120" height="38" fill="${ground}"/>${body}`);

  const MISSING_ITEM_GROUPS = [
    { id: "animals", label: "Hayvanlar", items: [["cat", "Kedi", "🐱"], ["dog", "Köpek", "🐶"], ["lion", "Aslan", "🦁"], ["rabbit", "Tavşan", "🐰"], ["elephant", "Fil", "🐘"], ["panda", "Panda", "🐼"]] },
    { id: "fruits", label: "Meyveler", items: [["apple", "Elma", "🍎"], ["banana", "Muz", "🍌"], ["grape", "Üzüm", "🍇"], ["orange", "Portakal", "🍊"], ["pear", "Armut", "🍐"], ["strawberry", "Çilek", "🍓"]] },
    { id: "vehicles", label: "Taşıtlar", items: [["car", "Araba", "🚗"], ["bus", "Otobüs", "🚌"], ["train", "Tren", "🚂"], ["plane", "Uçak", "✈️"], ["bike", "Bisiklet", "🚲"], ["tractor", "Traktör", "🚜"]] },
    { id: "toys", label: "Oyuncaklar", items: [["ball", "Top", "⚽"], ["teddy", "Ayıcık", "🧸"], ["drum", "Davul", "🥁"], ["kite", "Uçurtma", "🪁"], ["blocks", "Bloklar", "🧱"], ["puzzle", "Yapboz", "🧩"]] },
    { id: "home", label: "Ev Eşyaları", items: [["chair", "Sandalye", "🪑"], ["lamp", "Lamba", "💡"], ["clock", "Saat", "⏰"], ["key", "Anahtar", "🔑"], ["phone", "Telefon", "☎️"], ["bath", "Küvet", "🛁"]] },
    { id: "nature", label: "Doğa", items: [["tree", "Ağaç", "🌳"], ["sun", "Güneş", "☀️"], ["moon", "Ay", "🌙"], ["flower", "Çiçek", "🌻"], ["cloud", "Bulut", "☁️"], ["rainbow", "Gökkuşağı", "🌈"]] },
    { id: "clothes", label: "Giysiler", items: [["shirt", "Tişört", "👕"], ["pants", "Pantolon", "👖"], ["dress", "Elbise", "👗"], ["shoe", "Ayakkabı", "👟"], ["hat", "Şapka", "🧢"], ["sock", "Çorap", "🧦"]] }
  ].map(group => ({ ...group, items: group.items.map(([id, label, visual]) => ({ id: `${group.id}-${id}`, label, visual })) }));

  const SHADOW_OBJECTS = [
    { id: "cat", label: "Kedi", category: "animals", svg: svg('<circle cx="60" cy="58" r="30" fill="#f4a742"/><path d="M35 37 28 10 49 29M85 37l7-27-21 19" fill="#f4a742"/><circle cx="49" cy="55" r="4"/><circle cx="71" cy="55" r="4"/><path d="M55 70q5 6 10 0" fill="none" stroke="#713f23" stroke-width="4"/>') },
    { id: "fish", label: "Balık", category: "animals", svg: svg('<ellipse cx="55" cy="60" rx="38" ry="24" fill="#4bbbe8"/><path d="m88 60 27-22v44z" fill="#2d86c7"/><circle cx="39" cy="54" r="4" fill="#17345c"/>') },
    { id: "rabbit", label: "Tavşan", category: "animals", svg: svg('<ellipse cx="45" cy="30" rx="11" ry="27" fill="#ddd4ef"/><ellipse cx="75" cy="30" rx="11" ry="27" fill="#ddd4ef"/><circle cx="60" cy="70" r="33" fill="#eee8f8"/><circle cx="49" cy="66" r="4"/><circle cx="71" cy="66" r="4"/>') },
    { id: "car", label: "Araba", category: "vehicles", svg: svg('<path d="M18 72h84l-8-29H38L26 56H18z" fill="#e95b5b"/><circle cx="38" cy="80" r="12" fill="#26355a"/><circle cx="84" cy="80" r="12" fill="#26355a"/><path d="M43 47h43l6 18H29z" fill="#8fd4ed"/>') },
    { id: "boat", label: "Tekne", category: "vehicles", svg: svg('<path d="M16 70h94L90 96H38z" fill="#d46b4a"/><path d="M58 20h6v52h-6z" fill="#5c438f"/><path d="M64 25v39h35z" fill="#ffd75a"/>') },
    { id: "plane", label: "Uçak", category: "vehicles", svg: svg('<path d="m12 66 42-9 25-39 10 4-12 35 31 9-2 10-35-3-9 30-9-2 3-29-42 4z" fill="#6f8fd8"/>') },
    { id: "apple", label: "Elma", category: "foods", svg: svg('<path d="M61 35c-27-16-45 8-39 35 7 30 28 35 39 23 12 12 33 7 39-23 6-27-12-51-39-35z" fill="#e94b4b"/><path d="M60 37q2-20 17-25" fill="none" stroke="#60452f" stroke-width="7"/><ellipse cx="80" cy="19" rx="15" ry="7" fill="#55a95b" transform="rotate(-25 80 19)"/>') },
    { id: "pear", label: "Armut", category: "foods", svg: svg('<path d="M62 24c-6 0-10 13-12 27-23 8-30 45-6 58 9 5 28 5 38 0 24-13 17-50-7-58-2-14-7-27-13-27z" fill="#a9cf4c"/><path d="M62 27q0-15 11-19" fill="none" stroke="#60452f" stroke-width="6"/>') },
    { id: "kite", label: "Uçurtma", category: "toys", svg: svg('<path d="m60 8 42 43-42 43-42-43z" fill="#8a65d6"/><path d="M60 8v86M18 51h84" stroke="#fff" stroke-width="4"/><path d="M60 94q18 8 2 18" fill="none" stroke="#5c438f" stroke-width="4"/>') },
    { id: "ball", label: "Top", category: "toys", svg: svg('<circle cx="60" cy="60" r="48" fill="#ffd75a"/><path d="m60 25 18 13-7 22H49l-7-22zM24 58l25 2 8 22-18 14M96 58l-25 2-8 22 18 14" fill="#493a85"/>') },
    { id: "tree", label: "Ağaç", category: "nature", svg: svg('<path d="M53 65h15v46H53z" fill="#80502e"/><circle cx="60" cy="48" r="31" fill="#54a85c"/><circle cx="37" cy="55" r="22" fill="#66b96b"/><circle cx="83" cy="55" r="22" fill="#66b96b"/>') },
    { id: "lamp", label: "Lamba", category: "home", svg: svg('<path d="M42 14h36l13 42H29z" fill="#ffd75a"/><path d="M57 56h7v39h-7z" fill="#695489"/><path d="M40 98h41v9H40z" fill="#695489"/>') }
  ];

  const INITIAL_LETTER_WORDS = [
    ["apple", "Apple", "A", "🍎", "foods"], ["ball", "Ball", "B", "⚽", "toys"], ["cat", "Cat", "C", "🐱", "animals"],
    ["dog", "Dog", "D", "🐶", "animals"], ["elephant", "Elephant", "E", "🐘", "animals"], ["fish", "Fish", "F", "🐟", "animals"],
    ["goat", "Goat", "G", "🐐", "animals"], ["hat", "Hat", "H", "🧢", "clothes"], ["juice", "Juice", "J", "🧃", "foods"],
    ["kite", "Kite", "K", "🪁", "toys"], ["lion", "Lion", "L", "🦁", "animals"], ["moon", "Moon", "M", "🌙", "nature"],
    ["nose", "Nose", "N", "👃", "daily"], ["orange", "Orange", "O", "🍊", "foods"], ["panda", "Panda", "P", "🐼", "animals"],
    ["rabbit", "Rabbit", "R", "🐰", "animals"], ["sun", "Sun", "S", "☀️", "nature"], ["tiger", "Tiger", "T", "🐯", "animals"],
    ["van", "Van", "V", "🚐", "vehicles"], ["window", "Window", "W", "🪟", "home"], ["yarn", "Yarn", "Y", "🧶", "daily"],
    ["zebra", "Zebra", "Z", "🦓", "animals"], ["bus", "Bus", "B", "🚌", "vehicles"], ["cup", "Cup", "C", "🥤", "home"],
    ["drum", "Drum", "D", "🥁", "toys"], ["flower", "Flower", "F", "🌻", "nature"], ["train", "Train", "T", "🚂", "vehicles"]
  ].map(([id, word, letter, visual, category]) => ({ id, word, letter, visual, category, speech: word }));

  const SOUND_MEMORY_ITEMS = INITIAL_LETTER_WORDS
    .filter(item => ["apple", "cat", "dog", "fish", "lion", "moon", "sun", "car"].includes(item.id))
    .concat([{ id: "car", word: "Car", letter: "C", visual: "🚗", category: "vehicles", speech: "Car" }]);

  const PUZZLES = [
    { id: "cat-garden", label: "Bahçedeki Kedi", category: "animal", svg: scene("#9de1f0", "#78c66c", '<circle cx="26" cy="25" r="12" fill="#ffd75a"/><circle cx="65" cy="65" r="23" fill="#f4a742"/><path d="m48 50 5-20 14 16 15-16 2 23" fill="#f4a742"/><circle cx="58" cy="62" r="3"/><circle cx="72" cy="62" r="3"/>') },
    { id: "apple-tree", label: "Elma Ağacı", category: "fruit", svg: scene("#b9e9f4", "#7fca6b", '<rect x="56" y="46" width="12" height="52" fill="#7d4c2d"/><circle cx="62" cy="42" r="29" fill="#58ad58"/><circle cx="47" cy="35" r="6" fill="#e94b4b"/><circle cx="72" cy="31" r="6" fill="#e94b4b"/><circle cx="66" cy="52" r="6" fill="#e94b4b"/>') },
    { id: "red-car", label: "Kırmızı Araba", category: "vehicle", svg: scene("#b9e9f4", "#a9a2b7", '<path d="M17 77h88l-8-29H40L29 61H17z" fill="#e95b5b"/><circle cx="38" cy="83" r="10" fill="#26355a"/><circle cx="85" cy="83" r="10" fill="#26355a"/><path d="M44 52h42l7 18H31z" fill="#dff6ff"/>') },
    { id: "toy-kite", label: "Uçurtma", category: "toy", svg: scene("#9de1f0", "#79c96c", '<path d="m61 16 30 31-30 31-30-31z" fill="#8a65d6"/><path d="M61 16v62M31 47h60" stroke="#fff" stroke-width="3"/><path d="M61 78q18 9 1 28" fill="none" stroke="#5c438f" stroke-width="3"/>') },
    { id: "little-house", label: "Küçük Ev", category: "home", svg: scene("#a9e5f2", "#79c96c", '<path d="M25 52 61 20l36 32v50H25z" fill="#fff1c7"/><path d="m18 55 43-40 43 40-8 7-35-31-35 31z" fill="#e46d65"/><rect x="51" y="67" width="20" height="35" fill="#8c5c3d"/><rect x="31" y="61" width="14" height="16" fill="#72b8e1"/>') },
    { id: "mountain-lake", label: "Dağ ve Göl", category: "nature", svg: scene("#a9e5f2", "#69bede", '<circle cx="22" cy="22" r="11" fill="#ffd75a"/><path d="m5 83 36-55 29 42 16-28 31 41z" fill="#6d9b79"/><path d="m41 28 9 14-18 0z" fill="#fff"/>') },
    { id: "sea-turtle", label: "Deniz Kaplumbağası", category: "sea", svg: scene("#81d7ed", "#e3ca81", '<ellipse cx="61" cy="60" rx="31" ry="23" fill="#66aa62"/><circle cx="96" cy="60" r="11" fill="#82bf72"/><path d="m38 45-18-12 6 23M38 75 20 88l6-24M76 44l13-17 2 25M76 76l13 17 2-25" fill="#82bf72"/><path d="m42 60 19-19 19 19-19 19z" fill="#4f8d52"/>') },
    { id: "space-rocket", label: "Uzay Roketi", category: "space", svg: scene("#272456", "#403778", '<circle cx="24" cy="21" r="3" fill="#fff"/><circle cx="95" cy="31" r="4" fill="#ffd75a"/><path d="M60 15c18 19 18 51 0 71-18-20-18-52 0-71z" fill="#f3f0ff"/><circle cx="60" cy="47" r="9" fill="#69c5e3"/><path d="m47 70-18 18 20-3M73 70l18 18-20-3" fill="#e95b5b"/><path d="m54 85 6 25 6-25" fill="#ffd75a"/>') }
  ];

  const SOUND_DIFFICULTIES = {
    beginner: { id: "beginner", label: "Kolay", pairs: 3 },
    standard: { id: "standard", label: "Orta", pairs: 4 },
    advanced: { id: "advanced", label: "Zor", pairs: 6 }
  };
  const PUZZLE_DIFFICULTIES = {
    easy: { id: "easy", label: "Kolay", columns: 2, rows: 2 },
    medium: { id: "medium", label: "Orta", columns: 3, rows: 2 },
    hard: { id: "hard", label: "Zor", columns: 3, rows: 3 }
  };

  function shuffle(items, random = Math.random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const next = Math.floor(random() * (index + 1));
      [result[index], result[next]] = [result[next], result[index]];
    }
    return result;
  }

  function createMissingRound(roundIndex, random = Math.random) {
    const level = roundIndex < 3 ? { itemCount: 3, answerCount: 2 } : roundIndex < 6 ? { itemCount: 4, answerCount: 3 } : { itemCount: 5, answerCount: 4 };
    const group = MISSING_ITEM_GROUPS[roundIndex % MISSING_ITEM_GROUPS.length];
    const presented = shuffle(group.items, random).slice(0, level.itemCount);
    const missing = presented[Math.floor(random() * presented.length)];
    const distractors = shuffle(MISSING_ITEM_GROUPS.flatMap(itemGroup => itemGroup.items).filter(item => item.id !== missing.id && !presented.some(presentedItem => presentedItem.id === item.id)), random);
    return { group, presented, missing, remaining: presented.filter(item => item.id !== missing.id), choices: shuffle([missing, ...distractors.slice(0, level.answerCount - 1)], random), ...level };
  }

  function createShadowRound(roundIndex, random = Math.random) {
    const choiceCount = roundIndex < 3 ? 2 : roundIndex < 6 ? 3 : 4;
    const source = SHADOW_OBJECTS[roundIndex % SHADOW_OBJECTS.length];
    const distractors = shuffle(SHADOW_OBJECTS.filter(item => item.id !== source.id), random).slice(0, choiceCount - 1);
    return { source, choices: shuffle([source, ...distractors], random), choiceCount };
  }

  function createLetterRound(roundIndex, random = Math.random) {
    const word = INITIAL_LETTER_WORDS[roundIndex % INITIAL_LETTER_WORDS.length];
    const confusing = roundIndex < 4 ? { M: ["W"], W: ["M"], P: ["R"], R: ["P"], B: ["D"], D: ["B"] } : {};
    const letters = [...new Set(INITIAL_LETTER_WORDS.map(item => item.letter))]
      .filter(letter => letter !== word.letter && !(confusing[word.letter] ?? []).includes(letter));
    return { word, choices: shuffle([word.letter, ...shuffle(letters, random).slice(0, 2)], random) };
  }

  function createSoundBoard(difficultyId = "standard", random = Math.random) {
    const difficulty = SOUND_DIFFICULTIES[difficultyId] ?? SOUND_DIFFICULTIES.standard;
    const targets = shuffle(SOUND_MEMORY_ITEMS, random).slice(0, difficulty.pairs);
    return shuffle(targets.flatMap(target => [0, 1].map(copy => ({ id: `${target.id}-${copy}`, targetId: target.id, speech: target.speech, revealed: false, matched: false }))), random);
  }

  function canSelectSoundCard(card, inputLocked, speaking = false) {
    return Boolean(card && !card.matched && !inputLocked && !speaking);
  }

  function createPuzzlePieces(difficultyId = "easy", random = Math.random) {
    const difficulty = PUZZLE_DIFFICULTIES[difficultyId] ?? PUZZLE_DIFFICULTIES.easy;
    const pieces = Array.from({ length: difficulty.columns * difficulty.rows }, (_, target) => ({
      id: `piece-${target}`, target, row: Math.floor(target / difficulty.columns), column: target % difficulty.columns, placed: false
    }));
    return shuffle(pieces, random);
  }

  function isPuzzleComplete(pieces) {
    return Array.isArray(pieces) && pieces.length > 0 && pieces.every(piece => piece.placed === true);
  }

  function validateContent(warn = console.warn) {
    const problems = [];
    const checkUnique = (items, name) => {
      const ids = items.map(item => item.id);
      if (ids.some(id => typeof id !== "string" || !id.trim()) || new Set(ids).size !== ids.length) problems.push(`${name}: geçersiz veya yinelenen kimlik.`);
    };
    checkUnique(MISSING_ITEM_GROUPS, "Hangisi Eksik grupları");
    MISSING_ITEM_GROUPS.forEach(group => {
      checkUnique(group.items, `Hangisi Eksik/${group.id}`);
      if (!group.label || group.items.length < 5 || group.items.some(item => !item.label || !item.visual)) problems.push(`Hangisi Eksik/${group.id}: yetersiz içerik.`);
    });
    checkUnique(SHADOW_OBJECTS, "Gölge nesneleri");
    if (SHADOW_OBJECTS.length < 12 || new Set(SHADOW_OBJECTS.map(item => item.category)).size < 4 || SHADOW_OBJECTS.some(item => !item.label || !item.svg?.startsWith("<svg"))) problems.push("Gölge içeriği gerekli çeşitliliği veya geçerli SVG'leri sağlamıyor.");
    checkUnique(INITIAL_LETTER_WORDS, "İlk harf kelimeleri");
    if (INITIAL_LETTER_WORDS.length < 24 || new Set(INITIAL_LETTER_WORDS.map(item => item.letter)).size < 12 || INITIAL_LETTER_WORDS.some(item => !item.word || !item.speech || item.word[0].toUpperCase() !== item.letter)) problems.push("İlk harf içeriği geçersiz.");
    checkUnique(SOUND_MEMORY_ITEMS, "Ses hafızası");
    if (SOUND_MEMORY_ITEMS.length < 6 || SOUND_MEMORY_ITEMS.some(item => !item.speech)) problems.push("Ses hafızası içeriği yetersiz.");
    checkUnique(PUZZLES, "Yapbozlar");
    if (PUZZLES.length < 8 || PUZZLES.some(item => !item.label || !item.svg?.startsWith("<svg"))) problems.push("Yapboz içeriği geçersiz.");
    Object.values(PUZZLE_DIFFICULTIES).forEach(difficulty => {
      if (!Number.isInteger(difficulty.columns) || !Number.isInteger(difficulty.rows) || difficulty.columns < 2 || difficulty.rows < 2) problems.push(`Yapboz/${difficulty.id}: geçersiz boyut.`);
    });
    problems.forEach(problem => warn(`[Sprint 8.1 içerik] ${problem}`));
    return { valid: problems.length === 0, problems };
  }

  root.MilaNewMiniGames = {
    MISSING_ITEM_GROUPS, SHADOW_OBJECTS, INITIAL_LETTER_WORDS, SOUND_MEMORY_ITEMS, PUZZLES,
    SOUND_DIFFICULTIES, PUZZLE_DIFFICULTIES, shuffle, createMissingRound, createShadowRound,
    createLetterRound, createSoundBoard, canSelectSoundCard, createPuzzlePieces, isPuzzleComplete, validateContent
  };

  if (typeof module !== "undefined" && module.exports) module.exports = root.MilaNewMiniGames;
})(typeof window !== "undefined" ? window : globalThis);
