import Period from "../config/period.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";

export class FilterPanel {
    constructor(periodElement) {
        if (periodElement) {
            this.createPanel()
        }
    }

    async createPanel () {
        const btnListElement = document.createElement('ul');
        const btnTodayElement = document.createElement('li');

        this.btnToday = document.createElement('button');
        this.btnToday.innerHTML = 'Сегодня';
        this.btnToday.className = 'btn btn-outline-secondary';

        btnTodayElement.append(this.btnToday);
        btnListElement.append(btnTodayElement);

        const btnWeekElement = document.createElement('li');

        this.btnWeek = document.createElement('button');
        this.btnWeek.innerHTML = 'Неделя';
        this.btnWeek.className = 'btn btn-outline-secondary';

        btnWeekElement.append(this.btnWeek);
        btnListElement.append(btnWeekElement);


        const btnMonthElement = document.createElement('li');

        this.btnMonth = document.createElement('button');
        this.btnMonth.innerHTML = 'Месяц';
        this.btnMonth.className = 'btn btn-outline-secondary';

        btnMonthElement.append(this.btnMonth);
        btnListElement.append(btnMonthElement);


        const btnYearElement = document.createElement('li');

        this.btnYear = document.createElement('button');
        this.btnYear.innerHTML = 'Год';
        this.btnYear.className = 'btn btn-outline-secondary';

        btnYearElement.append(this.btnYear);
        btnListElement.append(btnYearElement);


        const btnAllElement = document.createElement('li');

        this.btnAll = document.createElement('button');
        this.btnAll.innerHTML = 'Все';
        this.btnAll.className = 'btn btn-outline-secondary';

        btnAllElement.append(this.btnAll);
        btnListElement.append(btnAllElement);


        const btnIntervalElement = document.createElement('li');

        this.btnInterval = document.createElement('button');
        this.btnInterval.innerHTML = 'Интервал';
        this.btnInterval.className = 'btn btn-outline-secondary';

        btnIntervalElement.append(this.btnInterval);
        btnListElement.append(btnIntervalElement);

        const intervalElement = document.createElement('li');

        const intervalElementDiv = document.createElement('div');
        intervalElementDiv.className = 'interval';

        const intervalElementSpanFromText = document.createElement('span');
        intervalElementSpanFromText.className = 'interval-text'
        intervalElementSpanFromText.innerHTML = 'c';

        intervalElementDiv.append(intervalElementSpanFromText)


        const intervalElementSpanFrom = document.createElement('span');
        intervalElementSpanFrom.className = 'interval-date';
        intervalElementSpanFrom.innerHTML = 'Дата';

        intervalElementDiv.append(intervalElementSpanFrom);


        const intervalElementInputFrom = document.createElement('input');
        intervalElementInputFrom.className = 'input-date';
        intervalElementInputFrom.setAttribute('type', 'date');
        intervalElementInputFrom.setAttribute('id', 'dateFrom');
        intervalElementInputFrom.style.display = 'none'

        intervalElementDiv.append(intervalElementInputFrom)

        const intervalElementSpanToText = document.createElement('span');
        intervalElementSpanToText.className = 'interval-text'
        intervalElementSpanToText.innerHTML = 'по';

        intervalElementDiv.append(intervalElementSpanToText);

        const intervalElementSpanTo = document.createElement('span');
        intervalElementSpanTo.className = 'interval-date';
        intervalElementSpanTo.innerHTML = 'Дата';

        intervalElementDiv.append(intervalElementSpanTo);


        const intervalElementInputTo = document.createElement('input');
        intervalElementInputTo.className = 'input-date';
        intervalElementInputTo.setAttribute('type', 'date');
        intervalElementInputTo.setAttribute('id', 'dateTo');
        intervalElementInputTo.style.display = 'none'

        intervalElementDiv.append(intervalElementInputTo)


        this.btnApplyInterval = document.createElement('button');
        this.btnApplyInterval.className = 'btn btn-outline-secondary w-auto';
        this.btnApplyInterval.innerHTML = 'OK';
        this.btnApplyInterval.setAttribute('id', 'finance-interval-apply');
        this.btnApplyInterval.style.display = 'none';

        intervalElementDiv.append(this.btnApplyInterval)


        intervalElement.append(intervalElementDiv);

        btnListElement.append(intervalElement);
        this.periodElement.append(btnListElement)


        const setBtnClasses = (activeBtn, otherBtn) => {
            activeBtn.className = 'btn btn-secondary';
            otherBtn.forEach(btn => btn.className = 'btn btn-outline-secondary')
        }

        const intervalDisplayVisible = (showElementsBlock, showElementsFlex, hideElements) => {
            showElementsBlock.forEach(element => element.style.display = 'block')
            showElementsFlex.forEach(element => element.style.display = 'flex')
            hideElements.forEach(element => element.style.display = 'none')
        }


        this.btnToday.onclick = async () => {
            setBtnClasses(this.btnToday, [this.btnWeek, this.btnMonth, this.btnYear, this.btnAll, this.btnInterval]);
            intervalDisplayVisible(
                [intervalElementSpanFromText, intervalElementSpanToText],
                [intervalElementSpanFrom, intervalElementSpanTo],
                [intervalElementInputFrom, intervalElementInputTo, this.btnApplyInterval]);
            await this.getData(Period.periodToday)
        }

        this.btnWeek.onclick = async () => {
            setBtnClasses(this.btnWeek, [this.btnToday, this.btnMonth, this.btnYear, this.btnAll, this.btnInterval]);
            intervalDisplayVisible(
                [intervalElementSpanFromText, intervalElementSpanToText],
                [intervalElementSpanFrom, intervalElementSpanTo],
                [intervalElementInputFrom, intervalElementInputTo, this.btnApplyInterval])
            await this.getData(Period.periodWeek)
        }

        this.btnMonth.onclick = async () => {
            setBtnClasses(this.btnMonth, [this.btnToday, this.btnWeek, this.btnYear, this.btnAll, this.btnInterval]);
            intervalDisplayVisible(
                [intervalElementSpanFromText, intervalElementSpanToText],
                [intervalElementSpanFrom, intervalElementSpanTo],
                [intervalElementInputFrom, intervalElementInputTo, this.btnApplyInterval])
            await this.getData(Period.periodMonth)
        }

        this.btnYear.onclick = async () => {
            setBtnClasses(this.btnYear, [this.btnToday, this.btnWeek, this.btnMonth, this.btnAll, this.btnInterval]);
            intervalDisplayVisible(
                [intervalElementSpanFromText, intervalElementSpanToText],
                [intervalElementSpanFrom, intervalElementSpanTo],
                [intervalElementInputFrom, intervalElementInputTo, this.btnApplyInterval])
            await this.getData(Period.periodYear)
        }

        this.btnAll.onclick = async () => {
            setBtnClasses(this.btnAll, [this.btnToday, this.btnWeek, this.btnMonth, this.btnYear, this.btnInterval]);
            intervalDisplayVisible(
                [intervalElementSpanFromText, intervalElementSpanToText],
                [intervalElementSpanFrom, intervalElementSpanTo],
                [intervalElementInputFrom, intervalElementInputTo, this.btnApplyInterval])
            await this.getData(Period.periodAll)
        }

        this.btnInterval.onclick = async () => {
            setBtnClasses(this.btnInterval, [this.btnToday, this.btnWeek, this.btnMonth, this.btnYear, this.btnAll]);
            intervalDisplayVisible(
                [intervalElementSpanFromText, intervalElementSpanToText],
                [intervalElementInputFrom, intervalElementInputTo, this.btnApplyInterval],
                [intervalElementSpanFrom, intervalElementSpanTo])
        }

        let localDateFrom = null;
        intervalElementInputFrom.onchange = () => {
            localDateFrom = intervalElementInputFrom.value;
        }

        let localDateTo = null;
        intervalElementInputTo.onchange = () => {
            localDateTo = intervalElementInputTo.value;
        }

        this.btnApplyInterval.onclick = async () => {
            try {
                const data = await CustomHttp.request(config.host + '/operations?period=' + Period.periodDateFrom + localDateFrom + Period.periodDateTo + localDateTo);
                if (data) {
                    if (data.length !== 0) {
                        await this.createChart(data);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}
