const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');
function body(name) {
  const start = source.search(new RegExp(`(?:async )?function ${name}\\(`));
  const end = source.slice(start + 1).search(/\n(?:async )?function /);
  return source.slice(start, start + 1 + end);
}
for (const [handler, part] of [['chooseShadow', 'source'], ['chooseMissingItem', 'missing'], ['chooseInitialLetter', 'word']]) {
  for (const correct of [true, false]) test(`${handler}: cancelled ${correct ? 'correct' : 'retry'} feedback cannot mutate a replacement session`, async () => {
    let resolve;
    const feedback = new Promise(done => { resolve = done; });
    let scheduled = 0, renders = 0;
    const context = vm.createContext({
      newMiniGameState: { sessionId: 1, challenge: { [part]: { id: 'cat', word: 'Kedi', letter: 'K' } } },
      isNewMiniGameActive: true, isPaused: false,
      ui: { newMiniGameFeedback: {} }, audio: { playSuccess() {} },
      recordNewMiniGameCorrect() {}, recordNewMiniGameWrong() {},
      speakNewMiniGame: () => feedback, speakInitialLetterWord: () => feedback,
      renderShadowChoices() { renders++; }, renderMissingItemChoices() { renders++; }, renderInitialLetterChoices() { renders++; },
      scheduleNewMiniGame() { scheduled++; }, showShadowRound() {}, showMissingItemRound() {}, showInitialLetterRound() {}
    });
    vm.runInContext(body(handler), context);
    const pending = context[handler](correct ? part === 'word' ? 'K' : 'cat' : 'other');
    const before = renders;
    context.newMiniGameState = { sessionId: 2, mode: 'math-addition' };
    resolve(false); await pending;
    assert.equal(scheduled, 0);
    assert.equal(renders, before);
  });
}
test('a continuation arriving during Pause stores one inactive delay for Resume', () => {
  let timers = 0;
  const context = vm.createContext({
    isPaused: true, newMiniGameState: { sessionId: 7 }, Date,
    window: { setTimeout() { timers++; return timers; }, clearTimeout() {} }
  });
  vm.runInContext(body('clearNewMiniGameDelay'), context);
  vm.runInContext(body('scheduleNewMiniGame'), context);
  context.scheduleNewMiniGame(() => {}, 450);
  assert.equal(timers, 0);
  assert.equal(context.newMiniGameState.pendingDelay.remaining, 450);
  assert.equal(context.newMiniGameState.pendingDelay.timer, undefined);
});
for (const firstCard of [undefined, 0]) test(`memory Pause cancels a new reveal safely (selected card: ${firstCard})`, async () => {
  let resolve;
  const speaking = new Promise(done => { resolve = done; });
  const board = [{ speech: 'Apple', revealed: firstCard === 0, matched: false }, { speech: 'Cat', revealed: false, matched: false }];
  const context = vm.createContext({
    isNewMiniGameActive: true, isPaused: false, ENGLISH_LANGUAGE: 'en-US',
    newMiniGameState: { sessionId: 3, board, firstCard, attempts: 0 },
    newMiniGames: { canSelectSoundCard: () => true },
    renderSoundMemoryBoard() {}, speakNewMiniGame: () => speaking
  });
  vm.runInContext(body('openSoundMemoryCard'), context);
  const index = firstCard === 0 ? 1 : 0;
  const pending = context.openSoundMemoryCard(index);
  context.isPaused = true; resolve(false); await pending;
  assert.equal(board[index].revealed, false);
  assert.equal(context.newMiniGameState.firstCard, firstCard);
  assert.equal(context.newMiniGameState.attempts, 0);
});
