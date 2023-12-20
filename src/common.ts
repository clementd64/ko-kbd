import { isSyllable, isInitalCompatibilityJamo } from "./hangul";

export const enum SelectionState {
  None,
  All,
  Last,
}

export type Result = {
  value: string;
  select: SelectionState;
};

export function isAlpha(ch: string): boolean {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

export function isStateValid(state: string): boolean {
  switch (state.length) {
    case 0:
      return true;
    case 1:
      return isSyllable(state) || isInitalCompatibilityJamo(state) || isAlpha(state);
    case 2:
      return (isInitalCompatibilityJamo(state[0]) && isAlpha(state[1])) ||
        (isSyllable(state[0]) && (isAlpha(state[1]) || isInitalCompatibilityJamo(state[1])));
  }
  return false;
}
