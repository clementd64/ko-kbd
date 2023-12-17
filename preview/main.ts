import './style.css';

import { keydownListener } from '../src/listener.ts';

document.querySelector('#status')?.classList.add('enabled');
(<HTMLTextAreaElement>document.querySelector('textarea'))
    .addEventListener('keydown', keydownListener);
