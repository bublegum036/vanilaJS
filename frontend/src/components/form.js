import config from "../config/config.js";
import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";

export class Form {
    constructor(page) {

        this.page = page;
        this.processElement = null;
        this.agreeElement = null;


        this.fields = [{
            name: 'email',
            id: 'email',
            element: null,
            regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            valid: false
        }, {
            name: 'password',
            id: 'password',
            element: null,
            regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
            valid: false
        }];

        if (this.page === 'index') {
            this.fields.unshift({
                    name: 'fullName',
                    id: 'full-name',
                    element: null,
                    regex: /([А-ЯЁ][а-яё]+[\-\s]?){3,}/,
                    valid: false
                },
                {
                    name: 'passwordRepeat',
                    id: 'password-repeat',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false
                })
        }


        const that = this
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id)
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });
        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        };

        if (this.page === 'login') {
            this.agreeElement = document.getElementById('agree');
            this.agreeElement.onchange = function () {
                that.validateForm()
            }
        }
    };


    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = 'red';
            field.valid = false;
        } else {
            element.removeAttribute('style');
            field.valid = true;
        }
        this.validateForm();
    };

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (this.page === 'login') {
            if (validForm) {
                this.processElement.removeAttribute('disabled', 'disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
        }
        if (this.page === 'index') {
            const passwordValue = this.fields.find(item => item.name === 'password').element.value;
            const passwordRepeatValue = this.fields.find(item => item.name === 'passwordRepeat').element.value;
            if (validForm && passwordValue === passwordRepeatValue) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
        }
    }

    async processForm() {
        if (this.page === 'login') {
            this.agreeElement = document.getElementById('agree')
        }

        const agreeElementValue = this.agreeElement ? this.agreeElement.checked : false;

        if (this.validateForm) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;


            if (this.page === 'index') {
                const fullName = this.fields.find(item => item.name === 'fullName').element.value;
                const passwordRepeat = this.fields.find(item => item.name === 'passwordRepeat').element.value

                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: fullName.split(' ')[0],
                        lastName: fullName.split(' ')[1],
                        email: email,
                        password: password,
                        passwordRepeat: passwordRepeat
                    });

                    if (result) {
                        if (result.error || !result.user && !result.tokens) {
                            throw new Error(result.message)
                        }

                        location.href = '#/finance'
                    }
                } catch (error) {
                    return console.log(error)
                }
            }

            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: agreeElementValue
                });


                if (result) {
                    if (result.error || !result.user && !result.tokens) {
                        throw new Error(result.message)
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        fullName: result.user.name + ' ' + result.user.lastName, userId: result.user.id
                    })

                    location.href = '#/main'
                }
            } catch (error) {
                return console.log(error)
            }
        }
    }
}
