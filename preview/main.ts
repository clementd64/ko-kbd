import './style.css';

import { append, SelectionState } from '../src/compose.ts';

const textarea = <HTMLTextAreaElement>document.querySelector('textarea');

const status = document.querySelector('#status');
status?.classList.add('enabled');

function isAlpha(c: string): boolean {
    return c.length === 1 && (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z');
}

textarea.addEventListener('keydown', (e) => {
    const target = <HTMLTextAreaElement>e.target;

    if (!e.altKey && !e.ctrlKey && !e.metaKey && isAlpha(e.key)) {
        e.preventDefault();
        const result = append(target.value.slice(target.selectionStart, target.selectionEnd), e.key);

        const start = target.selectionStart;
    
        target.value =
            target.value.slice(0, target.selectionStart) +
            result.value +
            target.value.slice(target.selectionEnd);
    
        console.log(start, start + (result.value.length > 0 ? target.value.length - 1 : 0));
        target.selectionEnd = start + target.value.length;
        target.selectionStart = result.select === SelectionState.None
            ? target.selectionEnd
            : result.select === SelectionState.Last
                ? start + (result.value.length > 0 ? result.value.length - 1 : 0)
                : start;
    }
});
