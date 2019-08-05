import {EventBus} from "../../../../share/event-bus";
import {events} from "../../../../share/constants";

export const Timer = function (obj) {
    this.time = obj.time;
    this.fps = obj.fps || 60;
    this.deadline = obj.deadline || null;
    this.onStart = obj.onStart || null;

    this.circle = document.querySelector('.progress-ring__circle');
    this.radius = this.circle.r.baseVal.value;
    this.circumference = this.radius * 2 * Math.PI;

    this.circle.style.strokeDashoffset = this.circumference / 100 * this.circumference;
    this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;

    this.start = () => {
        this.interval = setInterval(this.update, 1000 / this.fps)
    };

    this.stop = (status) => {
        clearInterval(this.interval);
        if (status !== 'finishTask') {
            EventBus.publish(events.FINISH_TIMER, status);
        }
    };

    this.update = () => {
        this.time < this.deadline ? this.time += 1 / this.fps : this.stop('finish');
        const timerMessage = document.querySelector('.main__timer-info-time');
        this.currentTime = Math.floor(this.time);
        timerMessage.innerHTML = this.currentTime;

        this.progressPercent = this.time / this.deadline * 100;

        this.setProgress(Math.floor(this.progressPercent))
    };

    this.setProgress = (percent) => {
        this.offset = this.circumference - percent / 100 * this.circumference;
        this.circle.style.strokeDashoffset = this.offset;
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;

        this.circle.style.stroke = "#8da5b8";
    };
};