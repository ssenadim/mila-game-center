const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '../..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
const objects = require('../../js/EducationalObjects.js');
const mini = require('../../js/NewMiniGames.js');
const coreIds = [...new Set([...mini.MATH_OBJECT_IDS, 'seahorse', 'strawberry', 'tree', 'broccoli', ...mini.SOUND_MEMORY_ITEMS.map(item => objects.getByEnglish(item.speech)?.id).filter(Boolean)])];
(async () => {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (error, data) => {
      res.writeHead(error ? 404 : 200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      res.end(error ? '' : data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 412, height: 915 } });
    await context.addInitScript(() => {
      window.qaSpeech = { active: null };
      window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
      Object.defineProperty(window, 'speechSynthesis', { value: {
        getVoices: () => [{ name: 'Turkish', lang: 'tr-TR' }, { name: 'English', lang: 'en-US' }],
        addEventListener() {}, cancel() { qaSpeech.active = null; }, speak(u) { qaSpeech.active = u; }
      } });
    });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.waitForFunction(() => document.documentElement.classList.contains('app-ready'));
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload(); await page.waitForFunction(() => !!navigator.serviceWorker.controller && document.documentElement.classList.contains('app-ready'));
    // A non-core object remains cached on first use rather than added to the shell.
    await page.evaluate(async src => { const img = new Image(); img.src = src; await img.decode(); }, objects.get('orange').src);
    await context.setOffline(true);
    await page.reload(); await page.waitForFunction(() => document.documentElement.classList.contains('app-ready'));
    const results = await page.evaluate(async items => {
      const results = [];
      for (const item of items) {
        const img = new Image(); img.src = item.src;
        try { await img.decode(); results.push({ id: item.id, loaded: true }); }
        catch { results.push({ id: item.id, loaded: false }); }
      }
      return results;
    }, coreIds.map(id => objects.get(id)));
    console.log('Fresh-install offline core assets:', JSON.stringify(results));
    assert.ok(results.every(item => item.loaded), 'all math/target/revealed-memory SVGs must work before any game warmup');
    await page.evaluate(async src => { const img = new Image(); img.src = src; await img.decode(); }, objects.get('orange').src);
    assert.equal(await page.evaluate(() => document.querySelector('[data-menu-target="home"]').textContent.includes('🏠')), true);
    await context.setOffline(false);
    await page.clock.install({ time: new Date('2026-10-08T12:00:00Z') });
    await page.clock.pauseAt(new Date('2026-10-08T12:00:01Z'));
    await page.evaluate(() => { selectPlayer('adaniakadmin'); speech.setSettings({ soundEffectsEnabled: false }); });
    const drain = async () => {
      for (let i = 0; i < 12; i++) {
        await page.evaluate(() => { const u = qaSpeech.active; qaSpeech.active = null; u?.onend?.(); });
        await page.clock.runFor(200);
        if (await page.evaluate(() => !qaSpeech.active && !newMiniGameState.speaking && !newMiniGameState.mathNarrating)) return;
      }
      throw new Error('Speech did not settle');
    };
    for (const mode of ['shadow', 'missing-item', 'initial-letter']) for (const correct of [true, false]) {
      await page.evaluate(mode => { goHome(false); launchMiniGame(mode); }, mode);
      await page.waitForFunction(mode => isNewMiniGameActive && newMiniGameState.mode === mode, mode);
      if (mode === 'shadow') await page.evaluate(() => startShadowSession());
      await drain();
      if (mode === 'missing-item') { await page.clock.runFor(3000); await drain(); }
      await page.evaluate(({ mode, correct }) => {
        const c = newMiniGameState.challenge;
        if (mode === 'shadow') void chooseShadow(correct ? c.source.id : c.choices.find(item => item.id !== c.source.id).id);
        else if (mode === 'missing-item') void chooseMissingItem(correct ? c.missing.id : c.choices.find(item => item.id !== c.missing.id).id);
        else void chooseInitialLetter(correct ? c.word.letter : c.choices.find(letter => letter !== c.word.letter));
        ui.newMiniGameHome.click();
        startNewMiniGame(MATH_ADDITION_MODE);
      }, { mode, correct });
      await drain(); await page.clock.runFor(1000);
      assert.equal(await page.evaluate(() => newMiniGameState.mode), 'math-addition');
      assert.equal(await page.evaluate(() => newMiniGameState.round), 1);
      assert.equal(await page.evaluate(() => newMiniGameState.pendingDelay), undefined);
      assert.equal(await page.locator('.math-mini-combine').count(), 1);
    }
    // Correct feedback cancelled by Pause must resume exactly one transition.
    await page.evaluate(() => { goHome(false); startNewMiniGame(SHADOW_MODE); startShadowSession(); }); await drain();
    await page.evaluate(() => { void chooseShadow(newMiniGameState.challenge.source.id); pauseGame(); });
    await page.clock.runFor(100);
    assert.equal(await page.evaluate(() => newMiniGameState.pendingDelay?.timer), undefined);
    await page.evaluate(() => resumeGame()); await page.clock.runFor(500); await drain();
    assert.equal(await page.evaluate(() => newMiniGameState.round), 2);
    await page.clock.runFor(1000); assert.equal(await page.evaluate(() => newMiniGameState.round), 2);
    await page.evaluate(() => { goHome(false); startNewMiniGame(SOUND_MEMORY_MODE); startSoundMemorySession(); });
    await page.evaluate(() => { void openSoundMemoryCard(0); pauseGame(); }); await page.clock.runFor(100);
    assert.equal(await page.evaluate(() => newMiniGameState.board[0].revealed), false);
    await page.evaluate(() => resumeGame());
    await page.evaluate(() => { void openSoundMemoryCard(0); }); await drain();
    assert.equal(await page.evaluate(() => newMiniGameState.firstCard), 0);
    const other = await page.evaluate(() => newMiniGameState.board.findIndex(card => card.targetId !== newMiniGameState.board[0].targetId));
    await page.evaluate(index => { void openSoundMemoryCard(index); pauseGame(); }, other); await page.clock.runFor(100);
    assert.equal(await page.evaluate(index => newMiniGameState.board[index].revealed, other), false);
    assert.equal(await page.evaluate(() => newMiniGameState.firstCard), 0);
    await page.evaluate(() => resumeGame());
    await page.evaluate(() => { const pair = newMiniGameState.board.findIndex((card, i) => i !== 0 && card.targetId === newMiniGameState.board[0].targetId); void openSoundMemoryCard(pair); }); await drain();
    assert.equal(await page.evaluate(() => newMiniGameState.board[0].matched && newMiniGameState.correct === 1 && newMiniGameState.attempts === 1), true);
    assert.deepEqual(errors, []);
    console.log('Six cancelled-feedback cross-game transitions and Pause/Resume single-advance passed');
    console.log('Memory Pause during first/second reveal recovers to a real match without extra attempts');
    await context.close();
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
