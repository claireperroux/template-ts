import './index.css';
import { Clock } from './Clock/Clock';
import { Vector2D } from './Math/Vector2D';
import { Matrix3x3 } from './Math/Matrix3x3';

window.onload = function() {
    document.getElementById('addClockButton').addEventListener('click', () => {
        const hourOffsetInput = document.getElementById('hourOffsetInput') as HTMLInputElement;
        const hourOffset = parseInt(hourOffsetInput.value);
        new Clock(hourOffset);
    });

};








