import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";
import Period from "../config/period.js";

export class Finance {

    constructor() {
        this.operationAllElement = document.getElementById('operations-items');
        this.btnToday = null;
        this.btnWeek = null;
        this.btnMonth = null
        this.btnYear = null
        this.btnAll = null
        this.btnInterval = null
        this.btnApplyInterval = null;
        this.periodElement = null;
        this.currencyIndex = 1;

        this.init();
    }

    async init() {
        this.periodElement = document.getElementById('period');
        if (this.periodElement) {
            await this.createPeriodPanel()
        }
    }

    async createPeriodPanel() {
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
        this.periodElement.append(btnListElement);

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
            this.operationAllElement.innerHTML = ' ';
            setBtnClasses(this.btnToday, [this.btnWeek, this.btnMonth, this.btnYear, this.btnAll, this.btnInterval]);
            intervalDisplayVisible(
                [intervalElementSpanFromText, intervalElementSpanToText],
                [intervalElementSpanFrom, intervalElementSpanTo],
                [intervalElementInputFrom, intervalElementInputTo, this.btnApplyInterval]);
            await this.requestData(Period.periodToday)
        }

        this.btnWeek.onclick = async () => {
            this.operationAllElement.innerHTML = ' ';
            setBtnClasses(this.btnWeek, [this.btnToday, this.btnMonth, this.btnYear, this.btnAll, this.btnInterval]);
            intervalDisplayVisible(
                [intervalElementSpanFromText, intervalElementSpanToText],
                [intervalElementSpanFrom, intervalElementSpanTo],
                [intervalElementInputFrom, intervalElementInputTo, this.btnApplyInterval])
            await this.requestData(Period.periodWeek)
        }

        this.btnMonth.onclick = async () => {
            this.operationAllElement.innerHTML = ' ';
            setBtnClasses(this.btnMonth, [this.btnToday, this.btnWeek, this.btnYear, this.btnAll, this.btnInterval]);
            intervalDisplayVisible(
                [intervalElementSpanFromText, intervalElementSpanToText],
                [intervalElementSpanFrom, intervalElementSpanTo],
                [intervalElementInputFrom, intervalElementInputTo, this.btnApplyInterval])
            await this.requestData(Period.periodMonth)
        }

        this.btnYear.onclick = async () => {
            this.operationAllElement.innerHTML = ' ';
            setBtnClasses(this.btnYear, [this.btnToday, this.btnWeek, this.btnMonth, this.btnAll, this.btnInterval]);
            intervalDisplayVisible(
                [intervalElementSpanFromText, intervalElementSpanToText],
                [intervalElementSpanFrom, intervalElementSpanTo],
                [intervalElementInputFrom, intervalElementInputTo, this.btnApplyInterval])
            await this.requestData(Period.periodYear)
        }

        this.btnAll.onclick = async () => {
            this.operationAllElement.innerHTML = ' ';
            setBtnClasses(this.btnAll, [this.btnToday, this.btnWeek, this.btnMonth, this.btnYear, this.btnInterval]);
            intervalDisplayVisible(
                [intervalElementSpanFromText, intervalElementSpanToText],
                [intervalElementSpanFrom, intervalElementSpanTo],
                [intervalElementInputFrom, intervalElementInputTo, this.btnApplyInterval])
            await this.requestData(Period.periodAll)
        }

        this.btnInterval.onclick = async () => {
            this.operationAllElement.innerHTML = ' ';
            setBtnClasses(this.btnInterval, [this.btnToday, this.btnWeek, this.btnMonth, this.btnYear, this.btnAll]);
            intervalDisplayVisible(
                [intervalElementSpanFromText, intervalElementSpanToText],
                [intervalElementInputFrom, intervalElementInputTo, this.btnApplyInterval],
                [intervalElementSpanFrom, intervalElementSpanTo])
        }

        let localDateFrom = null;
        intervalElementInputFrom.onchange = () => {
            localDateFrom = intervalElementInputFrom.value;
            console.log(localDateFrom);
            return localDateFrom;
        }

        let localDateTo = null;
        intervalElementInputTo.onchange = () => {
            localDateTo = intervalElementInputTo.value;
            console.log(localDateTo);
            return localDateTo;
        }

        this.btnApplyInterval.onclick = async () => {
            this.operationAllElement.innerHTML = ' ';
            try {
                const data = await CustomHttp.request(config.host + '/operations?period=' + Period.periodDateFrom + localDateFrom + Period.periodDateTo + localDateTo);
                if (data) {
                    if (data.length !== 0) {
                        await this.createPage(data);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }

    }

    async createPage(data) {

        data.sort((a, b) => a.id - b.id).forEach(item => {

            const that = this;
            const operationNumberElement = document.createElement('span');
            const operationIdElement = item.id
            operationNumberElement.innerHTML = item.id;

            const operationTypeElement = document.createElement('span');
            if (item.type === 'income') {
                operationTypeElement.innerHTML = 'доход';
                operationTypeElement.className = 'text-success'
            } else {
                operationTypeElement.innerHTML = 'расход';
                operationTypeElement.className = 'text-danger'
            }

            const operationCategoryElement = document.createElement('span');
            operationCategoryElement.innerHTML = item.category;

            const categoryAmountElement = document.createElement('span');
            categoryAmountElement.innerHTML = item.amount;

            const categoryDateElement = document.createElement('span');
            categoryDateElement.innerHTML = item.date;

            const categoryCommentElement = document.createElement('span');
            categoryCommentElement.innerHTML = item.comment;


            const categoryRemoveEditElement = document.createElement('span');


            const categoryRemoveElement = document.createElement('img');
            categoryRemoveElement.setAttribute('src', '/images/trash.svg');
            categoryRemoveElement.setAttribute('alt', 'trash');
            categoryRemoveElement.className = 'delete';
            categoryRemoveElement.onclick = () => {
                that.removeElement(operationIdElement, that, this);
            }

            const categoryEditElement = document.createElement('img');
            categoryEditElement.setAttribute('src', '/images/pen.svg');
            categoryEditElement.setAttribute('alt', 'pen');
            categoryEditElement.onclick = () => {
                that.editElement(operationIdElement, that, this);
            }

            categoryRemoveEditElement.appendChild(categoryRemoveElement);
            categoryRemoveEditElement.appendChild(categoryEditElement);


            const operationElement = document.createElement('div');
            operationElement.className = 'operations-item';
            operationElement.appendChild(operationNumberElement);
            operationElement.appendChild(operationTypeElement);
            operationElement.appendChild(operationCategoryElement);
            operationElement.appendChild(categoryAmountElement);
            operationElement.appendChild(categoryDateElement);
            operationElement.appendChild(categoryCommentElement);
            operationElement.appendChild(categoryRemoveEditElement);
            this.operationAllElement.appendChild(operationElement)

        })
    }

    async removeElement(operationIdElement) {
        const popup = document.getElementById('popup');
        popup.style.display = 'flex';
        const removeOperation = document.getElementById('remove');
        const cancelButton = document.getElementById('btn-close');
        removeOperation.onclick = async function () {
            try {
                const removeElement = await CustomHttp.request(config.host + '/operations/' + operationIdElement, 'DELETE');
                if (removeElement) {
                    popup.style.display = 'none';
                    location.reload();
                }
            } catch (error) {
                console.log(error)
            }
        };
        cancelButton.onclick = () => {
            popup.style.display = 'none';
        }
    };

    async editElement(operationIdElement) {
        location.href = '#/edit-finance?operation=' + operationIdElement
    }

    async requestData(period) {
        try {
            const data = await CustomHttp.request(config.host + '/operations/?period=' + period);
            if (data) {
                console.log(data)
                if (data.length !== 0) {
                    await this.createPage(data);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}


