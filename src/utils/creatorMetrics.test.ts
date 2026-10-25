import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeTitleCTR, calculateTagBudget, estimateScriptDuration } from './creatorMetrics';

test('analyzeTitleCTR detects empty titles cleanly', () => {
  const result = analyzeTitleCTR('');
  assert.equal(result.score, 0);
  assert.equal(result.rating, 'Poor');
});

test('analyzeTitleCTR evaluates high-performing gaming title correctly', () => {
  const title = 'I Survived 100 Days In Hardcore Minecraft [EP 1]';
  const result = analyzeTitleCTR(title);
  assert.ok(result.score >= 70, 'Score should be high for 100 days title');
  assert.ok(result.hasPowerWords, 'Should detect 100 days / hardcore');
  assert.ok(result.hasNumbers, 'Should detect numbers 100 and 1');
  assert.equal(result.isMobileTruncated, false, 'Length under 60 characters');
});

test('analyzeTitleCTR detects mobile truncation over 60 characters', () => {
  const longTitle = 'This is an extremely long title for a gaming video that will definitely get cut off by the YouTube mobile interface!';
  const result = analyzeTitleCTR(longTitle);
  assert.equal(result.isMobileTruncated, true);
  assert.ok(result.feedback.some(f => f.includes('60 characters')));
});

test('calculateTagBudget accurately tracks YouTube 500-char tag limit', () => {
  const tags = ['minecraft', 'gaming', 'speedrun', 'challenge', 'hardcore survival'];
  const result = calculateTagBudget(tags);
  assert.equal(result.validTags.length, 5);
  assert.equal(result.exceededLimit, false);
  assert.ok(result.remainingChars > 400);

  // Exceeding limit test
  const hugeTags = Array(50).fill('super-long-gaming-tag-keyword-seo-optimization');
  const overflowResult = calculateTagBudget(hugeTags);
  assert.equal(overflowResult.exceededLimit, true);
  assert.equal(overflowResult.remainingChars, 0);
});

test('estimateScriptDuration calculates WPM based on creator tone', () => {
  const wordCount = 320;
  const energetic = estimateScriptDuration(wordCount, 'energetic');
  assert.equal(energetic.wordsPerMinute, 160);
  assert.equal(energetic.durationSeconds, 120); // 2 minutes
  assert.equal(energetic.formattedDuration, '2m 00s');

  const chill = estimateScriptDuration(wordCount, 'chill');
  assert.equal(chill.wordsPerMinute, 110);
  assert.ok(chill.durationSeconds > energetic.durationSeconds);
});
