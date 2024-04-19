import './index.css';
import { Clock } from './Clock/Clock';
import { Matrix3x3 } from './Math/Matrix3x3';

window.onload = function() {
    document.getElementById('addClockButton').addEventListener('click', () => {
        const hourOffsetInput = document.getElementById('hourOffsetInput') as HTMLInputElement;
        const hourOffset = parseInt(hourOffsetInput.value);
        if (isNaN(hourOffset)) {
            alert('Veuillez entrer un nombre valide pour le décalage horaire.');
        } else {
            new Clock(hourOffset);
        }
    });
};








