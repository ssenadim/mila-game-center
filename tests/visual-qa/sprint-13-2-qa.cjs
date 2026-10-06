// Run with NODE_PATH pointing to the available Playwright runtime.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    for (const [width, height] of [[360, 800], [412, 915], [768, 1024], [1440, 900]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      await page.clock.install({ time: new Date('2026-10-06T12:00:00Z') });
      await page.clock.pauseAt(new Date('2026-10-06T12:00:01Z'));
      await page.addInitScript(() => {
        window.qaSpeech = { active: null, spoken: [], overlaps: 0 };
        window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
        Object.defineProperty(window, 'speechSynthesis', { value: {
          getVoices: () => [{ name: 'QA Turkish', lang: 'tr-TR', localService: true }, { name: 'QA English', lang: 'en-US', localService: true }],
          addEventListener() {}, removeEventListener() {},
          cancel() { window.qaSpeech.active = null; },
          speak(utterance) {
            if (window.qaSpeech.active) window.qaSpeech.overlaps++;
            window.qaSpeech.active = utterance;
            window.qaSpeech.spoken.push(utterance.text);
          }
        } });
      });
      await page.goto(pathToFileURL(path.resolve(__dirname, '../../index.html')).href);
      await page.waitForFunction(() => document.documentElement.classList.contains('app-ready'));
      // The virtual browser clock does not advance Web Audio's hardware clock.
      // Oscillator completion is tested separately in game-flow.test.js.
      await page.evaluate(() => speech.setSettings({ soundEffectsEnabled: false }));
      const finishSpeech = () => page.evaluate(() => {
        const utterance = qaSpeech.active;
        qaSpeech.active = null;
        utterance?.onend?.();
      });
      const drain = async () => {
        for (let i = 0; i < 12; i++) {
          await finishSpeech();
          await page.clock.runFor(1000);
          if (await page.evaluate(() => !qaSpeech.active && !isSpeaking && !isNumberMatchSpeaking && !isColorMatchSpeaking)) return;
        }
        throw new Error('Speech did not settle');
      };
      for (const mode of ['learning', 'quick']) {
        await page.evaluate(mode => {
          goHome(false);
          selectedPlayer = 'QA'; activeGameMode = mode;
          void startGame();
        }, mode);
        await page.waitForFunction(() => isWelcomeSequenceActive && qaSpeech.active);
        const first = await page.evaluate(() => ({ id: currentQuestionInstanceId, question: currentQuestion.id, number: questionNumber, answers: currentAnswers.slice() }));
        assert.equal(first.number, 1);
        assert.ok(first.answers.length >= 2);
        assert.equal(await page.evaluate(() => [...ui.answers.children].every(button => button.disabled)), true);
        if (process.env.QA_SCREENSHOTS && width === 360 && mode === 'learning') {
          await page.evaluate(() => document.getAnimations().forEach(animation => {
            if (animation.effect.getTiming().iterations !== Infinity) animation.finish();
          }));
          await page.screenshot({ path: path.join(require('node:os').tmpdir(), 'sprint-13-2-welcome.png'), fullPage: true });
        }
        await page.evaluate(() => ui.answers.firstElementChild.click());
        assert.equal(await page.evaluate(() => correctAnswers), 0);
        await drain();
        assert.deepEqual(await page.evaluate(() => ({ id: currentQuestionInstanceId, question: currentQuestion.id, number: questionNumber, answers: currentAnswers.slice() })), first);
        assert.equal(await page.evaluate(() => [...ui.answers.children].every(button => !button.disabled)), true);
      }
      // Pausing the welcome must retain the prepared question.
      await page.evaluate(() => { goHome(false); void startGame(); });
      await page.waitForFunction(() => isWelcomeSequenceActive && qaSpeech.active);
      const pausedId = await page.evaluate(() => { const id = currentQuestionInstanceId; pauseGame(); resumeGame(); return id; });
      await drain();
      assert.equal(await page.evaluate(() => currentQuestionInstanceId), pausedId);

      for (const mode of ['number-match', 'color-match']) {
        await page.evaluate(mode => { goHome(false); launchMiniGame(mode); }, mode);
        await page.waitForFunction(() => isNumberMatchGameActive || isColorMatchGameActive);
        let rounds = 0;
        while (await page.evaluate(mode => mode === 'number-match' ? isNumberMatchGameActive : isColorMatchGameActive, mode)) {
          await finishSpeech();
          await page.evaluate(mode => {
            const index = mode === 'number-match' ? numberMatchAnswers.indexOf(currentNumberMatchQuestion) : colorMatchAnswers.indexOf(currentColorMatchQuestion);
            const cards = mode === 'number-match' ? ui.numberMatchCards : ui.colorMatchCards;
            cards.children[index].click();
          }, mode);
          await page.clock.runFor(800);
          if (++rounds > 20) throw new Error('Round did not progress');
        }
        assert.ok(rounds >= 8);
        assert.equal(await page.evaluate(() => Boolean(qaSpeech.active)), true, 'completion speech is active');
        await page.clock.runFor(5000);
        await page.evaluate(() => document.getAnimations().forEach(animation => {
          if (animation.effect.getTiming().iterations !== Infinity) animation.finish();
        }));
        assert.equal(await page.evaluate(mode => !(mode === 'number-match' ? ui.numberMatch : ui.colorMatch).classList.contains('hidden'), mode), true, 'long completion speech retains screen');
        await finishSpeech();
        await page.clock.runFor(299);
        assert.equal(await page.evaluate(() => ui.welcome.classList.contains('hidden')), true);
        await page.clock.runFor(1);
        assert.equal(await page.evaluate(() => ui.welcome.classList.contains('hidden')), false);
        await finishSpeech();
      }
      // Exit during completion, immediately start another game, then release old time.
      await page.evaluate(() => { goHome(false); launchMiniGame('number-match'); });
      await page.waitForFunction(() => isNumberMatchGameActive);
      await page.evaluate(() => finishNumberMatchGame());
      await page.evaluate(() => { goHome(false); activeGameMode = 'quick'; void startGame(); });
      await page.waitForFunction(() => isWelcomeSequenceActive);
      const newId = await page.evaluate(() => currentQuestionInstanceId);
      await drain();
      await page.clock.runFor(10000);
      assert.equal(await page.evaluate(() => currentQuestionInstanceId), newId);
      assert.equal(await page.evaluate(() => qaSpeech.overlaps), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.evaluate(() => { goHome(false); void startGame(); });
      await page.waitForFunction(() => isWelcomeSequenceActive && qaSpeech.active);
      await page.evaluate(() => { window.qaLateWelcome = qaSpeech.active; goHome(false); });
      await page.waitForFunction(() => !isStartingGame);
      await page.evaluate(() => { void startGame(); });
      await page.waitForFunction(() => isWelcomeSequenceActive && qaSpeech.active);
      const freshId = await page.evaluate(() => { qaLateWelcome.onend?.(); return currentQuestionInstanceId; });
      await drain();
      assert.equal(await page.evaluate(() => currentQuestionInstanceId), freshId);
      await page.evaluate(() => { goHome(false); speech.setSettings({ speechEnabled: false }); void startGame(); });
      await page.waitForFunction(() => !isStartingGame && !isWelcomeSequenceActive && !isSpeaking && currentQuestion);
      assert.equal(await page.evaluate(() => questionNumber), 1);
      assert.equal(await page.evaluate(() => [...ui.answers.children].every(button => !button.disabled)), true);
      console.log(`${width}x${height}: welcome identity/options, pause, both complete sessions, audio ownership and rapid navigation passed`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
