interface ButtonPosition {
    id: string;
    angle: number;
    rotation: number;
}

export class Clock {

    private hourDisplay: HTMLElement;
    private hourOffset: number;
    private minuteOffset: number;
    private editMode: string;
    private is24HourFormat: boolean;
    private mode: 'AM' | 'PM' | null ;
    private container:HTMLElement;
    private static count = 0; // Compteur statique pour suivre le nombre d'horloges
    private rowCapacity = 3; // Nombre maximal d'horloges par ligne
    private verticalMargin = 350; // Marge verticale entre les horloges
    private initialHourOffset: number;

    constructor( hourOffset: number = 0) {
        this.container = this.createClockElement();
        this.hourDisplay = this.container.querySelector('.hour-display') as HTMLElement;
        this.positionClock();
        this.container.style.position = 'absolute';
        this.hourOffset = hourOffset;
        this.initialHourOffset = hourOffset;
        this.minuteOffset = 0;
        this.editMode = 'notEditable';
        this.is24HourFormat = true;
        this.mode= null;
        this.setupButtons();
        this.attachEventListeners();
        this.updateTime();
        setInterval(() => this.updateTime(), 100);
    }

    private attachEventListeners(): void {
        const buttons: NodeListOf<HTMLButtonElement> = this.container.querySelectorAll('.clock-button');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => this.handleButtonClick((event.target as HTMLElement).classList[1]));
        });
    }

    private handleButtonClick(buttonClass: string): void {
        switch (buttonClass) {
            case 'light-button':
                this.toggleLight();
                break;
            case 'mode-button':
                this.toggleEditMode();
                break;
            case 'increase-button':
                this.increase();
                break;
            case 'reset-button':
                this.reset();
                break;
            case 'format-button':
                this.toggleTimeFormat();
                break;
        }
    }


    private setupButtons(): void {
        const buttonPositions: ButtonPosition[] = [
            { id: 'light-button', angle: 3*Math.PI/4, rotation: 45 }, 
            { id: 'mode-button', angle: 7*Math.PI/4, rotation: 45 }, 
            { id: 'increase-button', angle: Math.PI/4, rotation: -45 },
            { id: 'reset-button', angle: 5*Math.PI/4, rotation: -45 }, 
            { id: 'format-button', angle: 5*Math.PI/2, rotation: 0 }
        ];

        buttonPositions.forEach(button => {
            this.positionButton(button.id, button.angle, button.rotation);
        });
    }

    private positionButton(buttonClass: string, angleRadians: number, rotation:number): void {
        const radius: number = 150;  

        const button = this.container.querySelector(`.${buttonClass}`) as HTMLElement;
        if (!button) throw new Error("Button not found");

        const centerX = this.container.offsetWidth/2;
        const centerY = this.container.offsetHeight/2;

        const xButton = centerX + (radius + button.offsetHeight / 2)* Math.cos(angleRadians);
        const yButton = centerY + (radius + button.offsetHeight / 2)* Math.sin(angleRadians);

        button.style.position = 'absolute';
        button.style.left = `${xButton}px`;
        button.style.top = `${yButton}px`;
        button.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            
    }

    public updateTime(): void {
        let currentTime = new Date();
        let hours = currentTime.getHours() + this.hourOffset;
        let minutes = currentTime.getMinutes() + this.minuteOffset;

        if (minutes >= 60) {
            minutes -= 60;
            hours++;
        } else if (minutes < 0) {
            minutes += 60;
            hours--;
        }

        hours = (hours + 24) % 24; 

        if (!this.is24HourFormat) {
            this.mode = hours >= 12 ? 'PM' : 'AM';
            if (hours > 12) {
                hours -= 12;
            } else if (hours === 0) {
                hours = 12; // Minuit ou midi
            }
        }

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const seconds = currentTime.getSeconds().toString().padStart(2, '0');

        const timeString = this.is24HourFormat ? `${formattedHours}:${formattedMinutes}:${seconds}`
                                                : `${formattedHours}:${formattedMinutes}:${seconds} ${this.mode}`;

        if (this.hourDisplay) {
            this.hourDisplay.textContent = timeString;
        }
    }

  

    public toggleLight(): void {
        if (this.hourDisplay) {
            this.hourDisplay.classList.toggle('light-on');
        }
    }

    public toggleEditMode(): void {
        if (this.editMode === 'notEditable') {
            this.editMode = 'hour';
            this.hourDisplay.classList.add('hour');
        } else if (this.editMode === 'hour') {
            this.editMode = 'minute';
            this.hourDisplay.classList.replace('hour', 'minute');
        } else if (this.editMode === 'minute') {
            this.editMode = 'notEditable';
            this.hourDisplay.classList.remove('minute');
        }
    }

    public increase(): void {
        if (this.editMode !== 'notEditable') {
            if (this.editMode === 'hour') {
                this.hourOffset++;
                if (this.hourOffset >= 24) {
                    this.hourOffset = 0;
                }
            } else if (this.editMode === 'minute') {
                this.minuteOffset++;
                if (this.minuteOffset >= 60) {
                    this.minuteOffset = 0;
                    this.hourOffset++;
                }
            }
            this.updateTime();
        }
    }

    public reset(): void {
        this.hourOffset = this.initialHourOffset; 
        this.minuteOffset = 0; 
        this.updateTime(); 
    }

    public toggleTimeFormat(): void {
        this.is24HourFormat = !this.is24HourFormat;
        this.updateTime();
    }

    private createClockElement(): HTMLElement {
        const container = document.querySelector('.container');
        const clockDiv = document.createElement('div');
        clockDiv.className = 'clock';
        clockDiv.innerHTML = `
            <div class="clock-face">
                <div class="hour-display"></div>
            </div>
            <button class="clock-button light-button">light</button>
            <button class="clock-button mode-button">mode</button>
            <button class="clock-button increase-button">increase</button>
            <button class="clock-button reset-button">Reset</button>
            <button class="clock-button format-button">Format</button>
        `;
        container.appendChild(clockDiv);
        return clockDiv;
    }

    private positionClock() {
        const titleHeight = document.querySelector('h1').offsetHeight;
        const buttonHeight = document.getElementById('addClockButton').offsetHeight;
        const initialTopOffset = 100; 
        const rowNumber = Math.floor(Clock.count / this.rowCapacity);
        const colNumber = Clock.count % this.rowCapacity;
        this.container.style.left = `${colNumber * 33.33}%`;
        this.container.style.top = `${titleHeight + buttonHeight + initialTopOffset + rowNumber * (this.verticalMargin)}px`;
        Clock.count++;
    }
  
  
}
