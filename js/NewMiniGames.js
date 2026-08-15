(function initializeNewMiniGames(root) {
  "use strict";

  const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${body}</svg>`;
  const scene = (sky, ground, body) => svg(`<rect width="120" height="120" rx="14" fill="${sky}"/><circle cx="12" cy="15" r="3" fill="#fff" opacity=".55"/><path d="M94 17q7-9 14 0 8 0 8 7H87q0-7 7-7z" fill="#fff" opacity=".5"/><rect y="82" width="120" height="38" fill="${ground}"/><circle cx="13" cy="101" r="3" fill="#fff" opacity=".45"/><path d="m103 91 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#fff" opacity=".4"/>${body}`);

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
    { id: "cat-garden", label: "Bahçedeki Kedi", description: "Çiçekli bahçede turuncu kedi", category: "animal", svg: scene("#9de1f0", "#78c66c", '<circle cx="26" cy="25" r="12" fill="#ffd75a"/><circle cx="65" cy="65" r="23" fill="#f4a742"/><path d="m48 50 5-20 14 16 15-16 2 23" fill="#f4a742"/><circle cx="58" cy="62" r="3"/><circle cx="72" cy="62" r="3"/><path d="M27 94v14m-7-7h14" stroke="#f26ba6" stroke-width="5"/>') },
    { id: "apple-tree", label: "Elma Ağacı", description: "Kırmızı elmalı yeşil ağaç", category: "fruit", svg: scene("#b9e9f4", "#7fca6b", '<rect x="56" y="46" width="12" height="52" fill="#7d4c2d"/><circle cx="62" cy="42" r="29" fill="#58ad58"/><circle cx="47" cy="35" r="6" fill="#e94b4b"/><circle cx="72" cy="31" r="6" fill="#e94b4b"/><circle cx="66" cy="52" r="6" fill="#e94b4b"/><circle cx="35" cy="58" r="5" fill="#e94b4b"/>') },
    { id: "red-car", label: "Kırmızı Araba", description: "Yolda giden kırmızı araba", category: "vehicle", svg: scene("#b9e9f4", "#a9a2b7", '<path d="M17 77h88l-8-29H40L29 61H17z" fill="#e95b5b"/><circle cx="38" cy="83" r="10" fill="#26355a"/><circle cx="85" cy="83" r="10" fill="#26355a"/><path d="M44 52h42l7 18H31z" fill="#dff6ff"/><path d="M5 103h29m52 0h29" stroke="#fff" stroke-width="4"/>') },
    { id: "toy-kite", label: "Uçurtma", description: "Gökyüzünde mor uçurtma", category: "toy", svg: scene("#9de1f0", "#79c96c", '<path d="m61 16 30 31-30 31-30-31z" fill="#8a65d6"/><path d="M61 16v62M31 47h60" stroke="#fff" stroke-width="3"/><path d="M61 78q18 9 1 28" fill="none" stroke="#5c438f" stroke-width="3"/><circle cx="23" cy="95" r="7" fill="#ffd75a"/>') },
    { id: "little-house", label: "Küçük Ev", description: "Yeşil çayırda küçük ev", category: "home", svg: scene("#a9e5f2", "#79c96c", '<path d="M25 52 61 20l36 32v50H25z" fill="#fff1c7"/><path d="m18 55 43-40 43 40-8 7-35-31-35 31z" fill="#e46d65"/><rect x="51" y="67" width="20" height="35" fill="#8c5c3d"/><rect x="31" y="61" width="14" height="16" fill="#72b8e1"/><circle cx="103" cy="75" r="10" fill="#55a95b"/>') },
    { id: "mountain-lake", label: "Dağ ve Göl", description: "Güneşli dağ ve mavi göl", category: "nature", svg: scene("#a9e5f2", "#69bede", '<circle cx="22" cy="22" r="11" fill="#ffd75a"/><path d="m5 83 36-55 29 42 16-28 31 41z" fill="#6d9b79"/><path d="m41 28 9 14-18 0z" fill="#fff"/><path d="M20 101q20-10 40 0t40 0" fill="none" stroke="#dff6ff" stroke-width="3"/>') },
    { id: "sea-turtle", label: "Deniz Kaplumbağası", description: "Denizde yüzen yeşil kaplumbağa", category: "sea", svg: scene("#81d7ed", "#e3ca81", '<ellipse cx="61" cy="60" rx="31" ry="23" fill="#66aa62"/><circle cx="96" cy="60" r="11" fill="#82bf72"/><path d="m38 45-18-12 6 23M38 75 20 88l6-24M76 44l13-17 2 25M76 76l13 17 2-25" fill="#82bf72"/><path d="m42 60 19-19 19 19-19 19z" fill="#4f8d52"/><circle cx="17" cy="28" r="5" fill="none" stroke="#fff" stroke-width="2"/>') },
    { id: "space-rocket", label: "Uzay Roketi", description: "Yıldızların arasında uzay roketi", category: "space", svg: scene("#272456", "#403778", '<circle cx="24" cy="21" r="3" fill="#fff"/><circle cx="95" cy="31" r="4" fill="#ffd75a"/><path d="M60 15c18 19 18 51 0 71-18-20-18-52 0-71z" fill="#f3f0ff"/><circle cx="60" cy="47" r="9" fill="#69c5e3"/><path d="m47 70-18 18 20-3M73 70l18 18-20-3" fill="#e95b5b"/><path d="m54 85 6 25 6-25" fill="#ffd75a"/><circle cx="105" cy="68" r="3" fill="#fff"/>') },
    { id: "friendly-dinosaur", label: "Sevimli Dinozor", description: "Çiçeklerin yanında sevimli yeşil dinozor", category: "dinosaur", svg: scene("#aee8f3", "#74c76c", '<path d="M25 76q2-38 35-38 28 0 31 28l18 8-8 11-19-5q-18 18-43 4l-19 12-8-10z" fill="#62b875"/><circle cx="75" cy="52" r="3" fill="#26355a"/><path d="m35 48 8-12 8 13 9-14 8 15" fill="#ffd75a"/><circle cx="29" cy="103" r="7" fill="#f477a7"/>') },
    { id: "rainbow-unicorn", label: "Gökkuşağı Unicorn", description: "Gökkuşağının yanında beyaz unicorn", category: "fantasy", svg: scene("#c9d9ff", "#9bd575", '<path d="M10 62q14-32 28 0 14-32 28 0 14-32 28 0" fill="none" stroke="#f16b8f" stroke-width="9"/><path d="M10 62q14-24 28 0 14-24 28 0 14-24 28 0" fill="none" stroke="#ffd75a" stroke-width="5"/><ellipse cx="76" cy="78" rx="24" ry="17" fill="#fff"/><circle cx="94" cy="58" r="14" fill="#fff"/><path d="m91 45 5-18 7 19" fill="#f2c94c"/><circle cx="99" cy="57" r="2" fill="#493a85"/><path d="M59 72q-13-18-22-1" fill="none" stroke="#a66de0" stroke-width="6"/>') },
    { id: "coral-fish", label: "Renkli Balık", description: "Mercanların arasında renkli balık", category: "sea", svg: scene("#72d4ea", "#d9bd7c", '<path d="M22 59q26-30 55 0-29 31-55 0z" fill="#ff8b5e"/><path d="m76 59 27-20v40z" fill="#8a65d6"/><circle cx="37" cy="54" r="4" fill="#26355a"/><path d="M50 37v44M61 41v36" stroke="#ffd75a" stroke-width="6"/><path d="M15 113V91m0 10-8-8m8 4 9-10M92 116V92m0 10-9-8m9 4 10-12" stroke="#e96f9f" stroke-width="5"/>') },
    { id: "happy-train", label: "Renkli Tren", description: "Tepelerin önünde renkli tren", category: "vehicle", svg: scene("#a9e5f2", "#83c96f", '<path d="M13 77h88v22H13z" fill="#e75d5d"/><rect x="56" y="48" width="34" height="31" rx="4" fill="#5f80d7"/><rect x="65" y="55" width="17" height="13" fill="#dff6ff"/><rect x="23" y="58" width="31" height="21" fill="#ffd75a"/><circle cx="32" cy="99" r="10" fill="#34385f"/><circle cx="79" cy="99" r="10" fill="#34385f"/><path d="M8 111h105" stroke="#806142" stroke-width="5"/>') },
    { id: "panda-picnic", label: "Panda Pikniği", description: "Meyvelerle piknik yapan panda", category: "animal", svg: scene("#b7e8f3", "#80ca6d", '<circle cx="60" cy="61" r="27" fill="#fff"/><circle cx="41" cy="40" r="11" fill="#313653"/><circle cx="79" cy="40" r="11" fill="#313653"/><ellipse cx="49" cy="59" rx="7" ry="9" fill="#313653"/><ellipse cx="71" cy="59" rx="7" ry="9" fill="#313653"/><circle cx="60" cy="72" r="5" fill="#313653"/><path d="M25 90h70l-8 23H33z" fill="#f2c94c"/><circle cx="45" cy="94" r="7" fill="#e94b4b"/><circle cx="68" cy="95" r="7" fill="#8a65d6"/>') },
    { id: "rainbow-garden", label: "Gökkuşağı Bahçesi", description: "Çiçekli bahçenin üstünde gökkuşağı", category: "nature", svg: scene("#bce8f5", "#73c76b", '<path d="M14 76a46 46 0 0 1 92 0" fill="none" stroke="#ed5d6e" stroke-width="15"/><path d="M21 76a39 39 0 0 1 78 0" fill="none" stroke="#ffd75a" stroke-width="10"/><path d="M28 76a32 32 0 0 1 64 0" fill="none" stroke="#6f8fd8" stroke-width="6"/><path d="M20 101v13m-7-7h14M53 96v18m-8-9h16M88 100v14m-7-7h14" stroke="#f477a7" stroke-width="5"/>') },
    { id: "strawberry-basket", label: "Çilek Sepeti", description: "Çimenlerde kırmızı çileklerle dolu sepet", category: "fruit", svg: scene("#c7ebf4", "#86cc72", '<path d="M25 67h70l-8 42H33z" fill="#b97845"/><path d="M37 69q2-35 23-35t23 35" fill="none" stroke="#8c5c3d" stroke-width="7"/><path d="M38 75h44M35 88h50M48 68v39M71 68v39" stroke="#e3b06b" stroke-width="4"/><path d="M41 61c-11-13 2-25 13-13 11-12 24 0 13 13-8 10-18 10-26 0z" fill="#e94b4b"/><path d="m54 47-8-7 9 1 7-6-1 10" fill="#55a95b"/>') },
    { id: "moon-rover", label: "Ay Gezgini", description: "Ay yüzeyinde yıldızları keşfeden araç", category: "space", svg: scene("#292653", "#817ba0", '<circle cx="95" cy="22" r="12" fill="#f2e9b8"/><circle cx="20" cy="30" r="3" fill="#fff"/><circle cx="50" cy="18" r="2" fill="#ffd75a"/><path d="M27 70h60l12 22H19z" fill="#d8d4e6"/><rect x="43" y="48" width="31" height="25" rx="5" fill="#f3f0ff"/><rect x="49" y="54" width="19" height="12" fill="#69c5e3"/><circle cx="34" cy="95" r="12" fill="#34385f"/><circle cx="83" cy="95" r="12" fill="#34385f"/><path d="M74 53 92 35" stroke="#f2c94c" stroke-width="4"/>') }
  ];

  const SOUND_DIFFICULTIES = {
    beginner: { id: "beginner", label: "Kolay", pairs: 3 },
    standard: { id: "standard", label: "Orta", pairs: 4 },
    advanced: { id: "advanced", label: "Zor", pairs: 6 }
  };
  const PUZZLE_DIFFICULTIES = {
    easy: { id: "easy", label: "Kolay", columns: 2, rows: 2 },
    medium: { id: "medium", label: "Orta", columns: 3, rows: 2 },
    hard: { id: "hard", label: "Zor", columns: 3, rows: 3 },
    veryHard: { id: "veryHard", label: "🔥 Çok Zor", columns: 4, rows: 4, pieceLabel: "16 Parça" }
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

  function sameOrder(first, second) {
    return first.length === second.length && first.every((value, index) => value === second[index]);
  }

  function isMeaningfulPuzzleOrder(order, difficultyId, previousOrder = []) {
    if (!Array.isArray(order) || new Set(order).size !== order.length || sameOrder(order, previousOrder)) return false;
    const correctPositions = order.reduce((count, target, index) => count + Number(target === index), 0);
    return correctPositions < order.length && (difficultyId !== "veryHard" || correctPositions <= 4);
  }

  function createPuzzlePieces(difficultyId = "easy", random = Math.random, previousOrder = []) {
    const difficulty = PUZZLE_DIFFICULTIES[difficultyId] ?? PUZZLE_DIFFICULTIES.easy;
    const pieces = Array.from({ length: difficulty.columns * difficulty.rows }, (_, target) => ({
      id: `piece-${target}`, target, row: Math.floor(target / difficulty.columns), column: target % difficulty.columns, placed: false
    }));
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const candidate = shuffle(pieces, random);
      if (isMeaningfulPuzzleOrder(candidate.map(piece => piece.target), difficulty.id, previousOrder)) return candidate;
    }
    for (let offset = Math.max(1, Math.floor(pieces.length / 2)); offset < pieces.length; offset += 1) {
      const fallback = pieces.map((_, index) => pieces[(index + offset) % pieces.length]);
      if (isMeaningfulPuzzleOrder(fallback.map(piece => piece.target), difficulty.id, previousOrder)) return fallback;
    }
    return pieces.map((_, index) => pieces[(index + 1) % pieces.length]);
  }

  function isPuzzleComplete(pieces, expectedCount = pieces?.length) {
    if (!Array.isArray(pieces) || !Number.isInteger(expectedCount) || expectedCount < 1 || pieces.length !== expectedCount) return false;
    const targets = pieces.map(piece => piece.target);
    return new Set(targets).size === expectedCount
      && targets.every(target => Number.isInteger(target) && target >= 0 && target < expectedCount)
      && pieces.every(piece => piece.placed === true);
  }

  function isPlayablePuzzle(puzzle) {
    return Boolean(puzzle && typeof puzzle.id === "string" && puzzle.id.trim() && typeof puzzle.label === "string" && puzzle.label.trim()
      && typeof puzzle.description === "string" && puzzle.description.trim() && puzzle.svg?.startsWith("<svg")
      && !/<image\b|\bhref\s*=/i.test(puzzle.svg));
  }

  function selectPuzzle(recentIds = [], random = Math.random, puzzles = PUZZLES) {
    const playable = puzzles.filter(isPlayablePuzzle);
    if (!playable.length) return undefined;
    const recent = new Set(recentIds.slice(-3));
    const candidates = playable.filter(puzzle => !recent.has(puzzle.id));
    const pool = candidates.length ? candidates : playable;
    const index = Math.min(pool.length - 1, Math.max(0, Math.floor(random() * pool.length)));
    return pool[index];
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
    if (PUZZLES.length !== 16 || PUZZLES.some(item => !isPlayablePuzzle(item)) || new Set(PUZZLES.map(item => item.svg)).size !== 16) problems.push("Yapboz içeriği 16 benzersiz yerel SVG sağlamıyor.");
    Object.values(PUZZLE_DIFFICULTIES).forEach(difficulty => {
      if (!Number.isInteger(difficulty.columns) || !Number.isInteger(difficulty.rows) || difficulty.columns < 2 || difficulty.rows < 2) problems.push(`Yapboz/${difficulty.id}: geçersiz boyut.`);
    });
    problems.forEach(problem => warn(`[Sprint 8.1 içerik] ${problem}`));
    return { valid: problems.length === 0, problems };
  }

  root.MilaNewMiniGames = {
    MISSING_ITEM_GROUPS, SHADOW_OBJECTS, INITIAL_LETTER_WORDS, SOUND_MEMORY_ITEMS, PUZZLES,
    SOUND_DIFFICULTIES, PUZZLE_DIFFICULTIES, shuffle, createMissingRound, createShadowRound,
    createLetterRound, createSoundBoard, canSelectSoundCard, createPuzzlePieces, isPuzzleComplete,
    isMeaningfulPuzzleOrder, isPlayablePuzzle, selectPuzzle, validateContent
  };

  if (typeof module !== "undefined" && module.exports) module.exports = root.MilaNewMiniGames;
})(typeof window !== "undefined" ? window : globalThis);
