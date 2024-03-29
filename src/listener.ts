import { isAlpha, isStateValid, SelectionState } from "./common.ts";
import { append } from "./append.ts";
import { remove } from "./remove.ts";

export interface Element {
    value: string;
    selectionStart: number;
    selectionEnd: number;
    setSelectionRange(start: number | null, end: number | null, direction?: "forward" | "backward" | "none"): void;
}

function replace(el: Element, value: string, selection: SelectionState) {
    const start = el.selectionStart;

    el.value =
        el.value.slice(0, el.selectionStart) +
        value +
        el.value.slice(el.selectionEnd);

    el.selectionEnd = start + value.length;

    switch (selection) {
        case SelectionState.None:
            el.selectionStart = el.selectionEnd;
            break;
        case SelectionState.Last:
            el.selectionStart = start + (value.length > 0 ? value.length - 1 : 0);
            break;
        case SelectionState.All:
            el.selectionStart = start;
            break;
    }
}

export function keydownListener(e: KeyboardEvent) {
    // ignore if modifier key is pressed
    if (e.altKey || e.ctrlKey || e.metaKey) {
        return;
    }

    const target = e.target as unknown as Element;
    let state = target.value.slice(target.selectionStart, target.selectionEnd);

    if (!isStateValid(state)) {
        // ignore if invalid state and not append event
        if (!isAppendEvent(e)) {
            return;
        }
        // process as replace
        state = "";
    }

    // Keep current selection when selecting backward
    if (e.shiftKey && e.key === "ArrowLeft") {
        target.setSelectionRange(target.selectionStart, target.selectionEnd, "backward");
        return;
    }

    // do not unselect when unprintable character
    if (e.key === "Shift" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
        return;
    }

    // input text
    if (isAppendEvent(e)) {
        e.preventDefault();
        const result = append(state, e.key);
        replace(target, result.value, result.select);
        return;
    }

    // delete text. If state is empty, use default behavior (delete left character)
    if (e.code === "Backspace" && state.length > 0) {
        e.preventDefault();
        const result = remove(state);
        replace(target, result.value, result.select);
        return;
    }

    // hyphen used to unselect
    if (e.key === "-") {
        e.preventDefault();
    }

    target.selectionStart = target.selectionEnd;
}

function isAppendEvent(e: KeyboardEvent) {
    return e.key.length === 1 && isAlpha(e.key);
}
