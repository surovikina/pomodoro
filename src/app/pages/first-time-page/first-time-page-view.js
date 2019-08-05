import {EventBus} from '../../share/event-bus';
import {events} from '../../share/constants';

const template = require('./first-time-page.handlebars');

export class FirstTimePageView {
    constructor(root, model) {
        this.root = root;
        this.model = model;

        this.taskActiveTab = 'task-list'
    }

    render() {
        if (document.querySelector('.main')) {
            document.querySelector('.main').remove();
        }
        const wrapper = document.querySelector('.wrapper');
        const myMain = document.createElement('main');
        myMain.classList.add('main');
        myMain.innerHTML = template();

        wrapper.appendChild(myMain);

        this.attachListeners(myMain);
        // add appropriate nav link  class is-active
        document.querySelector('.icon-trash').classList.add('hidden');
        document.querySelector(`[data-link='${this.taskActiveTab}'] span`).classList.add('is-active');
    }

    attachListeners(elem) {
        const buttonAddTask = elem.querySelector('.main__header-btn');

        buttonAddTask.addEventListener('click', event => {
            event.preventDefault();
            EventBus.publish(events.BUTTON_OPEN_MODAL_CLICK);
        });

        elem.addEventListener('click', (event) => {
            const target = event.target;

            if (target.id === 'settingsNavigate') {
                event.preventDefault();
                EventBus.publish(events.CLICK_NAVIGATE_SETTINGS_PAGE, '/settings')
            }

            if (target.id === 'firstTaskNavigate') {
                event.preventDefault();
                EventBus.publish(events.CLICK_NAVIGATE_TASKS_PAGE, '/task-list')
            }
        })
    }
}
