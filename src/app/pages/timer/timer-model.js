import {Timer} from "./page-components/timer/timer";
import {FirebaseService} from "../../firebase";

export class TimerModelPage {
    constructor() {
        this.observers = [];
        this.data = null;
        this.pomodoroIteration = 0;

        this.isBreak = false;
    }

    registerObserver(fn) {
        this.observers.push(fn)
    }

    notify() {
        this.observers.forEach(observer => observer.observe(this));
    }

    runTimer(data) {
        this.timer = new Timer(data);
        this.timer.start();

        document.querySelector('.main__timer-min').classList.remove('hidden');
    }

    stopTimer(status) {
        switch (status) {
            case 'failed':
                this.data.failedPomodoros += 1;
                break;
            case 'finish':
                this.data.completedCount += 1;
                break;
            case 'stopBreak':
                break;
            case 'finishTask':
                break
        }

        this.timer.stop(status);
    }

    finishTask() {
        this.timer.stop('finishTask');
        this.saveFinishTask()
    }

    saveFinishTask() {
        this.data.status = 'COMPLETED';
        this.data.completeDate = Date.now();
        this.data.estimation = this.pomodoroIteration;

        if (this.data.failedPomodoros > this.data.completedCount) {
            this.data.priority = 'failed';
        }
        FirebaseService.setData(`tasks/${this.data.id}`, this.data)
    }

    getSettingsData() {
        FirebaseService.getData("settings/main", (data) => {
            this.workTime = data.workTime;
            this.workIteration = data.workIteration;
            this.shortBreak = data.shortBreak;
            this.longBreak = data.longBreak;
        });
    }
}
