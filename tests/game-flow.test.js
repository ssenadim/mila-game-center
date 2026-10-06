const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');

function functionSource(name) {
  const start = source.search(new RegExp(`(?:async )?function ${name}\\(`));
  const end = source.indexOf('\nfunction ', start + 1);
  const asyncEnd = source.indexOf('\nasync function ', start + 1);
  return source.slice(start, Math.min(...[end, asyncEnd].filter(index => index >= 0)));
}

function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

function completionEnvironment() {
  const timers = new Map();
  let timerId = 0;
  const spoken = deferred();
  const animated = deferred();
  let ended;
  const screen = {
    classList: { contains: () => false },
    getAnimations: () => [{ effect: { getTiming: () => ({ iterations: 1 }) }, finished: animated.promise }]
  };
  const context = vm.createContext({
    SESSION_CELEBRATION_DURATION: 3500, COMPLETION_SETTLE_DURATION: 300,
    cancelCompletionNavigation: undefined, audioRun: 1,
    ui: { answers: { querySelectorAll: () => [] } },
    window: {
      setTimeout(fn, delay) { timers.set(++timerId, { fn, delay }); return timerId; },
      clearTimeout(id) { timers.delete(id); }
    },
    speech: { speakCelebration: () => spoken.promise, clear() { spoken.resolve(false); } },
    audio: { context: { state: 'running' }, activeOscillators: new Set([{
      addEventListener(_type, fn) { ended = fn; }, removeEventListener() { ended = undefined; }
    }]), stopAll() {} },
    isActiveAudio: run => run === context.audioRun,
    navigations: 0, goHome() { context.navigations++; },
    screen, feedback: { textContent: 'Tamamladın!' }
  });
  vm.runInContext(`${functionSource('finishMiniGameNavigation')}\n${functionSource('clearSpeech')}`, context);
  const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
  return { context, timers, spoken, animated, flush,
    finishSound() { ended?.(); },
    tick() { const [id, timer] = timers.entries().next().value; timers.delete(id); timer.fn(); return timer.delay; }
  };
}

test('completion waits for minimum display, speech, animation, sound and settle before navigation', async () => {
  const env = completionEnvironment();
  const pending = env.context.finishMiniGameNavigation(env.context.screen, env.context.feedback);
  assert.equal(env.tick(), 3500);
  env.animated.resolve(); env.finishSound();
  await env.flush();
  assert.equal(env.context.navigations, 0);
  assert.equal(env.timers.size, 0, 'long speech still owns the screen');
  env.spoken.resolve(true);
  await env.flush();
  assert.equal(env.context.navigations, 0);
  assert.equal(env.tick(), 300);
  await pending;
  assert.equal(env.context.navigations, 1);
  assert.equal(env.context.cancelCompletionNavigation, undefined);
});

test('navigation cancels completion timers and late callbacks cannot navigate a new game', async () => {
  const env = completionEnvironment();
  const pending = env.context.finishMiniGameNavigation(env.context.screen, env.context.feedback);
  env.context.clearSpeech();
  assert.equal(env.timers.size, 0);
  env.spoken.resolve(true); env.animated.resolve(); env.finishSound();
  await pending;
  assert.equal(env.context.navigations, 0);
  assert.equal(env.context.audioRun, 2);
});

test('short or disabled audio still leaves the completion readable for the shared minimum', async () => {
  const env = completionEnvironment();
  const pending = env.context.finishMiniGameNavigation(env.context.screen, env.context.feedback);
  env.spoken.resolve(false); env.animated.resolve(); env.finishSound();
  await env.flush();
  assert.equal(env.context.navigations, 0);
  assert.equal([...env.timers.values()][0].delay, 3500);
  env.tick(); await env.flush(); env.tick();
  await pending;
  assert.equal(env.context.navigations, 1);
});

test('navigation during settle cancels the final navigation callback', async () => {
  const env = completionEnvironment();
  const pending = env.context.finishMiniGameNavigation(env.context.screen, env.context.feedback);
  env.spoken.resolve(true); env.animated.resolve(); env.finishSound(); env.tick();
  await env.flush();
  assert.equal([...env.timers.values()][0].delay, 300);
  env.context.clearSpeech();
  await pending;
  assert.equal(env.timers.size, 0);
  assert.equal(env.context.navigations, 0);
});

test('blocked sound and unavailable speech do not strand completion', async () => {
  const env = completionEnvironment();
  env.context.audio.context.state = 'suspended';
  env.context.speech.speakCelebration = () => Promise.resolve(false);
  const pending = env.context.finishMiniGameNavigation(env.context.screen, env.context.feedback);
  env.animated.resolve(); env.tick();
  await env.flush();
  assert.equal(env.tick(), 300);
  await pending;
  assert.equal(env.context.navigations, 1);
});

test('welcome entry prepares once, then speaks the same question; resume preserves it', () => {
  const start = functionSource('startGame');
  assert.match(start, /showQuestion\(\{ playAudio: false \}\)/);
  assert.match(start, /if \(await playWelcomeSequence\(\)\) playQuestionSequence\(\)/);
  assert.doesNotMatch(start, /await playWelcomeSequence\(\)\) showQuestion/);
  const resume = functionSource('resumeGame');
  const welcome = resume.slice(resume.indexOf('if (isWelcomeSequenceActive)'), resume.indexOf('if (isRevealingCorrectAnswer)'));
  assert.match(welcome, /playQuestionSequence\(\)/);
  assert.doesNotMatch(welcome, /showQuestion\(\)/);
});
