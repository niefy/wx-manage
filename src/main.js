import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueCookie from 'vue-cookie'
import ElementUI from 'element-ui';
import moment from 'moment'

import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/common.css'
import './assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils'
import VueClipboard from 'vue-clipboard2'

Vue.use(ElementUI);
Vue.use(VueClipboard)
Vue.use(VueCookie)
Vue.config.productionTip = false

// 挂载全局
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.prototype.isAuth = isAuth     // 权限方法

moment.locale('zh-cn');
Vue.prototype.$moment = moment; //时间处理

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
