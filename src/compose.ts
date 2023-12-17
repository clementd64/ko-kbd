import { composeSyllable, isSyllable, COMPOSED_FINAL, NO_INITIAL, decomposeSyllable, isInitalCompatibilityJamo } from './hangul.ts';
import { $, INITIALS, MEDIALS, FINALS, FINAL_TO_INITIAL } from './compose.const.ts';

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

function appendInitial(state: string, initial: number): ComposeResult {
  return {
    value: state + composeSyllable({
      initial: initial,
      medial: null,
      final: null,
    }),
    select: SelectionState.Last,
  };
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

function appendFinal(state: string, final: number): ComposeResult {
  if (state.length > 0 && isSyllable(state[state.length - 1])) {
    const syllable = decomposeSyllable(state[state.length - 1]);

    if (syllable.final !== null) {
      const composed = composeFinal(syllable.final, final);
      if (composed !== null) {
        return {
          value: state.slice(0, -1) + composeSyllable({
            initial: syllable.initial,
            medial: syllable.medial,
            final: composed,
          }),
          select: SelectionState.All,
        };
      }
    }

    if (syllable.final === null && syllable.medial !== null) {
      return {
        value: state.slice(0, -1) + composeSyllable({
          initial: syllable.initial,
          medial: syllable.medial,
          final: final,
        }),
        select: SelectionState.All,
      };
    }
  }

  if (final in FINAL_TO_INITIAL) {
    return appendInitial(state, FINAL_TO_INITIAL[final]);
  }

  return { value: state, select: SelectionState.All };
}

export function append(state: string, input: string): ComposeResult {
  // incomplete ASCII
  if (
    (state.length === 0 || !isAlpha(state[state.length - 1])) &&
    (
      input in INITIALS && !($ in INITIALS[input]) ||
      input in MEDIALS && !($ in MEDIALS[input]) ||
      input in FINALS && !($ in FINALS[input])
    )
  ) {
    return {
      value: state + input,
      select: SelectionState.All,
    };
  }

  // as composed ASCII
  if (state.length > 0 && isAlpha(state[state.length - 1])) {
    const last = state[state.length - 1];

    if (
      state.length > 1 && isSyllable(state[state.length - 2]) &&
      last in FINALS && input in FINALS[last] && $ in FINALS[last][input]
    ) {
      return appendFinal(state.slice(0, -1), FINALS[last][input][$]!);
    }

    // is inital composed
    if (last in INITIALS && input in INITIALS[last] && $ in INITIALS[last][input]) {
      return appendInitial(state.slice(0, -1), INITIALS[last][input][$]!);
    }

    // if medial composed
    if (last in MEDIALS && input in MEDIALS[last] && $ in MEDIALS[last][input]) {
      return appendMedial(state.slice(0, -1), MEDIALS[last][input][$]!);
    }

    return { value: state, select: SelectionState.All };
  }

  if (input in FINALS) {
    return appendFinal(state, FINALS[input][$]!);
  }

  if (input in INITIALS) {
    return appendInitial(state, INITIALS[input][$]!);
  }

  if (input in MEDIALS) {
    return appendMedial(state, MEDIALS[input][$]!);
  }

  return { value: state, select: SelectionState.All };
}

function composeFinal(a: number, b: number): number|null {
  for (const id of COMPOSED_FINAL.keys()) {
    const [x, y] = COMPOSED_FINAL.get(id)!;
    if (a === x && b === y) {
      return id;
    }
  }

  return null;
}

function isAlpha(ch: string): boolean {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}
