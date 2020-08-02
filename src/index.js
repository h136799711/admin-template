import Vue from 'vue'
import App from './App.vue'
import axios from 'axios' // Promise based HTTP client for the browser and node.js
import _ from 'lodash' //
import Lockr from 'lockr' // 用于缓存较大的数据
import moment from 'moment' // 日期处理
import ElementUI from 'element-ui'
import '../theme/reset.css' // elementui theme
import '../theme/index.css' // elementui theme
import VueRouter from 'vue-router'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import store from './store/index'
import routes from './routes'
import './assets/plugins/fullscreen'
import base64Utils from 'js-base64'
import md5Utils from './assets/plugins/md5Utils'
import cache from './assets/plugins/cache'
import tools from './assets/plugins/tools'
import Finger from 'fingerprintjs2'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhCN from './i18n/zh-CN'
import en from './i18n/en'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// use
Vue.use(mavonEditor)

const messages = {
	en: {
		...en,
		...enLocale // 或者用 Object.assign({ message: 'hello' }, enLocale)
	},
  'zh': {
		...zhCN,
		...zhLocale // 或者用 Object.assign({ message: '你好' }, zhLocale)
	}
}

axios.defaults.baseURL = ''
axios.defaults.timeout = 30000
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.withCredentials = false


const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes
})

router.beforeEach((to, from, next) => {
  // const hideLeft = to.meta.hideLeft
  // store.dispatch('showLeftMenu', hideLeft)
  // store.dispatch('showLoading', true)
  NProgress.start();
  next()
})

router.afterEach(transition => {
  NProgress.done();
})

Vue.use(VueI18n)
Vue.use(ElementUI, {
	i18n: (key, value) => i18n.t(key, value)
})
Vue.use(VueRouter)
// Create VueI18n instance with options
const i18n = new VueI18n({
    locale: 'zh', // set locale
	messages, // set locale messages
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
  let token = cache.getValue('BY_TOKEN');
  if (token) {
    return token;
  }
	if (window.requestIdleCallback) {
		requestIdleCallback(function () {
      window.tools.finger.get(function (components) {
				cache.setValue('BY_TOKEN', components, 7200);
				itboye.clientInfo.deviceToken = components;
			})
		})
	} else {
		setTimeout(function () {
			window.tools.finger.get(function (components) {
				cache.setValue('BY_TOKEN', components, 7200);
				itboye.clientInfo.deviceToken = components;
			})
		}, 500)
	}
	return "";
}
i18n.locale = tools.getBrowseLanguage();
console.log('locale= ', i18n.locale)
const bus = new Vue()
window.bus = bus
window.tools.alertError = (msg) => {
  if (bus._byAlert) bus._byAlert.close()
  bus._byAlert = bus.$message({
    message: msg,
    type: 'error',
    showClose: true,
    duration: 4000
  })
}
window.tools.alertInfo = (msg) => {
  if (bus._byAlert) bus._byAlert.close()
  bus._byAlert = bus.$message({
    message: msg,
    type: 'info',
    showClose: true,
    duration: 3000
  })
}
window.tools.alertSuc = (msg, duration) => {
  if (bus._byAlert) bus._byAlert.close()
  bus._byAlert = bus.$message({
    message: msg,
    type: 'success',
    showClose: true,
    duration: duration || 1500
  })
}
window.tools.alertWarn = (msg) => {
  if (bus._byAlert) bus._byAlert.close()
  bus._byAlert = bus.$message({
    message: msg,
    type: 'warning',
    showClose: true,
    duration: 2500
  })
}
window.tools.alertClose = () => {
  if (bus._byAlert) bus._byAlert.close()
}

window.itboye.vue_instance = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router,
  store,
	i18n
}).$mount('#app')
