import { composeSyllable, isSyllable, COMPOSED_FINAL, NO_INITIAL, decomposeSyllable, isInitalCompatibilityJamo } from './hangul.ts';
import { $, INITIALS, MEDIALS, FINAL_TO_INITIAL } from './compose.const.ts';

export const enum SelectionState {
  None,
  All,
  Last,
}

export type ComposeResult = {
  value: string;
  select: SelectionState;
};

export function isStateValid(state: string): boolean {
  switch (state.length) {
    case 0:
      return true;
    case 1:
      return isSyllable(state) || isAlpha(state);
    case 2:
      return isSyllable(state[0]) && isAlpha(state[1]);
  }
  return false;
}

function appendMedial(state: string, medial: number): ComposeResult {
  if (isSyllable(state[0]) || isInitalCompatibilityJamo(state[0])) {
    const first = decomposeSyllable(state[0]);

    // extract from double final
    if (first.final !== null && COMPOSED_FINAL.has(first.final)) {
      const [a, b] = COMPOSED_FINAL.get(first.final)!;
      return {
        value: composeSyllable({
          initial: first.initial,
          medial: first.medial,
          final: a,
        }) + composeSyllable({
          initial: FINAL_TO_INITIAL[b],
          medial: medial,
          final: null,
        }),
        select: SelectionState.Last,
      };
    }

    // final to initial
    if (first.final !== null) {
      return {
        value: composeSyllable({
          initial: first.initial,
          medial: first.medial,
          final: null,
        }) + composeSyllable({
          initial: FINAL_TO_INITIAL[first.final],
          medial: medial,
          final: null,
        }),
        select: SelectionState.Last,
      };
    }

    // initial
    if (first.medial === null) {
      return {
        value: composeSyllable({
          initial: first.initial,
          medial: medial,
          final: null,
        }),
        select: SelectionState.All,
      };
    }

    // composed medial
    if (first.medial in MEDIALS && medial in MEDIALS[first.medial] && $ in MEDIALS[first.medial][medial]) {
      return {
        value: composeSyllable({
          initial: first.initial,
          medial: MEDIALS[first.medial][medial][$]!,
          final: null,
        }),
        select: SelectionState.Last,
      };
    }
  }

  return {
    value: state + composeSyllable({
      initial: NO_INITIAL,
      medial: medial,
      final: null,
    }),
    select: SelectionState.Last,
  };
}

export function append(state: string, input: string): ComposeResult {
  // incomplete ASCII
  if (
    (state.length === 0 || !isAlpha(state[state.length - 1])) &&
    (input in INITIALS && !($ in INITIALS[input]) || input in MEDIALS && !($ in MEDIALS[input]))
  ) {
    return {
      value: state + input,
      select: SelectionState.All,
    };
  }

  // as composed ASCII
  if (state.length > 0 && isAlpha(state[state.length - 1])) {
    const last = state[state.length - 1];

    // TODO: check composed final. Must be done first to fallback to initial

    // is inital composed
    if (last in INITIALS && input in INITIALS[last] && $ in INITIALS[last][input]) {
      return {
        value: state.slice(0, -1) + composeSyllable({
          initial: INITIALS[last][input][$]!,
          medial: null,
          final: null,
        }),
        select: SelectionState.Last,
      };
    }

    // if medial composed
    if (last in MEDIALS && input in MEDIALS[last] && $ in MEDIALS[last][input]) {
      return appendMedial(state.slice(0, -1), MEDIALS[last][input][$]!);
    }

    return { value: state, select: SelectionState.All };
  }

  if (input in MEDIALS) {
    return appendMedial(state, MEDIALS[input][$]!);
  }

  // state is empty, start new syllable
  if (state.length === 0) {
    // initial
    if (input in INITIALS) {
      return {
        value: composeSyllable({
          initial: INITIALS[input][$]!, // must exist, checked above
          medial: null,
          final: null,
        }),
        select: SelectionState.All,
      };
    }
  }

  return { value: state, select: SelectionState.All };
}

function isAlpha(ch: string): boolean {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}
