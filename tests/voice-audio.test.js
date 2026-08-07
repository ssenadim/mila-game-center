"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const speechSource = fs.readFileSync(path.join(root, "js", "services", "SpeechService.js"), "utf8");
const audioSource = fs.readFileSync(path.join(root, "js", "services", "AudioHelper.js"), "utf8");

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    snapshot() { return Object.fromEntries(values); }
  };
}

function createSpeechEnvironment({ voices = [], settings, autoEnd = true, supported = true } = {}) {
  let currentVoices = voices;
  const listeners = new Map();
  const spoken = [];
  const storage = createStorage({
    unrelated: JSON.stringify({ theme: "space", stars: 12 }),
    ...(settings ? { "mila-learning-audio-settings": JSON.stringify(settings) } : {})
  });
  class MockUtterance {
    constructor(text) { this.text = text; }
  }
  const synthesis = {
    cancelCount: 0,
    getVoices() { return currentVoices; },
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    speak(utterance) {
      spoken.push(utterance);
      if (autoEnd) queueMicrotask(() => utterance.onend?.());
    },
    cancel() { this.cancelCount += 1; }
  };
  const window = {
    speechSynthesis: supported ? synthesis : undefined,
    SpeechSynthesisUtterance: supported ? MockUtterance : undefined,
    localStorage: storage
  };
  vm.runInNewContext(speechSource, { window, console, encodeURIComponent, setTimeout, clearTimeout });
  return {
    SpeechService: window.MilaSpeechService,
    synthesis,
    spoken,
    storage,
    listenerCount(type) { return listeners.get(type)?.size ?? 0; },
    setVoices(nextVoices) { currentVoices = nextVoices; },
    dispatch(type) { listeners.get(type)?.forEach(listener => listener()); }
  };
}

const voice = (name, lang, options = {}) => ({ name, voiceURI: `voice:${name}`, lang, localService: false, default: false, ...options });

test("voice discovery loads immediately, refreshes when delayed and registers one listener", async () => {
  const environment = createSpeechEnvironment({ voices: [] });
  const service = new environment.SpeechService();
  await service.ready;
  assert.equal(environment.listenerCount("voiceschanged"), 1);
  assert.equal(service.getCapabilities().voices, false);

  const delayedVoices = [voice("Türkçe Yerel", "tr-TR", { localService: true }), voice("English", "en-US")];
  environment.setVoices(delayedVoices);
  environment.dispatch("voiceschanged");
  environment.dispatch("voiceschanged");
  assert.equal(service.turkishVoice.name, "Türkçe Yerel");
  assert.equal(service.englishVoice.name, "English");
  assert.equal(environment.listenerCount("voiceschanged"), 1);
});

test("automatic and saved voice routing prefer suitable Turkish and English voices", async () => {
  const available = [
    voice("Default Turkish", "tr-TR"),
    voice("Local Turkish", "tr-TR", { localService: true }),
    voice("US English", "en-US"),
    voice("Local British", "en-GB", { localService: true })
  ];
  const environment = createSpeechEnvironment({ voices: available });
  const service = new environment.SpeechService();
  await service.ready;
  assert.equal(service.turkishVoice.name, "Local Turkish");
  assert.equal(service.englishVoice.name, "Local British");

  service.setSettings({
    turkishVoice: service.getVoiceIdentifier(available[0]),
    englishVoice: service.getVoiceIdentifier(available[2])
  });
  await service.speakTurkish("Merhaba");
  await service.speakEnglish("Apple");
  assert.equal(environment.spoken[0].voice.name, "Default Turkish");
  assert.equal(environment.spoken[0].lang, "tr-TR");
  assert.equal(environment.spoken[1].voice.name, "US English");
  assert.equal(environment.spoken[1].lang, "en-US");
});

test("an unavailable saved voice falls back automatically without touching unrelated storage", async () => {
  const environment = createSpeechEnvironment({
    voices: [voice("Turkish", "tr-TR"), voice("English", "en-US")],
    settings: { speechEnabled: true, speechRate: "broken", turkishVoice: "missing", englishVoice: "missing", volume: 8 }
  });
  const service = new environment.SpeechService();
  await service.ready;
  assert.equal(service.turkishVoice.name, "Turkish");
  assert.equal(service.englishVoice.name, "English");
  assert.equal(service.getSettings().speechRate, "normal");
  assert.equal(service.getSettings().volume, "normal");
  service.setSettings({ speechRate: "slow" });
  assert.deepEqual(JSON.parse(environment.storage.getItem("unrelated")), { theme: "space", stars: 12 });
});

test("rapid replay cancels obsolete speech and stale completion cannot replace the active request", async () => {
  const environment = createSpeechEnvironment({ voices: [voice("Turkish", "tr-TR")], autoEnd: false });
  const service = new environment.SpeechService();
  await service.ready;
  const firstPromise = service.replay("Birinci soru", "tr-TR");
  await new Promise(resolve => setImmediate(resolve));
  const firstUtterance = environment.spoken[0];
  const secondPromise = service.replay("İkinci soru", "tr-TR");
  await new Promise(resolve => setImmediate(resolve));
  const secondUtterance = environment.spoken[1];
  firstUtterance.onend();
  assert.equal(service.activeRequest.text, "İkinci soru");
  secondUtterance.onend();
  assert.equal(await firstPromise, false);
  assert.equal(await secondPromise, true);
  assert.equal(service.queue.length, 0);
  assert.ok(environment.synthesis.cancelCount >= 2);
});

test("cancellation invalidates queued callbacks and navigation-style cleanup leaves no speech", async () => {
  const environment = createSpeechEnvironment({ voices: [voice("Turkish", "tr-TR")], autoEnd: false });
  const service = new environment.SpeechService();
  await service.ready;
  const active = service.speakPrompt("Soru", "tr-TR");
  const queued = service.speakAnswerChoice("Seçenek", "tr-TR");
  await new Promise(resolve => setImmediate(resolve));
  const oldEnd = environment.spoken[0].onend;
  service.cancelAllSpeech();
  oldEnd();
  assert.equal(await active, false);
  assert.equal(await queued, false);
  assert.equal(service.activeRequest, undefined);
  assert.equal(service.queue.length, 0);
});

test("speech toggle skips automatic narration but explicit replay remains available", async () => {
  const environment = createSpeechEnvironment({ voices: [voice("English", "en-US")] });
  const service = new environment.SpeechService();
  await service.ready;
  service.setSettings({ speechEnabled: false });
  assert.equal(await service.speakEnglish("Five"), false);
  assert.equal(environment.spoken.length, 0);
  assert.equal(await service.replay("Five", "en-US"), true);
  assert.equal(environment.spoken[0].text, "Five");
});

test("missing SpeechSynthesis fails safely and keeps visual gameplay available", async () => {
  const environment = createSpeechEnvironment({ supported: false });
  const service = new environment.SpeechService();
  await service.ready;
  const capabilities = service.getCapabilities();
  assert.equal(capabilities.speechSynthesis, false);
  assert.equal(capabilities.utterance, false);
  assert.equal(capabilities.voices, false);
  assert.equal(await service.speakPrompt("Görsel soru", "tr-TR"), false);
  assert.equal(await service.replay("Dinle", "tr-TR"), false);
});

test("all audio preferences persist additively with validated values", async () => {
  const available = [voice("Turkish", "tr-TR"), voice("English", "en-US")];
  const environment = createSpeechEnvironment({ voices: available });
  const service = new environment.SpeechService();
  await service.ready;
  service.setSettings({
    speechEnabled: false,
    speechRate: "fast",
    turkishVoice: service.getVoiceIdentifier(available[0]),
    englishVoice: service.getVoiceIdentifier(available[1]),
    soundEffectsEnabled: false,
    volume: "low"
  });
  const saved = JSON.parse(environment.storage.getItem(environment.SpeechService.SETTINGS_KEY));
  assert.equal(saved.speechEnabled, false);
  assert.equal(saved.speechRate, "fast");
  assert.equal(saved.soundEffectsEnabled, false);
  assert.equal(saved.volume, "low");
  assert.equal(saved.turkishVoice, service.getVoiceIdentifier(available[0]));
  assert.equal(saved.englishVoice, service.getVoiceIdentifier(available[1]));
  assert.deepEqual(JSON.parse(environment.storage.getItem("unrelated")), { theme: "space", stars: 12 });
});

test("pronunciation normalization preserves visible input and speaks natural Turkish math and numbers", async () => {
  const environment = createSpeechEnvironment({ voices: [voice("Turkish", "tr-TR"), voice("English", "en-US")] });
  const service = new environment.SpeechService();
  await service.ready;
  const addition = "3 + 2 = ?";
  const subtraction = "7 - 3 = ?";
  assert.equal(service.normalizePronunciation(addition, "tr-TR"), "üç artı iki kaç eder?");
  assert.equal(service.normalizePronunciation(subtraction, "tr-TR"), "yediden üç çıkarsa kaç kalır?");
  assert.equal(service.normalizePronunciation("5", "tr-TR"), "beş");
  assert.equal(service.normalizePronunciation("5", "en-US"), "five");
  assert.equal(addition, "3 + 2 = ?");
});

test("settings, accessibility, listening-game escape hatch and cleanup are wired in the UI", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  [
    "speech-enabled-setting", "speech-rate-setting", "turkish-voice-setting", "english-voice-setting",
    "sound-effects-setting", "audio-volume-setting", "turkish-voice-preview", "english-voice-preview"
  ].forEach(id => assert.match(html, new RegExp(`id="${id}"`)));
  assert.match(app, /function selectPlayer\(name\) \{\s*clearSpeech\(\)/);
  assert.match(app, /function pauseGame\(\)[\s\S]*clearSpeech\(\)/);
  assert.match(app, /function resumeGame\(\)[\s\S]*renderListeningCards\(\)/);
  assert.doesNotMatch(app, /function resumeGame\(\)[\s\S]*resumeQuestionSequence\(\)/);
  assert.match(app, /function showPrimaryView[\s\S]*clearSpeech\(\)/);
  assert.match(app, /speakListeningWord\(true\)/);
  assert.match(app, /speakNewMiniGame\(card\.speech, ENGLISH_LANGUAGE, \{ explicit: true \}\)/);
  assert.match(app, /speech\.onVoicesChanged/);
  assert.match(css, /\.audio-setting-row select:focus-visible/);
  assert.match(css, /@media\(max-width:480px\)[^{]*\{[^}]*\.parent-dashboard/);
});

test("optional sound effects reuse one AudioContext, obey settings and can be stopped", () => {
  const oscillators = [];
  let contextCount = 0;
  class MockAudioContext {
    constructor() { contextCount += 1; this.currentTime = 0; this.state = "running"; this.destination = {}; }
    createOscillator() {
      const oscillator = { frequency: {}, stopCount: 0, connect() { return this; }, disconnect() {}, start() {}, stop() { this.stopCount += 1; } };
      oscillators.push(oscillator);
      return oscillator;
    }
    createGain() {
      return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() { return this; }, disconnect() {} };
    }
  }
  const settings = { soundEffectsEnabled: true, volume: "normal" };
  const window = { AudioContext: MockAudioContext, MilaUtils: { randomItem: values => values[0] } };
  vm.runInNewContext(audioSource, { window, console });
  const helper = new window.MilaAudioHelper(() => settings);
  helper.playButton();
  helper.playSuccess();
  assert.equal(contextCount, 1);
  assert.equal(oscillators.length, 4);
  helper.stopAll();
  assert.ok(oscillators.every(oscillator => oscillator.stopCount >= 1));
  settings.soundEffectsEnabled = false;
  helper.playCelebration();
  assert.equal(oscillators.length, 4);
});

test("browser speech APIs remain confined to the central service", () => {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const javascriptFiles = fs.readdirSync(path.join(root, "js"), { recursive: true })
    .filter(file => file.endsWith(".js") && path.basename(file) !== "SpeechService.js");
  assert.doesNotMatch(app, /window\.speechSynthesis|new SpeechSynthesisUtterance/);
  javascriptFiles.forEach(file => {
    const source = fs.readFileSync(path.join(root, "js", file), "utf8");
    assert.doesNotMatch(source, /window\.speechSynthesis|new SpeechSynthesisUtterance/, file);
  });
});
