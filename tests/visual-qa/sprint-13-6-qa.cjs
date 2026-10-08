// Browser-only QA: existing local Edge/Playwright runtime, no application dependency.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.clock.install({ time: new Date('2026-10-06T12:00:00Z') });
    await page.clock.pauseAt(new Date('2026-10-06T12:00:01Z'));
    await page.addInitScript(() => {
      window.qaSpeech = { active: null, spoken: [], overlaps: 0 };
      window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
      Object.defineProperty(window, 'speechSynthesis', { value: {
        getVoices: () => [{ name: 'Turkish', lang: 'tr-TR' }, { name: 'English', lang: 'en-US' }],
        addEventListener() {}, cancel() { qaSpeech.active = null; },
        speak(u) { if (qaSpeech.active) qaSpeech.overlaps++; qaSpeech.active = u; qaSpeech.spoken.push({ text: u.text, lang: u.lang }); }
      } });
    });
    await page.goto(pathToFileURL(path.resolve(__dirname, '../../index.html')).href);
    await page.waitForFunction(() => document.documentElement.classList.contains('app-ready'));
    await page.evaluate(() => { selectPlayer('Mila'); speech.setSettings({ soundEffectsEnabled: false }); });
    const drain = async () => {
      for (let i = 0; i < 12; i++) {
        await page.evaluate(() => { const u = qaSpeech.active; qaSpeech.active = null; u?.onend?.(); });
        await page.clock.runFor(200);
        if (await page.evaluate(() => !qaSpeech.active && !newMiniGameState.mathNarrating && !isStartingGame)) return;
      }
      throw new Error('Math speech did not settle');
    };
    const start = async mode => {
      await page.evaluate(() => goHome(false, 'mini-games'));
      await page.locator(`[data-math-mini-mode="${mode}"]`).click();
      await page.waitForFunction(mode => isNewMiniGameActive && newMiniGameState.mode === mode && !!newMiniGameState.challenge, mode);
    };
    const settle = async () => {
      await drain();
      if (await page.evaluate(() => newMiniGameState.mode === MATH_ADDITION_MODE && newMiniGameState.mathPhase === 'ready')) await page.locator('.math-mini-combine').click();
      await page.clock.runFor(1500);
      await drain();
      assert.equal(await page.evaluate(() => [...ui.newMiniGameChoices.children].every(b => !b.disabled)), true);
    };
    const advance = async () => {
      const round = await page.evaluate(() => newMiniGameState.round);
      for (let i = 0; i < 15; i++) {
        await page.clock.runFor(250);
        if (await page.evaluate(round => newMiniGameState.round !== round || newMiniGameState.completed, round)) return;
      }
      throw new Error('Reward/round transition did not complete');
    };
    const layout = async label => {
      await page.evaluate(() => document.getAnimations().forEach(a => { if (a.effect.getTiming().iterations !== Infinity) a.finish(); }));
      await page.evaluate(() => Promise.all([...ui.newMiniGameVisual.querySelectorAll('img')].map(img => img.decode())));
      const result = await page.evaluate(() => {
        const rect = el => el.getBoundingClientRect();
        const overlaps = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
        const cards = [...ui.newMiniGameChoices.children];
        const images = [...ui.newMiniGameVisual.querySelectorAll('.math-mini-object')].filter(el => getComputedStyle(el).visibility !== 'hidden');
        const feedback = rect(ui.newMiniGameFeedback);
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          overlap: images.some((image, i) => images.slice(i + 1).some(other => overlaps(rect(image), rect(other)))),
          feedback: cards.some(card => overlaps(rect(card), feedback)),
          touch: cards.every(card => rect(card).width >= 44 && rect(card).height >= 44),
          imageSize: images.every(image => rect(image).width >= 32 && rect(image).height >= 32),
          containment: images.every(image => { const a = rect(image), b = rect(ui.newMiniGameVisual); return a.left >= b.left && a.right <= b.right && a.top >= b.top && a.bottom <= b.bottom; })
        };
      });
      assert.deepEqual(result, { overflow: false, overlap: false, feedback: false, touch: true, imageSize: true, containment: true }, label);
    };
    for (const [width, height] of [[360, 800], [412, 915], [768, 1024], [1440, 900]]) {
      await page.setViewportSize({ width, height });
      for (const mode of ['math-addition', 'math-subtraction', 'math-missing']) {
        await start(mode);
        if (width === 360) await page.screenshot({ path: path.join(os.tmpdir(), `sprint-13-6-start-${mode}.png`), fullPage: true });
        // Early taps cannot score while the initial narration/action is in progress.
        await page.evaluate(() => { answerMathMiniRound(newMiniGameState.challenge.answer); answerMathMiniRound(newMiniGameState.challenge.answer); });
        assert.equal(await page.evaluate(() => newMiniGameState.correct), 0);
        await settle(); await layout(`${width} ${mode} first round`);
        const key = await page.evaluate(() => newMiniGameState.challenge.key);
        await page.evaluate(() => { narrateMathMiniRound(true); narrateMathMiniRound(true); narrateMathMiniRound(true); });
        await drain();
        assert.equal(await page.evaluate(() => newMiniGameState.challenge.key), key);
        await page.evaluate(() => answerMathMiniRound(newMiniGameState.challenge.choices.find(n => n !== newMiniGameState.challenge.answer)));
        await drain(); await layout(`${width} ${mode} retry`);
        assert.equal(await page.evaluate(() => newMiniGameState.correct), 0);
        for (let round = 1; round <= 5; round++) {
          await settle();
          await page.evaluate(() => { const n = newMiniGameState.challenge.answer; answerMathMiniRound(n); answerMathMiniRound(n); });
          assert.equal(await page.evaluate(() => newMiniGameState.correct), round);
          await layout(`${width} ${mode} correct`);
          if (round === 1) await page.screenshot({ path: path.join(os.tmpdir(), `sprint-13-6-${width}-${mode}.png`), fullPage: true });
          if (round === 5) {
            await page.clock.runFor(1000);
            assert.equal(await page.evaluate(() => newMiniGameState.completed), false);
            await page.clock.runFor(250);
            if (!await page.evaluate(() => newMiniGameState.completed)) await advance();
          } else await advance();
        }
        assert.equal(await page.evaluate(() => newMiniGameState.completed && !ui.newMiniGameCompletion.classList.contains('hidden')), true);
        await page.clock.runFor(5000);
        assert.equal(await page.evaluate(() => !ui.newMiniGame.classList.contains('hidden')), true, 'completion remains until explicit navigation');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        await page.screenshot({ path: path.join(os.tmpdir(), `sprint-13-6-completion-${width}.png`), fullPage: true });
        await page.locator('#new-mini-game-replay-button').click();
        assert.equal(await page.evaluate(() => newMiniGameState.round === 1 && newMiniGameState.correct === 0), true);
      }
      // Every quantity, including 8 and 10, retains countable separated objects.
      await settle();
      for (let n = 1; n <= 10; n++) {
        await page.evaluate(n => {
          const c = newMiniGameState.challenge;
          c.mode = MATH_SUBTRACTION_MODE; c.first = n; c.second = 1; c.result = n - 1;
          newMiniGameState.mathPhase = 'ready'; newMiniGameState.mathPendingResult = undefined;
          renderMathMiniVisual();
        }, n);
        await layout(`${width} ${n} objects`);
        assert.equal(await page.locator('.math-mini-object').count(), n);
      }
      console.log(`${width}x${height}: all three five-round sessions, retries, duplicate taps, replay, completion and quantities 1–10 passed`);
    }
    // Pause during removal preserves its timer and current problem.
    await start('math-subtraction'); await page.clock.runFor(650);
    const before = await page.evaluate(() => newMiniGameState.challenge.key);
    await page.evaluate(() => pauseGame()); await page.clock.runFor(5000);
    assert.equal(await page.evaluate(() => newMiniGameState.mathPhase), 'moving');
    await page.evaluate(() => resumeGame()); await settle();
    assert.equal(await page.evaluate(() => newMiniGameState.challenge.key), before);
    // Pause during retry and correct feedback also recovers cleanly.
    await page.evaluate(() => answerMathMiniRound(newMiniGameState.challenge.choices.find(n => n !== newMiniGameState.challenge.answer)));
    await page.evaluate(() => pauseGame()); await page.evaluate(() => resumeGame()); await settle();
    await page.evaluate(() => answerMathMiniRound(newMiniGameState.challenge.answer));
    await page.evaluate(() => pauseGame()); await page.clock.runFor(5000);
    assert.equal(await page.evaluate(() => newMiniGameState.round), 1);
    await page.evaluate(() => resumeGame()); await page.clock.runFor(1250); await settle();
    assert.equal(await page.evaluate(() => newMiniGameState.round), 2);
    await page.evaluate(() => { goHome(false, 'mini-games'); }); await page.clock.runFor(5000);
    assert.equal(await page.evaluate(() => newMiniGameState.pendingDelay), undefined);
    assert.equal(await page.evaluate(() => qaSpeech.active), null);
    for (const player of ['Mila', 'adaniakadmin']) for (const mode of ['math-addition', 'math-subtraction', 'math-missing']) {
      await page.evaluate(player => selectPlayer(player), player); await start(mode); await settle();
      assert.equal(await page.evaluate(() => newMiniGameState.mode), mode);
    }
    assert.equal(await page.evaluate(() => qaSpeech.overlaps), 0);
    assert.equal(await page.evaluate(() => qaSpeech.spoken.every(u => u.lang === 'tr-TR')), true);
    console.log('Turkish narration ownership, Pause/Resume, navigation cleanup, normal and QA access passed');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
