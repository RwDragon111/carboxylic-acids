// Run with Node.js 24+: node scripts/check-carbohydrates.mjs
import assert from 'node:assert/strict';
import { CARB_LESSONS } from '../src/data/carbohydrates/lessons.ts';
import { CARB_QUESTIONS } from '../src/data/carbohydrates/questions.ts';
import { createCarbExam, emptyCarbProgress, parseCarbProgress, recordCarbAnswer, shuffled } from '../src/utils/carbProgress.ts';

const topics = CARB_LESSONS.map(l => l.id);
assert.equal(new Set(topics).size, 10);
assert.equal(CARB_QUESTIONS.length, 100);
assert.equal(new Set(CARB_QUESTIONS.map(q => q.id)).size, 100);
for (const lesson of CARB_LESSONS) {
  assert.ok(lesson.sections.length >= 3, `Missing full theory: ${lesson.id}`);
  assert.equal(lesson.oral.length, 2);
  assert.equal(CARB_QUESTIONS.filter(q => q.topic === lesson.id).length, 10);
}
for (const q of CARB_QUESTIONS) {
  assert.ok(topics.includes(q.topic), `Unknown topic: ${q.id}`);
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options).size, 4, `Duplicate answer: ${q.id}`);
  assert.equal(q.options.filter(o => o === q.answer).length, 1);
  assert.ok(q.explanation.length > 30, `Missing explanation: ${q.id}`);
}
const original = JSON.stringify(CARB_QUESTIONS);
for (let i = 0; i < 50; i++) {
  const exam = createCarbExam(CARB_QUESTIONS, topics);
  assert.equal(exam.length, 30);
  assert.equal(new Set(exam.map(q => q.id)).size, 30);
  assert.deepEqual([...new Set(exam.map(q => q.topic))].sort(), [...topics].sort());
}
assert.equal(JSON.stringify(CARB_QUESTIONS), original, 'Exam must not mutate the bank');
assert.deepEqual([...shuffled(topics)].sort(), [...topics].sort());
const before = emptyCarbProgress();
const wrong = recordCarbAnswer(before, 'c01', false);
assert.deepEqual(before.answers, {});
assert.deepEqual(wrong.answers.c01, { attempts: 1, correct: 0, lastCorrect: false });
const corrected = recordCarbAnswer(wrong, 'c01', true);
assert.deepEqual(corrected.answers.c01, { attempts: 2, correct: 1, lastCorrect: true });
assert.deepEqual(parseCarbProgress(JSON.stringify(corrected)), corrected);
for (const raw of [null, '{bad', 'null', '[]', '42', '{"read":3,"answers":null,"exams":false}']) {
  assert.deepEqual(parseCarbProgress(raw), emptyCarbProgress());
}
assert.deepEqual(parseCarbProgress('{"answers":{"x":{"attempts":1,"correct":9,"lastCorrect":true}}}').answers, {});
console.log('PASS: 10 full lessons, 100 valid questions, 20 oral prompts, exam coverage, immutable progress and corrupt-storage recovery.');
