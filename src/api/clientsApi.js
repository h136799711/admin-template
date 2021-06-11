/* eslint-disable */
'use strict'
import http from '../assets/js/http.js'

const clientsApi = {
    async resetSysRsaKey (data) {
        return http.methods.promisePost(data, window.tools.getApiUrl('') + '/100/Clients/resetSysRsaKey')
    },
    info (data, suc, fail) {
        data.service_type = 'by_Clients_info';
        http.methods.defaultPost('', data, suc, fail);
    },
    update (data, suc, fail) {
        data.service_type = 'by_Clients_update'
        http.methods.defaultPost('', data, suc, fail);
    },
    reset (data, suc, fail) {
        data.service_type = 'by_Clients_resetClientSecretKey'
        http.methods.defaultPost('', data, suc, fail);
    },
    query (data, suc, fail) {
        data.service_type = 'by_Clients_query'
        http.methods.defaultPost('', data, suc, fail)
    },
    create (data, suc, fail) {
        data.service_type = 'by_Clients_create'
        http.methods.defaultPost('', data, suc, fail)
    },
    createBySelf (data, suc, fail) {
        data.service_type = 'by_Clients_createBySelf'
        http.methods.defaultPost('', data, suc, fail)
    },
    payConfig (data, suc, fail) {
        data.service_type = 'by_ClientsConfig_payConfig'
        http.methods.defaultPost('', data, suc, fail)
    },
    wxpayConfig (data, suc, fail) {
        data.service_type = 'by_ClientsConfig_wxpayConfig'
        http.methods.defaultPost('', data, suc, fail)
    },
    updatePayConfig (data, suc, fail) {
        data.service_type = 'by_ClientsConfig_updatePayConfig'
        http.methods.defaultPost('', data, suc, fail)
    },
    updateWxPayConfig (data, suc, fail) {
        data.service_type = 'by_ClientsConfig_updateWxPayConfig'
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
