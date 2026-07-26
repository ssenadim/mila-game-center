(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MilaWorldThemes = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const DEFAULT_THEME_ID = "sunny";
  const STORAGE_KEY = "mila-learning-world-theme";
  const REQUIRED_THEME_IDS = [
    "sunny", "spring", "summer", "autumn", "winter",
    "night", "unicorn", "space", "dinosaur", "forest"
  ];

  const WORLD_THEMES = Object.freeze([
    { id: "sunny", name: "Güneşli Dünya", icon: "🌞", subtitle: "Bulutların arasında oyna" },
    { id: "spring", name: "İlkbahar", icon: "🌸", subtitle: "Çiçekler ve kelebekler" },
    { id: "summer", name: "Yaz", icon: "☀️", subtitle: "Deniz, güneş ve tatil" },
    { id: "autumn", name: "Sonbahar", icon: "🍂", subtitle: "Renkli yapraklar" },
    { id: "winter", name: "Kış", icon: "❄️", subtitle: "Karlı ve neşeli bir dünya" },
    { id: "night", name: "Gece", icon: "🌙", subtitle: "Ay ve parlayan yıldızlar" },
    { id: "unicorn", name: "Unicorn Dünyası", icon: "🦄", subtitle: "Gökkuşağı ve sihir" },
    { id: "space", name: "Uzay", icon: "🚀", subtitle: "Gezegenleri keşfet" },
    { id: "dinosaur", name: "Dinozor Vadisi", icon: "🦕", subtitle: "Dinozorlarla macera" },
    { id: "forest", name: "Orman", icon: "🌳", subtitle: "Orman dostlarıyla oyna" }
  ].map(theme => Object.freeze({ ...theme })));

  function validateRegistry(themes = WORLD_THEMES) {
    const ids = themes.map(theme => theme?.id);
    const errors = [];
    if (themes.length !== REQUIRED_THEME_IDS.length) errors.push("Tema sayısı on olmalıdır.");
    if (new Set(ids).size !== ids.length) errors.push("Tema kimlikleri benzersiz olmalıdır.");
    REQUIRED_THEME_IDS.forEach(id => {
      if (!ids.includes(id)) errors.push(`Eksik tema: ${id}`);
    });
    themes.forEach(theme => {
      if (!theme?.id || !theme?.name || !theme?.icon || !theme?.subtitle) {
        errors.push(`Eksik tema bilgisi: ${theme?.id ?? "bilinmeyen"}`);
      }
    });
    if (!ids.includes(DEFAULT_THEME_ID)) errors.push("Varsayılan tema kayıtlı değil.");
    return { valid: errors.length === 0, errors };
  }

  function isValidThemeId(themeId) {
    return WORLD_THEMES.some(theme => theme.id === themeId);
  }

  function playerStorageKey(playerName) {
    const validName = typeof playerName === "string" ? playerName.trim() : "";
    return validName ? `${STORAGE_KEY}-${encodeURIComponent(validName)}` : STORAGE_KEY;
  }

  class WorldThemeManager {
    constructor({ rootElement, storage, warn } = {}) {
      this.rootElement = rootElement;
      this.storage = storage;
      this.warn = typeof warn === "function" ? warn : () => {};
      this.activeThemeId = DEFAULT_THEME_ID;
      const validation = validateRegistry();
      if (!validation.valid) throw new Error(validation.errors.join(" "));
    }

    normalize(themeId, { warn = false } = {}) {
      if (isValidThemeId(themeId)) return themeId;
      if (warn && themeId) this.warn(`[Oyun Dünyası] Geçersiz tema "${themeId}", Güneşli Dünya kullanılıyor.`);
      return DEFAULT_THEME_ID;
    }

    apply(themeId) {
      const validThemeId = this.normalize(themeId, { warn: true });
      if (this.rootElement) this.rootElement.setAttribute("data-world-theme", validThemeId);
      this.activeThemeId = validThemeId;
      return validThemeId;
    }

    read(playerName) {
      try {
        const savedThemeId = this.storage?.getItem(playerStorageKey(playerName));
        return this.normalize(savedThemeId, { warn: Boolean(savedThemeId) });
      } catch {
        return DEFAULT_THEME_ID;
      }
    }

    restore(playerName) {
      return this.apply(this.read(playerName));
    }

    save(themeId, playerName) {
      const validThemeId = this.apply(themeId);
      try {
        this.storage?.setItem(STORAGE_KEY, validThemeId);
        if (playerName) this.storage?.setItem(playerStorageKey(playerName), validThemeId);
      } catch {
        // Theme selection remains usable if local storage is unavailable.
      }
      return validThemeId;
    }

    getTheme(themeId = this.activeThemeId) {
      return WORLD_THEMES.find(theme => theme.id === this.normalize(themeId));
    }
  }

  return {
    DEFAULT_THEME_ID,
    REQUIRED_THEME_IDS,
    STORAGE_KEY,
    WORLD_THEMES,
    WorldThemeManager,
    isValidThemeId,
    playerStorageKey,
    validateRegistry
  };
});
