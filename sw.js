"use strict";

const APP_VERSION = "1.0.0";
const CACHE_PREFIX = "mila-oyun-merkezi-";
const CACHE_NAME = `${CACHE_PREFIX}${APP_VERSION}`;
const VERSIONED_ASSETS = [
  "./styles.css",
  "./js/utils/random.js",
  "./js/services/SpeechService.js",
  "./js/services/AudioHelper.js",
  "./js/services/AnimationHelper.js",
  "./js/QuestionEngine.js",
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
const APP_SHELL = ["./", "./index.html", ...VERSIONED_ASSETS];

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
