import { isAlpha, append, SelectionState, isStateValid } from "./compose.ts";

function replace(el: HTMLTextAreaElement, value: string, selection: SelectionState) {
    const start = el.selectionStart;

    el.value =
        el.value.slice(0, el.selectionStart) +
        value +
        el.value.slice(el.selectionEnd);

    el.selectionEnd = start + el.value.length;

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

    const target = <HTMLTextAreaElement>e.target;
    const state = target.value.slice(target.selectionStart, target.selectionEnd);

    // ignore if invalid state
    if (!isStateValid(state)) {
        return;
    }

    // input text
    if (e.key.length === 1 && isAlpha(e.key)) {
        e.preventDefault();
        const result = append(state, e.key);
        replace(target, result.value, result.select);
        return;
    }

    // delete text
    if (e.code === "Backspace") {
        e.preventDefault();
        // TODO: handle delete
        return;
    }

    // hyphen used to unselect
    if (e.key === "-") {
        e.preventDefault();
    }

    target.selectionStart = target.selectionEnd;
}