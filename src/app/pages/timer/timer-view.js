import './timer.less';
import {EventBus} from "../../share/event-bus";
import {events} from "../../share/constants";
import {FirebaseService} from "../../firebase";

const template = require('./timer.handlebars');

export class TimerViewPage {
    constructor(model) {
        this.model = model;
        this.pomodoros = this.model.estimation;
    }

    observe(model) {
        this.model = model;
        this.render();
    }

    destroy() {
        if (document.querySelector('.main')) {
            document.querySelector('.main').remove();
        }
    }

    render() {
        this.destroy();
        if (this.model.data) {

            const wrapper = document.querySelector('.wrapper');
            const myMain = document.createElement('main');
            myMain.classList.add('main');
            myMain.innerHTML = template(this.model.data);

            wrapper.appendChild(myMain);
            this.attachListeners(myMain);
            this.renderPoodoros();
            this.showStartTimerMode();

            if (this.model.btnRight) {
                document.querySelector('.arrow-control--next').classList.remove('hidden')
            }

            document.querySelector('.icon-list').classList.remove('is-active');
            document.querySelector('.icon-trash').classList.add('hidden');

        } else {
            console.log('user reload page on timer page. This is out of scope behavior');
        }
    }

    renderPoodoros() {
        const addPomodoroBtn = document.getElementById('add-pomodoro');
        const containerForPomodoro = document.querySelector('.main__timer-btn');
        if (this.model.data.estimation) {
            for (let i = 0; i < this.model.data.estimation; i++) {
                const pomodoro = document.createElement('box-icon');
                pomodoro.innerHTML = '<img src="../images/svg/empty-tomato.svg" alt="">';
                pomodoro.classList.add('box-icon');
                pomodoro.setAttribute('data-pomodoro', `${i + 1}`);

                containerForPomodoro.insertBefore(pomodoro, addPomodoroBtn);
            }
        }
    }

    changePomodoroIcon(status) {
        if (status === 'failed') {
            document.querySelector(`[data-pomodoro='${this.model.pomodoroIteration}']`).firstChild.src = '../images/svg/tomato-failed.svg';
        } else if (status === 'finish') {
            document.querySelector(`[data-pomodoro='${this.model.pomodoroIteration}']`).firstChild.src = '../images/svg/fill-tomato.svg';
        }
    }

    showStartTimerMode() {
        document.querySelectorAll('.main__nav-holder .btn').forEach(btn => {
            btn.classList.add('hidden')
        });
        document.getElementById('btn-start').classList.remove('hidden');
    }

    showActiveTimerMode() {
        document.getElementById('add-pomodoro').classList.add('visibility-hidden');

        document.querySelector('.main__timer-info-text').classList.add('hidden');
        document.querySelector('.main__timer-info-time').classList.remove('hidden');
        document.querySelector('.main__timer-info-message').innerHTML = '';

        document.querySelectorAll('.main__nav-holder .btn').forEach(btn => {
            btn.classList.add('hidden')
        });
        document.getElementById('btn-fail').classList.remove('hidden');
        document.getElementById('btn-finish').classList.remove('hidden');

        document.querySelector('.arrow-control--prev').classList.add('hidden');
    }

    showBreakTimerActiveMode() {

        document.getElementById('add-pomodoro').classList.add('visibility-hidden');

        document.querySelectorAll('.main__nav-holder .btn').forEach(btn => {
            btn.classList.add('hidden')
        });
        document.getElementById('btn-start-pomodoro').classList.remove('hidden');

        document.querySelector('.main__timer-info-text').classList.remove('hidden');
    }

    showBreakTimerFinishMode() {
        document.getElementById('add-pomodoro').classList.remove('visibility-hidden');
        document.querySelector('.main__timer-info-text').classList.add('hidden');
        document.querySelector('.main__timer-min').classList.add('hidden');
        document.querySelector('.main__timer-info-time').classList.add('hidden');
        document.querySelector('.main__timer-info-message').innerHTML = 'Break is over';


        document.querySelectorAll('.main__nav-holder .btn').forEach(btn => {
            btn.classList.add('hidden')
        });
        document.getElementById('btn-start-pomodoro').classList.remove('hidden');
        document.getElementById('btn-finish-task').classList.remove('hidden');
    }

    showComplitedTaskMode() {
        document.querySelector('.progress-ring__circle').style.stroke = 'transparent';
        document.querySelector('#add-pomodoro').classList.add('hidden');

        document.querySelector('.main__timer-min').innerHTML = '';
        document.querySelector('.main__timer-min').classList.add('hidden');
        document.querySelector('.main__timer-info-time').innerHTML = '';
        document.querySelector('.main__timer-info-time').classList.add('hidden');
        document.querySelector('.main__timer-info-text').classList.add('hidden');
        document.querySelector('.main__timer-info-message').innerHTML = 'You Completed Task';

        document.querySelectorAll('.main__nav-holder .btn').forEach(btn => {
            btn.classList.add('hidden')
        });

        document.querySelectorAll('.arrow-control').forEach(arrow => arrow.classList.remove('hidden'))
    }


    attachListeners(elem) {
        elem.addEventListener('click', (event) => {
            const target = event.target;
            event.preventDefault();

            // click on start timer
            if (target.id === 'btn-start') {
                this.model.runTimer({time: 0, deadline: this.model.workTime});
                this.showActiveTimerMode();
                this.model.btnLeft = false;
            }

            //click on fail pomodoro
            if (target.id === 'btn-fail') {
                this.model.stopTimer('failed');
            }

            // click on finish pomodoro
            if (target.id === 'btn-finish') {
                this.model.stopTimer('finish');
            }

            //click on finish task
            if (target.id === 'btn-finish-task') {
                this.model.finishTask();
                this.showComplitedTaskMode();
            }

            //click on start-pomodoro
            if (target.id === 'btn-start-pomodoro') {
                //check if clicked during the break
                if (this.model.timer && this.model.isBreak) {
                    this.model.stopTimer('stopBreak');
                }
                this.model.runTimer({time: 0, deadline: this.model.workTime});
                this.showActiveTimerMode();
                this.model.btnLeft = false;
            }

            // click on add pomodoro
            if (target.classList.contains('icon-add') && target.parentElement.nodeName === 'BUTTON') {
                this.model.data.estimation = +this.model.data.estimation + 1;
                const pomodoros = document.querySelectorAll('.box-icon');
                const newPomodoro = pomodoros[pomodoros.length - 1].cloneNode(true);
                newPomodoro.setAttribute('data-pomodoro', `${pomodoros.length + 1}`);

                document.querySelector('.main__timer-btn').insertBefore(newPomodoro, document.getElementById('add-pomodoro'));

                this.pomodoros += 1;

                if (this.pomodoros === 10) {
                    document.getElementById('add-pomodoro').setAttribute('disabled', 'disabled')
                    document.getElementById('add-pomodoro').classList.add('visibility-hidden');
                }
            }

            //click on arrow right (report page)
            if (target.classList.contains('icon-arrow-right') || target.classList.contains('arrow-control--next')) {
                EventBus.publish(events.CLICK_NAVIGATE_REPORT_PAGE, {href: '/report'});
            }

            //click on arrow left (task list page)
            if (target.classList.contains('icon-arrow-left') || target.classList.contains('arrow-control--prev')) {
                if (this.model.pomodoroIteration === 0) {
                    this.model.data.status = 'DAILY_LIST';
                    FirebaseService.setData(`tasks/${this.model.data.id}`, this.model.data);
                    EventBus.publish(events.CLICK_NAVIGATE_TASKS_PAGE, '/task-list');
                } else {
                    EventBus.publish(events.CLICK_NAVIGATE_TASKS_PAGE, '/task-list');
                }
            }
        })
    }
}
