(function (root) {
  "use strict";

  const LEARNING_TYPES = Object.freeze({
    VOCABULARY_RECOGNITION: "vocabularyRecognition",
    COLOR_RECOGNITION: "colorRecognition",
    SHAPE_RECOGNITION: "shapeRecognition",
    NUMBER_RECOGNITION: "numberRecognition",
    LETTER_RECOGNITION: "letterRecognition",
    QUANTITY_COUNTING: "quantityCounting",
    NUMBER_ORDERING: "numberOrdering",
    PREVIOUS_NEXT_NUMBER: "previousNextNumber",
    NUMERIC_COMPARISON: "numericComparison",
    QUANTITY_COMPARISON: "quantityComparison",
    ADDITION_PREPARATION: "additionPreparation",
    NUMERIC_ADDITION: "numericAddition",
    VISUAL_ADDITION: "visualAddition",
    SUBTRACTION_PREPARATION: "subtractionPreparation",
    NUMERIC_SUBTRACTION: "numericSubtraction",
    VISUAL_SUBTRACTION: "visualSubtraction",
    MIXED_OPERATIONS: "mixedOperations",
    ODD_ONE_OUT: "oddOneOut",
    MISSING_ITEM: "missingItem",
    PATTERN_COMPLETION: "patternCompletion",
    SEQUENCE_ORDERING: "sequenceOrdering",
    SHADOW_MATCHING: "shadowMatching",
    GROUPING: "grouping",
    SIMPLE_MAZE: "simpleMaze",
    EMOTION_RECOGNITION: "emotionRecognition",
    WEATHER_RECOGNITION: "weatherRecognition",
    SEASON_RECOGNITION: "seasonRecognition",
    POSITION_RECOGNITION: "positionRecognition",
    OPPOSITE_RECOGNITION: "oppositeRecognition",
    ACTION_RECOGNITION: "actionRecognition",
    TIME_PREPARATION: "timePreparation",
    MONEY_PREPARATION: "moneyPreparation"
  });

  const PLAYABLE_LEARNING_TYPES = new Set([
    LEARNING_TYPES.VOCABULARY_RECOGNITION,
    LEARNING_TYPES.COLOR_RECOGNITION,
    LEARNING_TYPES.SHAPE_RECOGNITION,
    LEARNING_TYPES.NUMBER_RECOGNITION,
    LEARNING_TYPES.LETTER_RECOGNITION,
    LEARNING_TYPES.EMOTION_RECOGNITION,
    LEARNING_TYPES.WEATHER_RECOGNITION,
    LEARNING_TYPES.SEASON_RECOGNITION,
    LEARNING_TYPES.POSITION_RECOGNITION,
    LEARNING_TYPES.OPPOSITE_RECOGNITION,
    LEARNING_TYPES.ACTION_RECOGNITION
  ]);

  const GROUPS = [
    {
      id: "first-discoveries",
      title: "İlk Keşifler",
      icon: "🌟",
      description: "Renkleri, şekilleri, sayıları ve harfleri keşfet.",
      stageIds: ["recognize-colors", "recognize-shapes", "recognize-numbers", "recognize-letters"]
    },
    {
      id: "word-world",
      title: "Kelime Dünyası",
      icon: "💬",
      description: "Çevrendeki canlıları ve nesneleri İngilizce tanı.",
      stageIds: ["animals", "fruits-vegetables", "vehicles", "body", "objects", "nature-space"]
    },
    {
      id: "number-world",
      title: "Sayılar Dünyası",
      icon: "🔢",
      description: "Say, sırala ve miktarları karşılaştır.",
      stageIds: ["count-objects", "order-numbers", "previous-next-number", "find-greater-number", "find-smaller-number", "equal-quantities"]
    },
    {
      id: "first-operations",
      title: "İlk İşlemler",
      icon: "➕",
      description: "Toplama ve çıkarmaya küçük adımlarla hazırlan.",
      stageIds: ["addition-preparation", "add-two-numbers", "visual-addition", "subtraction-preparation", "subtract-smaller-from-greater", "visual-subtraction", "mixed-operations"]
    },
    {
      id: "think-find",
      title: "Düşün ve Bul",
      icon: "🧠",
      description: "Dikkatini kullan, örüntüleri ve ilişkileri bul.",
      stageIds: ["odd-one-out", "missing-item", "complete-pattern", "sequence-order", "shadow-matching", "same-group", "simple-maze"]
    },
    {
      id: "daily-life",
      title: "Günlük Hayat",
      icon: "🏡",
      description: "Duyguları, doğayı ve günlük kavramları keşfet.",
      stageIds: ["emotions", "weather", "seasons", "positions", "opposites", "daily-actions", "time-preparation", "money-preparation"]
    }
  ];

  const STAGES = [
    { id: "recognize-colors", title: "Renkleri Tanı", icon: "🎨", description: "Renkleri gör ve İngilizce adını bul.", groupId: "first-discoveries", order: 1, learningType: LEARNING_TYPES.COLOR_RECOGNITION, categoryIds: ["Colors"], prerequisiteStageIds: [], sessionLength: 20, implemented: true },
    { id: "recognize-shapes", title: "Şekilleri Tanı", icon: "🔷", description: "Şekilleri gör ve doğru adı seç.", groupId: "first-discoveries", order: 2, learningType: LEARNING_TYPES.SHAPE_RECOGNITION, categoryIds: ["Shapes"], prerequisiteStageIds: ["recognize-colors"], sessionLength: 20, implemented: true },
    { id: "recognize-numbers", title: "Sayıları Tanı", icon: "🔢", description: "0'dan 20'ye sayıları tanı.", groupId: "first-discoveries", order: 3, learningType: LEARNING_TYPES.NUMBER_RECOGNITION, categoryIds: ["Numbers"], prerequisiteStageIds: ["recognize-shapes"], sessionLength: 20, implemented: true },
    { id: "recognize-letters", title: "Harfleri Tanı", icon: "🔤", description: "İngilizce büyük harfleri tanı.", groupId: "first-discoveries", order: 4, learningType: LEARNING_TYPES.LETTER_RECOGNITION, categoryIds: ["Letters"], prerequisiteStageIds: ["recognize-numbers"], sessionLength: 20, implemented: true },

    { id: "animals", title: "Hayvanlar", icon: "🐾", description: "Hayvanların İngilizce adlarını öğren.", groupId: "word-world", order: 5, learningType: LEARNING_TYPES.VOCABULARY_RECOGNITION, categoryIds: ["Animals"], prerequisiteStageIds: ["recognize-letters"], sessionLength: 20, implemented: true },
    { id: "fruits-vegetables", title: "Meyveler ve Sebzeler", icon: "🍎", description: "Meyve ve sebzeleri birlikte keşfet.", groupId: "word-world", order: 6, learningType: LEARNING_TYPES.VOCABULARY_RECOGNITION, categoryIds: ["Fruits", "Vegetables"], prerequisiteStageIds: ["animals"], sessionLength: 20, implemented: true },
    { id: "vehicles", title: "Taşıtlar", icon: "🚗", description: "Karada, havada ve suda giden taşıtları tanı.", groupId: "word-world", order: 7, learningType: LEARNING_TYPES.VOCABULARY_RECOGNITION, categoryIds: ["Vehicles"], prerequisiteStageIds: ["fruits-vegetables"], sessionLength: 20, implemented: true },
    { id: "body", title: "Vücudumuz", icon: "🧍", description: "Vücudumuzun bölümlerini öğren.", groupId: "word-world", order: 8, learningType: LEARNING_TYPES.VOCABULARY_RECOGNITION, categoryIds: ["Body"], prerequisiteStageIds: ["vehicles"], sessionLength: 20, implemented: true },
    { id: "objects", title: "Eşyalar", icon: "🪑", description: "Evde ve okulda kullandığımız eşyaları tanı.", groupId: "word-world", order: 9, learningType: LEARNING_TYPES.VOCABULARY_RECOGNITION, categoryIds: ["HomeItems", "KitchenItems", "BathroomItems", "SchoolItems"], prerequisiteStageIds: ["body"], sessionLength: 20, implemented: true },
    { id: "nature-space", title: "Doğa ve Uzay", icon: "🌍", description: "Doğayı ve gökyüzünü keşfet.", groupId: "word-world", order: 10, learningType: LEARNING_TYPES.VOCABULARY_RECOGNITION, categoryIds: ["Nature", "Space"], prerequisiteStageIds: ["objects"], sessionLength: 20, implemented: true },

    { id: "count-objects", title: "Nesneleri Say", icon: "🧸", description: "Nesneleri tek tek say.", groupId: "number-world", order: 11, learningType: LEARNING_TYPES.QUANTITY_COUNTING, categoryIds: [], prerequisiteStageIds: ["nature-space"], sessionLength: 10, implemented: false },
    { id: "order-numbers", title: "Sayıları Sırala", icon: "🔢", description: "Sayıları doğru sıraya yerleştir.", groupId: "number-world", order: 12, learningType: LEARNING_TYPES.NUMBER_ORDERING, categoryIds: ["NumberOrder"], prerequisiteStageIds: ["count-objects"], sessionLength: 10, implemented: false },
    { id: "previous-next-number", title: "Önceki ve Sonraki Sayı", icon: "↔️", description: "Bir sayının komşularını bul.", groupId: "number-world", order: 13, learningType: LEARNING_TYPES.PREVIOUS_NEXT_NUMBER, categoryIds: [], prerequisiteStageIds: ["order-numbers"], sessionLength: 10, implemented: false },
    { id: "find-greater-number", title: "Büyük Sayıyı Bul", icon: "⬆️", description: "İki sayıdan büyük olanı bul.", groupId: "number-world", order: 14, learningType: LEARNING_TYPES.NUMERIC_COMPARISON, categoryIds: ["BigSmall"], prerequisiteStageIds: ["previous-next-number"], sessionLength: 10, implemented: false },
    { id: "find-smaller-number", title: "Küçük Sayıyı Bul", icon: "⬇️", description: "İki sayıdan küçük olanı bul.", groupId: "number-world", order: 15, learningType: LEARNING_TYPES.NUMERIC_COMPARISON, categoryIds: ["BigSmall"], prerequisiteStageIds: ["find-greater-number"], sessionLength: 10, implemented: false },
    { id: "equal-quantities", title: "Eşit Miktarları Bul", icon: "⚖️", description: "Aynı miktardaki grupları eşleştir.", groupId: "number-world", order: 16, learningType: LEARNING_TYPES.QUANTITY_COMPARISON, categoryIds: [], prerequisiteStageIds: ["find-smaller-number"], sessionLength: 10, implemented: false },

    { id: "addition-preparation", title: "Toplamaya Hazırlık", icon: "➕", description: "Grupları bir araya getirmeye hazırlan.", groupId: "first-operations", order: 17, learningType: LEARNING_TYPES.ADDITION_PREPARATION, categoryIds: [], prerequisiteStageIds: ["equal-quantities"], sessionLength: 10, implemented: false },
    { id: "add-two-numbers", title: "İki Sayıyı Topla", icon: "➕", description: "İki küçük sayıyı topla.", groupId: "first-operations", order: 18, learningType: LEARNING_TYPES.NUMERIC_ADDITION, categoryIds: [], prerequisiteStageIds: ["addition-preparation"], sessionLength: 10, implemented: false },
    { id: "visual-addition", title: "Görsellerle Toplama", icon: "🍎", description: "Resimleri sayarak toplamayı keşfet.", groupId: "first-operations", order: 19, learningType: LEARNING_TYPES.VISUAL_ADDITION, categoryIds: [], prerequisiteStageIds: ["add-two-numbers"], sessionLength: 10, implemented: false },
    { id: "subtraction-preparation", title: "Çıkarmaya Hazırlık", icon: "➖", description: "Bir gruptan nesne ayırmaya hazırlan.", groupId: "first-operations", order: 20, learningType: LEARNING_TYPES.SUBTRACTION_PREPARATION, categoryIds: [], prerequisiteStageIds: ["visual-addition"], sessionLength: 10, implemented: false },
    { id: "subtract-smaller-from-greater", title: "Büyük Sayıdan Küçük Sayıyı Çıkar", icon: "➖", description: "Küçük sayıyı büyük sayıdan çıkar.", groupId: "first-operations", order: 21, learningType: LEARNING_TYPES.NUMERIC_SUBTRACTION, categoryIds: [], prerequisiteStageIds: ["subtraction-preparation"], sessionLength: 10, implemented: false },
    { id: "visual-subtraction", title: "Görsellerle Çıkarma", icon: "🧸", description: "Resimlerden ayırarak çıkarmayı keşfet.", groupId: "first-operations", order: 22, learningType: LEARNING_TYPES.VISUAL_SUBTRACTION, categoryIds: [], prerequisiteStageIds: ["subtract-smaller-from-greater"], sessionLength: 10, implemented: false },
    { id: "mixed-operations", title: "Karışık İşlemler", icon: "🧮", description: "Toplama ve çıkarma ipuçlarını ayırt et.", groupId: "first-operations", order: 23, learningType: LEARNING_TYPES.MIXED_OPERATIONS, categoryIds: [], prerequisiteStageIds: ["visual-subtraction"], sessionLength: 10, implemented: false },

    { id: "odd-one-out", title: "Hangisi Farklı?", icon: "🔎", description: "Diğerlerinden farklı olanı bul.", groupId: "think-find", order: 24, learningType: LEARNING_TYPES.ODD_ONE_OUT, categoryIds: [], prerequisiteStageIds: ["mixed-operations"], sessionLength: 8, implemented: false },
    { id: "missing-item", title: "Hangisi Eksik?", icon: "🫣", description: "Kaybolan resmi hatırla.", groupId: "think-find", order: 25, learningType: LEARNING_TYPES.MISSING_ITEM, categoryIds: [], prerequisiteStageIds: ["odd-one-out"], sessionLength: 8, implemented: false },
    { id: "complete-pattern", title: "Örüntüyü Tamamla", icon: "🔶", description: "Tekrar eden sıranın devamını bul.", groupId: "think-find", order: 26, learningType: LEARNING_TYPES.PATTERN_COMPLETION, categoryIds: [], prerequisiteStageIds: ["missing-item"], sessionLength: 8, implemented: false },
    { id: "sequence-order", title: "Doğru Sırayı Bul", icon: "📶", description: "Olayları doğru sıraya koy.", groupId: "think-find", order: 27, learningType: LEARNING_TYPES.SEQUENCE_ORDERING, categoryIds: [], prerequisiteStageIds: ["complete-pattern"], sessionLength: 8, implemented: false },
    { id: "shadow-matching", title: "Gölgesini Bul", icon: "🌑", description: "Resmi doğru gölgeyle eşleştir.", groupId: "think-find", order: 28, learningType: LEARNING_TYPES.SHADOW_MATCHING, categoryIds: [], prerequisiteStageIds: ["sequence-order"], sessionLength: 8, implemented: false },
    { id: "same-group", title: "Aynı Grubu Bul", icon: "🧺", description: "Birlikte olan nesneleri bul.", groupId: "think-find", order: 29, learningType: LEARNING_TYPES.GROUPING, categoryIds: [], prerequisiteStageIds: ["shadow-matching"], sessionLength: 8, implemented: false },
    { id: "simple-maze", title: "Basit Labirent", icon: "🌀", description: "Kısa yolu takip ederek çıkışı bul.", groupId: "think-find", order: 30, learningType: LEARNING_TYPES.SIMPLE_MAZE, categoryIds: [], prerequisiteStageIds: ["same-group"], sessionLength: 6, implemented: false },

    { id: "emotions", title: "Duygular", icon: "😊", description: "Yüzlerdeki duyguları tanı.", groupId: "daily-life", order: 31, learningType: LEARNING_TYPES.EMOTION_RECOGNITION, categoryIds: ["Emotions"], prerequisiteStageIds: ["nature-space"], sessionLength: 20, implemented: true },
    { id: "weather", title: "Hava Durumu", icon: "🌦️", description: "Bugünün havasını anlatan resmi bul.", groupId: "daily-life", order: 32, learningType: LEARNING_TYPES.WEATHER_RECOGNITION, categoryIds: ["Weather"], prerequisiteStageIds: ["emotions"], sessionLength: 20, implemented: true },
    { id: "seasons", title: "Mevsimler", icon: "🍂", description: "Mevsimleri ve işaretlerini tanı.", groupId: "daily-life", order: 33, learningType: LEARNING_TYPES.SEASON_RECOGNITION, categoryIds: ["Seasons"], prerequisiteStageIds: ["weather"], sessionLength: 20, implemented: true },
    { id: "positions", title: "Konum Kavramları", icon: "📍", description: "Nesnelerin nerede olduğunu bul.", groupId: "daily-life", order: 34, learningType: LEARNING_TYPES.POSITION_RECOGNITION, categoryIds: ["Positions"], prerequisiteStageIds: ["seasons"], sessionLength: 20, implemented: true },
    { id: "opposites", title: "Zıt Kavramlar", icon: "↔️", description: "Birbirinin zıttı olan kavramları bul.", groupId: "daily-life", order: 35, learningType: LEARNING_TYPES.OPPOSITE_RECOGNITION, categoryIds: ["Opposites"], prerequisiteStageIds: ["positions"], sessionLength: 20, implemented: true },
    { id: "daily-actions", title: "Günlük Eylemler", icon: "🏃", description: "Gün içinde yaptığımız eylemleri tanı.", groupId: "daily-life", order: 36, learningType: LEARNING_TYPES.ACTION_RECOGNITION, categoryIds: ["Actions"], prerequisiteStageIds: ["opposites"], sessionLength: 20, implemented: true },
    { id: "time-preparation", title: "Saatlere Hazırlık", icon: "🕘", description: "Günün bölümlerini ve saatleri keşfetmeye hazırlan.", groupId: "daily-life", order: 37, learningType: LEARNING_TYPES.TIME_PREPARATION, categoryIds: [], prerequisiteStageIds: ["daily-actions"], sessionLength: 8, implemented: false },
    { id: "money-preparation", title: "Para Kavramına Hazırlık", icon: "🪙", description: "Paraları ve alışveriş kavramını tanımaya hazırlan.", groupId: "daily-life", order: 38, learningType: LEARNING_TYPES.MONEY_PREPARATION, categoryIds: [], prerequisiteStageIds: ["time-preparation"], sessionLength: 8, implemented: false }
  ];

  const REQUIRED_GROUP_IDS = GROUPS.map(group => group.id);
  const REQUIRED_STAGE_IDS = STAGES.map(stage => stage.id);
  const LEGACY_STAGE_ID_MAP = Object.freeze({
    colors: "recognize-colors",
    numbers: "recognize-numbers",
    animals: "animals",
    fruits: "fruits-vegetables",
    "mixed-review": "fruits-vegetables"
  });

  const STRATEGIES_BY_LEARNING_TYPE = Object.freeze({
    [LEARNING_TYPES.VOCABULARY_RECOGNITION]: ["vocabulary"],
    [LEARNING_TYPES.COLOR_RECOGNITION]: ["color"],
    [LEARNING_TYPES.SHAPE_RECOGNITION]: ["shape"],
    [LEARNING_TYPES.NUMBER_RECOGNITION]: ["number"],
    [LEARNING_TYPES.LETTER_RECOGNITION]: ["letter"],
    [LEARNING_TYPES.EMOTION_RECOGNITION]: ["emotion"],
    [LEARNING_TYPES.WEATHER_RECOGNITION]: ["weather"],
    [LEARNING_TYPES.SEASON_RECOGNITION]: ["season"],
    [LEARNING_TYPES.POSITION_RECOGNITION]: ["position"],
    [LEARNING_TYPES.OPPOSITE_RECOGNITION]: ["opposite"],
    [LEARNING_TYPES.ACTION_RECOGNITION]: ["vocabulary"]
  });

  function stageById(stageId, stages = STAGES) {
    return stages.find(stage => stage.id === stageId);
  }

  function groupById(groupId, groups = GROUPS) {
    return groups.find(group => group.id === groupId);
  }

  function stagesForGroup(groupId, stages = STAGES, groups = GROUPS) {
    const group = groupById(groupId, groups);
    if (!group) return [];
    return group.stageIds.map(stageId => stageById(stageId, stages)).filter(Boolean);
  }

  function normalizeProgress(savedProgress, stages = STAGES) {
    const source = savedProgress && typeof savedProgress === "object" && !Array.isArray(savedProgress) ? savedProgress : {};
    const sourceCompleted = source.completed && typeof source.completed === "object" && !Array.isArray(source.completed) ? source.completed : {};
    const legacyCompleted = source.legacyCompleted && typeof source.legacyCompleted === "object" && !Array.isArray(source.legacyCompleted)
      ? Object.fromEntries(Object.entries(source.legacyCompleted).filter(([, value]) => value === true))
      : {};
    const validIds = new Set(stages.map(stage => stage.id));
    const completed = {};
    Object.entries(sourceCompleted).forEach(([savedId, value]) => {
      if (value !== true) return;
      const mappedId = LEGACY_STAGE_ID_MAP[savedId] ?? savedId;
      if (LEGACY_STAGE_ID_MAP[savedId]) legacyCompleted[savedId] = true;
      if (validIds.has(mappedId)) completed[mappedId] = true;
    });
    const normalized = { ...source, completed };
    if (Object.keys(legacyCompleted).length) normalized.legacyCompleted = legacyCompleted;
    return normalized;
  }

  function prerequisitesComplete(stage, progress) {
    if (!stage) return false;
    const completed = progress?.completed ?? {};
    return stage.prerequisiteStageIds.every(stageId => completed[stageId] === true);
  }

  function canLaunchStage(stageId, progress, stages = STAGES) {
    const stage = stageById(stageId, stages);
    if (!stage?.implemented) return false;
    return progress?.completed?.[stage.id] === true || prerequisitesComplete(stage, progress);
  }

  function getRecommendedStage(progress, stages = STAGES) {
    const ordered = [...stages].sort((first, second) => first.order - second.order);
    const recommended = ordered.find(stage => stage.implemented && progress?.completed?.[stage.id] !== true && prerequisitesComplete(stage, progress));
    return recommended ?? ordered.find(stage => stage.implemented);
  }

  function getNextEligibleStage(stageId, progress, stages = STAGES) {
    const current = stageById(stageId, stages);
    if (!current) return undefined;
    return [...stages]
      .sort((first, second) => first.order - second.order)
      .find(stage => stage.order > current.order && stage.implemented && progress?.completed?.[stage.id] !== true && prerequisitesComplete(stage, progress));
  }

  function getStageState(stage, progress, recommendedStage = getRecommendedStage(progress)) {
    if (!stage?.implemented) return "planned";
    if (progress?.completed?.[stage.id] === true) return "completed";
    if (!prerequisitesComplete(stage, progress)) return "locked";
    return stage.id === recommendedStage?.id ? "current" : "unlocked";
  }

  function getGroupProgress(groupId, progress, stages = STAGES, groups = GROUPS) {
    const groupStages = stagesForGroup(groupId, stages, groups);
    const playable = groupStages.filter(stage => stage.implemented);
    return {
      completed: playable.filter(stage => progress?.completed?.[stage.id] === true).length,
      playable: playable.length,
      planned: groupStages.length - playable.length
    };
  }

  function findPrerequisiteCycle(stages) {
    const visiting = new Set();
    const visited = new Set();
    const byId = new Map(stages.map(stage => [stage.id, stage]));
    function visit(stageId) {
      if (visiting.has(stageId)) return true;
      if (visited.has(stageId)) return false;
      visiting.add(stageId);
      const stage = byId.get(stageId);
      if (stage?.prerequisiteStageIds.some(visit)) return true;
      visiting.delete(stageId);
      visited.add(stageId);
      return false;
    }
    return stages.some(stage => visit(stage.id));
  }

  function validateRoadmap({
    groups = GROUPS,
    stages = STAGES,
    categories = root.MilaLearningCategories?.CATEGORIES ?? [],
    requireCompleteness = true,
    warn = console.warn
  } = {}) {
    const problems = [];
    const groupIds = groups.map(group => group.id);
    const stageIds = stages.map(stage => stage.id);
    const orders = stages.map(stage => stage.order);
    const learningTypes = new Set(Object.values(LEARNING_TYPES));
    const categoryById = new Map(categories.map(category => [category.id, category]));
    if (new Set(groupIds).size !== groupIds.length) problems.push("Tekrarlanan Öğrenme Yolu grup kimliği var.");
    if (new Set(stageIds).size !== stageIds.length) problems.push("Tekrarlanan Öğrenme Yolu aşama kimliği var.");
    if (new Set(orders).size !== orders.length || orders.some(order => !Number.isInteger(order) || order < 1)) problems.push("Aşama sıraları benzersiz pozitif tam sayılar olmalı.");
    if (requireCompleteness) {
      REQUIRED_GROUP_IDS.forEach(groupId => { if (!groupIds.includes(groupId)) problems.push(`Eksik Öğrenme Yolu grubu: ${groupId}`); });
      REQUIRED_STAGE_IDS.forEach(stageId => { if (!stageIds.includes(stageId)) problems.push(`Eksik Öğrenme Yolu aşaması: ${stageId}`); });
      if (groups.length !== 6) problems.push("Öğrenme Yolu tam olarak 6 grup içermeli.");
      if (stages.length !== 38) problems.push("Öğrenme Yolu tam olarak 38 aşama içermeli.");
    }
    const listedStageIds = groups.flatMap(group => group.stageIds);
    if (new Set(listedStageIds).size !== listedStageIds.length) problems.push("Bir aşama birden fazla grup listesinde yer alıyor.");
    stages.forEach(stage => {
      if (!groupIds.includes(stage.groupId)) problems.push(`${stage.id}: geçersiz grup.`);
      if (listedStageIds.filter(stageId => stageId === stage.id).length !== 1) problems.push(`${stage.id}: tam olarak bir grup listesinde bulunmalı.`);
      if (!learningTypes.has(stage.learningType)) problems.push(`${stage.id}: geçersiz öğrenme türü.`);
      if (typeof stage.implemented !== "boolean") problems.push(`${stage.id}: implemented değeri boolean olmalı.`);
      if (!Array.isArray(stage.prerequisiteStageIds) || stage.prerequisiteStageIds.some(prerequisiteId => !stageIds.includes(prerequisiteId))) problems.push(`${stage.id}: bilinmeyen ön koşul.`);
      if (!Number.isInteger(stage.sessionLength) || stage.sessionLength < 1) problems.push(`${stage.id}: geçersiz oturum uzunluğu.`);
      if (stage.implemented) {
        if (!PLAYABLE_LEARNING_TYPES.has(stage.learningType)) problems.push(`${stage.id}: oynanabilir işaretli ancak öğrenme türü desteklenmiyor.`);
        if (!stage.categoryIds.length) problems.push(`${stage.id}: oynanabilir aşamada kategori yok.`);
        const allowedStrategies = STRATEGIES_BY_LEARNING_TYPE[stage.learningType] ?? [];
        stage.categoryIds.forEach(categoryId => {
          const category = categoryById.get(categoryId);
          if (!category) problems.push(`${stage.id}: kategori bulunamadı (${categoryId}).`);
          else if (!allowedStrategies.includes(category.strategy)) problems.push(`${stage.id}: ${categoryId} stratejisi öğrenme türüyle uyumlu değil.`);
        });
      }
    });
    groups.forEach(group => {
      group.stageIds.forEach(stageId => {
        const stage = stageById(stageId, stages);
        if (!stage) problems.push(`${group.id}: bilinmeyen aşama (${stageId}).`);
        else if (stage.groupId !== group.id) problems.push(`${stage.id}: grup listesi ile groupId uyuşmuyor.`);
      });
    });
    if (findPrerequisiteCycle(stages)) problems.push("Öğrenme Yolu ön koşullarında döngü var.");
    Object.entries(LEGACY_STAGE_ID_MAP).forEach(([legacyId, mappedId]) => {
      if (!stageIds.includes(mappedId)) problems.push(`Eski aşama eşlemesi geçersiz: ${legacyId} -> ${mappedId}`);
    });
    const emptyProgress = { completed: {} };
    const firstImplemented = [...stages].sort((first, second) => first.order - second.order).find(stage => stage.implemented);
    if (firstImplemented && !canLaunchStage(firstImplemented.id, emptyProgress, stages)) problems.push("İlk oynanabilir aşama açık değil.");
    stages.filter(stage => !stage.implemented).forEach(stage => {
      if (canLaunchStage(stage.id, emptyProgress, stages)) problems.push(`${stage.id}: planlı aşama başlatılabiliyor.`);
    });
    problems.forEach(problem => warn(`[Sprint 8.3.1 Öğrenme Yolu] ${problem}`));
    return { valid: problems.length === 0, problems };
  }

  const validation = validateRoadmap();

  root.MilaLearningPath = {
    LEARNING_TYPES,
    PLAYABLE_LEARNING_TYPES,
    GROUPS,
    STAGES,
    REQUIRED_GROUP_IDS,
    REQUIRED_STAGE_IDS,
    LEGACY_STAGE_ID_MAP,
    STRATEGIES_BY_LEARNING_TYPE,
    validation,
    stageById,
    groupById,
    stagesForGroup,
    normalizeProgress,
    prerequisitesComplete,
    canLaunchStage,
    getRecommendedStage,
    getNextEligibleStage,
    getStageState,
    getGroupProgress,
    findPrerequisiteCycle,
    validateRoadmap
  };

  if (typeof module !== "undefined" && module.exports) module.exports = root.MilaLearningPath;
})(typeof window !== "undefined" ? window : globalThis);
