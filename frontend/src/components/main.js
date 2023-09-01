import {Chart} from "chart.js/auto";
import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";
import CategoryType from "../config/category-type.js";
import PieConfig from "../config/pie-config-expense.js";
import Period from "../config/period.js";
import PieConfigExpense from "../config/pie-config-expense.js";
import PieConfigIncome from "../config/pie-config-income.js";


export class Main {

    constructor() {
        this.allOperations = null;
        this.mergeSameCategoriesAll = null;
        this.periodElement = null;

        this.btnToday = null;
        this.btnWeek = null;
        this.btnMonth = null
        this.btnYear = null
        this.btnAll = null
        this.btnInterval = null
        this.btnApplyInterval = null;


        this.incomeElement = document.getElementById('income');
        this.expenseElement = document.getElementById('expenses');

        this.incomePie = null;
        this.expensePie = null;


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
                        await this.mergeSameCategories(data);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }


    async getData(period) {
        try {
            const allOperations = await CustomHttp.request(config.host + '/operations?period=' + period);
            if (allOperations) {
                this.allOperations = allOperations;
            }
        } catch (error) {
            console.log(error)
        }
        await this.mergeSameCategories(this.allOperations)
    }

    async mergeSameCategories(operations) {
        this.mergeSameCategoriesAll = [];

        operations.map(item => {
            let operation = item;
            let category = operation.category;
            let amount = operation.amount;
            let type = operation.type;
            let existingOperation = this.mergeSameCategoriesAll.find(function (item) {
                return item.category === category;
            });
            if (existingOperation) {
                existingOperation.amount += amount;
            } else {
                this.mergeSameCategoriesAll.push({type: type, category: category, amount: amount});
            }
        })
        await this.createChart(this.mergeSameCategoriesAll)
    }


    async createChart(data) {

        async function addData(chart, label, data) {
            chart.data.labels.concat(label);
            chart.data.datasets.forEach((dataset) => {
                dataset.data.push(data);
            });
            await chart.update();
        }

        async function removeData(chart) {
            chart.data.labels.pop();
            chart.data.datasets.forEach((dataset) => {
                dataset.data.pop();
            });
            chart.update();
        }

        if (this.incomeElement) {
            if (this.incomePie) {
                if (PieConfigIncome.data.labels.length > 0 && PieConfigIncome.data.datasets[0].data) {
                    PieConfigExpense.data.labels.length = 0
                    PieConfigIncome.data.datasets[0].data.length = 0
                }
                await removeData(this.incomePie)
                await this.incomePie.destroy();
            }
            let incomeOperations = data.filter(operations => operations.type === CategoryType.categoryTypeIncome)
            console.log(incomeOperations)
            let labelsName = incomeOperations.map(operations => operations.category.toString())

            console.log(labelsName)



            PieConfigIncome.data.labels = PieConfig.data.labels.concat(labelsName);
            PieConfigIncome.data.datasets[0].data = incomeOperations.map(operation => operation.amount)
            PieConfigIncome.options.plugins.title.text = 'Доходы';

            this.incomePie = await new Chart(this.incomeElement, PieConfigIncome);
            this.incomePie.update();
        }

        if (this.expenseElement) {
            if (this.expensePie) {
                if (PieConfigExpense.data.labels.length > 0 && PieConfigExpense.data.datasets[0].data.length > 0) {
                    PieConfigExpense.data.labels.length = 0;
                    PieConfigExpense.data.datasets[0].data.length = 0;
                }
                await removeData(this.expensePie)
                await this.expensePie.destroy();
            }
            let expenseOperations = data.filter(operations => operations.type === CategoryType.categoryTypeExpense)
            console.log(expenseOperations)

            let labelsName = expenseOperations.map(operations => operations.category.toString())
            console.log(labelsName)


            PieConfigExpense.data.labels = PieConfig.data.labels.concat(labelsName);
            PieConfigExpense.data.datasets[0].data = expenseOperations.map(operation => operation.amount);
            PieConfigExpense.options.plugins.title.text = 'Расходы';
            this.expensePie = await new Chart(this.expenseElement, PieConfigExpense);
            this.expensePie.update();

        }
    }
}


