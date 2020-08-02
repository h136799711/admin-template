/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const userApi = {
    resetPwd: (data, suc, fail) => {
        data.service_type = 'by_UserAccount_resetPwd'
        http.methods.defaultPost('', data, suc, fail)
    },
    detail: (data, suc, fail) => {
        data.service_type = 'by_UserAccount_detail'
        http.methods.defaultPost('', data, suc, fail)
    },
    queryLog: (data, suc, fail) => {
        data.service_type = 'by_UserLog_query'
        http.methods.defaultPost('', data, suc, fail)
    },
    querySession: (data, suc, fail) => {
        data.service_type = 'by_LoginSession_query'
        http.methods.defaultPost('', data, suc, fail)
    },
    logoutSession: (data, suc, fail) => {
        data.service_type = 'by_LoginSession_logout'
        http.methods.defaultPost('', data, suc, fail)
    },
    turnOn2StepVerify: (data, suc, fail) => {
        data.service_type = 'by_UserAccount_turnOn2StepVerify'
        http.methods.defaultPost('', data, suc, fail)
    },
    turnOff2StepVerify: (data, suc, fail) => {
        data.service_type = 'by_UserAccount_turnOff2StepVerify'
        http.methods.defaultPost('', data, suc, fail)
    },
    updateLimit: (data, suc, fail) => {
        data.service_type = 'by_UserAccount_updateLimit'
        http.methods.defaultPost('', data, suc, fail)
    },
    bindPhone: (data, suc, fail) => {
        data.service_type = 'by_UserAccount_bindNewPhone'
        http.methods.defaultPost('', data, suc, fail)
    },
    sendAuthCode: (data, suc, fail) => {
        data.service_type = 'by_SecurityCode_createAndSend'
        http.methods.defaultPost('', data, suc, fail)
    },
    sendAuthEmail: (data, suc, fail) => {
        data.service_type = 'by_UserAccount_sendAuthEmail'
        http.methods.defaultPost('', data, suc, fail)
    },
    registerByMobileCode:
        (data, suc, fail) => {
            data.service_type = 'by_UserAccount_registerByMobile'
            http.methods.defaultPost('', data, suc, fail)
        },
    update:
        (data, suc, fail) => {
            data.service_type = 'by_UserProfile_update'
            http.methods.defaultPost('', data, suc, fail)
        },
    updateInfo:
        (data, suc, fail) => {
            data.service_type = 'by_UserAccount_updateInfo'
            http.methods.defaultPost('', data, suc, fail)
        },
    disable:
        (data, suc, fail) => {
            data.service_type = 'by_UserAccount_disable'
            http.methods.defaultPost('', data, suc, fail)
        },
    enable:
        (data, suc, fail) => {
            data.service_type = 'by_UserAccount_enable'
            http.methods.defaultPost('', data, suc, fail)
        },
    updatePassword (data, suc, fail) {
        data.service_type = 'by_UserLoginSession_updatePassword'
        http.methods.defaultPost('', data, suc, fail)
    }
    ,
    queryByPagingNoCount: (data, suc, fail) => {
        data.service_type = 'by_UserAccount_queryForAjax'
        http.methods.defaultPost('', data, suc, fail)
    },
    queryByPaging: (data, suc, fail) => {
        data.service_type = 'by_UserAccount_query'
        http.methods.defaultPost('', data, suc, fail)
    },
    logout:
        (data, cb, failCb) => {
            console.debug('[ajax] userApi::logout 用户登出', data)
            let url = window.tools.getApiUrl('user/logout')
            data.service_type = 'by_UserLoginSession_logout'
            http.methods.apiPost(url, data).then((res) => {
                if (res.code === 0) {
                    cb(res)
                } else {
                    failCb(res)
                }
            })
            window.tools.clear()
        },
    login:
        (data, cb, failCb) => {
            console.debug('[ajax] userApi::login 用户登录', data)
            let url = window.tools.getApiUrl()
            data.loginInfo = ''
            data.service_type = 'by_UserLoginSession_loginByMobilePassword'
            http.methods.apiPost(url, data).then((res) => {
                if (res.code === 0) {
                    cb(res)
                } else {
                    failCb(res)
                }
            })
        },
    getUserData (cb, failCb) {
        console.debug('[ajax] userApi::getUserData 获取用户数据')
        let url = window.tools.getApiUrl()
        let data = { 'service_type': 'by_UserLoginSession_adminData' }
        http.methods.apiPost(url, data).then((res) => {
            console.log(res)
            if (res.code === 0) {
                cb(res)
            } else {
                failCb(res)
            }
        })
    }
}

export default userApi
