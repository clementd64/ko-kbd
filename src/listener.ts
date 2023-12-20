import { isAlpha, isStateValid, SelectionState } from "./common.ts";
import { append } from "./append.ts";
import { remove } from "./remove.ts";

export interface Element {
    value: string;
    selectionStart: number;
    selectionEnd: number;
    addEventListener: (type: "keydown", listener: (e: KeyboardEvent) => void) => void;
}

function replace(el: Element, value: string, selection: SelectionState) {
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

    const target = e.target as unknown as Element;
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

    // delete text. If state  is empty, use default behavior (delete left character)
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

type KeyboardOptions = {
    target: Element;
    enabled?: boolean;
    onEnable?: (enabled: boolean) => void;
    toggleModeFilter?: (e: KeyboardEvent) => boolean;
};

export class Keyboard {
    #enabled = false;
    #onEnable: (enabled: boolean) => void;
    #target: Element;

    constructor({
        target,
        enabled = false,
        onEnable = () => {},
        toggleModeFilter = (e: KeyboardEvent) => e.altKey && e.code === "Space" && e.repeat === false,
    }: KeyboardOptions) {
        this.#onEnable = onEnable;
        this.#target = target;

        target.addEventListener("keydown", (e) => {
            if (toggleModeFilter(e)) {
                e.preventDefault();
                this.enabled = !this.#enabled;
                return;
            }

            if (this.#enabled) {
                keydownListener(e);
            }
        });

        // trigger onEnable only if enabled
        if (enabled) {
            this.enabled = enabled;
        }
    }

    get enabled() {
        return this.#enabled;
    }

    set enabled(value: boolean) {
        // unselect state when disabling
        if (value === false && isStateValid(this.#target.value.slice(this.#target.selectionStart, this.#target.selectionEnd))) {
            this.#target.selectionStart = this.#target.selectionEnd;
        }

        this.#enabled = value;
        this.#onEnable(value);
    }
}
