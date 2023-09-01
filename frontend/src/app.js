import {Router} from "./router.js";
import { Tooltip, Toast, Popover } from 'bootstrap';
import {popper} from "@popperjs/core";

class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

   async  handleRouteChanging() {
       await this.router.openRoute();
    }
}

(new App());
