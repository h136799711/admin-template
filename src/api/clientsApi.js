/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const clientsApi = {
    async resetSysRsaKey (data) {
        return http.promisePost('/100/Clients/resetSysRsaKey', data)
    },
    info (data, suc, fail) {
        http.defaultPost('/100/Clients/info', data, suc, fail)
    },
    update (data, suc, fail) {
        http.defaultPost('/100/Clients/update', data, suc, fail)
    },
    reset (data, suc, fail) {
        http.defaultPost('/100/Clients/resetClientSecretKey', data, suc, fail)
    },
    query (data, suc, fail) {
        http.defaultPost('/100/Clients/query', data, suc, fail)
    },
    create (data, suc, fail) {
        http.defaultPost('/100/Clients/create', data, suc, fail)
    },
    createBySelf (data, suc, fail) {
        http.defaultPost('/100/Clients/createBySelf', data, suc, fail)
    },
    payConfig (data, suc, fail) {
        http.defaultPost('/100/ClientsConfig/payConfig', data, suc, fail)
    },
    wxpayConfig (data, suc, fail) {
        http.defaultPost('/100/ClientsConfig/wxpayConfig', data, suc, fail)
    },
    updatePayConfig (data, suc, fail) {
        http.defaultPost('/100/ClientsConfig/updatePayConfig', data, suc, fail)
    },
    updateWxPayConfig (data, suc, fail) {
        http.defaultPost('/100/ClientsConfig/updateWxPayConfig', data, suc, fail)
    },
    paymentList (data, suc, fail) {
        http.defaultPost('/100/ClientsConfig/paymentList', data, suc, fail)
    },
    updatePayment (data, suc, fail) {
        http.defaultPost('/100/ClientsConfig/updatePayment', data, suc, fail)
    }
}

export default clientsApi
