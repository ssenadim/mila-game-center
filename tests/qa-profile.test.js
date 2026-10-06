const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const model = require('../js/LearningPath.js');
const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

function functionSource(name) {
  const start = source.indexOf(`function ${name}(`);
  const end = source.indexOf('\nfunction ', start + 1);
  return source.slice(start, end);
}

function environment(initial = {}) {
  const values = new Map(Object.entries(initial));
  const context = vm.createContext({
    selectedPlayer: 'Mila', QA_PROFILE_NAME: source.match(/const QA_PROFILE_NAME = "([^"]+)"/)[1], learningPathModel: model,
    LEARNING_PATH_PROGRESS_STORAGE_KEY: 'mila-learning-path-progress',
    warnedStorageKeys: new Set(), console: { warn() {} },
    window: { localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) } }
  });
  ['isQaProfile', 'getValidPlayerName', 'getPlayerStorageKey', 'readStoredJson', 'loadLearningPathProgress', 'saveLearningPathProgress']
    .forEach(name => vm.runInContext(functionSource(name), context));
  return { context, values };
}

test('QA detection uses existing trim and case-sensitive identity; similar names never activate', () => {
  const { context } = environment();
  assert.equal(context.getValidPlayerName(' adaniakadmin '), 'adaniakadmin');
  assert.equal(context.isQaProfile(' adaniakadmin '), true);
  for (const name of ['adaniak-admin', 'adaniak', 'admin', 'adaniakadmin2', 'adaniak admin', 'mila', 'ADANIAKADMIN', '', undefined, null]) {
    assert.equal(context.isQaProfile(name), false);
  }
  assert.equal(context.getValidPlayerName(' Açelya '), 'Açelya');
  assert.equal(context.getValidPlayerName('other-admin'), undefined);
  assert.equal(context.getValidPlayerName('adaniak-admin'), undefined);
});

test('all 38 playable QA stages unlock without completion or mutation', () => {
  const { context, values } = environment();
  context.selectedPlayer = 'adaniakadmin';
  const progress = context.loadLearningPathProgress();
  assert.equal(model.STAGES.length, 38);
  assert.equal(model.STAGES.every(stage => model.canLaunchStage(stage.id, progress)), true);
  assert.equal(model.STAGES.some(stage => model.getStageState(stage, progress) === 'locked'), false);
  assert.equal(Object.keys(progress.completed).length, 0);
  assert.equal(model.isLearningPathComplete(progress), false);
  assert.equal(model.GROUPS.every(group => model.getGroupProgress(group.id, progress).completed === 0), true);
  assert.equal(values.size, 0);
  const planned = { ...model.STAGES[0], implemented: false };
  assert.equal(model.canLaunchStage(planned.id, progress, [planned]), false);
  assert.equal(model.getStageState(planned, progress), 'planned');
});

test('QA access is recomputed and excluded from saves; real completion stays isolated', () => {
  const childKey = 'mila-learning-path-progress-Mila';
  const child = JSON.stringify({ completed: { 'recognize-colors': true } });
  const { context, values } = environment({ [childKey]: child });
  context.selectedPlayer = 'adaniakadmin';
  const progress = context.loadLearningPathProgress();
  const stage = model.STAGES.at(-1);
  progress.completed[stage.id] = true;
  context.saveLearningPathProgress(progress);
  const qaKey = context.getPlayerStorageKey('mila-learning-path-progress');
  const saved = JSON.parse(values.get(qaKey));
  assert.equal(saved.qaProfileAccess, undefined);
  assert.deepEqual(saved.completed, { [stage.id]: true });
  assert.equal(values.get(childKey), child);
  context.selectedPlayer = 'Mila';
  const childProgress = context.loadLearningPathProgress();
  assert.equal(childProgress.qaProfileAccess, false);
  assert.equal(model.canLaunchStage(stage.id, childProgress), false);
  values.set(childKey, JSON.stringify({ completed: {}, qaProfileAccess: true }));
  assert.equal(context.loadLearningPathProgress().qaProfileAccess, false, 'saved access cannot activate QA');
  context.selectedPlayer = 'adaniakadmin';
  assert.equal(context.loadLearningPathProgress().qaProfileAccess, true);
  values.set(qaKey, '{broken');
  assert.equal(model.canLaunchStage(stage.id, context.loadLearningPathProgress()), true);
});
