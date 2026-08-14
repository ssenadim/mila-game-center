"use strict";

const fs = require("node:fs");

const html = fs.readFileSync("index.recovered.html", "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
const requiredIds = [
  "welcome-screen",
  "player-selection-screen",
  "learning-center-screen",
  "mini-games-screen",
  "learning-path-screen",
  "parent-dashboard",
  "settings-button",
  "world-theme-panel",
  "daily-goal-card",
  "question-count",
  "score"
];
const missingRequired = requiredIds.filter(id => !ids.includes(id));
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
const app = fs.readFileSync("app.js", "utf8");
const queriedIds = [...app.matchAll(/querySelector(?:All)?\("#([^"]+)"\)/g)].map(match => match[1]);
const optionalLegacyIds = new Set(["achievements-button", "sorting-finish-home-button", "summary-home-button"]);
const missingQueriedIds = [...new Set(queriedIds.filter(id => !ids.includes(id) && !optionalLegacyIds.has(id)))];
const checks = {
  doctype: html.startsWith("<!doctype html>"),
  closes: html.trimEnd().endsWith("</html>"),
  title: /<title>Mila Oyun Merkezi/.test(html),
  app9: scripts.includes("app.js?v=9.0"),
  duplicateIds,
  missingRequired,
  missingQueriedIds,
  idCount: ids.length,
  scriptCount: scripts.length,
  bytes: Buffer.byteLength(html)
};

console.log(JSON.stringify(checks, null, 2));
if (!checks.doctype || !checks.closes || !checks.title || !checks.app9 || duplicateIds.length || missingRequired.length || missingQueriedIds.length) {
  process.exitCode = 1;
}
