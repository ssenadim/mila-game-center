"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const library = require("../js/LearningCategories.js");

function seededRandom(seed = 1) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

test("Sprint 11.2 has 16 valid data-driven sorting categories backed by shared educational items", () => {
  const expected = [
    "animals", "fruits", "vegetables", "toys", "clothes", "schoolItems", "homeItems", "foods",
    "landVehicles", "seaVehicles", "airVehicles", "seaAnimals", "landAnimals", "pets", "wildAnimals", "nature"
  ];
  assert.equal(library.validateSortingContent(() => {}).valid, true);
  assert.deepEqual(library.SORTING_CATEGORIES.map(category => category.id), expected);
  assert.equal(new Set(expected).size, 16);
  library.SORTING_CATEGORIES.forEach(category => {
    const validation = library.validateSortingCategory(category);
    assert.equal(validation.valid, true, `${category.id}: ${validation.problems.join("; ")}`);
    assert.ok(validation.items.length >= 4);
    assert.equal(new Set(validation.items.map(item => item.id)).size, validation.items.length);
    assert.ok(validation.items.every(item => item.label && (item.visual || item.visualSvg)));
    validation.items.forEach(item => {
      const source = library.getCategory(item.sourceCategoryId);
      assert.ok(source.items.some(sourceItem => sourceItem.id === item.id), item.id);
    });
  });
});

test("all 15 allowed pairs are valid, exclusive and initialize deterministic balanced sessions", () => {
  assert.equal(library.SORTING_PAIRS.length, 15);
  assert.equal(library.getValidSortingPairs().length, 15);
  library.SORTING_PAIRS.forEach((pair, index) => {
    const pairValidation = library.validateSortingPair(pair);
    assert.equal(pairValidation.valid, true, `${pair.id}: ${pairValidation.problems.join("; ")}`);
    assert.ok(pairValidation.eligibleItems.every(items => items.length >= 4));
    const firstConcepts = new Set(pairValidation.eligibleItems[0].map(item => item.conceptId));
    assert.ok(pairValidation.eligibleItems[1].every(item => !firstConcepts.has(item.conceptId)));
    const session = library.createSortingSession({ pairId: pair.id, random: seededRandom(index + 21) });
    assert.equal(session.pairId, pair.id);
    assert.equal(library.validateSortingSession(session).valid, true);
    assert.equal(session.items.length, 8);
    assert.equal(new Set(session.items.map(item => item.id)).size, 8);
    session.categories.forEach(category => assert.equal(session.items.filter(item => item.group === category.id).length, 4));
  });
});

test("required intermediate and advanced pairs are present and unsafe overlapping pairs are rejected", () => {
  const required = [
    "fruits-vegetables", "land-sea-vehicles", "land-air-vehicles", "sea-air-vehicles",
    "sea-land-animals", "pets-wild"
  ];
  required.forEach(pairId => assert.ok(library.SORTING_PAIRS.some(pair => pair.id === pairId), pairId));

  [
    ["animals-pets", "animals", "pets"],
    ["animals-wild", "animals", "wildAnimals"],
    ["animals-sea", "animals", "seaAnimals"],
    ["foods-fruits", "foods", "fruits"],
    ["foods-vegetables", "foods", "vegetables"]
  ].forEach(([id, first, second]) => {
    const validation = library.validateSortingPair({ id, categoryIds: [first, second], tier: "advanced", instruction: "" });
    assert.equal(validation.valid, false, id);
    assert.ok(validation.problems.some(problem => /örtüşen|iki gruba da ait/.test(problem)), validation.problems.join("; "));
  });
});

test("pair selection uses deterministic tiers, avoids recent pairs and falls back safely", () => {
  const easy = library.selectSortingPair([], (() => { const values = [0.1, 0]; return () => values.shift() ?? 0; })());
  const medium = library.selectSortingPair([], (() => { const values = [0.6, 0]; return () => values.shift() ?? 0; })());
  const advanced = library.selectSortingPair([], (() => { const values = [0.9, 0]; return () => values.shift() ?? 0; })());
  assert.equal(easy.tier, "easy");
  assert.equal(medium.tier, "medium");
  assert.equal(advanced.tier, "advanced");
  assert.notEqual(library.selectSortingPair([easy.id], () => 0).id, easy.id);

  const safe = library.SORTING_PAIRS.find(pair => pair.id === library.SORTING_FALLBACK_PAIR_ID);
  const invalid = { id: "invalid", categoryIds: ["animals", "pets"], tier: "advanced", instruction: "" };
  const fallback = library.createSortingSession({ pairId: "missing", sourcePairs: [invalid, safe], random: () => 0.999999 });
  assert.equal(fallback.pairId, "animals-fruits");
  assert.equal(library.validateSortingSession(fallback).valid, true);
});

test("category sides vary while one session stays stable and bounded fallback prevents item blocks", () => {
  const normal = library.createSortingSession({ pairId: "land-sea-vehicles", random: () => 0 });
  const reversed = library.createSortingSession({ pairId: "land-sea-vehicles", random: () => 0.999999 });
  assert.deepEqual(normal.categories.map(category => category.id), ["landVehicles", "seaVehicles"]);
  assert.deepEqual(reversed.categories.map(category => category.id), ["seaVehicles", "landVehicles"]);
  assert.equal(library.validateSortingSession(normal).valid, true);
  assert.equal(library.validateSortingSession(reversed).valid, true);
  assert.ok(normal.items.slice(1).some((item, index) => item.group !== normal.items[index].group));
  assert.ok(reversed.items.slice(1).some((item, index) => item.group !== reversed.items[index].group));
});

test("sorting placement supports retry, rejects duplicates and completes exactly on the final item", () => {
  const session = library.createSortingSession({ pairId: "animals-fruits", random: seededRandom(99) });
  const first = session.items[0];
  const wrongGroup = session.categories.find(category => category.id !== first.group).id;
  assert.deepEqual(library.placeSortingSessionItem(session, first.id, wrongGroup), { accepted: false, completed: false, retry: true });
  assert.equal(first.completed, false);
  assert.equal(library.placeSortingSessionItem(session, first.id, first.group).accepted, true);
  assert.equal(library.placeSortingSessionItem(session, first.id, first.group).accepted, false);
  session.items.slice(1, -1).forEach(item => assert.equal(library.placeSortingSessionItem(session, item.id, item.group).completed, false));
  const final = session.items.at(-1);
  assert.equal(library.placeSortingSessionItem(session, final.id, final.group).completed, true);
  assert.equal(library.placeSortingSessionItem(session, final.id, final.group).completed, false);
});

test("Grupla UI preserves identity, tap/drag, pause selection, cleanup, replay and canonical completion", () => {
  const root = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.match(html, /<strong>🧺 Grupla<\/strong>/);
  assert.match(html, /id="sorting-replay-button"[^>]*>Tekrar Oyna/);
  assert.match(app, /createSortingSession\(\{ recentPairIds: recentSortingPairIds \}\)/);
  assert.match(app, /recentSortingPairIds[\s\S]*\.slice\(-3\)/);
  assert.match(app, /aria-pressed/);
  assert.match(app, /pointerdown[\s\S]*pointermove[\s\S]*pointerup/);
  assert.match(app, /clearSortingInteraction\(true\)/);
  assert.match(app, /sortingSessionId \+= 1/);
  assert.match(app, /speech\.speakTurkish\(sortingSession\.instruction/);
  assert.match(app, /function finishSortingGame\(\)[\s\S]*if \(!isSortingGameActive\) return/);
  assert.match(app, /recordMiniGameMissionCompletion\(SORTING_MODE\)/);
  assert.match(css, /\.sorting-item\.selected/);
  assert.match(css, /\.sorting-destinations\{display:grid;grid-template-columns:1fr 1fr/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
});
