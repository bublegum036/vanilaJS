import {CustomHttp} from "../services/custom-http.js";
import config from "../config/config.js";

export class Category {

    constructor(page) {
        this.page = page;
        this.contentTitleElement = null;
        this.categoriesElement = null;
        this.categoryNumber = null;
        this.operationsIdForRemove = null;

        this.init(page)
    }

    async init(page) {
        try {
            const operations = await CustomHttp.request(config.host + '/categories/' + page);
            if (operations) {
                await this.createPage(operations, page)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async createPage(operations, page) {
        this.contentTitleElement = document.getElementById('content-title');
        this.categoriesElement = document.getElementById('categories');


        const that = this;

        if (page === 'income') {
            this.contentTitleElement.innerText = 'Доходы';
        }

        if (this.page === 'expense') {
            this.contentTitleElement.innerText = 'Расходы';
        }

        operations.forEach(category => {

            const that = this

            const categoryElement = document.createElement('div');
            categoryElement.className = 'category';
            categoryElement.setAttribute('category-id', category.id);

            const categoryTitleElement = document.createElement('h2')
            categoryTitleElement.className = 'category-title';
            categoryTitleElement.innerHTML = category.title;

            const categoryActionElement = document.createElement('div');
            categoryActionElement.className = 'category-action';

            const editButtonElement = document.createElement('button');
            editButtonElement.className = 'btn btn-primary';
            editButtonElement.innerText = 'Редактировать';
            editButtonElement.onclick = async function () {
                const categoryElement = removeButtonElement.parentNode.parentNode;
                const categoryNumber = categoryElement.getAttribute('category-id');
                that.categoryNumber = categoryNumber;
                await that.editCategory(this, page)
            }

            const removeButtonElement = document.createElement('button');
            removeButtonElement.className = 'btn btn-danger';
            removeButtonElement.innerText = 'Удалить';
            removeButtonElement.onclick = async function () {
                const categoryElement = removeButtonElement.parentNode.parentNode;
                const categoryNumber = categoryElement.getAttribute('category-id');
                let categoryName = categoryElement.childNodes[0].textContent;
                that.categoryNumber = categoryNumber
                try {
                    let data = await CustomHttp.request(config.host + '/operations?period=all');
                    if (data) {
                        Category.operationsIdForRemove = data.filter(operations => {
                            return operations.category === categoryName
                        }).map(item => {
                            return item.id
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
                await that.removeCategory(this, page)
            }

            categoryActionElement.appendChild(editButtonElement)
            categoryActionElement.appendChild(removeButtonElement)
            categoryElement.appendChild(categoryTitleElement);
            categoryElement.appendChild(categoryActionElement);
            this.categoriesElement.appendChild(categoryElement);
        })

        const categoryAddElement = document.createElement('button');
        categoryAddElement.className = 'category category-add';
        categoryAddElement.onclick = function () {
            that.addCategory(this);
        }

        const categoryAddImgElement = document.createElement('img');
        categoryAddImgElement.setAttribute('src', 'images/add.png');
        categoryAddImgElement.setAttribute('alt', 'add');


        categoryAddElement.appendChild(categoryAddImgElement)
        this.categoriesElement.appendChild(categoryAddElement);

    }

    addCategory() {
        location.href = '#/add-category?create=' + this.page
        location.reload()
    }

    async removeCategory() {
        const popup = document.getElementById('popup');
        popup.style.display = 'flex';

        const btnPopupClose = document.getElementById('btn-close');
        btnPopupClose.onclick = () => {
            popup.style.display = 'none';
        }
        const btnRemoveCategory = document.getElementById('btn-remove');
        btnRemoveCategory.onclick = async () => {
            await this.removeCategoryNow();
        }
    }

    async removeCategoryNow() {
        try {
            const remove = await CustomHttp.request(config.host + '/categories/' + this.page + '/' + this.categoryNumber, 'DELETE');
            if (remove) {
                Category.operationsIdForRemove.forEach(item => removeCategory(item))

                async function removeCategory(id) {
                    const removeOperations = await CustomHttp.request(config.host + '/operations/' + id, 'DELETE');
                    if (removeOperations) {
                        alert('все операции, связанные с категорией удалены')
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
        location.reload()
    }

    async editCategory() {
        location.href = '#/add-category?edit=' + this.page + '&id=' + this.categoryNumber;
        location.reload()
    }
}



