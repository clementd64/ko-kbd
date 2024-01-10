import { SelectionState, Result } from './common.ts';
import { composeSyllable, decomposeSyllable, isSyllable, COMPOSED_FINAL, NO_INITIAL } from './hangul.ts';

export function remove(state: string): Result {
    // state can't have 2 syllables. second must be ascii or initial jamo.
    if (state.length > 1) {
        return {
            value: state.slice(0, -1),
            select: SelectionState.All,
        }
    }

    if (isSyllable(state)) {
        const syllable = decomposeSyllable(state);

        if (syllable.final !== null) {
            syllable.final = COMPOSED_FINAL.has(syllable.final)
                ? COMPOSED_FINAL.get(syllable.final)![0]
                : null;

            return {
                value: composeSyllable(syllable),
                select: SelectionState.All,
            }
        }

        if (syllable.medial !== null && syllable.initial !== NO_INITIAL) {
            syllable.medial = null;
            return {
                value: composeSyllable(syllable),
                select: SelectionState.All,
            }
        }
    }

    // single non syllable character
    return { value: '', select: SelectionState.All };
}
