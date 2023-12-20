import './style.css';

import { Keyboard } from '../src/listener.ts';

const status = document.querySelector('#status')!;

new Keyboard({
    target: <HTMLTextAreaElement>document.querySelector('#input'),
    enabled: true,
    onEnable: (enabled) => {
        if (enabled) {
            status.classList.add('enabled');
        } else {
            status.classList.remove('enabled');
        }
    },
});
