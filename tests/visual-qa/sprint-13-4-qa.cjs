// Run with NODE_PATH pointing to the available Playwright runtime.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '../..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png' };

(async () => {
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) { response.writeHead(403); response.end(); return; }
    fs.readFile(file, (error, data) => {
      response.writeHead(error ? 404 : 200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      response.end(error ? '' : data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 360, height: 900 } });
    await page.addInitScript(() => {
      window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
      Object.defineProperty(window, 'speechSynthesis', { value: {
        getVoices: () => [{ lang: 'tr-TR', name: 'Turkish' }, { lang: 'en-US', name: 'English' }],
        addEventListener() {}, cancel() {}, speak(u) { queueMicrotask(() => u.onend?.()); }
      } });
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.waitForFunction(() => document.documentElement.classList.contains('app-ready'));
    await page.evaluate(() => {
      selectPlayer('Mila');
      speech.setSettings({ speechEnabled: false, soundEffectsEnabled: false });
      const progress = loadLearningPathProgress();
      progress.completed[learningPathModel.STAGES[0].id] = true;
      saveLearningPathProgress(progress);
    });
    const child = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(key => key.endsWith('-Mila')).map(key => [key, localStorage.getItem(key)])));
    assert.equal(await page.evaluate(() => learningPathModel.canLaunchStage(learningPathModel.STAGES.at(-1).id, loadLearningPathProgress())), false);

    // Exercise the QA name through ordinary custom-name validation, one character at a time.
    await page.evaluate(() => { goHome(false, 'players'); selectCustomPlayer(); });
    await page.locator('#custom-player-name').pressSequentially('adaniakadmin');
    assert.equal(await page.evaluate(() => selectedPlayer), 'adaniakadmin');
    assert.equal(await page.evaluate(() => isQaProfile()), true);
    assert.equal(await page.evaluate(() => Object.keys(loadLearningPathProgress().completed).length), 0);
    const stages = await page.evaluate(() => learningPathModel.STAGES.map(stage => ({ id: stage.id, groupId: stage.groupId, title: stage.title })));
    for (const stage of stages) {
      await page.evaluate(stage => {
        goHome(false); openLearningPath(); activeLearningPathGroupId = stage.groupId; renderLearningPath();
        const button = ui.learningPathStages.querySelector(`[data-learning-path-stage="${stage.id}"]`);
        if (!button || button.disabled) throw new Error(`Locked QA stage: ${stage.id}`);
        button.click();
      }, stage);
      await page.waitForFunction(id => activeLearningPathStage?.id === id && !isStartingGame, stage.id);
    }
    const games = await page.evaluate(() => MINI_GAME_MODES.slice());
    for (const mode of games) {
      await page.evaluate(mode => { goHome(false); launchMiniGame(mode); }, mode);
      await page.waitForFunction(() => !isStartingGame);
      assert.equal(await page.evaluate(() => document.querySelectorAll('.screen:not(.hidden)').length), 1);
      const difficulty = await page.evaluate(mode => {
        const registry = mode === SHADOW_MODE ? newMiniGames.SHADOW_DIFFICULTIES
          : mode === SOUND_MEMORY_MODE ? newMiniGames.SOUND_DIFFICULTIES
          : mode === PUZZLE_MODE ? newMiniGames.PUZZLE_DIFFICULTIES : undefined;
        if (!registry) return undefined;
        const options = [...ui.newMiniGameSetup.querySelectorAll('.setup-options')].at(-1);
        const buttons = [...options.querySelectorAll('button')];
        const result = { expected: Object.keys(registry).length, count: buttons.length, enabled: buttons.every(button => !button.disabled) };
        buttons.at(-1).click();
        ui.newMiniGameSetup.querySelector('.primary-button').click();
        return result;
      }, mode);
      if (difficulty) { assert.equal(difficulty.count, difficulty.expected); assert.equal(difficulty.enabled, true); }
    }
    // Play real QA questions and persist only their genuine result.
    await page.evaluate(() => { goHome(false); activeGameMode = 'quick'; void startGame({ skipWelcome: true }); });
    await page.waitForFunction(() => currentQuestion && !isSpeaking && !isStartingGame);
    await page.evaluate(() => [...ui.answers.children].find(button => button.textContent === currentQuestion.correct).click());
    await page.waitForFunction(() => correctAnswers === 1);
    await page.evaluate(() => { goHome(false); startLearningPathStage('count-objects'); });
    await page.waitForFunction(() => isNumberLearningActive && !numberLearningState.speaking);
    await page.evaluate(() => ui.numberLearningAnswers.querySelector(`[data-number-value="${numberLearningState.round.correct}"]`).click());
    await page.waitForFunction(() => correctAnswers === 1);
    await page.evaluate(() => { goHome(false); launchMiniGame('number-match'); });
    await page.waitForFunction(() => isNumberMatchGameActive && !isNumberMatchSpeaking);
    await page.evaluate(() => ui.numberMatchCards.children[numberMatchAnswers.indexOf(currentNumberMatchQuestion)].click());
    await page.evaluate(() => goHome(false));
    assert.deepEqual(await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(key => key.endsWith('-Mila')).map(key => [key, localStorage.getItem(key)]))), child);
    assert.equal(await page.evaluate(() => Object.keys(loadLearningPathProgress().completed).length), 0, 'playing partial stages does not fake completion');
    assert.ok(await page.evaluate(() => localStorage.getItem(getPlayerStorageKey(PARENT_DATA_STORAGE_KEY))), 'QA statistics use QA storage');
    assert.equal(await page.evaluate(() => localStorage.getItem(getPlayerStorageKey(LEARNING_PATH_PROGRESS_STORAGE_KEY))?.includes('qaProfileAccess') ?? false), false);

    await page.evaluate(() => selectPlayer('Mila'));
    assert.equal(await page.evaluate(() => learningPathModel.canLaunchStage(learningPathModel.STAGES.at(-1).id, loadLearningPathProgress())), false);
    await page.evaluate(() => selectPlayer('adaniakadmin'));
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await page.waitForFunction(() => document.documentElement.classList.contains('app-ready'));
    assert.equal(await page.evaluate(() => isQaProfile()), true);
    assert.equal(await page.evaluate(() => learningPathModel.STAGES.every(stage => learningPathModel.canLaunchStage(stage.id, loadLearningPathProgress()))), true);
    assert.equal(await page.evaluate(() => Object.keys(loadLearningPathProgress().completed).length), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    for (const name of ['adaniak-admin', 'adaniak', 'admin', 'adaniakadmin2', 'adaniak admin', 'mila', 'ADANIAKADMIN']) assert.equal(await page.evaluate(name => isQaProfile(name), name), false);
    console.log(`QA: ${stages.length} stage launches, ${games.length} mini-games, real answers, child data isolation, typed profile and PWA reload passed`);
    console.log(stages.map(stage => stage.title).join('; '));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
