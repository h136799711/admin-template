/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const clientsApi = {
    info (data, suc, fail) {
        let url = window.tools.getApiUrl()
        data.service_type = 'by_Clients_info'
        http.methods.apiPost(url, data).then((res) => {
            console.log(res)
            if (res.code === 0) {
                if (typeof suc === 'function') {
                    suc(res.data)
                } else {
                    tools.alertSuc(res.msg)
                }
            } else {
                if (typeof fail === 'function') {
                    fail(res)
                } else {
                    tools.alertError(res.msg)
                }
            }
        })
    },
    update (data, suc, fail) {
        let url = window.tools.getApiUrl()
        data.service_type = 'by_Clients_update'
        http.methods.apiPost(url, data).then((res) => {
            if (res.code === 0) {
                if (typeof suc === 'function') {
                    suc(res.data)
                } else {
                    tools.alertSuc(res.msg)
                }
            } else {
                if (typeof fail === 'function') {
                    fail(res)
                } else {
                    tools.alertError(res.msg)
                }
            }
        })
    },
    reset (data, suc, fail) {
        let url = window.tools.getApiUrl()
        data.service_type = 'by_Clients_resetClientSecretKey'
        http.methods.apiPost(url, data).then((res) => {
            if (res.code === 0) {
                if (typeof suc === 'function') {
                    suc(res.data)
                } else {
                    tools.alertSuc(res.msg)
                }
            } else {
                if (typeof fail === 'function') {
                    fail(res)
                } else {
                    tools.alertError(res.msg)
                }
            }
        })
    },
    query (data, suc, fail) {
        data.service_type = 'by_Clients_query'
        http.methods.defaultPost('', data, suc, fail)
    },
    create (data, suc, fail) {
        data.service_type = 'by_Clients_create'
        http.methods.defaultPost('', data, suc, fail)
    },
    payConfig (data, suc, fail) {
        data.service_type = 'by_ClientsConfig_payConfig'
        http.methods.defaultPost('', data, suc, fail)
    },
    updatePayConfig (data, suc, fail) {
        data.service_type = 'by_ClientsConfig_updatePayConfig'
        http.methods.defaultPost('', data, suc, fail)
    },
    paymentList(data, suc, fail) {
        data.service_type = 'by_ClientsConfig_paymentList'
        http.methods.defaultPost('', data, suc, fail)
    },
    updatePayment(data, suc, fail) {
        data.service_type = 'by_ClientsConfig_updatePayment'
        http.methods.defaultPost('', data, suc, fail)
    }
}

export default clientsApi
