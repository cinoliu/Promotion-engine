import Vue from 'vue';
import iView from 'iview';
import { router } from './router/index';
import store from './store';
import App from './app.vue';
import util from '@/libs/util.js';
import hasPermission from '@/libs/hasPermission.js';
import 'iview/dist/styles/iview.css';
import axios from "axios";
import func from "./api/func";
import api from "./api/api";
import qs from "qs";
import ZkTable from 'vue-table-with-tree-grid';

Vue.use(iView);
Vue.use(hasPermission);
Vue.use(ZkTable);
Vue.prototype.$http = axios;
Vue.prototype.api = api;
Vue.prototype.func = func;
Vue.prototype.qs = qs;




new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    mounted () {
        // 调用方法，动态生成路由
        util.initRouter(this);
    }
});









