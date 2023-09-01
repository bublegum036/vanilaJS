import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";
import {UrlManager} from "../utils/url-manager.js";

export class AddFinance {
    constructor(page) {
        this.page = page;
        this.financeType = document.getElementById('finance-type');
        this.categoryType = document.getElementById('category-type');
        this.amountMoney = document.getElementById('amount');
        this.dateOperation = document.getElementById('date');
        this.commentOperation = document.getElementById('comment');
        this.contentTitle = document.getElementById('content-title');
        this.processElement = document.getElementById('process-finance');
        this.cancelElement = document.getElementById('cancel-finance');


        this.operationEdit = null;

        this.routeParams = UrlManager.getQueryParams();

        const that = this;
        this.processElement.onclick = async function () {
           await that.processForm()
        }

        this.cancelElement.onclick = () => {
            location.href = '#/finance'
        }

        this.createPage();
    }


    async createPage() {

        if (this.page === 'add-income') {
            this.contentTitle.innerHTML = 'Создание дохода';
            this.financeType.options[0].removeAttribute('selected', 'selected');
            this.financeType.options[1].setAttribute('selected', 'selected');
            this.financeType.options[1].setAttribute('disabled', 'disabled');
            this.financeType.options[2].remove();
            const financeCategoryData = this.financeType.options[1].value;
            if (financeCategoryData) {
                await this.requestCategory(financeCategoryData);
            }
        }

        if (this.page === 'add-expense') {
            this.contentTitle.innerHTML = 'Создание расхода';
            this.financeType.options[0].removeAttribute('selected', 'selected');
            this.financeType.options[2].setAttribute('selected', 'selected');
            this.financeType.options[2].setAttribute('disabled', 'disabled');
            this.financeType.options[1].remove();
            const financeCategoryData = this.financeType.options[1].value;
            if (financeCategoryData) {
                await this.requestCategory(financeCategoryData);
            }
        }

        if (this.routeParams.operation) {
            await this.createEditOperationPage()
        }
    }

    async requestCategory(financeCategoryData) {
        const data = await CustomHttp.request(config.host + '/categories/' + financeCategoryData);
        if (data) {
            this.categoryType.innerHTML = ' ';
            await this.createCategoryOption(data);
        }
    }

    async createCategoryOption(data) {
        data.forEach(obj => {
            const categoryTypeElement = document.createElement('option');
            categoryTypeElement.setAttribute('value', obj.id);
            categoryTypeElement.setAttribute('name', obj.title);
            categoryTypeElement.innerHTML = obj.title;
            this.categoryType.append(categoryTypeElement);
        })
    }

    async processForm() {

        const type = this.financeType.options[this.financeType.selectedIndex].value;
        const amount = Number(this.amountMoney.value);
        const date = this.dateOperation.value;
        const comment = this.commentOperation.value;
        const categoryId = Number(this.categoryType.options[this.categoryType.selectedIndex].value);
        console.log(categoryId)

        if (this.routeParams.operation) {
            try {
                const request = await CustomHttp.request(config.host + '/operations/' + this.routeParams.operation, 'PUT', {
                    type: type,
                    amount: amount,
                    date: date,
                    comment: comment,
                    category_id: categoryId
                });

                if (request) {
                    location.href = '#/finance'
                }

            } catch (error) {
                console.log(error)
            }
        }

        if (this.page === 'add-income' || this.page === 'add-expense') {
            try {
                const request = await CustomHttp.request(config.host + '/operations', 'POST', {
                    type: type,
                    amount: amount,
                    date: date,
                    comment: comment,
                    category_id: categoryId
                });

                if (request) {
                    location.href = '#/finance'
                }

            } catch (error) {
                console.log(error)
            }
        }

    }

    async createEditOperationPage() {
        this.contentTitle.innerHTML = 'Редактирование операции';

        const disabledType = this.financeType.options[this.financeType.selectedIndex];
        disabledType.removeAttribute('selected');

        try {
            const operation = await CustomHttp.request(config.host + '/operations/' + this.routeParams.operation);
            if (operation) {
                this.operationEdit = operation
                console.log(operation)
                if (operation.type === 'income') {
                    this.financeType.value = operation.type;
                }

                if (operation.type === 'expense') {
                    this.financeType.value = operation.type;
                }
            }
        } catch (error) {
            console.log(error)
        }

        let editFinanceType = this.financeType.options[this.financeType.selectedIndex].value;
        if (editFinanceType) {
            await this.requestCategory(editFinanceType);
        }

        this.financeType.onchange = async () => {
            editFinanceType = this.financeType.options[this.financeType.selectedIndex].value;
            await this.requestCategory(editFinanceType);
        }


        const categoryName = this.operationEdit.category;
        const editCategoryType = this.categoryType.options;

        for (let i = 0; i < editCategoryType.length; i++) {
            if (editCategoryType[i].textContent === categoryName) {
                editCategoryType[i].setAttribute('selected', 'selected')
            }
        }

        this.amountMoney.value = this.operationEdit.amount
        this.dateOperation.value = this.operationEdit.date
        this.commentOperation.value = this.operationEdit.comment
        this.processElement.innerHTML = 'Редактировать'
    }
}
