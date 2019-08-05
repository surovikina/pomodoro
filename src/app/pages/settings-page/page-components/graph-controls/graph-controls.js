import {Observable} from '../../../../share/event';

const templateGraphControls = require('./graph-controls.handlebars');

export function renderInputs() {
    const boxHtml = document.createElement('div');
    boxHtml.classList.add('box');
    boxHtml.innerHTML = templateGraphControls();

    const mainContainer = document.querySelector('.main__container');
    const headerCycle = document.querySelector('.header-cycle');

    mainContainer.insertBefore(boxHtml, headerCycle);
}

export class InputTime {
    constructor(options) {
        const that = this;
        this.elem = options.elem;
        this.step = options.step;

        this.input = this.elem.querySelector('.input-group__digit');

        this.buttonControlPlus = this.elem.querySelector('.input-group__control--plus');
        this.buttonControlMinus = this.elem.querySelector('.input-group__control--minus');
        this.inputsObserver = new Observable();

        this.elem.addEventListener('click', this.clickHandler.bind(that));

        return this;
    }

    timeIncrease() {
        if (+this.input.value >= this.input.max) {
            this.buttonControlPlus.setAttribute('disabled', 'true');
            return;
        }

        if (this.buttonControlMinus.hasAttribute('disabled')) {
            this.buttonControlMinus.removeAttribute('disabled');
        }

        this.input.value = +this.input.value + this.step;
    }

    timeDecrease() {
        if (+this.input.value <= this.input.min) {
            this.buttonControlMinus.setAttribute('disabled', 'true');
            return;
        }

        if (this.buttonControlPlus.hasAttribute('disabled')) {
            this.buttonControlPlus.removeAttribute('disabled');
        }

        this.input.value = +this.input.value - this.step;
    }

    clickHandler(event) {
        this.targetItem = event.target;

        if (this.targetItem.classList.contains('input-group__control--plus')) {
            if (this.elem.querySelector('.input-group__control--minus')) {
                this.timeIncrease();
                this.inputsObserver.notify(this.input.value);
            }
        } else if (this.targetItem.classList.contains('input-group__control--minus')) {
            this.timeDecrease();
            this.inputsObserver.notify(this.input.value);
        }
    }

    getValueFromInput() {
        return +this.input.value;
    }

    setValueToInput(data) {
        this.input.value = data
    }
}