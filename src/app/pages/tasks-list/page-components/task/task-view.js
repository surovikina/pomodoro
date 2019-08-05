import {EventBus} from '../../../../share/event-bus';
import {events} from '../../../../share/constants';

const template = require('./task.handlebars');

export class TaskView {
    constructor(root, model) {
        this.root = root;
        this.model = model;
    }

    observe(model) {
        this.model = model;
        this.render();
    }

    render() {
        const fragment = document.createDocumentFragment();
        const task = document.createElement('div');
        task.innerHTML = template(this.model.createTaskDataObj());
        task.setAttribute('draggable', 'true');
        task.classList.add('task__wrapper');
        fragment.appendChild(task);
        this.root.appendChild(fragment);

        this.attachListeners(task);
    }

    attachListeners(elem) {
        const editButton = elem.querySelector('.tasks__edit-btn .icon-edit');
        const moveButton = elem.querySelector('.tasks__edit-btn .icon-arrows-up');
        const timerButton = elem.querySelector('.tasks__estimation-timer');

        editButton.addEventListener('click', event => {
            const target = event.target;

            if (target.parentElement.tagName === 'BUTTON') {
                event.preventDefault();
                EventBus.publish(events.EDIT_TASK_CLICKED, {
                    editModal: true,
                    data: this.model._data
                })
            }
        });

        if (moveButton) {
            moveButton.addEventListener('click', event => {
                const target = event.target;

                if (target.parentElement.tagName === 'BUTTON') {
                    event.preventDefault();
                    this.model.setTaskStatus('DAILY_LIST');

                    EventBus.publish(events.MOVE_TASK_BUTTON_CLICKED, {
                        data: this.model._data,
                    })
                }
            })
        }

        timerButton.addEventListener('click', event => {
            event.preventDefault();
            this.model.setTaskStatus('ACTIVE');

            EventBus.publish(events.CLICK_NAVIGATE_TIMER_PAGE, {data : this.model._data, href: '/timer'})
        });

        elem.addEventListener('click', event => {
            const target = event.target;

            if (target.classList.contains('icon-close') || target.classList.contains('tasks__date')) {
                event.preventDefault();
                elem.classList.toggle('tasks__item--checked');

                EventBus.publish(events.TASK_READY_TO_DELETE_CLICK, this.model._data)
            }
        })
    }
}
