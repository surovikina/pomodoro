import {TimerViewPage} from "./timer-view";
import {TimerModelPage} from "./timer-model";
import {EventBus} from '../../share/event-bus';
import {events} from '../../share/constants';

export class TimerPageController {
    constructor() {
        this.model = new TimerModelPage();
        this.view = new TimerViewPage(this.model);

        this.model.registerObserver(this);
        this.model.registerObserver(this.view);

        this.init();
    }

    observe() {
    }

    render() {
        this.model.getSettingsData();
        this.view.render();
    }

    subscribeToEvents() {
        EventBus.subscribe(events.CLICK_NAVIGATE_TIMER_PAGE, data => {
            this.model.data = data.data;
            this.model.pomodoroQuantity = +data.data.estimation;
            this.view.pomodoros = this.model.pomodoroQuantity;

            this.model.pomodoroIteration = 0;
        });

        EventBus.subscribe(events.FINISH_TIMER, status => {
            this.model.isBreak ? this.model.isBreak = false : this.model.isBreak = true;

            switch (this.model.isBreak) {
                case true:
                    this.model.pomodoroIteration += 1;
                    this.view.changePomodoroIcon(status);
                    if (this.model.pomodoroIteration === +this.model.data.estimation) {
                        this.view.showComplitedTaskMode();
                        this.model.saveFinishTask();
                    } else {
                        this.view.showBreakTimerActiveMode();
                        this.model.pomodoroIteration % this.model.workIteration === 0
                            ? this.model.runTimer({time: 0, deadline: this.model.longBreak})
                            : this.model.runTimer({time: 0, deadline: this.model.shortBreak});
                    }
                    break;
                case false:
                    this.view.showBreakTimerFinishMode();
            }
        });
    }

    init() {
        this.subscribeToEvents();
    }
}
