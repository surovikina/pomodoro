const template = require('./reports.handlebars');
import './report.less';

export class ReportPageView {
    constructor(model) {
        this.model = model;
        this.calendarActiveTab = 'day';
        this.taskActiveTab = 'tasks';
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
        const wrapper = document.querySelector('.wrapper');
        const myMain = document.createElement('main');
        myMain.classList.add('main');
        myMain.innerHTML = template();

        wrapper.appendChild(myMain);

        document.querySelector('.icon-statistics').classList.add('is-active');
        document.querySelector(`[data-target='${this.calendarActiveTab}']`).classList.add('is-active');
        document.querySelector(`[data-target='${this.taskActiveTab}']`).classList.add('is-active');

        this.attachListeners(myMain);
    }

    attachListeners(elem) {
        elem.addEventListener('click', (event) => {
            const target = event.target;

            if (target.classList.contains('tabs__link') && target.parentElement.classList.contains('tabs-calendar__item')) {

                this.calendarActiveTab = target.dataset.target;
                this.model.sortTasksData(this.calendarActiveTab, this.taskActiveTab);

                document.querySelectorAll('#tabs-calendar .tabs__link').forEach(tab => {
                    tab.classList.remove('is-active')
                });
                document.querySelector(`[data-target='${this.calendarActiveTab}']`).classList.add('is-active');
            }

            if (target.classList.contains('tabs__link') && target.parentElement.classList.contains('tabs-task__item')) {

                this.taskActiveTab = target.dataset.target;
                this.model.sortTasksData(this.calendarActiveTab, this.taskActiveTab);

                document.querySelectorAll('#tabs-task .tabs__link').forEach(tab => {
                    tab.classList.remove('is-active')
                });
                document.querySelector(`[data-target='${this.taskActiveTab}']`).classList.add('is-active');
            }
        })
    }
}