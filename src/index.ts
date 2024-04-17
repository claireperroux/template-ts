import './index.css';
import { Clock } from './Clock/Clock';

window.onload = function() {
    document.getElementById('addClockButton').addEventListener('click', () => {
        const hourOffsetInput = document.getElementById('hourOffsetInput') as HTMLInputElement;
        const hourOffset = parseInt(hourOffsetInput.value);
        new Clock(hourOffset);
    });
};


