const INITIAL_COMPATIBILITY_JAMO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
export const NO_INITIAL = 11;

export type Syllable = {
  initial: number;
  medial: number | null;
  final: number | null;
};

export function isSyllable(char: string): boolean {
  return char >= '가' && char <= '힣';
}

export function isInitalCompatibilityJamo(char: string): boolean {
  return INITIAL_COMPATIBILITY_JAMO.includes(char);
}

export const COMPOSED_FINAL = new Map<number, [number, number]>([
  [3, [1, 19]], // ㄳ
  [5, [4, 22]], // ㄵ
  [6, [4, 27]], // ㄶ
  [9, [8, 1]], // ㄺ
  [10, [8, 16]], // ㄻ
  [11, [8, 17]], // ㄼ
  [12, [8, 19]], // ㄽ
  [13, [8, 25]], // ㄾ
  [14, [8, 26]], // ㄿ
  [15, [8, 27]], // ㅀ
  [18, [17, 19]], // ㅄ
  [21, [4, 1]], // ㅇ
]);

// Hangul are encoded as 0xAC00 + (initial * 588) + (medial * 28) + final
// with 0xAC00 the offset of the Hangul Syllable block
// 28 the number of finals
// 588 = 21 * 28 the number of medial + final combinations

export function decomposeSyllable(char: string): Syllable {
  if (isInitalCompatibilityJamo(char)) {
    return {
      initial: INITIAL_COMPATIBILITY_JAMO.indexOf(char),
      medial: null,
      final: null,
    };
  }

  if (!isSyllable(char)) {
    throw new Error(`"${char}" is not a valid Hangul syllable`);
  }

  const code = char.charCodeAt(0) - 0xac00;

  const final = code % 28;
  return {
    initial: Math.floor(code / 588),
    medial: Math.floor((code % 588) / 28),
    final: final === 0 ? null : final,
  };
}

export function composeSyllable(syllable: Syllable): string {
  if (syllable.medial === null) {
    if (syllable.final !== null) {
      throw new Error('Final cannot be set if medial is null');
    }

    return INITIAL_COMPATIBILITY_JAMO[syllable.initial];
  }

  return String.fromCharCode(0xac00 + syllable.initial * 588 + syllable.medial * 28 + (syllable.final ?? 0));
}
