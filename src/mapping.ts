export const $ = Symbol();

type Compose = {
  [$]?: number;
  [key: string]: Compose;
};

export const INITIALS: Compose = {
  g: { [$]: 0 }, // ㄱ
  G: { [$]: 1 }, // ㄲ
  n: { [$]: 2 }, // ㄴ
  d: { [$]: 3 }, // ㄷ
  D: { [$]: 4 }, // ㄸ
  r: { [$]: 5 }, // ㄹ
  l: { [$]: 5 }, // ㄹ
  m: { [$]: 6 }, // ㅁ
  b: { [$]: 7 }, // ㅂ
  B: { [$]: 8 }, // ㅃ
  s: { [$]: 9 }, // ㅅ
  S: { [$]: 10 }, // ㅆ
  j: { [$]: 12 }, // ㅈ
  J: { [$]: 13 }, // ㅉ
  c: { h: { [$]: 14 } }, // ㅊ
  k: { [$]: 15 }, // ㅋ
  t: { [$]: 16 }, // ㅌ
  p: { [$]: 17 }, // ㅍ
  h: { [$]: 18 }, // ㅎ
};

export const MEDIALS: Compose = {
  a: { [$]: 0 }, // ㅏ
  e: { [$]: 5 }, // ㅔ
  i: { [$]: 20 }, // ㅣ
  o: { [$]: 8 }, // ㅗ
  u: { [$]: 13 }, // ㅜ
  y: {
    a: { [$]: 2 }, // ㅑ
    e: { [$]: 7 }, // ㅖ
    o: { [$]: 12 }, // ㅛ
    u: { [$]: 17 }, // ㅠ
  },
  w: {
    a: { [$]: 9 }, // ㅘ
    e: { [$]: 15 }, // ㅞ
    i: { [$]: 16 }, // ㅟ
    o: { [$]: 14 }, // ㅝ
  },
  // use id because y- and w- are already recomposed
  0: { // a
    5: { [$]: 1 }, // e / ㅐ
  },
  2: { // ya
    5: { [$]: 3 }, // e / ㅒ
  },
  5: { // e
    8: { [$]: 4 }, // o / ㅓ
    13: { [$]: 18 }, // u / ㅡ
  },
  7: { // ye
    8: { [$]: 6 }, // o / ㅕ
  },
  8: { // o
    5: { [$]: 11 }, // e / ㅚ
  },
  9: { // wa
    5: { [$]: 10 }, // e / ㅙ
  },
  13: { // u
    20: { [$]: 19 }, // i / ㅢ
  },
};

export const FINALS: Compose = {
  g: { [$]: 1 }, // ㄱ
  G: { [$]: 2 }, // ㄲ
  n: { [$]: 4 }, // ㄴ
  d: { [$]: 7 }, // ㄷ
  r: { [$]: 8 }, // ㄹ
  l: { [$]: 8 }, // ㄹ
  m: { [$]: 16 }, // ㅁ
  b: { [$]: 17 }, // ㅂ
  s: { [$]: 19 }, // ㅅ
  S: { [$]: 20 }, // ㅆ
  j: { [$]: 22 }, // ㅈ
  c: { h: { [$]: 23 } }, // ㅊ
  k: { [$]: 24 }, // ㅋ
  t: { [$]: 25 }, // ㅌ
  p: { [$]: 26 }, // ㅍ
  h: { [$]: 27 }, // ㅎ
};

export const FINAL_TO_INITIAL: Record<number, number> = {
  1: 0, // ㄱ
  2: 1, // ㄲ
  4: 2, // ㄴ
  7: 3, // ㄷ
  8: 5, // ㄹ
  16: 6, // ㅁ
  17: 7, // ㅂ
  19: 9, // ㅅ
  22: 12, // ㅈ
  25: 16, // ㅌ
  26: 17, // ㅍ
  27: 18, // ㅎ
  20: 10, // ㅆ
  21: 11, // ㅇ
  23: 14, // ㅊ
  24: 15, // ㅋ
};
