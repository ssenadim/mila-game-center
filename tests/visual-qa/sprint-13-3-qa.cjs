// Run with NODE_PATH pointing to the available Playwright runtime.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    for (const width of [360, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.clock.install({ time: new Date('2026-10-06T12:00:00Z') });
      await page.clock.pauseAt(new Date('2026-10-06T12:00:01Z'));
      await page.addInitScript(() => {
        window.qaSpeech = { active: null, spoken: [], overlaps: 0 };
        window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
        Object.defineProperty(window, 'speechSynthesis', { value: {
          getVoices: () => [{ name: 'Turkish', lang: 'tr-TR' }, { name: 'English', lang: 'en-US' }],
          addEventListener() {}, cancel() { qaSpeech.active = null; },
          speak(utterance) { if (qaSpeech.active) qaSpeech.overlaps++; qaSpeech.active = utterance; qaSpeech.spoken.push(utterance.text); }
        } });
      });
      await page.goto(pathToFileURL(path.resolve(__dirname, '../../index.html')).href);
      await page.waitForFunction(() => document.documentElement.classList.contains('app-ready'));
      await page.evaluate(() => { selectedPlayer = 'QA'; speech.setSettings({ soundEffectsEnabled: false }); });
      const finish = () => page.evaluate(() => { const u = qaSpeech.active; qaSpeech.active = null; u?.onend?.(); });
      const drain = async () => {
        for (let i = 0; i < 15; i++) {
          await finish(); await page.clock.runFor(1000);
          if (await page.evaluate(() => !qaSpeech.active && !isQuestionNarrationActive)) return;
        }
        throw new Error('Narration did not finish');
      };
      const start = async mode => {
        await page.evaluate(mode => { goHome(false); activeGameMode = mode; qaSpeech.spoken = []; void startGame({ skipWelcome: true }); }, mode);
        await page.waitForFunction(() => isQuestionNarrationActive && qaSpeech.active);
        return page.evaluate(() => ({ id: currentQuestionInstanceId, prompt: currentQuestion.questionPrompt ?? currentQuestion.prompt, answers: currentAnswers.slice() }));
      };
      const first = await start('learning');
      await finish(); await page.clock.runFor(800);
      assert.equal(await page.evaluate(() => ui.answers.querySelectorAll('.speaking-choice').length), 1);
      assert.equal(await page.evaluate(() => [...ui.answers.children].every(b => b.disabled)), true);
      if (process.env.QA_SCREENSHOTS && width === 360) {
        await page.evaluate(() => document.getAnimations().forEach(a => { if (a.effect.getTiming().iterations !== Infinity) a.finish(); }));
        await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'sprint-13-3-option.png'), fullPage: true });
      }
      await drain();
      assert.deepEqual(await page.evaluate(() => qaSpeech.spoken), [first.prompt, ...first.answers, first.prompt]);
      assert.equal(await page.evaluate(() => currentQuestionInstanceId), first.id);
      assert.equal(await page.evaluate(() => [...ui.answers.children].every(b => !b.disabled)), true);

      // Rapid Replay replaces the old sequence; only the final replay owns options.
      await page.evaluate(() => { void replayCurrentQuestion(); void replayCurrentQuestion(); void replayCurrentQuestion(); });
      const replayStart = await page.evaluate(() => qaSpeech.spoken.length - 1);
      await drain();
      assert.deepEqual(await page.evaluate(index => qaSpeech.spoken.slice(index), replayStart), [first.prompt, ...first.answers, first.prompt]);
      // Pause during an option removes its highlight and resumes the same question.
      await page.evaluate(() => { void replayCurrentQuestion(); });
      await finish(); await page.clock.runFor(800);
      await page.evaluate(() => pauseGame());
      assert.equal(await page.evaluate(() => ui.answers.querySelectorAll('.speaking-choice').length), 0);
      await page.evaluate(() => resumeGame());
      await drain();
      assert.equal(await page.evaluate(() => currentQuestionInstanceId), first.id);

      const quick = await start('quick'); await drain();
      assert.deepEqual(await page.evaluate(() => qaSpeech.spoken), [quick.prompt]);
      await page.evaluate(() => { void replayCurrentQuestion(); }); await drain();
      assert.deepEqual(await page.evaluate(() => qaSpeech.spoken), [quick.prompt, quick.prompt]);

      for (const destination of ['home', 'games']) {
        await start('learning'); await finish(); await page.clock.runFor(800);
        await page.evaluate(destination => {
          const stale = qaSpeech.active;
          goHome(false, destination);
          stale?.onend?.();
        }, destination);
        await page.clock.runFor(6000);
        assert.equal(await page.evaluate(() => qaSpeech.active), null);
        assert.equal(await page.evaluate(() => currentQuestion), undefined);
        assert.equal(await page.evaluate(() => ui.answers.querySelectorAll('.speaking-choice').length), 0);
      }

      await page.evaluate(() => { launchMiniGame('sound-memory'); });
      await page.waitForFunction(() => isNewMiniGameActive);
      await page.evaluate(() => startSoundMemorySession());
      const board = await page.evaluate(() => newMiniGameState.board.map(card => ({ id: card.id, targetId: card.targetId })));
      const choose = async index => { await page.evaluate(index => { void openSoundMemoryCard(index); }, index); await finish(); };
      const a = 0, b = board.findIndex(card => card.targetId !== board[a].targetId), pair = board.findIndex((card, index) => index !== a && card.targetId === board[a].targetId);
      await choose(a); await choose(b);
      assert.equal(await page.locator('.sound-card img').count(), 0);
      assert.equal(await page.evaluate(() => [...ui.newMiniGameChoices.children].some(b => /🍎|🐱|🐶|🐟|🦁|🌙|☀️|🚗/.test(b.textContent))), false);
      await page.clock.runFor(700);
      await choose(a); await choose(pair);
      const visual = await page.evaluate(() => {
        const card = newMiniGameState.board[0];
        return educationalObjectSystem.getByEnglish(card.speech)?.src || newMiniGames.SOUND_MEMORY_ITEMS.find(item => item.id === card.targetId).visual;
      });
      assert.equal(await page.evaluate(() => [...ui.newMiniGameChoices.children].filter(b => b.classList.contains('matched')).every(b => b.disabled)), true);
      assert.equal(await page.evaluate(visual => [...ui.newMiniGameChoices.children].filter(b => b.querySelector('img')?.getAttribute('src') === visual || b.textContent === visual).length, visual), 2);
      await page.clock.runFor(700);
      assert.equal(await page.evaluate(visual => [...ui.newMiniGameChoices.children].filter(b => b.querySelector('img')?.getAttribute('src') === visual || b.textContent === visual).length, visual), 2);
      for (const targetId of [...new Set(board.map(card => card.targetId))].filter(id => id !== board[a].targetId)) {
        for (const index of board.map((card, index) => card.targetId === targetId ? index : -1).filter(index => index >= 0)) await choose(index);
        await page.clock.runFor(700);
      }
      assert.equal(await page.evaluate(() => newMiniGameState.completed), true);
      assert.ok(await page.evaluate(() => ui.newMiniGameCompletion.querySelector('.new-mini-game-completion-icon').textContent.includes('🎉')));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await page.evaluate(() => qaSpeech.overlaps), 0);
      if (process.env.QA_SCREENSHOTS && width === 360) {
        await page.evaluate(() => document.getAnimations().forEach(a => { if (a.effect.getTiming().iterations !== Infinity) a.finish(); }));
        await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'sprint-13-3-memory.png'), fullPage: true });
      }
      console.log(`${width}px: narration order, highlights, rapid Replay, Pause/Resume, navigation and full Sound Memory reinforcement passed`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
