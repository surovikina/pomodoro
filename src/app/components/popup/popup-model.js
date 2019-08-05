export class PopupModel {
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

    getPopUpData(id, status) {
        function _getUniqueId() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            )
        }

        function _getInputVal(id) {
            return document.getElementById(id).value;
        }

        return {
            id: id || _getUniqueId(),
            title: _getInputVal('title') || '',
            desk: _getInputVal('desk') || '',
            category: document.querySelector('input[name="category"]:checked').value || '',
            priority: document.querySelector('input[name="priority"]:checked').value || '',
            estimation: document.querySelector('input[name="estimation"]:checked').value || '',
            deadline: Date.parse(_getInputVal('deadline')) || Date.now(),
            status: status || 'GLOBAL_LIST',
            createDate: Date.now(),
            completedCount: 0,
            failedPomodoros: 0,
            completeDate: '',
        };
    }
}