import './graph';

export const Graph = function (options) {
    this.data = options;
    this.myChart = document.querySelector('.box-cycle');

    function _findHour(totalTime) {
        const calculation = Math.floor(totalTime / 60);

        if (calculation === 0) {
            return ' ';
        } else
            return calculation + 'h';
    }

    function _findMin(totalTime) {
        const calculation = totalTime % 60;
        if (calculation === 0) {
            return ' ';
        } else {
            return calculation + 'm';
        }
    }

    this._findMin = _findMin;
    this._findHour = _findHour;

    this.render();
};

Graph.prototype.renderLine = function () {

    const myChartLine = document.createElement('div');
    myChartLine.classList.add('box-cycle__line');
    this.myChart.appendChild(myChartLine);

    const widthWorkGap = this.widthWorkGap;
    const widthShortBreakGap = this.widthShortBreakGap;
    const widthLongBreakGap = this.widthLongBreakGap;

    function _renderWorkTimeGap() {
        const workTimeGap = document.createElement('span');
        workTimeGap.classList.add('box-cycle__work-time');
        workTimeGap.style = `width: ${widthWorkGap}%`;
        myChartLine.appendChild(workTimeGap);
    }

    function _renderShortBreakGap() {
        const shortBreakGap = document.createElement('span');
        shortBreakGap.classList.add('box-cycle__short-break');
        shortBreakGap.style = `width: ${widthShortBreakGap}%`;
        myChartLine.appendChild(shortBreakGap);
    }

    function _renderLongBreakGap() {
        const longBreakGap = document.createElement('span');
        longBreakGap.classList.add('box-cycle__long-break');
        longBreakGap.style = `width: ${widthLongBreakGap}%`;
        myChartLine.appendChild(longBreakGap);
    }

    for (let i = 0; i <= this.workIteration * 2; i++) {
        if (i < this.workIteration - 1) {
            _renderWorkTimeGap();
            _renderShortBreakGap();
        } else if (i === this.workIteration) {
            _renderWorkTimeGap();
            _renderLongBreakGap()
        } else if (i > this.workIteration && i !== this.workIteration * 2) {
            _renderWorkTimeGap();
            _renderShortBreakGap();
        } else if (i === this.workIteration * 2) {
            _renderWorkTimeGap();
        }
    }
};

Graph.prototype.renderLabelBottom = function () {

    let time = 30;
    const labelBottom = document.createElement('div');
    labelBottom.classList.add('box-cycle__label-bottom');
    const margin = this.widthOneMin * +time;

    for (let i = 0; i < this.totalTimeHour * 2; i++) {
        const timeLineScale = document.createElement('span');
        timeLineScale.classList.add('box-cycle__label');

        const timelineText = document.createElement('span');
        timelineText.classList.add('box-cycle__label-text');
        timelineText.innerHTML = this._findHour(time) + this._findMin(time);
        timeLineScale.appendChild(timelineText);

        timeLineScale.style = `margin-left: ${margin}%`;
        labelBottom.appendChild(timeLineScale);

        time += 30;
    }

    this.myChart.appendChild(labelBottom);
};

Graph.prototype.renderLabelTop = function () {

    const labelTop = document.createElement('div');
    labelTop.classList.add('box-cycle__label-top');

    const startTime = document.createElement('span');
    startTime.classList.add('box-cycle__label');

    const firstTopLabel = document.createElement('span');
    firstTopLabel.classList.add('box-cycle__label-text');
    firstTopLabel.innerHTML = '0m';
    startTime.appendChild(firstTopLabel);

    labelTop.appendChild(startTime);

    const firstCycle = document.createElement('span');
    firstCycle.classList.add('box-cycle__label');
    firstCycle.style = `margin-left: ${this.marginFirstCycle}%`;

    const timelineText = document.createElement('span');
    timelineText.classList.add('box-cycle__label-text');
    timelineText.innerHTML = `First cycle: ${this.timeHour} ${this.timeMin}`;
    firstCycle.appendChild(timelineText);

    labelTop.appendChild(firstCycle);

    const finishTime = document.createElement('span');
    finishTime.classList.add('box-cycle__label');
    const lastTopLabel = document.createElement('span');
    lastTopLabel.classList.add('box-cycle__label-text');
    lastTopLabel.innerHTML = ` ${this.totalTimeHour}h ${this.totalTimeMin}m`;
    finishTime.appendChild(lastTopLabel);

    labelTop.appendChild(finishTime);

    this.myChart.appendChild(labelTop);
};

Graph.prototype.setGraphOptions = function (newOptionFromGeneratePage) {
    this.data = newOptionFromGeneratePage || this.data;

    this.workTime = +this.data.workTime;
    this.workIteration = +this.data.workIteration;
    this.shortBreak = +this.data.shortBreak;
    this.longBreak = +this.data.longBreak;

    this.firstCycleTime = (this.workTime * this.workIteration) + (this.shortBreak * (this.workIteration - 1)) + this.longBreak;
    this.totalTime = this.firstCycleTime + (this.workTime * this.workIteration) + (this.shortBreak * (this.workIteration - 1));
    this.widthWorkGap = this.workTime * 100 / this.totalTime;
    this.widthShortBreakGap = this.shortBreak * 100 / this.totalTime;
    this.widthLongBreakGap = this.longBreak * 100 / this.totalTime;
    this.marginFirstCycle = this.firstCycleTime * 100 / this.totalTime;
    this.widthOneMin = 100 / this.totalTime;
    this.totalTimeHour = Math.floor(this.totalTime / 60);
    this.totalTimeMin = this.totalTime % 60;
    this.timeHour = this._findHour(this.firstCycleTime);
    this.timeMin = this._findMin(this.firstCycleTime);
};

Graph.prototype.cleanHtml = function () {
    this.myChart.innerHTML = "";
};

Graph.prototype.render = function (data) {
    const newDataAfterClick = data;

    this.cleanHtml();
    this.setGraphOptions(newDataAfterClick);
    this.renderLabelTop();
    this.renderLine();
    this.renderLabelBottom();
};