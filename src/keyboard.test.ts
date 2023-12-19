import { describe, expect, test } from 'vitest';

import { append, isStateValid, SelectionState } from './append.ts';
import { $, INITIALS, MEDIALS, FINALS } from './mapping.ts';
import { COMPOSED_FINAL, NO_INITIAL } from './hangul.ts';

const VALID_STATE_TEST_CASES = [
  { state: '', expected: true },
  { state: '0', expected: false },
  { state: 'a', expected: true },
  { state: 'aa', expected: false },
  { state: 'aㄱ', expected: false },
  { state: 'a가', expected: false },
  { state: 'ㄱ', expected: true },
  { state: 'ㄱa', expected: true },
  { state: 'ㄱㄱ', expected: false },
  { state: '가', expected: true },
  { state: '가a', expected: true },
  { state: '가aa', expected: false },
  { state: '가ㄱ', expected: true },
  { state: '가ㄱa', expected: false },
  { state: '가ㄱㄱ', expected: false },
  { state: '가가', expected: false },
];

describe('State validity', () => {
  test.each(VALID_STATE_TEST_CASES)('$state', ({ state, expected }) => {
    expect(isStateValid(state)).toBe(expected);
  });
});

const APPEND_TEST_CASES = [
  // initial
  { state: '', input: 'g', expected: 'ㄱ', select: SelectionState.Last },
  { state: '', input: 'G', expected: 'ㄲ', select: SelectionState.Last },
  { state: '', input: 'a', expected: '아', select: SelectionState.Last },
  { state: '', input: 'z', expected: '', select: SelectionState.All }, // invalid input
  // multiple characters
  { state: '', input: 'c', expected: 'c', select: SelectionState.All },
  { state: 'c', input: 'h', expected: 'ㅊ', select: SelectionState.Last },
  { state: 'c', input: 'z', expected: 'c', select: SelectionState.All }, // invalid input
  { state: '', input: 'y', expected: 'y', select: SelectionState.All },
  { state: 'y', input: 'a', expected: '야', select: SelectionState.Last },
  { state: 'y', input: 'z', expected: 'y', select: SelectionState.All }, // invalid input
  { state: '에', input: 'o', expected: '어', select: SelectionState.Last }, // 3 letters vowels

  // medial with existing initial
  { state: 'ㄱ', input: 'a', expected: '가', select: SelectionState.All },
  { state: 'ㄱ', input: 'z', expected: 'ㄱ', select: SelectionState.All }, // invalid input
  // multiple characters
  { state: 'ㄱ', input: 'y', expected: 'ㄱy', select: SelectionState.All },
  { state: 'ㄱy', input: 'a', expected: '갸', select: SelectionState.All },
  { state: '게', input: 'o', expected: '거', select: SelectionState.Last }, // 3 letters vowels

  // final
  { state: '하', input: 'n', expected: '한', select: SelectionState.All },
  { state: '하', input: 'G', expected: '핚', select: SelectionState.All },
  { state: '하', input: 'z', expected: '하', select: SelectionState.All }, // invalid input
  // // multiple characters
  { state: '한', input: 'g', expected: '항', select: SelectionState.All },
  { state: '하', input: 'c', expected: '하c', select: SelectionState.All },
  { state: '하c', input: 'h', expected: '핯', select: SelectionState.All },
  { state: '하c', input: 'z', expected: '하c', select: SelectionState.All }, // invalid input

  // second syllable
  { state: '한', input: 'k', expected: '한ㅋ', select: SelectionState.Last },
  { state: '한', input: 'c', expected: '한c', select: SelectionState.All },
  { state: '한c', input: 'h', expected: '한ㅊ', select: SelectionState.Last },
  { state: '한', input: 'a', expected: '하나', select: SelectionState.Last },
  { state: '하', input: 'a', expected: '하아', select: SelectionState.Last },
  { state: '하', input: 'y', expected: '하y', select: SelectionState.All },
  { state: '하y', input: 'a', expected: '하야', select: SelectionState.Last },
  { state: '하', input: 'J', expected: '하ㅉ', select: SelectionState.Last }, // ever used as final

  // double final
  { state: '할', input: 'g', expected: '핡', select: SelectionState.All },
  { state: '핡', input: 'a', expected: '할가', select: SelectionState.Last },
  { state: '핡', input: 'k', expected: '핡ㅋ', select: SelectionState.Last },
  { state: '항', input: 'a', expected: '한가', select: SelectionState.Last },
  // // multiple characters
  { state: '핡', input: 'y', expected: '핡y', select: SelectionState.All },
  { state: '핡y', input: 'a', expected: '할갸', select: SelectionState.Last },
];

describe('Append', () => {
  test.each(APPEND_TEST_CASES)('$state + $input => $expected', ({
    state, input, expected, select,
  }) => {
    const result = append(state, input);
    expect(result.value).toBe(expected);
    expect(result.select).toBe(select);
  });
});

describe('Jamo count', () => {
  function composeMapToList(map: typeof INITIALS, list: number[] = []): number[] {
    for (const key in map) {
      if ($ in map[key]) {
        list.push(map[key][$]!);
      } else {
        composeMapToList(map[key], list);
      }
    }
    return list;
  }

  test('initials', () => {
    const list = composeMapToList(INITIALS);
    // 19 because -1 for ㅇ and +1 for ㄹ (r/l)
    expect.soft(list).toHaveLength(19);
    // no duplicates except ㄹ (r/l)
    expect.soft(new Set(list)).toHaveLength(list.length - 1);
    expect.soft(list.filter((i) => i === INITIALS.r[$])).toHaveLength(2);
    // all initial are listed
    expect
      .soft(new Set(list.concat([NO_INITIAL]))) // add ㅇ
      .toStrictEqual(new Set(Array.from({ length: 19 }, (_, i) => i)));
  });

  test('medials', () => {
    const list = composeMapToList(MEDIALS);
    expect.soft(list).toHaveLength(21);
    // no duplicates
    expect.soft(new Set(list)).toHaveLength(list.length);
    // all medials are listed
    expect.soft(new Set(list)).toStrictEqual(new Set(Array.from({ length: 21 }, (_, i) => i)));
  });

  test('finals', () => {
    const list = composeMapToList(FINALS);
    // +1 for double ㄹ (r/l)
    expect.soft(list).toHaveLength(27 - COMPOSED_FINAL.size + 1);
    // no duplicates except ㄹ (r/l)
    expect.soft(new Set(list)).toHaveLength(list.length - 1);
    expect.soft(list.filter((i) => i === FINALS.r[$])).toHaveLength(2);
    // all finals are listed
    expect.soft(new Set(list))
      // 0 is no final
      .toStrictEqual(new Set(Array.from({ length: 27 }, (_, i) => i + 1).filter(v => !COMPOSED_FINAL.has(v))));
  });
});
