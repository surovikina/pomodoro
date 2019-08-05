import './tasks-list.less';
import {EventBus} from '../../share/event-bus';
import {events} from '../../share/constants';
import {TaskController} from './page-components/task/task-controller';

const template = require('./tasks-list.handlebars');

export class TasksListPageView {
    constructor(root, model) {
        this.root = root;
        this.model = model;
        this.context = {};
        this.activeStateTab = 'to-do';
        this.activePriorityTab = 'all';
        this.showTrashIcon = true;
    }

    observe(model) {
        this.model = model;
        this.globalData = model.globalData;
        this.render(model.data);
    }

    setContextForRender() {
        switch (this.activeStateTab) {
            case 'to-do':
                this.datalDayliGloba = this.model.data.filter(task => {
                    return task.status === 'DAILY_LIST' || task.status === 'GLOBAL_LIST'
                });
                if (this.model.data.length === 0 && this.model.globalData === 0) {  // render add first task
                    this.context = {
                        firstTask: true,
                        noTasksLeft: false,
                        tasks: false,
                        tabsTodo: false,
                    };
                    this.showTrashIcon = false

                } else if (this.model.data.length !== 0 && this.datalDayliGloba.length === 0 && this.activePriorityTab === 'all') { // render you don't have any tasks left
                    this.context = {
                        firstTask: false,
                        noTasksLeft: true,
                        tasks: false,
                        tabsTodo: true,
                    };
                    this.showTrashIcon = false

                } else if (this.datalDayliGloba.length > 0) {
                    this.context = {
                        firstTask: false,
                        noTasksLeft: false,
                        tasks: true,
                        tabsTodo: true,
                    };
                    this.showTrashIcon = true;
                }
                break;
            case 'done':
                this.context = {
                    firstTask: false,
                    noTasksLeft: false,
                    tasks: true,
                    tabsTodo: true,
                };
                this.showTrashIcon = true;
        }
    }

    destroy() {
        if (document.querySelector('.main')) {
            document.querySelector('.main').remove();
        }
    }

    renderDailyList(taskStatus, data) {
        // check for message in DAILY LIST section
        const message = document.querySelector('.message');
        if (message) {
            this.globalData.filter(task => task.status === taskStatus).length > 0 ?
                message.style.display = 'none' :
                message.style.display = 'block';
        }
        //render DAILY LIST section
        switch (this.activeStateTab) {
            case  'to-do' :
                this.globalData.forEach(task => {
                    if (task.status === taskStatus) {
                        new TaskController(document.querySelector('.tasks'), task);
                    }
                });
                break;
            case 'done':
                this.globalData.forEach(task => {
                    if (task.completeDate !== '') {
                        const dataComplete = new Date(task.completeDate).toLocaleDateString();
                        if (task.status === taskStatus && dataComplete === data) {
                            new TaskController(document.querySelector('.tasks'), task);
                        }
                    }
                });
        }
    }

    renderGlobalList(dataSort, taskStatus) {
        //render GLOBAL LIST section
        let _sortData = dataSort || this.globalData;
        switch (this.activeStateTab) {
            case  'to-do' :

                break;
            case 'done':
                _sortData = dataSort.filter(task => {
                    return new Date(task.completeDate).toLocaleDateString() !== new Date().toLocaleDateString()
                });
        }
        _sortData.forEach(task => {
            if (task.category === 'education' && task.status === taskStatus) {
                this.renderTaskCategoryGlobal('education', 'Education', task);
            }
            if (task.category === 'work' && task.status === taskStatus) {
                this.renderTaskCategoryGlobal('work', 'Work', task);
            }
            if (task.category === 'hobby' && task.status === taskStatus) {
                this.renderTaskCategoryGlobal('hobby', 'Hobby', task);
            }
            if (task.category === 'sport' && task.status === taskStatus) {
                this.renderTaskCategoryGlobal('sport', 'Sport', task);
            }
            if (task.category === 'other' && task.status === taskStatus) {
                this.renderTaskCategoryGlobal('other', 'Other', task);
            }
        });
        // add appropriate priority tab link class is-active
        document.querySelectorAll('#priority-tabs .tabs__link').forEach(link => link.classList.remove('is-active'));
        if (document.querySelector('#priority-tabs')) {

            document.querySelector(`#priority-tabs [data-link=${this.activePriorityTab}]`).classList.add('is-active');
        }
    }

    render(dataSort) {
        this.setContextForRender();
        this.destroy();

        const wrapper = document.querySelector('.wrapper');
        const myMain = document.createElement('main');
        myMain.classList.add('main');
        myMain.innerHTML = template(this.context);

        wrapper.appendChild(myMain);

        switch (this.activeStateTab) {
            case 'to-do':
                this.renderDailyList('DAILY_LIST');
                this.renderGlobalList(dataSort, 'GLOBAL_LIST');

                break;
            case 'done':
                this.renderDailyList('COMPLETED', new Date().toLocaleDateString());
                this.renderGlobalList(dataSort, 'COMPLETED',);

                document.querySelectorAll('.tasks').forEach(block => block.classList.add('tasks--done'));
        }

        //add appropriate state tab link class is-active
        document.querySelectorAll('#state-tabs .tabs__link').forEach(link => link.classList.remove('is-active'));
        document.querySelector(`#state-tabs [data-link=${this.activeStateTab}]`).classList.add('is-active');

        //render Trash Icon
        if (this.showTrashIcon) {
            document.querySelector('.icon-trash').parentElement.classList.remove('hidden');
            document.querySelector('.icon-trash').classList.remove('hidden');
        } else {
            document.querySelector('.icon-trash').parentElement.classList.add('hidden');
        }
        // add appropriate nav link class is-active
        document.querySelector('.icon-list').classList.add('is-active');

        this.attachListeners(myMain);
    }

    renderTaskCategoryGlobal(category, header, dataForTask) {
        if (!document.querySelector(`.tasks--category-${category}`)) {
            const tasks = document.createElement('div');
            tasks.classList.add('tasks');
            tasks.classList.add(`tasks--category-${category}`);
            tasks.classList.add('tasks--category');

            tasks.innerHTML = `<h2 class="tasks__header-category">${header}</h2>`;
            document.querySelector('.main__container').appendChild(tasks);
        }

        new TaskController(document.querySelector(`.tasks--category-${category}`), dataForTask);
    }

    renderQuantityTasksForDelete() {
        const notificationDelete = document.querySelector('.nav__item-notification');
        if (this.model.tasksForDelete.length === 0) {
            notificationDelete.classList.add('hidden');
            notificationDelete.innerText = this.model.tasksForDelete.length;
        } else {
            notificationDelete.innerText = this.model.tasksForDelete.length;
        }
    }

    setRemoveModeStyle() {
        const wrapperHeader = document.querySelector('.main__header-bottom');
        const removeSelectTabs = document.querySelector('.tabs--whole-width');

        document.querySelectorAll('.tasks').forEach(item => {
            item.classList.add('tasks--remove')
        });

        wrapperHeader.classList.remove('right-content');
        wrapperHeader.classList.add('justify-content');
        removeSelectTabs.classList.remove('hidden');

        document.querySelector('#select-tabs-daily');
    }

    attachListeners(elem) {
        const btnGlobalTaskList = elem.querySelector('.link-nav-global');

        elem.addEventListener('click', event => {
            const target = event.target;

            //click on add task
            if (target.classList.contains('icon-add') && target.parentElement.nodeName === 'BUTTON') {
                event.preventDefault();
                EventBus.publish(events.BUTTON_OPEN_MODAL_CLICK);
            }
            //click on global list bnt
            if (target.classList.contains('link-nav-global')) {
                event.preventDefault();

                btnGlobalTaskList.classList.toggle('is-open');

                if (btnGlobalTaskList.classList.contains('is-open')) {
                    document.querySelectorAll('.tasks--category').forEach(tasksContainer =>
                        tasksContainer.style.display = 'block'
                    );
                    btnGlobalTaskList.nextElementSibling.style.display = 'block'

                } else {
                    document.querySelectorAll('.tasks--category').forEach(tasksContainer =>
                        tasksContainer.style.display = 'none'
                    );
                    btnGlobalTaskList.nextElementSibling.style.display = 'none'
                }
            }
            // click on priority tabs
            if (target.classList.contains('tabs__link') && target.parentElement.classList.contains('priority-tab')) {
                event.preventDefault();
                this.activePriorityTab = target.dataset.link;
                this.model.sortTasksData(target.dataset.link, this.activeStateTab);
            }
            // click on priority DONE state tab
            if (target.classList.contains('tabs__link') && target.parentElement.classList.contains('state-tab')) {
                event.preventDefault();
                this.activeStateTab = target.dataset.link;
                this.model.sortTasksData(this.activePriorityTab, target.dataset.link);
            }

            if (target.classList.contains('tabs__link') && target.dataset.select === 'select-all-daily') {
                event.preventDefault();
                if (!target.classList.contains('is-active')) {
                    document.querySelectorAll('#select-tabs-daily .tabs__link').forEach(link => link.classList.remove('is-active'));

                    target.classList.add('is-active');

                    document.querySelector('.tasks--daily').childNodes.forEach(task => task.classList.add('tasks__item--checked'));
                    document.querySelector('.nav__item-notification').classList.remove('hidden');

                    this.model.selectAllTasksFofDelete('DAILY_LIST');
                    this.renderQuantityTasksForDelete();
                }
            }

            if (target.classList.contains('tabs__link') && target.dataset.select === 'deselect-all-daily') {
                event.preventDefault();

                document.querySelectorAll('#select-tabs-daily .tabs__link').forEach(link => link.classList.remove('is-active'))
                target.classList.add('is-active');

                document.querySelector('.tasks--daily').childNodes.forEach(task => task.classList.remove('tasks__item--checked'));
                document.querySelector('.nav__item-notification').classList.remove('hidden');

                this.model.resetTasksForDelete('DAILY_LIST');
                this.renderQuantityTasksForDelete();
            }

            if (target.classList.contains('tabs__link') && target.dataset.select === 'select-all-global') {
                event.preventDefault();
                if (!target.classList.contains('is-active')) {

                    document.querySelectorAll('#select-tabs-global .tabs__link').forEach(link => link.classList.remove('is-active'))
                    target.classList.add('is-active');

                    document.querySelectorAll('.tasks--category .task__wrapper').forEach(task => task.classList.add('tasks__item--checked'));
                    document.querySelector('.nav__item-notification').classList.remove('hidden');


                    this.model.selectAllTasksFofDelete('GLOBAL_LIST');
                    this.renderQuantityTasksForDelete();
                }
            }

            if (target.classList.contains('tabs__link') && target.dataset.select === 'deselect-all-global') {
                event.preventDefault();

                document.querySelectorAll('#select-tabs-global .tabs__link').forEach(link => link.classList.remove('is-active'))
                target.classList.add('is-active');

                document.querySelectorAll('.tasks--category .task__wrapper').forEach(task => task.classList.remove('tasks__item--checked'));
                document.querySelector('.nav__item-notification').classList.remove('hidden');

                this.model.resetTasksForDelete('GLOBAL_LIST');
                this.renderQuantityTasksForDelete();
            }
        })
    }
}
