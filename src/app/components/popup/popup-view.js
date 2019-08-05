import {EventBus} from '../../share/event-bus';
import {events} from '../../share/constants';
import './popup.less';

const template = require('./popup.handlebars');
const templateRemove = require('./popup-remove.handlebars');

export class PopupView {
    constructor(root, model) {
        this.root = root;
        this.model = model;
    }

    observe(model) {
        this.model = model;
        this.renderEdit(id);
    }

    render() {
        const contextAddTask = {
            title: "Add Task",
            defaultChecked: true,
        };

        this.destroy();
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = template(contextAddTask);
        this.root.appendChild(popup);

        this.attachListeners(popup);
        this.attachDataPlugin()
    }

    renderEdit(taskData) {
        const contextEditTask = {
            title: "Edit Task",
            deleteIcon: true,
        };

        this.id = taskData.id;

        this.destroy();
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.setAttribute('data-edit', true);
        popup.innerHTML = template(contextEditTask);

        this.root.appendChild(popup);

        document.querySelector('#title').value = taskData.title;
        document.querySelector('#desk').value = taskData.desk;
        document.querySelector('#deadline').value = new Date(+taskData.deadline).toISOString().substring(0, 10);
        document.querySelector(`input[value=${taskData.category}]`).setAttribute('checked', 'checked');
        document.querySelector(`input[value="${taskData.estimation}"]`).setAttribute('checked', 'checked');
        document.querySelectorAll('.radio-tomato__input').forEach((item, index, arr) => {
            if (index < taskData.estimation) {
                arr[index].classList.add('is-checked')
            }
        });
        document.querySelector(`input[value="${taskData.priority}"]`).setAttribute('checked', 'checked');

        this.attachListeners(popup);
        this.attachDataPlugin()
    }

    attachDataPlugin() {
        $(document).ready(function () {
            Date.prototype.formatMMDDYYYY = function () {
                return `${dt.toLocaleString('default', {month: 'short'})} ${this.getDate()}, ${this.getFullYear()}`
            };
            let dt = new Date();

            $('#deadline').val(dt.formatMMDDYYYY());
            $("#deadline").datepicker({
                minDate: dt,
                dateFormat: "M d, yy",
                monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
                duration: "slow",
                changeMonth: true,
            });

        });

    }

    renderDelete() {
        this.destroy();
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = templateRemove();
        this.root.appendChild(popup);

        this.attachListeners(popup);
    }

    destroy() {
        if (document.querySelector('.popup')) {
            document.querySelector('.popup').remove();
        }
    }

    attachListeners(elem) {
        const popupControls = elem.querySelector('.popup__controls');
        const estimation = document.querySelector('#form-estimation');
        const estimationItems = document.querySelectorAll('.radio-tomato__input');
        const buttonsFooter = document.querySelector('.popup__footer');

        popupControls.addEventListener('click', event => {
            event.preventDefault();
            const target = event.target;

            if (target.classList.contains('icon-close')) {
                EventBus.publish(events.BUTTON_CLOSE_MODAL_CLICK, elem)
            }

            if (target.classList.contains('icon-check') && elem.hasAttribute('data-edit')) {
                EventBus.publish(events.SAVE_BUTTON_EDIT_TASK_CLICKED, this.model.getPopUpData(this.id, this.model._data.status));
                this.destroy();
            }

            if (target.classList.contains('icon-check') && elem.hasAttribute('data-edit') === false) {
                EventBus.publish(events.BUTTON_SAVE_MODAL_CLICK, this.model.getPopUpData())
            }

            if (target.classList.contains('icon-trash')) {
                EventBus.publish(events.CLICK_DELETE_TASK_FROM_MODAL, this.model.getPopUpData(this.id, this.model._data.status));
                this.destroy();
            }
        });

        if (estimation) {

            estimation.addEventListener('click', event => {
                event.preventDefault();
                const target = event.target;

                if (target.classList.contains('radio-tomato__box')) {
                    _removeAllActiveEl(estimationItems);

                    target.previousElementSibling.classList.add('is-checked');
                    target.previousElementSibling.setAttribute('checked', 'true');

                    _mouseOverActiveClass(estimationItems);
                }
            });

            estimation.addEventListener('mouseover', event => {
                event.preventDefault();
                const target = event.target;

                if (target.classList.contains('radio-tomato__box')) {
                    Array.from(estimationItems).forEach(myInput => {
                        myInput.classList.remove('is-checked');
                    });

                    target.previousElementSibling.classList.add('is-checked');

                    _mouseOverActiveClass(estimationItems);
                }
            });

            estimation.addEventListener('mouseleave', event => {
                event.preventDefault();

                for (let i = estimationItems.length - 1; i >= 1; i--) {
                    if (!estimationItems[i].hasAttribute('checked')) {
                        estimationItems[i].classList.remove('is-checked')
                    } else {
                        break;
                    }
                }

                for (let i = 0; i < estimationItems.length; i++) {
                    if (!estimationItems[i].hasAttribute('checked')) {
                        estimationItems[i].classList.add('is-checked')
                    } else {
                        break;
                    }
                }

                estimation.querySelector('[checked]').classList.add('is-checked')
            });

            function _removeAllActiveEl(collectionItems) {
                Array.from(collectionItems).forEach(myInput => {
                        myInput.classList.remove('is-checked');
                        myInput.removeAttribute('checked')
                    }
                );
            }

            function _mouseOverActiveClass(arr) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].classList.contains('is-checked')) {
                        break
                    } else {
                        arr[i].classList.add('is-checked');
                    }
                }
            }
        }

        if (buttonsFooter) {
            buttonsFooter.addEventListener('click', () => {
                const target = event.target;

                if (target.dataset.id === 'cancel-btn') {
                    EventBus.publish(events.CANCEL_BUTTON_POPUP_CLICK);
                    this.destroy();
                }

                if (target.dataset.id === 'remove-btn') {
                    EventBus.publish(events.REMOVE_BUTTON_POPUP_CLICK);
                    this.destroy();
                }
            })
        }
    }
}
