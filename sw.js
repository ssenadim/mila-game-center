"use strict";

const APP_VERSION = "1.0.5";
const CACHE_PREFIX = "mila-oyun-merkezi-";
const CACHE_NAME = `${CACHE_PREFIX}${APP_VERSION}-art13-5-math13-6-qa13-7`;
const VERSIONED_ASSETS = [
  "./styles.css",
  "./js/utils/random.js",
  "./js/services/SpeechService.js",
  "./js/services/AudioHelper.js",
  "./js/services/AnimationHelper.js",
  "./js/QuestionEngine.js",
  "./js/EducationalObjects.js",
  "./js/Illustrations.js",
  "./js/NewMiniGames.js",
  "./js/LearningCategories.js",
  "./js/LogicAttention.js",
  "./js/DailyConcepts.js",
  "./js/LearningPath.js",
  "./js/NumberLearning.js",
  "./js/WorldThemes.js",
  "./js/DailyMissions.js",
  "./js/BonusManager.js",
  "./js/ParentExperience.js",
  "./data/offline-data.js",
  "./app.js"
].map(path => `${path}?v=${APP_VERSION}`);
// Bounded core set: math quantities, Sprint 13 targets and canonical memory reveals.
// Other educational objects and puzzle scenes retain their existing first-use cache.
const CORE_OBJECT_IDS = ["apple", "strawberry", "pear", "cat", "rabbit", "fish", "car", "bus", "airplane", "ball", "kite", "pencil", "seahorse", "tree", "broccoli", "dog", "lion"];
const ILLUSTRATION_ASSETS = [
  ...CORE_OBJECT_IDS.map(id => `./assets/illustrations/objects/object-${id}.svg`),
  "./assets/illustrations/home/learn.svg",
  "./assets/illustrations/home/mini-games.svg",
  "./assets/illustrations/home/learning-path.svg",
  "./assets/illustrations/home/rewards.svg",
  "./assets/illustrations/learning/path.svg",
  "./assets/illustrations/learning/modes.svg",
  "./assets/illustrations/learning/category-packs.svg",
  "./assets/illustrations/learning/custom-category.svg",
  "./assets/illustrations/mini-games/matching.svg",
  "./assets/illustrations/mini-games/listening.svg",
  "./assets/illustrations/mini-games/number.svg",
  "./assets/illustrations/mini-games/color.svg",
  "./assets/illustrations/mini-games/sorting.svg",
  "./assets/illustrations/mini-games/missing.svg",
  "./assets/illustrations/mini-games/shadow.svg",
  "./assets/illustrations/mini-games/initial-letter.svg",
  "./assets/illustrations/mini-games/sound-memory.svg",
  "./assets/illustrations/mini-games/puzzle.svg",
  "./assets/illustrations/learning-path/first-discoveries.svg",
  "./assets/illustrations/learning-path/word-world.svg",
  "./assets/illustrations/learning-path/number-world.svg",
  "./assets/illustrations/learning-path/first-operations.svg",
  "./assets/illustrations/learning-path/think-find.svg",
  "./assets/illustrations/learning-path/daily-life.svg",
  "./assets/illustrations/missions/daily.svg",
  "./assets/illustrations/rewards/stars.svg",
  "./assets/illustrations/rewards/stickers.svg",
  "./assets/illustrations/rewards/achievements.svg",
  "./assets/illustrations/empty-states/stickers.svg",
  "./assets/illustrations/empty-states/achievements.svg",
  "./assets/illustrations/empty-states/activity.svg",
  "./assets/illustrations/empty-states/review.svg",
  "./assets/illustrations/empty-states/unavailable.svg"
].map(path => `${path}?v=${APP_VERSION}`);
const APP_SHELL = ["./", "./index.html", ...VERSIONED_ASSETS, ...ILLUSTRATION_ASSETS];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map(name => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    if (response.ok && response.headers.get("content-type")?.includes("text/html")) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put("./index.html", response.clone());
    }
    return response;
  } catch {
    return (await caches.match("./index.html")) || (await caches.match("./")) || Response.error();
  }
}

async function handleLocalAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }
  const url = new URL(request.url);
  if (url.origin === self.location.origin) event.respondWith(handleLocalAsset(request));
});
