const test = require('node:test');
const assert = require('node:assert/strict');
const games = require('../js/NewMiniGames.js');
const objects = require('../js/EducationalObjects.js');

function random(seed) {
  let state = seed;
  return () => { state = (1664525 * state + 1013904223) >>> 0; return state / 4294967296; };
}

test('five-round math sessions stay valid, bounded, unique and tied to canonical local assets', () => {
  const seenObjects = new Set(), forms = new Set();
  for (const mode of games.MATH_MODES) for (let seed = 1; seed <= 250; seed++) {
    const rng = random(seed), recent = [];
    for (let i = 0; i < 5; i++) {
      const round = games.createMathRound(mode, i, recent, rng);
      assert.ok(!recent.includes(round.key)); recent.push(round.key);
      assert.ok(Number.isInteger(round.first) && Number.isInteger(round.second));
      if (round.operation === 'add') {
        assert.ok(round.first >= 1 && round.first <= 5 && round.second >= 1 && round.second <= 5);
        assert.equal(round.result, round.first + round.second);
        assert.ok(round.result <= 10);
      } else {
        assert.ok(round.first >= 2 && round.first <= 10 && round.second >= 1 && round.second <= round.first);
        assert.equal(round.result, round.first - round.second);
        assert.ok(round.result >= 0);
      }
      assert.equal(round.answer, round[round.blank]);
      assert.equal(round.choices.length, 3);
      assert.equal(new Set(round.choices).size, 3);
      assert.equal(round.choices.filter(n => n === round.answer).length, 1);
      assert.ok(round.choices.every(n => Number.isInteger(n) && n >= 0 && n <= 10));
      assert.equal(round.object.src, objects.get(round.objectId).src);
      assert.ok(round.object.src.startsWith('assets/illustrations/objects/'));
      assert.ok(round.narration.length > 20);
      seenObjects.add(round.objectId); forms.add(`${round.operation}:${round.blank}`);
    }
  }
  assert.deepEqual(seenObjects, new Set(games.MATH_OBJECT_IDS));
  assert.ok(forms.has('add:first') && forms.has('add:second') && forms.has('subtract:second'));
});

test('boundary outcomes and fresh alternatives exist even with deterministic randomness', () => {
  const seen = new Set();
  for (let seed = 0; seed < 1000; seed++) for (const mode of games.MATH_MODES) {
    const round = games.createMathRound(mode, 4, [], () => seed / 1000);
    [round.first, round.second, round.result].forEach(n => seen.add(n));
  }
  for (let n = 0; n <= 10; n++) assert.ok(seen.has(n), `quantity ${n}`);
  for (const mode of games.MATH_MODES) {
    const previous = games.createMathRound(mode, 0, [], () => 0);
    const fresh = games.createMathRound(mode, 0, [previous.key], () => 0);
    assert.notEqual(fresh.key, previous.key);
    const history = [];
    for (let session = 0; session < 40; session++) {
      const next = games.createMathRound(mode, 0, history, () => 0);
      assert.notEqual(next.key, history.at(-1), 'exhausted recent pool still avoids immediate repeats');
      history.push(next.key);
      if (history.length > 30) history.shift();
    }
  }
  assert.equal(games.createMathRound('unrelated'), undefined);
});
