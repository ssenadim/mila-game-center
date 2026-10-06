// Run with NODE_PATH pointing to the available Playwright runtime. No app dependency.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.resolve(__dirname, '../../index.html')).href);
    await page.waitForFunction(() => document.documentElement.classList.contains('app-ready'));
    for (const [width, height] of [[360, 800], [412, 915], [768, 1024], [1440, 900]]) {
      await page.setViewportSize({ width, height });
      for (const scenario of ['sequence', 'numeric', 'visual', 'shadow', 'treasure']) {
        for (const status of ['success', 'try-again']) {
          await page.evaluate(({ scenario, status }) => {
            document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
            ui.mascot.classList.remove('hidden');
            let screen, feedback;
            if (scenario === 'shadow') {
              screen = ui.newMiniGame;
              ui.newMiniGameSetup.classList.add('hidden');
              ui.newMiniGameCompletion.classList.add('hidden');
              ui.newMiniGameArea.classList.remove('hidden');
              ui.newMiniGamePrompt.textContent = 'Gölgeyi bul.';
              ui.newMiniGameVisual.innerHTML = '<img class="shadow-source" src="assets/illustrations/objects/object-cat.svg" alt="Kedi">';
              ui.newMiniGameChoices.innerHTML = Array.from({ length: 4 }, () => '<button class="new-mini-game-choice shadow-choice"><img src="assets/illustrations/objects/object-cat.svg" alt="Gölge"></button>').join('');
              feedback = ui.newMiniGameFeedback;
            } else if (scenario === 'treasure') {
              screen = ui.bonus;
              ui.balloons.className = 'bonus-activity';
              ui.balloons.dataset.bonus = 'treasure';
              activeBonusState = { bonusId: 'treasure' };
              renderManagedBonus();
              feedback = ui.bonusFeedback;
            } else {
              screen = ui.quiz;
              const category = scenario === 'sequence' ? 'NumberOrder' : 'BigSmall';
              renderQuestionVisual({ category, visual: scenario === 'sequence' ? '18 → 19 → ?' : scenario === 'numeric' ? '4   10' : '🐘   🐭' });
              ui.prompt.textContent = scenario === 'sequence' ? 'Sıradaki sayıyı bul.' : 'Hangisi daha büyük?';
              ui.answers.innerHTML = '<button class="answer-button">Bir</button><button class="answer-button">İki</button>';
              feedback = ui.feedback;
            }
            screen.classList.remove('hidden');
            feedback.textContent = status === 'success' ? 'Muhteşem! Harika gidiyorsun!' : 'Çok yaklaştın, bir daha dene.';
            feedback.classList.remove('success', 'try-again');
            feedback.classList.add(status);
            const answer = screen.querySelector('.answer-button,.new-mini-game-choice');
            if (answer) answer.classList.add(status === 'success' ? 'correct' : 'try-again-choice');
          }, { scenario, status });
          await page.evaluate(() => {
            document.getAnimations().forEach(animation => {
              if (animation.effect.getTiming().iterations !== Infinity) animation.finish();
            });
          });
          const result = await page.evaluate(() => {
            const screen = document.querySelector('.screen:not(.hidden)');
            const feedback = screen.querySelector('.feedback,.matching-feedback,.bonus-feedback');
            const rect = element => element.getBoundingClientRect();
            const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
            const cards = [...screen.querySelectorAll('.answer-button,.new-mini-game-choice,.bonus-choice')];
            const f = rect(feedback);
            const textRange = document.createRange();
            textRange.selectNodeContents(feedback);
            const feedbackText = textRange.getBoundingClientRect();
            const mascot = document.querySelector('.game-mascot');
            const row = screen.querySelector('.question-visual-row');
            const prompt = screen.querySelector('.question-prompt');
            return {
              overflow: document.documentElement.scrollWidth > innerWidth,
              cardOverlap: cards.some(card => overlaps(rect(card), f)),
              touch: cards.every(card => rect(card).width >= 44 && rect(card).height >= 44),
              mascotOverlap: getComputedStyle(mascot).display !== 'none' && overlaps(rect(mascot), feedbackText),
              rowOverlap: Boolean(row && overlaps(rect(row), rect(prompt))),
              rowOverflow: Boolean(row && row.scrollWidth > row.clientWidth),
              treasureCount: screen.querySelectorAll('.treasure-choice').length
            };
          });
          assert.equal(result.overflow, false, `${width} ${scenario}: horizontal overflow`);
          assert.equal(result.cardOverlap, false, `${width} ${scenario}: feedback overlaps cards`);
          assert.equal(result.mascotOverlap, false, `${width} ${scenario}: mascot overlaps feedback`);
          assert.equal(result.rowOverlap, false);
          assert.equal(result.rowOverflow, false);
          assert.equal(result.touch, true);
          if (scenario === 'treasure') assert.equal(result.treasureCount, 4);
          if (process.env.QA_SCREENSHOTS && status === 'success') {
            await page.screenshot({ path: path.join(require('node:os').tmpdir(), `sprint-13-1-${width}-${scenario}.png`), fullPage: true });
          }
        }
      }
      console.log(`${width}x${height}: all five scenarios, both feedback states passed`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
