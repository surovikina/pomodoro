import {FirebaseService} from '../../../../firebase';

export class TaskModel {
    constructor(data) {
        this._data = data;

        this.observers = [];
    }

    registerObserver(fn) {
        this.observers.push(fn)
    }

    notify() {
        this.observers.forEach(observer => observer.observe(this));
    }

    createTaskDataObj() {
        return {
            id: this._data.id,
            title: this._data.title,
            desk: this._data.desk,
            category: this._data.category,
            priority: this._data.priority,
            estimation: this._data.estimation,
            deadlineDay: new Date(this._data.deadline).getDate(),
            deadlineMonth: new Date(this._data.deadline).toLocaleString('en', {
                month: 'long'
            }),
            status: this._data.status,
            createDate: this._data.createDate,
            completedCount: this._data.completedCount,
            failedPomodoros: this._data.failedPomodoros,
            completeDate: this._data.completeDate,
            statusDaily: !(this._data.status === 'DAILY_LIST' || this._data.status === 'ACTIVE' ),
        }
    }

    setTaskStatus(status) {
        this._data.status = status;
        this._data.deadline = Date.now();
        FirebaseService.setData(`tasks/${this._data.id}`, this._data)
    }
}