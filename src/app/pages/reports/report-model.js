import {createHighchart} from './page-components/highcharts'

export class ReportPageModel {
    constructor() {
        this.observers = [];
        this.data = null;
        this.today = new Date;
    }

    registerObserver(fn) {
        this.observers.push(fn)
    }

    notify() {
        this.observers.forEach(observer => observer.observe(this));
    }

    setTasks(tasks) {
        this.globalData = []; // array of objects
        this.tasks = tasks;  // data from firebase [id: task, id: task ...]

        if (tasks) {
            Object.keys(tasks).forEach(id => {
                const task = tasks[id];
                this.addToTaskList(task);
            });
        }
        this.data = this.globalData;
    }

    addToTaskList(task) {
        this.globalData.push(task);
    }

    getPomodorosCount(status) {
        let count = 0;
        this._data.forEach(task => {
            if (task.priority === status && task.priority !== 'failed') {
                count += +task.completedCount
            } else if (task.priority === status && task.priority === 'failed') {
                count += +task.failedPomodoros
            }
        });
        return count;
    }

    getDataPeriod(period) {
        this._data = [];
        for (let key in this.data.statistics) {
            this.data.statistics[key] = new Array(period).fill(0);
        }

        this.globalData.forEach(task => {
            for (let i = 0; i < period; i++) {
                if (new Date(task.completeDate).toLocaleDateString() === new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString()) {
                    this._data.push(task)
                }
            }
        });

    }

    sortTasksData(calendarTab, taskTab) {
        this.notify();
        const root = document.querySelector('.main__graph-holder');
        this.data.interval = calendarTab;
        this.data.type = taskTab;

        switch (calendarTab) {
            case 'day' :
                this._data = this.globalData.filter(task => {
                    return new Date(task.completeDate).toLocaleDateString() === new Date().toLocaleDateString()
                });

                if (taskTab === 'tasks') {
                    this.data.statistics = {
                        urgent: [this._data.filter(task => task.priority === 'urgent').length, 0, 0, 0, 0],
                        high: [0, this._data.filter(task => task.priority === 'high').length, 0, 0, 0],
                        middle: [0, 0, this._data.filter(task => task.priority === 'middle').length, 0, 0],
                        low: [0, 0, 0, this._data.filter(task => task.priority === 'low').length, 0],
                        failed: [0, 0, 0, 0, this._data.filter(task => task.priority === 'failed').length],
                    };

                } else if (taskTab === 'pomodoros') {
                    this.data.statistics = {
                        urgent: [this.getPomodorosCount('urgent'), 0, 0, 0, 0,],
                        high: [0, this.getPomodorosCount('high'), 0, 0, 0],
                        middle: [0, 0, this.getPomodorosCount('middle'), 0, 0],
                        low: [0, 0, 0, this.getPomodorosCount('low'), 0],
                        failed: [0, 0, 0, 0, this.getPomodorosCount('failed')],
                    };
                }

                break;
            case 'week':
                this.getDataPeriod(7);

                if (taskTab === 'tasks') {
                    this._data.forEach(task => {
                        const priority = task.priority;
                        const dataComplete = new Date(task.completeDate);
                        const diff = this.today.getDay() - dataComplete.getDay();

                        this.data.statistics[priority][diff] += 1;
                    });
                } else if (taskTab === 'pomodoros') {
                    this._data.forEach(task => {
                        const priority = task.priority;
                        const dataComplete = new Date(task.completeDate);
                        const diff = this.today.getDay() - dataComplete.getDay();

                        if (priority !== 'failed') {
                            this.data.statistics[priority][diff] += +task.completedCount;
                        } else {
                            this.data.statistics[priority][diff] += +task.failedPomodoros;
                        }
                    })
                }

                break;
            case 'month':
                this.getDataPeriod(30);

                if (taskTab === 'tasks') {
                    this._data.forEach(task => {
                        const priority = task.priority;
                        const dataComplete = new Date(task.completeDate);
                        const oneDay = 24 * 60 * 60 * 1000;

                        const diff = Math.round(Math.abs((this.today.getTime() - dataComplete.getTime()) / (oneDay)));

                        this.data.statistics[priority][diff] += 1;
                    });

                } else if (taskTab === 'pomodoros') {
                    this._data.forEach(task => {
                        const priority = task.priority;
                        const dataComplete = new Date(task.completeDate);
                        const oneDay = 24 * 60 * 60 * 1000;

                        const diff = Math.round(Math.abs((this.today.getTime() - dataComplete.getTime()) / (oneDay)));

                        if (priority !== 'failed') {
                            this.data.statistics[priority][diff] += +task.completedCount;
                        } else {
                            this.data.statistics[priority][diff] += +task.failedPomodoros;
                        }
                    })
                }
                break;
        }

        createHighchart(root, this.data);
    }
}