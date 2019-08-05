import {Graph} from './page-components/graph';
import {InputTime} from './page-components/graph-controls';
import {renderInputs} from './page-components/graph-controls/graph-controls';
import {FirebaseService} from '../../firebase';
import {events} from "../../share/constants";
import {EventBus} from "../../share/event-bus";
import './settings-page.less';

const templateSettingsPage = require('./settings-page.handlebars');

export function GeneratePage() {
    const that = this;

    this.workTime = new InputTime({
        elem: document.querySelector('.input-group--work-time'),
        step: +document.querySelector('.input-group--work-time .input-group__digit').getAttribute('step')
    });
    this.workIteration = new InputTime({
        elem: document.querySelector('.input-group--iteration-time'),
        step: +document.querySelector('.input-group--iteration-time .input-group__digit').getAttribute('step')
    });
    this.shortBreak = new InputTime({
        elem: document.querySelector('.input-group--short-break'),
        step: +document.querySelector('.input-group--short-break .input-group__digit').getAttribute('step')
    });
    this.longBreak = new InputTime({
        elem: document.querySelector('.input-group--long-break'),
        step: +document.querySelector('.input-group--long-break .input-group__digit').getAttribute('step')
    });

    FirebaseService.getData("settings/main", (data) => {
        this.graph = new Graph(data);
        this.workTime.setValueToInput(data.workTime);
        this.workIteration.setValueToInput(data.workIteration);
        this.shortBreak.setValueToInput(data.shortBreak);
        this.longBreak.setValueToInput(data.longBreak);

        this.myData = {
            workTime: this.workTime.getValueFromInput(),
            workIteration: this.workIteration.getValueFromInput(),
            shortBreak: this.shortBreak.getValueFromInput(),
            longBreak: this.longBreak.getValueFromInput(),
        };
    });

    this.buttonSubmitData = document.querySelector('#buttonSubmitData');

    this.buttonClickHandler = function (event) {
        event.preventDefault();
        this.graph.render({
            workTime: this.workTime.getValueFromInput(),
            workIteration: this.workIteration.getValueFromInput(),
            shortBreak: this.shortBreak.getValueFromInput(),
            longBreak: this.longBreak.getValueFromInput(),
        });

        FirebaseService.setData("settings/main", {
            workTime: this.workTime.getValueFromInput(),
            workIteration: this.workIteration.getValueFromInput(),
            shortBreak: this.shortBreak.getValueFromInput(),
            longBreak: this.longBreak.getValueFromInput(),
        });

        document.querySelector('.icon-settings').classList.remove('is-active');
        document.querySelector('.icon-list').classList.add('is-active');
        document.querySelector('.icon-trash').parentElement.classList.remove('hidden');
        console.log('We saved your settings;) Good job!');

        EventBus.publish(events.CLICK_NAVIGATE_TASKS_PAGE, '/task-list')
    };

    if (this.buttonSubmitData) {
        this.buttonSubmitData.addEventListener('click', this.buttonClickHandler.bind(that));
    }

    //notify a Subscriber about an Event
    this.workTime.inputsObserver.subscribe(function (value) {
        this.myData.workTime = value;
        this.graph.render(this.myData);
    }.bind(this));

    this.workIteration.inputsObserver.subscribe(function (value) {
        this.myData.workIteration = value;
        this.graph.render(this.myData);
    }.bind(this));

    this.shortBreak.inputsObserver.subscribe(function (value) {
        this.myData.shortBreak = value;
        this.graph.render(this.myData);
    }.bind(this));

    this.longBreak.inputsObserver.subscribe(function (value) {
        this.myData.longBreak = value;
        this.graph.render(this.myData);
    }.bind(this));
}

export class SettingsPage {
    constructor() {
        this.init();
        this.modePomodoros = true;
        this.modeCategories = false;
    }

    render() {
        const contextTemplate = {
            pomodoros: this.modePomodoros,
            categories: this.modeCategories,
        };
        if (document.querySelector('.main')) {
            document.querySelector('.main').remove();
        }
        const wrapper = document.querySelector('.wrapper');
        const myMain = document.createElement('main');
        myMain.classList.add('main');
        myMain.innerHTML = templateSettingsPage(contextTemplate);
        wrapper.appendChild(myMain);

        if (this.modePomodoros) {
            renderInputs();
            new GeneratePage();
        }
        this.attachListeners(myMain);
        // add appropriate nav link  class is-active
        document.querySelector('.icon-settings').classList.add('is-active');
    }

    subscribeToEvents() {
    }

    attachListeners(element) {
        element.addEventListener('click', (event) => {
            const target = event.target;

            if (target.id === 'tasksNavigate') {
                event.preventDefault();

                document.querySelector('.icon-settings').classList.remove('is-active');

                EventBus.publish(events.CLICK_NAVIGATE_TASKS_PAGE, '/task-list')
            }

            if (target.dataset.id === 'pomodoros') {
                this.modePomodoros = true;
                this.modeCategories = false;
                this.render();
            }

            if (target.dataset.id === 'categories') {
                this.modePomodoros = false;
                this.modeCategories = true;
                this.render();
            }
        })
    }

    init() {
        this.subscribeToEvents()
    }
}