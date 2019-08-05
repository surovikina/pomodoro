export class TasksListPageModel {
    constructor() {
        this.observers = [];
        this.data = [];

        this.tasksForDelete = [];
    }

    registerObserver(fn) {
        this.observers.push(fn)
    }

    notify() {
        this.observers.forEach(observer => observer.observe(this));
    }

    setTasks(tasks) {
        this.globalData = [];
        this.tasks = tasks;

        if (tasks) {
            Object.keys(tasks).forEach(id => {
                const task = tasks[id];
                this.addToTaskList(task);
            });
        }

        this.data = this.globalData;

        this.notify();
    }

    addToTaskList(task) {
        this.globalData.push(task);
    }

    sortTasksData(priority, activeState) {
        switch (activeState) {
            case  'to-do' :
                if (priority === 'all') {
                    this.data = this.globalData
                } else {
                    this.data = this.globalData.filter(item => item.priority === priority)
                }
                break;
            case 'done':
                if (priority === 'all') {
                    this.data = this.globalData.filter(item => item.status === 'COMPLETED');
                } else {
                    this.data = this.globalData.filter(item => item.status === 'COMPLETED' && item.priority === priority);
                }
        }

        this.notify();
    }

    selectAllTasksFofDelete(status) {
        this.data.forEach(task => {
            if (task.status === status) {
                this.tasksForDelete.push(task)
            }
        });
    }

    resetTasksForDelete(status) {
        if (status) {
            this.tasksForDelete = this.tasksForDelete.filter((task) => {return task.status !== status})
        } else {
            this.tasksForDelete = [];
        }
    }
}
