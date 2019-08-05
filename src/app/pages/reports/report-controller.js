import {ReportPageModel} from "./report-model";
import {ReportPageView} from "./report-view";
import {FirebaseService} from "../../firebase";

export class ReportPageController {
    constructor() {
        this.model = new ReportPageModel();
        this.view = new ReportPageView(this.model);

        this.model.registerObserver(this);
        this.model.registerObserver(this.view);

        this.init();
    }
    observe() {}

    getTaskData() {
        FirebaseService.getData('/tasks', tasks => {
            this.model.setTasks(tasks);
            this.model.sortTasksData(this.view.calendarActiveTab, this.view.taskActiveTab)
        });
    }

    render() {
        this.getTaskData();
    }

    subscribeToEvents() {

    }

    init() {
        this.subscribeToEvents();
    }
}