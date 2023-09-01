import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";

export class AddCategory {
    constructor(page) {
        this.page = page;
        this.pageTitle = null;
        this.routeParams = UrlManager.getQueryParams();


        this.createPage();
    }


    async createPage() {
        this.pageTitle = document.getElementById('content-title');
        const actionButton = document.getElementById('create-edit');
        const cancelButton = document.getElementById('cancel');
        const categoryName = document.getElementById('category-name');
        const that = this;


        if (this.routeParams.create === 'income') {
            this.pageTitle.innerText = 'Создание категории доходов';

        }
        if (this.routeParams.create === 'expense') {
            this.pageTitle.innerText = 'Создание категории расходов'
        }

        if (this.routeParams.edit) {
            actionButton.innerText = 'Редактировать';
        }


        actionButton.onclick = async function () {
            const createCategory = await CustomHttp.request(config.host + '/categories/' + that.routeParams.create, 'POST', {
                title: categoryName.value,
            })
            if (createCategory) {
                location.href = '#/' + that.routeParams.create
                location.reload()
            }
        }

        cancelButton.onclick = function () {
            location.href = '#/' + that.routeParams.create
        }

        if (this.routeParams.edit) {
            this.pageTitle.innerText = 'Редактирование категории расходов';
            const categoryEditName = await CustomHttp.request(config.host + '/categories/' + this.routeParams.edit + '/' + this.routeParams.id);
            if (categoryEditName && categoryEditName.title) {
                categoryName.value = categoryEditName.title
            }
            actionButton.onclick = async function () {
                const editCategory = await CustomHttp.request(config.host + '/categories/' + that.routeParams.edit + '/' + that.routeParams.id, 'PUT', {
                    title: categoryName.value,
                });
                if (editCategory) {
                    location.href = '#/' + that.routeParams.edit
                    location.reload();
                }
            }

            cancelButton.onclick = function () {
                location.href = '#/' + that.routeParams.edit
                location.reload();
            }
        }
    }
}
