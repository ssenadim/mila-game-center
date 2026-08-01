(function initializeDailyConcepts(root) {
  "use strict";

  const STAGE_IDS = Object.freeze(["emotions", "weather", "seasons", "positions", "opposites", "daily-actions", "time-preparation", "money-preparation"]);
  const STAGE_CONFIG = Object.freeze({
    emotions: { type: "emotionRecognition", rounds: 8 }, weather: { type: "weatherRecognition", rounds: 8 },
    seasons: { type: "seasonRecognition", rounds: 8 }, positions: { type: "positionRecognition", rounds: 10 },
    opposites: { type: "oppositeRecognition", rounds: 10 }, "daily-actions": { type: "actionRecognition", rounds: 8 },
    "time-preparation": { type: "timePreparation", rounds: 8 }, "money-preparation": { type: "moneyPreparation", rounds: 8 }
  });

  const LABELS = Object.freeze({
    Happy: "Mutlu", Sad: "Üzgün", Angry: "Kızgın", Scared: "Korkmuş", Surprised: "Şaşırmış", Excited: "Heyecanlı", Tired: "Yorgun", Shy: "Utangaç", Calm: "Sakin", Confused: "Kafası Karışmış",
    Sunny: "Güneşli", Cloudy: "Bulutlu", Rainy: "Yağmurlu", Snowy: "Karlı", Windy: "Rüzgârlı", Stormy: "Fırtınalı", Foggy: "Sisli", Hot: "Sıcak", Cold: "Soğuk", Rainbow: "Gökkuşaklı",
    Spring: "İlkbahar", Summer: "Yaz", Autumn: "Sonbahar", Winter: "Kış",
    In: "İçinde", On: "Üstünde", Under: "Altında", Above: "Yukarısında", Behind: "Arkasında", "In front of": "Önünde", "Next to": "Yanında", Between: "Arasında", Left: "Solunda", Right: "Sağında",
    Run: "Koşmak", Walk: "Yürümek", Jump: "Zıplamak", Sit: "Oturmak", Stand: "Ayakta Durmak", Sleep: "Uyumak", Eat: "Yemek Yemek", Drink: "Su İçmek", Read: "Kitap Okumak", Write: "Yazı Yazmak", Swim: "Yüzmek", Dance: "Dans Etmek"
  });

  const EMOTION_SITUATIONS = Object.freeze([
    { id: "gift", visual: "🎁😊", label: "Hediye alan çocuk", target: "Happy" }, { id: "ice-cream", visual: "🍦😢", label: "Dondurması düşen çocuk", target: "Sad" },
    { id: "noise", visual: "🔊😨", label: "Yüksek ses duyan çocuk", target: "Scared" }, { id: "toy", visual: "🧸🤩", label: "Oyuncağını bulan çocuk", target: "Excited" }
  ]);
  const WEATHER_CLOTHES = Object.freeze({ Sunny: { id: "sun-hat", label: "Güneş şapkası", visual: "👒" }, Rainy: { id: "raincoat", label: "Yağmurluk", visual: "🧥☔" }, Snowy: { id: "winter-coat", label: "Kışlık mont", visual: "🧥🧣" }, Cold: { id: "cold-coat", label: "Kalın mont", visual: "🧥" } });
  const SEASON_META = Object.freeze({
    Spring: { label: "İlkbahar", scene: "🌷🌦️", items: [["flower", "Çiçek", "🌷"], ["rain", "Bahar yağmuru", "🌦️"], ["light-coat", "İnce mont", "🧥"]] },
    Summer: { label: "Yaz", scene: "☀️🏖️", items: [["beach", "Plaj topu", "🏖️⚽"], ["sun", "Güneş", "☀️"], ["shorts", "Şort", "🩳"]] },
    Autumn: { label: "Sonbahar", scene: "🍂🌧️", items: [["leaf", "Dökülen yaprak", "🍂"], ["pumpkin", "Bal kabağı", "🎃"], ["boots", "Yağmur çizmesi", "🥾"]] },
    Winter: { label: "Kış", scene: "❄️⛄", items: [["snowman", "Kardan adam", "⛄"], ["snow", "Kar", "❄️"], ["scarf", "Atkı", "🧣"]] }
  });
  const SEASON_ORDER = Object.freeze(["Spring", "Summer", "Autumn", "Winter"]);
  const OPPOSITE_LABELS = Object.freeze({ Big: "Büyük", Small: "Küçük", Tall: "Uzun", Short: "Kısa", Fast: "Hızlı", Slow: "Yavaş", Hot: "Sıcak", Cold: "Soğuk", Open: "Açık", Closed: "Kapalı", Full: "Dolu", Empty: "Boş", Clean: "Temiz", Dirty: "Kirli", Happy: "Mutlu", Sad: "Üzgün", Day: "Gündüz", Night: "Gece", Up: "Yukarı", Down: "Aşağı", Wet: "Islak", Dry: "Kuru", Heavy: "Ağır", Light: "Hafif" });
  const OPPOSITE_PAIRS = Object.freeze((category("Opposites")?.items || []).map((item, index) => {
    const [first, second] = item.pair;
    const [firstVisual, secondVisual] = String(item.visual).split(/\s{2,}/);
    return { id: item.id || `opposite-${index}`, first: { id: `${item.id}-a`, label: OPPOSITE_LABELS[first], visual: firstVisual }, second: { id: `${item.id}-b`, label: OPPOSITE_LABELS[second], visual: secondVisual } };
  }));
  const POSITION_COORDINATES = Object.freeze({
    In: { subject: { x: 60, y: 65, depth: 0 }, reference: { x: 60, y: 75, depth: 0 } }, On: { subject: { x: 60, y: 53, depth: 1 }, reference: { x: 60, y: 81, depth: 0 } }, Under: { subject: { x: 60, y: 78, depth: 0 }, reference: { x: 60, y: 47, depth: 0 } }, Above: { subject: { x: 60, y: 33, depth: 0 }, reference: { x: 60, y: 82, depth: 0 } }, Behind: { subject: { x: 55, y: 63, depth: -1 }, reference: { x: 72, y: 68, depth: 0 } }, "In front of": { subject: { x: 55, y: 70, depth: 1 }, reference: { x: 72, y: 68, depth: 0 } }, "Next to": { subject: { x: 83, y: 70, depth: 0 }, reference: { x: 40, y: 70, depth: 0 } }, Between: { subject: { x: 60, y: 70, depth: 0 }, reference: [{ x: 23, y: 70 }, { x: 97, y: 70 }] }, Left: { subject: { x: 28, y: 62, depth: 0 }, reference: { x: 80, y: 62, depth: 0 } }, Right: { subject: { x: 92, y: 62, depth: 0 }, reference: { x: 40, y: 62, depth: 0 } }
  });
  const ROUTINES = Object.freeze([
    { id: "morning", steps: [["wake", "Uyan", "🌅"], ["wash", "Yüzünü yıka", "🧼"], ["dress", "Giyin", "👕"]] },
    { id: "bedtime", steps: [["pajamas", "Pijamanı giy", "🥱"], ["brush", "Dişlerini fırçala", "🪥"], ["sleep", "Uyu", "😴"]] }
  ].map(routine => ({ ...routine, steps: routine.steps.map(([id, label, visual]) => ({ id: `${routine.id}-${id}`, label, visual })) })));
  const TIME_OF_DAY = Object.freeze([
    { id: "morning", label: "Sabah", visual: "🌅🥣" }, { id: "noon", label: "Öğle", visual: "☀️🍽️" },
    { id: "evening", label: "Akşam", visual: "🌇🍲" }, { id: "night", label: "Gece", visual: "🌙😴" }
  ]);
  const MONEY_TOKENS = Object.freeze([{ value: 1, kind: "coin", label: "1 TL madeni para" }, { value: 5, kind: "note", label: "5 TL kâğıt para" }, { value: 10, kind: "note", label: "10 TL kâğıt para" }]);

  function category(id) { return root.MilaLearningCategories?.getCategory(id); }
  function shuffle(items, rng = Math.random) { const result = [...items]; for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(rng() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; }
  function getDifficulty(roundNumber, totalRounds) { const p = (roundNumber - 1) / Math.max(1, totalRounds - 1); return p < .34 ? { level: 1, choiceCount: 2 } : p < .72 ? { level: 2, choiceCount: 3 } : { level: 3, choiceCount: roundNumber % 2 ? 3 : 4 }; }
  function choiceItem(item, categoryId) { return { id: item.id, label: LABELS[item.wordEn] || item.wordEn, visual: item.visual, svg: item.visualSvg, coordinates: categoryId === "Positions" ? POSITION_COORDINATES[item.wordEn] : undefined, categoryId, sourceKey: item.wordEn }; }
  function categoryItems(id) { return (category(id)?.items || []).map(item => choiceItem(item, id)); }
  function placeCorrect(correct, distractors, count, roundNumber) { const choices = distractors.filter(item => item.id !== correct.id).slice(0, count - 1); choices.splice((roundNumber - 1) % count, 0, correct); return choices; }
  function makeChoices(correct, pool, difficulty, roundNumber, rng) { return placeCorrect(correct, shuffle(pool.filter(item => item.id !== correct.id), rng), difficulty.choiceCount, roundNumber); }
  function uniqueIds(items) { return Array.isArray(items) && items.length > 0 && new Set(items.map(item => item.id)).size === items.length; }
  function positionMatches(relation, coordinates) { if (!coordinates?.subject || !coordinates.reference) return false; const subject = coordinates.subject; const reference = coordinates.reference; if (relation === "In") return Math.abs(subject.x - reference.x) <= 10 && Math.abs(subject.y - reference.y) <= 15; if (relation === "On") return subject.y < reference.y && subject.depth > reference.depth; if (relation === "Under") return subject.y > reference.y; if (relation === "Above") return subject.y < reference.y; if (relation === "Behind") return subject.depth < reference.depth; if (relation === "In front of") return subject.depth > reference.depth; if (relation === "Next to") return Math.abs(subject.x - reference.x) <= 50 && Math.abs(subject.y - reference.y) <= 10; if (relation === "Between") return Array.isArray(reference) && subject.x > reference[0].x && subject.x < reference[1].x; if (relation === "Left") return subject.x < reference.x; if (relation === "Right") return subject.x > reference.x; return false; }

  function createEmotionRound(roundNumber, totalRounds, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds); const items = categoryItems("Emotions"); const target = items[(roundNumber - 1) % items.length]; const family = difficulty.level === 3 && roundNumber % 2 === 0 ? "situation" : roundNumber % 2 ? "findFace" : "nameEmotion";
    const situation = family === "situation" ? EMOTION_SITUATIONS[(roundNumber - 1) % EMOTION_SITUATIONS.length] : undefined; const correct = situation ? items.find(item => item.sourceKey === situation.target) : target;
    return { type: "emotionRecognition", family, key: `${family}-${correct.id}-${roundNumber}`, prompt: family === "findFace" ? `Hangisi ${correct.label.toLocaleLowerCase("tr-TR")}?` : family === "nameEmotion" ? "Bu çocuk nasıl hissediyor?" : "Sence nasıl hissediyor?", speech: family === "findFace" ? `${correct.label} olanı bul.` : family === "nameEmotion" ? "Bu çocuk nasıl hissediyor?" : "Sence nasıl hissediyor?", scene: situation || { visual: correct.visual, label: "Duygu gösteren yüz" }, choices: makeChoices(correct, items, difficulty, roundNumber, rng), correctId: correct.id, targetKey: correct.sourceKey, difficulty };
  }

  function createWeatherRound(roundNumber, totalRounds, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds); const items = categoryItems("Weather"); const clothingKeys = Object.keys(WEATHER_CLOTHES); const weather = difficulty.level === 3 ? items.find(item => item.sourceKey === clothingKeys[(roundNumber - 1) % clothingKeys.length]) : items[(roundNumber - 1) % items.length]; const clothing = difficulty.level === 3 && WEATHER_CLOTHES[weather.sourceKey]; const family = clothing ? "clothing" : roundNumber % 2 ? "nameWeather" : "findWeather";
    if (clothing) { const clothes = Object.values(WEATHER_CLOTHES); return { type: "weatherRecognition", family, key: `clothing-${weather.id}`, prompt: "Bu havada hangisini giyelim?", speech: "Bu havada hangisini giyelim?", scene: { visual: weather.visual, label: "Hava durumu sahnesi" }, choices: makeChoices(clothing, clothes, difficulty, roundNumber, rng), correctId: clothing.id, weatherKey: weather.sourceKey, association: clothing.id, difficulty }; }
    return { type: "weatherRecognition", family, key: `${family}-${weather.id}`, prompt: family === "nameWeather" ? "Hava nasıl?" : `${weather.label} havayı bul.`, speech: family === "nameWeather" ? "Hava nasıl?" : `${weather.label} havayı bul.`, scene: family === "nameWeather" ? { visual: weather.visual, label: "Hava durumu sahnesi" } : undefined, choices: makeChoices(weather, items, difficulty, roundNumber, rng), correctId: weather.id, weatherKey: weather.sourceKey, difficulty };
  }

  function seasonItems() { return SEASON_ORDER.map(id => ({ id: `season-${id}`, label: SEASON_META[id].label, visual: SEASON_META[id].scene, sourceKey: id })); }
  function createSeasonRound(roundNumber, totalRounds, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds); const seasons = seasonItems();
    if (difficulty.level === 3 && roundNumber === totalRounds) { const steps = seasons.map(item => ({ ...item })); return { type: "sequenceOrdering", family: "seasonOrder", key: "season-order", prompt: "Mevsimleri sıraya koy.", speech: "Mevsimleri ilkbahardan başlayarak sıraya koy.", steps, target: steps.map(step => step.id), pieces: shuffle(steps, rng), difficulty }; }
    const season = seasons[(roundNumber - 1) % 4]; const association = difficulty.level >= 2 && roundNumber % 2 === 0; const clothing = difficulty.level === 3 && roundNumber === totalRounds - 1;
    if (association || clothing) { const meta = SEASON_META[season.sourceKey]; const correctData = meta.items[clothing ? 2 : (roundNumber % 2)]; const correct = { id: `${season.id}-${correctData[0]}`, label: correctData[1], visual: correctData[2], season: season.sourceKey }; const pool = SEASON_ORDER.flatMap(id => SEASON_META[id].items.map(data => ({ id: `season-${id}-${data[0]}`, label: data[1], visual: data[2], season: id }))); return { type: "seasonRecognition", family: clothing ? "clothing" : "association", key: `${season.id}-${correct.id}`, prompt: clothing ? `${season.label} mevsiminde hangisini giyeriz?` : `${season.label} mevsimine ait olanı bul.`, speech: clothing ? `${season.label} mevsiminde hangisini giyeriz?` : `${season.label} mevsimine ait olanı bul.`, scene: { visual: season.visual, label: "Mevsim sahnesi" }, choices: makeChoices(correct, pool.filter(item => item.season !== season.sourceKey).concat(correct), difficulty, roundNumber, rng), correctId: correct.id, seasonKey: season.sourceKey, association: correct.id, difficulty }; }
    return { type: "seasonRecognition", family: "findSeason", key: season.id, prompt: "Bu hangi mevsim?", speech: "Bu hangi mevsim?", scene: { visual: season.visual, label: "Mevsim sahnesi" }, choices: makeChoices(season, seasons, difficulty, roundNumber, rng), correctId: season.id, seasonKey: season.sourceKey, difficulty };
  }

  function createPositionRound(roundNumber, totalRounds, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds); const items = categoryItems("Positions"); const allowed = difficulty.level === 1 ? items.slice(0, 3) : difficulty.level === 2 ? items.slice(3, 7) : items.slice(7); const target = allowed[(roundNumber - 1) % allowed.length]; const placement = difficulty.level === 3 && roundNumber % 2 === 0;
    if (placement) { const targets = makeChoices(target, items, difficulty, roundNumber, rng); return { type: "positionPlacement", family: "placement", key: `place-${target.id}`, prompt: `Topu kutunun ${target.label.toLocaleLowerCase("tr-TR")} olan yerine koy.`, speech: `Önce topa, sonra ${target.label.toLocaleLowerCase("tr-TR")} olan yere dokun.`, object: { id: "ball", label: "Top", visual: "⚽" }, targets, choices: targets, correctId: target.id, relationKey: target.sourceKey, difficulty }; }
    const family = roundNumber % 2 ? "findScene" : "nameRelation"; return { type: "positionRecognition", family, key: `${family}-${target.id}`, prompt: family === "findScene" ? `Topun kutunun ${target.label.toLocaleLowerCase("tr-TR")} olduğu resmi bul.` : "Top nerede?", speech: family === "findScene" ? `Topun kutunun ${target.label.toLocaleLowerCase("tr-TR")} olduğu resmi bul.` : "Top nerede?", scene: family === "nameRelation" ? { svg: target.svg, label: "Top ve kutu sahnesi" } : undefined, choices: makeChoices(target, items, difficulty, roundNumber, rng), correctId: target.id, relationKey: target.sourceKey, perspective: "viewer", difficulty };
  }

  function oppositeLookup(label) { for (const pair of OPPOSITE_PAIRS) { if (pair.first.label === label) return pair.second; if (pair.second.label === label) return pair.first; } return undefined; }
  function createOppositeRound(roundNumber, totalRounds, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds); const pair = OPPOSITE_PAIRS[(roundNumber - 1) % OPPOSITE_PAIRS.length]; const source = roundNumber % 2 ? pair.first : pair.second; const correct = oppositeLookup(source.label); const pool = OPPOSITE_PAIRS.flatMap(item => [item.first, item.second]); const matching = difficulty.level === 3 && roundNumber % 2 === 0;
    return { type: matching ? "oppositeMatching" : "oppositeRecognition", family: matching ? "matching" : (roundNumber % 3 ? "findOpposite" : "findScene"), key: `${pair.id}-${source.id}`, prompt: matching ? "Zıt olan resmi seç ve kontrol et." : `${source.label} kavramının zıttını bul.`, speech: matching ? "Zıt olan resmi seç ve kontrol et." : `${source.label} kavramının zıttını bul.`, scene: source, reference: source, choices: makeChoices(correct, pool.filter(item => item.id !== source.id), difficulty, roundNumber, rng), correctId: correct.id, pairId: pair.id, difficulty };
  }

  function createActionRound(roundNumber, totalRounds, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds); const items = categoryItems("Actions");
    if (difficulty.level === 3 && roundNumber === totalRounds) { const routine = ROUTINES[(roundNumber - 1) % ROUTINES.length]; return { type: "sequenceOrdering", family: "routine", key: routine.id, prompt: "Günlük işleri sıraya koy.", speech: "Günlük işleri doğru sıraya koy.", steps: routine.steps, target: routine.steps.map(step => step.id), pieces: shuffle(routine.steps, rng), difficulty }; }
    const action = items[(roundNumber - 1) % items.length]; const family = roundNumber % 2 ? "findAction" : "nameAction"; return { type: "actionRecognition", family, key: `${family}-${action.id}`, prompt: family === "findAction" ? `${action.label} eylemini bul.` : "Ne yapıyor?", speech: family === "findAction" ? `${action.label} eylemini bul.` : "Ne yapıyor?", scene: family === "nameAction" ? { visual: action.visual, label: "Bir eylem yapan çocuk" } : undefined, choices: makeChoices(action, items, difficulty, roundNumber, rng), correctId: action.id, actionKey: action.sourceKey, difficulty };
  }

  function createClock(hour) { return { hour, minute: 0, hourAngle: hour * 30, minuteAngle: 0 }; }
  function createTimeRound(roundNumber, totalRounds, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds);
    if (difficulty.level === 1) { const target = TIME_OF_DAY[(roundNumber - 1) % TIME_OF_DAY.length]; return { type: "timePreparation", family: "timeOfDay", key: target.id, prompt: "Bu günün hangi zamanı?", speech: "Bu günün hangi zamanı?", scene: { visual: target.visual, label: "Günün bir zamanı" }, choices: makeChoices(target, TIME_OF_DAY, difficulty, roundNumber, rng), correctId: target.id, timeOfDay: target.id, difficulty }; }
    if (difficulty.level === 3 && roundNumber === totalRounds) { const hand = roundNumber % 2 ? { id: "hour-hand", label: "Akrep", visual: "↖️", hand: "hour" } : { id: "minute-hand", label: "Yelkovan", visual: "⬆️", hand: "minute" }; const other = hand.hand === "hour" ? { id: "minute-hand", label: "Yelkovan", visual: "⬆️", hand: "minute" } : { id: "hour-hand", label: "Akrep", visual: "↖️", hand: "hour" }; return { type: "timePreparation", family: "handRecognition", key: hand.id, prompt: `${hand.label} hangisi?`, speech: `${hand.hand === "hour" ? "Kısa olan akrep" : "Uzun olan yelkovan"}. ${hand.label} hangisi?`, scene: { clock: createClock(10), label: "Akrep ve yelkovanı olan saat" }, choices: placeCorrect(hand, [other], 2, roundNumber), correctId: hand.id, difficulty }; }
    const maxHour = difficulty.level === 2 ? 6 : 12; const hour = ((roundNumber * 2 - 1) % maxHour) + 1; const correct = { id: `clock-${hour}`, label: `Saat ${hour}`, clock: createClock(hour), ariaLabel: "Saat seçeneği" }; const pool = Array.from({ length: maxHour }, (_, index) => { const value = index + 1; return { id: `clock-${value}`, label: `Saat ${value}`, clock: createClock(value), ariaLabel: "Saat seçeneği" }; }); const family = roundNumber % 2 ? "readClock" : "chooseClock"; return { type: "timePreparation", family, key: `${family}-${hour}`, prompt: family === "readClock" ? "Saat kaç?" : `Saat ${hour} olanı bul.`, speech: family === "readClock" ? "Saat kaç?" : `Saat ${hour}. Doğru saati bul.`, scene: family === "readClock" ? { clock: correct.clock, label: "Tam saati gösteren analog saat" } : undefined, choices: makeChoices(correct, pool, difficulty, roundNumber, rng), correctId: correct.id, clock: correct.clock, difficulty };
  }

  function tokenGroup(total) { const tokens = []; let left = total; [10, 5, 1].forEach(value => { while (left >= value) { tokens.push(MONEY_TOKENS.find(token => token.value === value)); left -= value; } }); return { id: `money-${total}`, label: `${total} TL`, visual: "", tokens, total }; }
  function calculateTokenTotal(tokens) { return Array.isArray(tokens) ? tokens.reduce((sum, token) => sum + token.value, 0) : NaN; }
  function createMoneyRound(roundNumber, totalRounds, rng = Math.random) {
    const difficulty = getDifficulty(roundNumber, totalRounds); const price = difficulty.level === 1 ? ((roundNumber - 1) % 5) + 1 : ((roundNumber * 2 - 1) % 10) + 1;
    if (difficulty.level === 1 && roundNumber % 2) { const money = tokenGroup(price); const choices = placeCorrect(money, [{ id: "toy", label: "Oyuncak", visual: "🧸" }, { id: "fruit", label: "Meyve", visual: "🍎" }], 2, roundNumber); return { type: "moneyPreparation", family: "recognizeMoney", key: `recognize-${roundNumber}`, prompt: "Hangisi para?", speech: "Hangisi para?", choices, correctId: money.id, price, difficulty }; }
    if (difficulty.level === 3 && roundNumber === totalRounds) { const reference = tokenGroup(price); const totals = [...new Set([price, Math.max(1, price - 2), Math.min(10, price + 2)])]; while (totals.length < 3) totals.push(totals.length); const choices = placeCorrect(tokenGroup(price), totals.filter(total => total !== price).map(tokenGroup), 3, roundNumber); return { type: "moneyPreparation", family: "equalMoney", key: `equal-${price}`, prompt: "Aynı miktarı bul.", speech: "Aynı miktarı bul.", scene: reference, choices, correctId: `money-${price}`, price, paymentTotal: price, difficulty }; }
    if (difficulty.level >= 2 && roundNumber % 3 === 0) { const paid = roundNumber % 2 ? price : Math.max(1, price - 2); const yes = { id: "yes", label: "Evet", visual: "✅" }; const no = { id: "no", label: "Hayır", visual: "❌" }; return { type: "moneyPreparation", family: "enoughMoney", key: `enough-${price}-${paid}`, prompt: "Bu para yeterli mi?", speech: `Fiyat ${price} Türk lirası. Verilen para ${paid} Türk lirası. Bu para yeterli mi?`, scene: { price, payment: tokenGroup(paid), label: `${price} TL fiyat ve ${paid} TL ödeme` }, choices: placeCorrect(paid >= price ? yes : no, [paid >= price ? no : yes], 2, roundNumber), correctId: paid >= price ? "yes" : "no", price, paymentTotal: paid, enough: paid >= price, difficulty }; }
    if (difficulty.level === 3 && roundNumber === totalRounds - 1) { const other = price === 10 ? 7 : price + 2; const groups = [tokenGroup(price), tokenGroup(other)]; const correct = groups.find(group => group.total === Math.max(price, other)); return { type: "moneyPreparation", family: "compareMoney", key: `compare-${price}-${other}`, prompt: "Hangisinde daha çok para var?", speech: "Hangisinde daha çok para var?", choices: groups, correctId: correct.id, price, difficulty }; }
    const totals = [...new Set([price, Math.max(1, price - 1), Math.min(10, price + 2), Math.max(1, price - 2)])]; while (totals.length < difficulty.choiceCount) totals.push(totals.length + 1); const correct = tokenGroup(price); return { type: "moneyPreparation", family: "matchPrice", key: `price-${price}`, prompt: `${price} TL olan ödemeyi bul.`, speech: `Fiyat ${price} Türk lirası. Aynı miktarı bul.`, scene: { price, label: `${price} TL fiyat etiketi` }, choices: placeCorrect(correct, totals.filter(total => total !== price).map(tokenGroup), difficulty.choiceCount, roundNumber), correctId: correct.id, price, paymentTotal: price, difficulty };
  }

  const CREATORS = Object.freeze({ emotions: createEmotionRound, weather: createWeatherRound, seasons: createSeasonRound, positions: createPositionRound, opposites: createOppositeRound, "daily-actions": createActionRound, "time-preparation": createTimeRound, "money-preparation": createMoneyRound });
  function createRound(stageId, roundNumber, totalRounds, { rng = Math.random, warn = console.warn } = {}) { const creator = CREATORS[stageId]; if (!creator) return undefined; for (let attempt = 0; attempt < 4; attempt += 1) { const round = creator(roundNumber + attempt, totalRounds, rng); if (validateRound(round)) return round; } warn(`[Sprint 8.3.5.2 Günlük Kavramlar] ${stageId} için güvenli yedek tur kullanıldı.`); const fallback = creator(1, totalRounds, () => 0.42); return validateRound(fallback) ? fallback : undefined; }
  function validateSelection(round) { return uniqueIds(round.choices) && round.choices.filter(choice => choice.id === round.correctId).length === 1 && round.choices.length >= 2 && round.choices.length <= 4; }
  function validateRound(round) {
    if (!round?.type || !round.prompt || !round.speech || !round.difficulty || round.difficulty.level < 1 || round.difficulty.level > 3) return false;
    if (round.type === "sequenceOrdering") return uniqueIds(round.steps) && uniqueIds(round.pieces) && round.target.length >= 3 && round.target.length <= 4 && round.target.every(id => round.steps.some(step => step.id === id));
    if (round.type === "positionPlacement") return validateSelection(round) && round.object?.id && round.relationKey && round.targets === round.choices && positionMatches(round.relationKey, round.choices.find(choice => choice.id === round.correctId)?.coordinates);
    if (!validateSelection(round)) return false;
    if (round.type === "emotionRecognition") return categoryItems("Emotions").some(item => item.sourceKey === round.targetKey);
    if (round.type === "weatherRecognition") return categoryItems("Weather").some(item => item.sourceKey === round.weatherKey) && (!round.association || WEATHER_CLOTHES[round.weatherKey]?.id === round.association);
    if (round.type === "seasonRecognition") return SEASON_ORDER.includes(round.seasonKey);
    if (round.type === "positionRecognition") return categoryItems("Positions").some(item => item.sourceKey === round.relationKey) && positionMatches(round.relationKey, round.choices.find(choice => choice.id === round.correctId)?.coordinates) && round.perspective === "viewer";
    if (["oppositeRecognition", "oppositeMatching"].includes(round.type)) return OPPOSITE_PAIRS.some(pair => pair.id === round.pairId);
    if (round.type === "actionRecognition") return categoryItems("Actions").some(item => item.sourceKey === round.actionKey);
    if (round.type === "timePreparation") return !round.clock || (Number.isInteger(round.clock.hour) && round.clock.hour >= 1 && round.clock.hour <= 12 && round.clock.minute === 0 && round.clock.minuteAngle === 0 && round.clock.hourAngle === round.clock.hour * 30);
    if (round.type === "moneyPreparation") return Number.isInteger(round.price) && round.price > 0 && round.price <= 10 && round.choices.every(choice => !choice.tokens || calculateTokenTotal(choice.tokens) === choice.total) && (!Number.isFinite(round.paymentTotal) || round.paymentTotal <= 10);
    return false;
  }
  function validateContent(warn = console.warn) { const problems = []; [["Emotions", 10], ["Weather", 10], ["Seasons", 12], ["Positions", 10], ["Actions", 12]].forEach(([id, count]) => { if ((category(id)?.items.length || 0) < count) problems.push(`${id} içeriği eksik.`); }); if (OPPOSITE_PAIRS.length < 12) problems.push("En az 12 zıt kavram çifti gerekli."); STAGE_IDS.forEach(id => { const total = STAGE_CONFIG[id].rounds; for (let round = 1; round <= total; round += 1) if (!validateRound(createRound(id, round, total, { rng: () => .42, warn: () => {} }))) problems.push(`${id}/${round}: geçerli tur üretilemedi.`); }); problems.forEach(problem => warn(`[Sprint 8.3.5.2 Günlük Kavramlar] ${problem}`)); return { valid: problems.length === 0, problems }; }

  root.MilaDailyConcepts = { STAGE_IDS, STAGE_CONFIG, LABELS, EMOTION_SITUATIONS, WEATHER_CLOTHES, SEASON_META, SEASON_ORDER, OPPOSITE_PAIRS, POSITION_COORDINATES, ROUTINES, TIME_OF_DAY, MONEY_TOKENS, getDifficulty, categoryItems, positionMatches, oppositeLookup, createClock, tokenGroup, calculateTokenTotal, createEmotionRound, createWeatherRound, createSeasonRound, createPositionRound, createOppositeRound, createActionRound, createTimeRound, createMoneyRound, createRound, validateRound, validateContent };
  if (typeof module !== "undefined" && module.exports) module.exports = root.MilaDailyConcepts;
})(typeof window !== "undefined" ? window : globalThis);
