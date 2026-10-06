(function (root, factory) {
  "use strict";

  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MilaIllustrations = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  const VERSION = "1.0.5";
  const content = root?.MilaEducationalObjects
    || (typeof require === "function" ? require("./EducationalObjects.js") : undefined);
  const asset = path => `assets/illustrations/${path}?v=${VERSION}`;
  const entries = [
    { id: "home-learn", src: asset("home/learn.svg"), alt: "Kitap, harf ve sayılarla öğrenme sahnesi", type: "cardHero", theme: "learning", category: "home", fallback: "🧭" },
    { id: "home-mini-games", src: asset("home/mini-games.svg"), alt: "Yapboz ve eşleştirme kartlarıyla oyun sahnesi", type: "cardHero", theme: "play", category: "home", fallback: "🎮" },
    { id: "home-learning-path", src: asset("home/learning-path.svg"), alt: "Yıldızlı dönemeçleri olan öğrenme yolu", type: "cardHero", theme: "journey", category: "home", fallback: "🗺️" },
    { id: "home-rewards", src: asset("home/rewards.svg"), alt: "Sticker kitabı, yıldız ve madalya ödülleri", type: "cardHero", theme: "rewards", category: "home", fallback: "🏆" },

    { id: "learning-path", src: asset("learning/path.svg"), alt: "Renkli adımlar ve öğrenme durakları", type: "cardHero", theme: "journey", category: "learning", fallback: "🗺️" },
    { id: "learning-modes", src: asset("learning/modes.svg"), alt: "Kitap, dinleme kartı ve hızlı oyun kartı", type: "sectionHero", theme: "learning", category: "learning", fallback: "📚" },
    { id: "learning-category-packs", src: asset("learning/category-packs.svg"), alt: "Sayı, renk, şekil ve kelime kartları", type: "sectionHero", theme: "learning", category: "learning", fallback: "🗂️" },
    { id: "learning-custom-category", src: asset("learning/custom-category.svg"), alt: "Seçilebilir öğrenme nesneleriyle yaratıcı kutu", type: "compactHero", theme: "creative", category: "learning", fallback: "🧺" },

    { id: "mini-game-matching", src: asset("mini-games/matching.svg"), alt: "Aynı iki hayvan kartını eşleştirme", type: "cardHero", theme: "play", category: "miniGames", fallback: "🧩" },
    { id: "mini-game-listening", src: asset("mini-games/listening.svg"), alt: "Kulaklıklı sevimli karakter ve seçim kartları", type: "cardHero", theme: "play", category: "miniGames", fallback: "👂" },
    { id: "mini-game-number", src: asset("mini-games/number.svg"), alt: "Renkli sayılar ve sayma nesneleri", type: "cardHero", theme: "math", category: "miniGames", fallback: "🔢" },
    { id: "mini-game-color", src: asset("mini-games/color.svg"), alt: "Fırça ve renkli boya lekeleri", type: "cardHero", theme: "creative", category: "miniGames", fallback: "🎨" },
    { id: "mini-game-sorting", src: asset("mini-games/sorting.svg"), alt: "Nesnelerin iki farklı sepete ayrılması", type: "cardHero", theme: "thinking", category: "miniGames", fallback: "🧺" },
    { id: "mini-game-missing", src: asset("mini-games/missing.svg"), alt: "Bir yeri boş olan görsel sıralama", type: "cardHero", theme: "thinking", category: "miniGames", fallback: "🫣" },
    { id: "mini-game-shadow", src: asset("mini-games/shadow.svg"), alt: "Sevimli hayvan ve gölge kartları", type: "cardHero", theme: "thinking", category: "miniGames", fallback: "🌑" },
    { id: "mini-game-initial-letter", src: asset("mini-games/initial-letter.svg"), alt: "Elma resmi ve büyük harf seçenekleri", type: "cardHero", theme: "language", category: "miniGames", fallback: "🔤" },
    { id: "mini-game-sound-memory", src: asset("mini-games/sound-memory.svg"), alt: "Ses dalgaları taşıyan hafıza kartları", type: "cardHero", theme: "language", category: "miniGames", fallback: "🎧" },
    { id: "mini-game-puzzle", src: asset("mini-games/puzzle.svg"), alt: "Parçaları tamamlanmakta olan renkli resim", type: "cardHero", theme: "play", category: "miniGames", fallback: "🧩" },

    { id: "path-first-discoveries", src: asset("learning-path/first-discoveries.svg"), alt: "Büyüteçle keşfedilen renk ve şekiller", type: "groupHero", theme: "discovery", category: "learningPath", fallback: "🌟" },
    { id: "path-word-world", src: asset("learning-path/word-world.svg"), alt: "Açık kitaptan yükselen harf ve nesneler", type: "groupHero", theme: "language", category: "learningPath", fallback: "💬" },
    { id: "path-number-world", src: asset("learning-path/number-world.svg"), alt: "Sayı blokları ve sayma boncukları", type: "groupHero", theme: "math", category: "learningPath", fallback: "🔢" },
    { id: "path-first-operations", src: asset("learning-path/first-operations.svg"), alt: "Birleşen ve ayrılan nesne grupları", type: "groupHero", theme: "math", category: "learningPath", fallback: "➕" },
    { id: "path-think-find", src: asset("learning-path/think-find.svg"), alt: "Kısa labirent, örüntü ve yapboz parçaları", type: "groupHero", theme: "thinking", category: "learningPath", fallback: "🧠" },
    { id: "path-daily-life", src: asset("learning-path/daily-life.svg"), alt: "Saat, hava durumu ve günlük yaşam nesneleri", type: "groupHero", theme: "daily", category: "learningPath", fallback: "🏡" },

    { id: "mission-daily", src: asset("missions/daily.svg"), alt: "Güneşli küçük görev haritası ve onay yıldızları", type: "compactHero", theme: "missions", category: "missions", fallback: "☀️" },
    { id: "rewards-stars", src: asset("rewards/stars.svg"), alt: "Parlayan yıldız koleksiyonu", type: "compactHero", theme: "rewards", category: "rewards", fallback: "⭐" },
    { id: "rewards-stickers", src: asset("rewards/stickers.svg"), alt: "Renkli stickerlarla açık albüm", type: "sectionHero", theme: "rewards", category: "rewards", fallback: "🎁" },
    { id: "rewards-achievements", src: asset("rewards/achievements.svg"), alt: "Madalya, kurdele ve başarı yıldızları", type: "sectionHero", theme: "rewards", category: "rewards", fallback: "🏅" },

    { id: "empty-stickers", src: asset("empty-states/stickers.svg"), alt: "Yeni stickerları bekleyen açık albüm", type: "emptyState", theme: "inviting", category: "emptyStates", fallback: "✨" },
    { id: "empty-achievements", src: asset("empty-states/achievements.svg"), alt: "Yeni başarıları bekleyen boş madalya panosu", type: "emptyState", theme: "inviting", category: "emptyStates", fallback: "🌟" },
    { id: "empty-activity", src: asset("empty-states/activity.svg"), alt: "Yeni etkinlikleri bekleyen küçük macera haritası", type: "emptyState", theme: "inviting", category: "emptyStates", fallback: "🗺️" },
    { id: "empty-review", src: asset("empty-states/review.svg"), alt: "Gelecek öğrenme yıldızlarına bakan teleskop", type: "emptyState", theme: "inviting", category: "emptyStates", fallback: "🔭" },
    { id: "empty-unavailable", src: asset("empty-states/unavailable.svg"), alt: "Yeni içerikleri bekleyen dost canlısı sepet", type: "emptyState", theme: "inviting", category: "emptyStates", fallback: "🧺" }
  ];

  const contentEntries = [
    ...(content?.OBJECTS ?? []).map(item => ({
      id: item.illustration, src: item.src, alt: item.labelTr, type: "educationalObject",
      theme: "educational", category: "educational", fallback: item.fallback
    })),
    ...(content?.PUZZLE_SCENES ?? []).map(scene => ({
      id: scene.illustration, src: scene.src, alt: scene.description, type: "puzzleScene",
      theme: "play", category: "puzzles", fallback: "🧩"
    }))
  ];
  const ILLUSTRATIONS = Object.freeze([...entries, ...contentEntries].map(entry => Object.freeze(entry)));
  const byId = new Map(ILLUSTRATIONS.map(entry => [entry.id, entry]));
  const REQUIRED_FIRST_WAVE_IDS = Object.freeze(entries.map(entry => entry.id));
  const ALLOWED_CATEGORIES = new Set(["home", "learning", "miniGames", "learningPath", "rewards", "missions", "emptyStates", "decorative", "educational", "puzzles"]);

  function get(id) {
    return byId.get(id);
  }

  function validateRegistry() {
    const errors = [];
    const ids = new Set();
    const sources = new Set();
    ILLUSTRATIONS.forEach(entry => {
      if (!entry.id || ids.has(entry.id)) errors.push(`Geçersiz veya yinelenen illüstrasyon kimliği: ${entry.id || "boş"}`);
      if (!entry.src || sources.has(entry.src)) errors.push(`Geçersiz veya yinelenen illüstrasyon kaynağı: ${entry.src || "boş"}`);
      if (/^(?:https?:)?\/\//i.test(entry.src) || !entry.src.startsWith("assets/illustrations/")) errors.push(`Yerel olmayan illüstrasyon kaynağı: ${entry.src}`);
      if (!/\.(?:svg|png|webp)(?:\?v=[\w.-]+)?$/i.test(entry.src)) errors.push(`Desteklenmeyen illüstrasyon türü: ${entry.src}`);
      if (!entry.alt || !entry.alt.trim()) errors.push(`Eksik illüstrasyon açıklaması: ${entry.id}`);
      if (!ALLOWED_CATEGORIES.has(entry.category)) errors.push(`Geçersiz illüstrasyon kategorisi: ${entry.id}`);
      ids.add(entry.id);
      sources.add(entry.src);
    });
    REQUIRED_FIRST_WAVE_IDS.forEach(id => {
      if (!byId.has(id)) errors.push(`Eksik ilk dalga illüstrasyonu: ${id}`);
    });
    return { valid: errors.length === 0, errors };
  }

  function createElement(id, { className = "", eager = false, fallback } = {}) {
    if (typeof document === "undefined") return undefined;
    const entry = get(id);
    const frame = document.createElement("span");
    frame.className = `illustration-frame${className ? ` ${className}` : ""}`;
    frame.dataset.illustrationId = id;
    frame.setAttribute("aria-hidden", "true");
    const fallbackElement = document.createElement("span");
    fallbackElement.className = "illustration-fallback";
    fallbackElement.textContent = fallback || entry?.fallback || "✦";
    if (!entry) {
      frame.classList.add("is-broken");
      frame.append(fallbackElement);
      return frame;
    }
    const image = document.createElement("img");
    image.className = "illustration-image";
    image.src = entry.src;
    image.alt = "";
    image.width = 160;
    image.height = 120;
    image.loading = eager ? "eager" : "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => frame.classList.add("is-broken"), { once: true });
    frame.append(image, fallbackElement);
    return frame;
  }

  function mount(target, id = target?.dataset?.illustration, options = {}) {
    if (!target || typeof target.prepend !== "function") return undefined;
    const existing = Array.from(target.children || []).find(child => child.classList?.contains("illustration-frame"));
    if (existing?.dataset.illustrationId === id) return existing;
    existing?.remove();
    const element = createElement(id, options);
    if (element) target.prepend(element);
    return element;
  }

  function hydrate(scope = document) {
    if (!scope?.querySelectorAll) return;
    scope.querySelectorAll("[data-illustration]").forEach(target => {
      mount(target, target.dataset.illustration, { eager: target.dataset.artPriority === "high", fallback: target.dataset.artFallback });
    });
  }

  return Object.freeze({ VERSION, ILLUSTRATIONS, REQUIRED_FIRST_WAVE_IDS, get, validateRegistry, createElement, mount, hydrate });
});
