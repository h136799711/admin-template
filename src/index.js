import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './store/index'
import routes from './routes'
import './assets/plugins/fullscreen'
import config from './assets/plugins/config'
// ElementPlus
import '../static/reset.css'
import 'element-plus/lib/theme-chalk/index.css'
import '../static/index.css' // black theme
import ElementPlus from 'element-plus'
import enLocale from 'element-plus/lib/locale/lang/en'
import zhLocale from 'element-plus/lib/locale/lang/zh-CN'
import ElementLocale from 'element-plus/lib/locale'

//VMdEditor Start
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor'
import '@kangc/v-md-editor/lib/style/codemirror-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// codemirror 编辑器的相关资源
import Codemirror from 'codemirror'
// mode
import 'codemirror/mode/markdown/markdown'
// placeholder
import 'codemirror/addon/display/placeholder'
// active-line
import 'codemirror/addon/selection/active-line'
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
// style
import 'codemirror/lib/codemirror.css'
import jwtApi from './api/jwtApi'
import { dbhTool } from '@peter_xiter/dbh-js-tools/index'

VMdEditor.Codemirror = Codemirror
VMdEditor.use(githubTheme)

//VMEditor End

import zhCN from './i18n/zh-CN'
import en from './i18n/en'

import 'vue-json-pretty/lib/styles.css'

const router = createRouter({
    history: createWebHashHistory(__dirname),
    routes
})
// 刷新 JWT Token
router.beforeEach((to, from) => {
    NProgress.start()
    if (to.path === '/login') {
        return true
    }
    let jwt = dbhTool.getJwt()
    if (jwt) {
        let expTime = dbhTool.getJwtExpireTime()
        if (expTime < (new Date()).getTimestamp() + 300) {
            jwtApi.refresh({}).then((resp) => {
                if (resp.jwt && resp.jwt_expire) {
                    console.debug('Refresh Token')
                    dbhTool.setJwt(resp.jwt, resp.jwt_expire)
                }
            }).catch((reason => {
                console.debug('Refresh Token Failed', reason)
            }))
        } else {
            console.debug('Cached Token', (new Date(expTime * 1000).format('yyyy-MM-dd hh:mm')))
        }
    }
    return true
})

router.afterEach(transition => {
    NProgress.done()
})
// ElementLocale.i18n
// Create VueI18n instance with options
const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'zh',
    messages: {
        'zh': {
            el: zhLocale.el,
            ...zhCN
        },
        'en': {
            el: enLocale.el,
            ...en
        }
    }
})

ElementLocale.i18n(i18n.global.t)

const app = createApp(App)

app.use(ElementPlus, { i18n: i18n.global.t })
app.use(i18n)
app.use(router)
app.use(store)
app.use(VMdEditor)


window.dbh = window.dbh || {}
window.dbh.config = config
window.dbh.clientInfo = window.dbh.clientInfo || {}
window.dbh.clientInfo.env = process.env.NODE_ENV
window.dbh.vue_instance = app.mount('#app')
window.dbh.alertError = (msg) => {
    if (window.dbh.vue_instance._byAlert) window.dbh.vue_instance._byAlert.close()
    window.dbh.vue_instance._byAlert = window.dbh.vue_instance.$message({
        message: msg,
        type: 'error',
        showClose: true,
        duration: 4000
    })
}
window.dbh.alertInfo = (msg) => {
    if (window.dbh.vue_instance._byAlert) window.dbh.vue_instance._byAlert.close()
    window.dbh.vue_instance._byAlert = window.dbh.vue_instance.$message({
        message: msg,
        type: 'info',
        showClose: true,
        duration: 3000
    })
}
window.dbh.alertSuc = (msg, duration) => {
    if (window.dbh.vue_instance._byAlert) window.dbh.vue_instance._byAlert.close()
    window.dbh.vue_instance._byAlert = window.dbh.vue_instance.$message({
        message: msg,
        type: 'success',
        showClose: true,
        duration: duration || 1500
    })
}
window.dbh.alertWarn = (msg) => {
    if (window.dbh.vue_instance._byAlert) window.dbh.vue_instance._byAlert.close()
    window.dbh.vue_instance._byAlert = window.dbh.vue_instance.$message({
        message: msg,
        type: 'warning',
        showClose: true,
        duration: 2500
    })
}
window.dbh.alertClose = () => {
    if (window.dbh.vue_instance._byAlert) window.dbh.vue_instance._byAlert.close()
}
