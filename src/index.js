import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios' // Promise based HTTP client for the browser and node.js
import _ from 'lodash' //
import Lockr from 'lockr' // 用于缓存较大的数据
import moment from 'moment' // 日期处理

import { createRouter, createWebHashHistory } from 'vue-router'
import {createI18n} from 'vue-i18n'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './store/index'
import routes from './routes'
import './assets/plugins/fullscreen'
import base64Utils from 'js-base64'
import md5Utils from './assets/plugins/md5Utils'
import cache from './assets/plugins/cache'
import tools from './assets/plugins/tools'
import Finger from 'fingerprintjs2'
// ElementPlus
import '../static/reset.css'
import 'element-plus/lib/theme-chalk/index.css'
import '../static/index.css' // black theme
import ElementPlus from 'element-plus'
import enLocale from 'element-plus/lib/locale/lang/en'
import zhLocale from 'element-plus/lib/locale/lang/zh-CN'

import zhCN from './i18n/zh-CN'
import en from './i18n/en'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'vue-json-pretty/lib/styles.css'

axios.defaults.baseURL = ''
axios.defaults.timeout = 30000
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.withCredentials = false

const router = createRouter({
    history: createWebHashHistory(__dirname),
    routes
})

router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
})

router.afterEach(transition => {
    NProgress.done()
})
const messages = {
    zh: {
        el: zhLocale.el,
        ...zhCN
    },
    en: {
        el: enLocale.el,
        ...en
    }
};

// Create VueI18n instance with options
const i18n = createI18n({
    locale: 'zh',
    fallbackLocale: 'en',
    messages
})

window.itboye = window.itboye || {}
window.itboye.clientInfo = window.itboye.clientInfo || {}
window.Lockr = Lockr
window.moment = moment
window.axios = axios
window._ = _
window.cache = cache
window.tools = tools
window.tools.md5Utils = md5Utils
window.tools.base64Utils = base64Utils.Base64
window.tools.finger = new Finger()
window.tools.getDeviceToken = function () {
    let token = cache.getValue('BY_TOKEN')
    if (token) {
        return token
    }
    if (window.requestIdleCallback) {
        requestIdleCallback(function () {
            window.tools.finger.get(function (components) {
                cache.setValue('BY_TOKEN', components, 7200)
                itboye.clientInfo.deviceToken = components
            })
        })
    } else {
        setTimeout(function () {
            window.tools.finger.get(function (components) {
                cache.setValue('BY_TOKEN', components, 7200)
                itboye.clientInfo.deviceToken = components
            })
        }, 500)
    }
    return ''
}
// i18n.locale = tools.getBrowseLanguage()

const app = createApp(App)

// use
app.use(mavonEditor)
app.use(ElementPlus,{
    i18n: i18n.global.t
})
app.use(i18n)
app.use(router)
app.use(store)
window.itboye.vue_instance = app.mount('#app')
window.tools.alertError = (msg) => {
    if (window.itboye.vue_instance._byAlert) window.itboye.vue_instance._byAlert.close()
    window.itboye.vue_instance._byAlert = window.itboye.vue_instance.$message({
        message: msg,
        type: 'error',
        showClose: true,
        duration: 4000
    })
}
window.tools.alertInfo = (msg) => {
    if (window.itboye.vue_instance._byAlert) window.itboye.vue_instance._byAlert.close()
    window.itboye.vue_instance._byAlert = window.itboye.vue_instance.$message({
        message: msg,
        type: 'info',
        showClose: true,
        duration: 3000
    })
}
window.tools.alertSuc = (msg, duration) => {
    if (window.itboye.vue_instance._byAlert) window.itboye.vue_instance._byAlert.close()
    window.itboye.vue_instance._byAlert = window.itboye.vue_instance.$message({
        message: msg,
        type: 'success',
        showClose: true,
        duration: duration || 1500
    })
}
window.tools.alertWarn = (msg) => {
    if (window.itboye.vue_instance._byAlert) window.itboye.vue_instance._byAlert.close()
    window.itboye.vue_instance._byAlert = window.itboye.vue_instance.$message({
        message: msg,
        type: 'warning',
        showClose: true,
        duration: 2500
    })
}
window.tools.alertClose = () => {
    if (window.itboye.vue_instance._byAlert) window.itboye.vue_instance._byAlert.close()
}
