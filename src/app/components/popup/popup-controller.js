import {PopupModel} from './popup-model';
import {PopupView} from './popup-view';
import {EventBus} from '../../share/event-bus';
import {events} from '../../share/constants';

export class PopupController {
    constructor(root, data) {
        this.model = new PopupModel(data);
        this.view = new PopupView(root, this.model);

        this.model.registerObserver(this);
        this.model.registerObserver(this.view);

        this.init();
    }

    observe(model) {
    }

    subscribeToEvents() {
        EventBus.subscribe(events.BUTTON_CLOSE_MODAL_CLICK, thisElem => {
            thisElem.remove()
        });

        EventBus.subscribe(events.BUTTON_SAVE_MODAL_CLICK, () => {
            this.view.destroy()
        });

        EventBus.subscribe(events.BUTTON_OPEN_MODAL_CLICK, () => {
            this.view.render()
        });

        EventBus.subscribe(events.EDIT_TASK_CLICKED, obj => {
            this.model._data = obj.data;

            if (obj.editModal === true) {
                this.view.renderEdit(obj.data);
            }
        });

        EventBus.subscribe(events.DELETE_TASKS_CLICK, ()=> {
            this.view.renderDelete()
        });
    }

    init() {
        this.subscribeToEvents();
    }
}
