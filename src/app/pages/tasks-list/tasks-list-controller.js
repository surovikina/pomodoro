import {TasksListPageView} from './tasks-list-view';
import {TasksListPageModel} from './tasks-list-model';
import {FirebaseService} from '../../firebase';
import {EventBus} from '../../share/event-bus';
import {events} from '../../share/constants';

export class TasksListPageController {
    constructor(root) {
        this.model = new TasksListPageModel();
        this.view = new TasksListPageView(root, this.model);

        this.model.registerObserver(this);
        this.model.registerObserver(this.view);

        this.init();
    }

    observe() {}

    getTaskData() {
        FirebaseService.getData('/tasks', tasks => {
            this.model.setTasks(tasks)
        });
    }

    writeTaskData(data) {
        FirebaseService.setData(`tasks/${data.id}`, data);
    }

    deleteTasksData(data) {
        data.forEach(task => {
            FirebaseService.deleteData(`tasks/${task.id}`)
        });

        this.model.resetTasksForDelete();
        this.view.renderQuantityTasksForDelete();
    }

    render() {
        this.getTaskData();
    }

    subscribeToEvents() {
        EventBus.subscribe(events.BUTTON_SAVE_MODAL_CLICK, data => {
            this.writeTaskData(data);
            this.getTaskData();
        });

        EventBus.subscribe(events.SAVE_BUTTON_EDIT_TASK_CLICKED, data => {
            this.writeTaskData(data);
            this.getTaskData();
        });

        EventBus.subscribe(events.MOVE_TASK_BUTTON_CLICKED, data => {
            this.getTaskData();
        });

        EventBus.subscribe(events.REMOVE_MODE_CLICK, (event)=>{ this.view.setRemoveModeStyle() });

        EventBus.subscribe(events.TASK_READY_TO_DELETE_CLICK, data => {
            if (this.model.tasksForDelete.find(task => task.id === data.id)) {

                this.model.tasksForDelete.forEach((item, index) => {
                    if (item.id === data.id) {
                        this.model.tasksForDelete.splice(index, 1)
                    }
                })
            } else {
                this.model.tasksForDelete.push(data)
            }

            this.view.renderQuantityTasksForDelete();
        });

        EventBus.subscribe(events.REMOVE_BUTTON_POPUP_CLICK, () => {
            this.deleteTasksData(this.model.tasksForDelete);
            this.render();
        });

        EventBus.subscribe(events.CLICK_DELETE_TASK_FROM_MODAL, (data) => {

            document.getElementById(`${data.id}`).parentElement.classList.add('tasks__item--checked');
            document.querySelector('.nav__item-notification').classList.remove('hidden');

            this.view.setRemoveModeStyle();
            this.model.tasksForDelete.push(data);
            this.view.renderQuantityTasksForDelete();
        });

        EventBus.subscribe(events.SAVE_BUTTON_EDIT_TASK_CLICKED, ()=> {
            this.view.activePriorityTab = 'all';
        } )
    }

    init() {
        this.subscribeToEvents();
    }
}
