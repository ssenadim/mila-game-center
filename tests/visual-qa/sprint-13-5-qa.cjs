// Local vector gallery and browser regression checks; uses the available Playwright runtime.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { pathToFileURL } = require('node:url');
const objects = require('../../js/EducationalObjects.js').OBJECTS;
const root = path.resolve(__dirname, '../..');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
    await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
    for (let start = 0; start < objects.length; start += 28) {
      await page.evaluate(items => {
        document.body.innerHTML = '<main style="display:grid;grid-template-columns:repeat(7,1fr);gap:12px;padding:12px;background:#eee8fb">' + items.map(item => `<figure style="margin:0;padding:8px;background:#fffdf8;border-radius:18px"><img style="width:100%;height:135px;object-fit:contain" src="${item.src}" alt="${item.labelTr}"><figcaption style="text-align:center;font:14px system-ui">${item.id}</figcaption></figure>`).join('') + '</main>';
      }, objects.slice(start, start + 28));
      await page.locator('img').last().waitFor();
      await page.evaluate(() => Promise.all([...document.images].map(img => img.decode())));
      const output = path.join(os.tmpdir(), `sprint-13-5-gallery-${start}.png`);
      await page.locator('main').screenshot({ path: output });
      console.log(output);
    }
    await page.close();
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };
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
    const context = await browser.newContext();
    try {
      const game = await context.newPage();
      await game.goto(`http://127.0.0.1:${server.address().port}/`);
      await game.waitForFunction(() => document.documentElement.classList.contains('app-ready'));
      await game.evaluate(() => navigator.serviceWorker.ready);
      await game.reload();
      await game.waitForFunction(() => !!navigator.serviceWorker.controller);
      const render = async (scenario, status) => {
        await game.evaluate(({ scenario, status }) => {
          hideAllScreens();
          if (scenario === 'listening') {
            ui.listening.classList.remove('hidden');
            const words = ['Seahorse', 'Strawberry', 'Tree', 'Broccoli'];
            currentListeningQuestion = { category: 'ArtQA', correct: words[0] };
            words.forEach(word => engine.questions.push({ category: 'ArtQA', correct: word, illustrationSrc: educationalObjectSystem.getByEnglish(word).src }));
            listeningAnswers = words;
            isListeningSpeaking = false; isListeningTransitioning = false; isListeningRevealing = false;
            listeningWrongIndex = status === 'try-again' ? 1 : undefined;
            renderListeningCards();
            ui.listeningCards.children[0].classList.toggle('correct', status === 'success');
            ui.listeningFeedback.textContent = status === 'success' ? 'Muhteşem! Harika gidiyorsun!' : 'Bir daha dene.';
            ui.listeningFeedback.className = `matching-feedback ${status}`;
          } else {
            ui.newMiniGame.classList.remove('hidden');
            ui.newMiniGameSetup.classList.add('hidden'); ui.newMiniGameCompletion.classList.add('hidden');
            ui.newMiniGameArea.classList.remove('hidden');
            ui.newMiniGameVisual.classList.remove('hidden');
            ui.newMiniGameVisual.innerHTML = '<img class="shadow-source" src="' + educationalObjectSystem.get('strawberry').src + '" alt="Çilek">';
            ui.newMiniGameChoices.className = 'new-mini-game-choices';
            ui.newMiniGameChoices.textContent = '';
            ['strawberry', 'tree', 'broccoli', 'seahorse'].forEach(id => addNewMiniGameChoice({ illustrationSrc: educationalObjectSystem.get(id).src, label: '', className: 'shadow-choice', onClick() {} }));
            ui.newMiniGameFeedback.textContent = status === 'success' ? 'Muhteşem! Harika gidiyorsun!' : 'Bir daha dene.';
            ui.newMiniGameFeedback.className = `matching-feedback ${status}`;
          }
          document.getAnimations().forEach(a => { if (a.effect.getTiming().iterations !== Infinity) a.finish(); });
        }, { scenario, status });
        await game.evaluate(() => Promise.all([...document.querySelectorAll('.screen:not(.hidden) .listening-card img,.screen:not(.hidden) .shadow-choice img,.screen:not(.hidden) .shadow-source')].map(img => img.decode())));
      };
      for (const [width, height] of [[360, 800], [412, 915], [768, 1024], [1440, 900]]) {
        await game.setViewportSize({ width, height });
        for (const scenario of ['listening', 'shadow']) for (const status of ['success', 'try-again']) {
          await render(scenario, status);
          const result = await game.evaluate(() => {
            const screen = document.querySelector('.screen:not(.hidden)');
            const cards = [...screen.querySelectorAll('.listening-card,.new-mini-game-choice')];
            const feedback = screen.querySelector('.matching-feedback');
            const f = feedback.getBoundingClientRect();
            const intersects = r => r.left < f.right && r.right > f.left && r.top < f.bottom && r.bottom > f.top;
            return {
              overflow: document.documentElement.scrollWidth > innerWidth,
              overlap: cards.some(c => intersects(c.getBoundingClientRect())),
              touch: cards.every(c => c.getBoundingClientRect().width >= 44 && c.getBoundingClientRect().height >= 44),
              images: [...screen.querySelectorAll('.listening-card img,.shadow-choice img,.shadow-source')].map(img => ({ width: img.naturalWidth, height: img.naturalHeight, fit: getComputedStyle(img).objectFit }))
            };
          });
          assert.equal(result.overflow, false, `${width} ${scenario} overflow`);
          assert.equal(result.overlap, false, `${width} ${scenario} feedback overlap`);
          assert.equal(result.touch, true, `${width} ${scenario} touch`);
          assert.ok(result.images.length >= 4);
          assert.ok(result.images.every(img => img.width > 0 && img.width === img.height && img.fit === 'contain'), `${width} ${scenario} image scaling: ${JSON.stringify(result.images)}`);
          if (scenario === 'listening' && status === 'success') {
            const output = path.join(os.tmpdir(), `sprint-13-5-listening-${width}.png`);
            await game.screenshot({ path: output, fullPage: true }); console.log(output);
          }
        }
        console.log(`${width}x${height}: canonical listening/shadow images and both feedback states passed`);
      }
      await context.setOffline(true);
      await game.reload();
      await game.waitForFunction(() => document.documentElement.classList.contains('app-ready'));
      await render('listening', 'success');
      assert.equal(await game.locator('.listening-card img').count(), 4);
      assert.ok(await game.evaluate(async () => (await caches.keys()).some(key => key.endsWith('-art13-5'))));
      console.log('Controlled PWA offline reload and four target SVGs decoded successfully');
    } finally { await context.close(); await new Promise(resolve => server.close(resolve)); }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
