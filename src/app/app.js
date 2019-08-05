import 'assets/less/main.less';
import {Header} from './components/header';
import {SettingsPage} from './pages/settings-page';
import {PopupController} from './components/popup/popup-controller';
import {ReportPageController} from "./pages/reports/report-controller";
import {TimerPageController} from "./pages/timer/timer-controller";
import {TasksListPageController} from './pages/tasks-list/tasks-list-controller';
import {FirstTimePageController} from './pages/first-time-page/first-time-page-controller';
import {Router} from './router';
import {EventBus} from "./share/event-bus";
import {events} from "./share/constants";
import {FirebaseService} from "./firebase";

const header = new Header();
const settingsPage = new SettingsPage();
const reportPage = new ReportPageController();
const timerPage = new TimerPageController();
const firstTimePage = new FirstTimePageController();
const tasksListPage = new TasksListPageController();
header.render();

const myRouter = new Router('/task-list');

myRouter.add('/settings', settingsPage);
myRouter.add('/task-list', tasksListPage);
myRouter.add('/report', reportPage);
myRouter.add('/timer', timerPage);
myRouter.add('/first-time', firstTimePage);

myRouter.innit();

document.addEventListener('click', function (event) {
    const target = event.target;

    if (target.parentElement.tagName === 'A' && !target.classList.contains('icon-trash')) {
        event.preventDefault();
        myRouter.navigate(target.parentElement.href);
        history.pushState({href: target.parentElement.href}, null, target.parentElement.href);
    }
});

window.addEventListener('popstate', event => {
    if (event.state) {
        myRouter.navigate(event.state.href);
    }
});

new PopupController(document.querySelector('.wrapper'));

EventBus.subscribe(events.CLICK_NAVIGATE_TASKS_PAGE, (href) => {
    myRouter.navigate(href);
    history.pushState({href: href}, null, href);
});

EventBus.subscribe(events.CLICK_NAVIGATE_SETTINGS_PAGE, (href) => {
    myRouter.navigate(href);
    history.pushState({href: href}, null, href);
});

EventBus.subscribe(events.CLICK_NAVIGATE_TIMER_PAGE, (data) => {
    myRouter.navigate(data.href);
    history.pushState({href: data.href}, null, data.href);
});

EventBus.subscribe(events.CLICK_NAVIGATE_REPORT_PAGE, (data) => {
    myRouter.navigate(data.href);
    history.pushState({href: data.href}, null, data.href);
});

// mock data for test functionality
const dataId = 1991;
const myData = {
    category: "sport",
    completeDate: Date.now(),
    completedCount: 2,
    createDate: 1560081118919,
    deadline: 1560081118919,
    desk: "This is test task COMPLETED today",
    estimation: "3",
    failedPomodoros: 1,
    id: "1991",
    priority: "low",
    status: "COMPLETED",
    title: "Task 6"
};
FirebaseService.setData(`tasks/${dataId}`, myData);

const dataId2 = 1992;
const myData2 = {
    category: "sport",
    completeDate: new Date().setDate(new Date().getDate() - 1),
    completedCount: 2,
    createDate: 1560081118919,
    deadline: 1560081118919,
    desk: "This is test task COMPLETED yesterday",
    estimation: "3",
    failedPomodoros: 1,
    id: "1992",
    priority: "low",
    status: "COMPLETED",
    title: "Task 6"
};
FirebaseService.setData(`tasks/${dataId2}`, myData2);

const dataId3 = 1993;
const myData3 = {
    category: "sport",
    completeDate: new Date().setDate(new Date().getDate() - 9),
    completedCount: 2,
    createDate: 1560081118919,
    deadline: 1560081118919,
    desk: "This is test task COMPLETED yesterday",
    estimation: "3",
    failedPomodoros: 1,
    id: "1992",
    priority: "low",
    status: "COMPLETED",
    title: "Task 6677"
};
FirebaseService.setData(`tasks/${dataId3}`, myData3);

const dataId4 = 1994;
const myData4 = {
    category: "sport",
    completeDate: new Date().setDate(new Date().getDate() - 9),
    completedCount: 4,
    createDate: 1560081118919,
    deadline: 1560081118919,
    desk: "This is test task COMPLETED yesterday",
    estimation: "3",
    failedPomodoros: 1,
    id: "1992",
    priority: "urgent",
    status: "COMPLETED",
    title: "Task 6677"
};
FirebaseService.setData(`tasks/${dataId4}`, myData4);
