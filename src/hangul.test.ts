import { describe, expect, test } from 'vitest';
import { composeSyllable, decomposeSyllable } from './hangul.ts';

const h = (i: number, m: number | null, f: number | null) => ({
  initial: i,
  medial: m,
  final: f,
});

const DECOMPOSE_TEST_CASES = [
  { input: 'ㄱ', expected: h(0, null, null) },
  { input: '가', expected: h(0, 0, null) },
  { input: '한', expected: h(18, 0, 4) },
];

describe('Decompose syllables', () => {
  test.each(DECOMPOSE_TEST_CASES)('decompose $input', ({ input, expected }) => {
    expect(decomposeSyllable(input)).toEqual(expected);
  });

  test.fails('decompose invalid syllable', () => {
    decomposeSyllable('a');
  });
});

const COMPOSE_TEST_CASES = [
  { input: h(0, null, null), expected: 'ㄱ' },
  { input: h(0, 0, null), expected: '가' },
  { input: h(18, 0, 4), expected: '한' },
];

describe('Compose syllables', () => {
  test.each(COMPOSE_TEST_CASES)('compose $expected', ({ input, expected }) => {
    expect(composeSyllable(input)).toEqual(expected);
  });

  test.fails('compose invalid syllable', () => {
    composeSyllable(h(0, null, 0));
  });
});
