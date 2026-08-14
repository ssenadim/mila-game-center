"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const worker = fs.readFileSync(path.join(root, "sw.js"), "utf8");
const parent = require(path.join(root, "js", "ParentExperience.js"));
const releaseVersion = "1.0.0";

function localPath(reference) {
  return reference.split(/[?#]/, 1)[0].replace(/^\//, "");
}

test("static HTML has unique IDs and the Home title is not focused during initial render", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.match(html, /<h1 id="welcome-title" tabindex="-1">Mila <span>Oyun Merkezi<\/span><\/h1>/);
  assert.match(app, /showPrimaryView\(selectedPlayer \? "home" : "players", \{ focus: false \}\)/);
  assert.doesNotMatch(app, /welcomeTitle\.focus|welcome-title[^\n]+focus/);
});

test("all static local HTML, CSS and data-index references resolve inside the repository", () => {
  const references = [
    ...html.matchAll(/\b(?:src|href)="([^"]+)"/g),
    ...fs.readFileSync(path.join(root, "styles.css"), "utf8").matchAll(/url\(["']?([^"')]+)["']?\)/g)
  ].map(match => match[1]).filter(reference => !/^(?:https?:|data:|blob:|#)/i.test(reference));
  references.forEach(reference => assert.equal(fs.existsSync(path.join(root, localPath(reference))), true, reference));
  const index = JSON.parse(fs.readFileSync(path.join(root, "data", "index.json"), "utf8"));
  assert.ok(Array.isArray(index.files) && index.files.length > 0);
  index.files.forEach(file => assert.equal(fs.existsSync(path.join(root, "data", file)), true, file));
});

test("release asset URLs, application metadata and offline cache share one production version", () => {
  const versionedLocalAssets = [...html.matchAll(/(?:src|href)="((?!https?:)[^"]+\?v=([^"]+))"/g)];
  assert.ok(versionedLocalAssets.length >= 18);
  versionedLocalAssets.forEach(match => assert.equal(match[2], releaseVersion, match[1]));
  assert.match(app, new RegExp(`const APP_VERSION = "${releaseVersion.replaceAll(".", "\\.")}"`));
  assert.equal(parent.APP_VERSION, releaseVersion);
  assert.match(worker, new RegExp(`const APP_VERSION = "${releaseVersion.replaceAll(".", "\\.")}"`));
});

test("service worker is registered once and provides versioned, safe app-shell lifecycle behavior", () => {
  assert.equal((app.match(/serviceWorker\.register\(/g) || []).length, 1);
  assert.match(worker, /caches\.open\(CACHE_NAME\).*cache\.addAll\(APP_SHELL\)/s);
  assert.match(worker, /name\.startsWith\(CACHE_PREFIX\) && name !== CACHE_NAME/);
  assert.doesNotMatch(worker, /skipWaiting\(/);
  assert.match(worker, /request\.mode === "navigate"/);
  assert.match(worker, /response\.ok && response\.headers\.get\("content-type"\)\?\.includes\("text\/html"\)/);
  const shellPaths = [...worker.matchAll(/"(\.\/(?:[^"?]+))"/g)].map(match => match[1]);
  shellPaths.filter(reference => reference !== "./").forEach(reference => assert.equal(fs.existsSync(path.join(root, localPath(reference))), true, reference));
});

test("production deployment applies safe headers without rewriting static SEO resources", () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, "vercel.json"), "utf8"));
  assert.equal(config.rewrites, undefined);
  const headers = Object.fromEntries(config.headers.flatMap(rule => rule.headers).map(header => [header.key, header.value]));
  ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy", "Strict-Transport-Security"].forEach(name => assert.ok(headers[name], name));
  assert.match(headers["Permissions-Policy"], /camera=\(\).*microphone=\(\).*geolocation=\(\)/);
  assert.equal(headers["Cache-Control"], "public, max-age=0, must-revalidate");
});

test("storage and import hardening preserve data and provide bounded fallbacks", () => {
  const sources = [app, worker, fs.readFileSync(path.join(root, "js", "ParentExperience.js"), "utf8")].join("\n");
  assert.doesNotMatch(sources, /localStorage\.clear\s*\(/);
  assert.doesNotMatch(app, /JSON\.parse\(window\.localStorage\.getItem/);
  assert.match(app, /function readStoredJson\(storageKey, fallback\)/);
  assert.match(app, /file\.size > 2_000_000/);
  const backup = parent.createBackup({ length: 0, key() { return null; }, getItem() { return null; } });
  assert.equal(backup.appVersion, releaseVersion);
  assert.equal(parent.validateBackup({ ...backup, appVersion: "invalid" }).valid, false);
});

test("core startup has a local-data fallback and production privacy copy is factual", () => {
  assert.match(app, /return createOfflineEngine\(\)/);
  assert.match(app, /await speech\.ready/);
  assert.match(app, /if \(engine\) restoreStoredLearningStats\(\)/);
  assert.match(html, /Çocuk profili ve oyun ilerlemesi bu tarayıcıda saklanır/);
  assert.doesNotMatch(html, /Hiçbir ağ isteği yapılmaz/);
});
