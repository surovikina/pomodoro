import {TaskModel} from './task-model';
import {TaskView} from './task-view';
import {EventBus} from "../../../../share/event-bus";
import {events} from "../../../../share/constants";

export class TaskController {
    constructor(root, data) {
        this.model = new TaskModel(data);
        this.view = new TaskView(root, this.model);

        this.model.registerObserver(this);
        this.model.registerObserver(this.view);

        this.data = data;
        this.init()
    }

    observe(model) {
    }

    subscribeToEvents() {
        EventBus.subscribe(events.CLICK_DELETE_TASK_FROM_MODAL, data => {
            this.data = data;
        })
    }

    init() {
        this.subscribeToEvents();
        this.view.render();
    }
}