import {FirstTimePageModel} from './first-time-page-model';
import {FirstTimePageView} from './first-time-page-view';

export class FirstTimePageController {
    constructor(root, data){
        this.view = new FirstTimePageView();
        this.model = new FirstTimePageModel();

        this.data = data;

        this.init();
    }

    render() {
        this.view.render();
    }

    subscribeToEvents() {
    }

    init() {
        this.subscribeToEvents();
    }
}