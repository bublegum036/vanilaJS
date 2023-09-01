import {Form} from "./components/form.js";
import {Main} from "./components/main.js";
import {Finance} from "./components/finance.js";
import {Category} from "./components/category.js";
import {Auth} from "./services/auth.js";
import {AddCategory} from "./components/add-category.js";
import {AddFinance} from "./components/add-finance.js";
import {CustomHttp} from "./services/custom-http";
import config from "./config/config";
import {UrlManager} from "./utils/url-manager.js";

export class Router {
    constructor() {

        this.contentElement = document.getElementById('content');
        this.styleElement = document.getElementById('style');
        this.pageTitleElement = document.getElementById('page-title');
        this.profileFullNameElement = null;

        this.sidebarMainLink = document.getElementById('link-main');
        this.sidebarFinanceLink = document.getElementById('link-finance');
        this.sidebarCategoryLink = document.getElementById('link-category');
        this.sidebarCategoryList = document.getElementById('category-list');
        this.sidebarCategoryIncomeLink = document.getElementById('link-income');
        this.sidebarCategoryExpenseLink = document.getElementById('link-expense');


        this.routeParams = UrlManager.getQueryParams();

        this.routes = [
            {
                route: '#/',
                title: 'Lumincoin Finance',
                template: 'templates/index.html',
                styles: 'styles/index.css',
                load: () => {
                    new Form('index');
                    localStorage.clear()
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: 'styles/index.css',
                load: () => {
                    new Form('login')
                    localStorage.clear()

                }
            },
            {
                route: '#/main',
                title: 'Добро пожаловать!',
                template: 'templates/main.html',
                styles: 'styles/main.css',
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/finance',
                title: 'Доходы и расходы',
                template: 'templates/finance.html',
                styles: 'styles/finance.css',
                load: () => {
                    new Finance();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/category.html',
                styles: 'styles/category.css',
                load: () => {
                    new Category('income');
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                template: 'templates/category.html',
                styles: 'styles/category.css',
                load: () => {
                    new Category('expense');
                }
            },
            {
                route: '#/add-category',
                title: 'Добавить категорию',
                template: 'templates/add-category.html',
                styles: 'styles/add-category.css',
                load: () => {
                    new AddCategory();
                }
            },
            {
                route: '#/add-income',
                title: 'Создние дохода',
                template: 'templates/add-finance.html',
                styles: 'styles/add-finance.css',
                load: () => {
                    new AddFinance('add-income');
                }
            },
            {
                route: '#/add-expense',
                title: 'Создние расхода',
                template: 'templates/add-finance.html',
                styles: 'styles/add-finance.css',
                load: () => {
                    new AddFinance('add-expense');
                }
            },
            {
                route: '#/edit-finance',
                title: 'Редактирование дохода/расхода',
                template: 'templates/add-finance.html',
                styles: 'styles/add-finance.css',
                load: () => {
                    new AddFinance();
                }
            },
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            localStorage.clear();
            window.location.href = '#/';
            return;
        }



        if (urlRoute === '#/main') {
            this.sidebarMainLink.classList.add('sidebar-active');
        } else {
            this.sidebarMainLink.classList.remove('sidebar-active');
        }

        if (urlRoute === '#/finance') {
            this.sidebarFinanceLink.classList.add('sidebar-active');
        } else {
            this.sidebarFinanceLink.classList.remove('sidebar-active');
        }

        if (urlRoute === '#/income' || urlRoute === '#/add-income' || (urlRoute === '#/add-category' && this.routeParams.create === 'income') || (urlRoute === '#/add-category' && this.routeParams.edit === 'income')
            || urlRoute === '#/expense' || urlRoute === '#/add-expense' || (urlRoute === '#/add-category' && this.routeParams.create === 'expense') || (urlRoute === '#/add-category' && this.routeParams.edit === 'expense')) {
            this.sidebarCategoryLink.classList.add('show');
            this.sidebarCategoryLink.classList.add('btn-toggle-last-active');
            this.sidebarCategoryLink.setAttribute('aria-expanded', 'true');
            this.sidebarCategoryList.classList.add('show');
            this.sidebarCategoryList.classList.add('dropdown-menu');
            this.sidebarCategoryList.setAttribute('data-popper-placement', 'bottom-start')
            this.sidebarCategoryList.setAttribute('style', 'position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(47px, 47px);');

            if (urlRoute === '#/income' || urlRoute === '#/add-income' || (urlRoute === '#/add-category' && this.routeParams.create === 'income') || (urlRoute === '#/add-category' && this.routeParams.edit === 'income')) {
                this.sidebarCategoryIncomeLink.classList.add('btn-income-active');
                this.sidebarCategoryExpenseLink.classList.remove('btn-expense-active');
            }
            if (urlRoute === '#/expense' || urlRoute === '#/add-expense' || (urlRoute === '#/add-category' && this.routeParams.create === 'expense') || (urlRoute === '#/add-category' && this.routeParams.edit === 'expense')) {
                this.sidebarCategoryExpenseLink.classList.add('btn-expense-active');
                this.sidebarCategoryIncomeLink.classList.remove('btn-income-active');
            }
        } else {
            if (this.sidebarCategoryLink.classList.contains('show')) {
                this.sidebarCategoryLink.classList.remove('show');
            }
            if (this.sidebarCategoryLink.classList.contains('btn-toggle-last-active')) {
                this.sidebarCategoryLink.classList.remove('btn-toggle-last-active');
            }
            this.sidebarCategoryLink.setAttribute('aria-expanded', 'false');


            if (this.sidebarCategoryList.classList.contains('show')) {
                this.sidebarCategoryList.classList.remove('show');
            }

            this.sidebarCategoryList.removeAttribute('data-popper-placement')
            this.sidebarCategoryList.removeAttribute('style');

            if (this.sidebarCategoryIncomeLink.classList.contains('btn-income-active')) {
                this.sidebarCategoryIncomeLink.classList.remove('btn-income-active');
            }

            if (this.sidebarCategoryExpenseLink.classList.contains('btn-expense-active')) {
                this.sidebarCategoryExpenseLink.classList.remove('btn-expense-active');
            }
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        this.styleElement.setAttribute('href', newRoute.styles);
        this.pageTitleElement.innerText = newRoute.title;

        const userInfo = Auth.getUserInfo();
        this.profileFullNameElement = document.getElementById('user-full-name');

        const sidebar = document.getElementById('sidebar');
        const headContainer = document.getElementById('head-container');
        if (userInfo && sidebar && this.profileFullNameElement) {
            sidebar.style.display = 'inline-flex'
            headContainer.className = 'd-flex flex-nowrap'
            this.profileFullNameElement.innerHTML = userInfo.fullName;
        } else {
            sidebar.style.display = 'none'
            headContainer.className = 'container'
        }

        if (urlRoute === '#/login' || urlRoute === '#/' || urlRoute === '#/index') {
            sidebar.style.display = 'none'
            headContainer.className = 'container'
        }

        const balanceElement = document.getElementById('balance-now');

        if (balanceElement && userInfo) {
            try {
                const result = await CustomHttp.request(config.host + '/balance');
                if (result) {
                    balanceElement.innerHTML = result.balance + '$'
                } else {
                    balanceElement.innerHTML = 'Ошибка'
                }
            } catch (error) {
                console.log(error);
            }
        }

        newRoute.load();
    }
}
