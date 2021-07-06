/* eslint-disable */
'use strict'
import {defaultPost} from '../assets/plugins/http.js'

const roleApi = {
    create (data, suc, fail) {
        defaultPost('/100/AuthRole/create', data, suc, fail)
    },
    update (data, suc, fail) {
        defaultPost('/100/AuthRole/update', data, suc, fail)
    },
    query (data, suc, fail) {
        defaultPost('/100/AuthRole/query', data, suc, fail)
    },
    enable (data, suc, fail) {
        defaultPost('/100/AuthRole/changeStatus', data, suc, fail)
    },
    menu (data, suc, fail) {
        defaultPost('/100/AuthRole/listMenus', data, suc, fail)
    },
    deleteMenu (data, suc, fail) {
        defaultPost('/100/AuthRole/removeMenus', data, suc, fail)
    },
    attachMenus (data, suc, fail) {
        defaultPost('/100/AuthRole/attachMenus', data, suc, fail)
    },
    policy (data, suc, fail) {
        defaultPost('/100/AuthRole/listPolicies', data, suc, fail)
    },
    removePolicies (data, suc, fail) {
        defaultPost('/100/AuthRole/removePolicies', data, suc, fail)
    },
    attachPolicies (data, suc, fail) {
        defaultPost('/100/AuthRole/attachPolicies', data, suc, fail)
    },
    user (data, suc, fail) {
        defaultPost('/100/AuthRole/listUsers', data, suc, fail)
    },
    removeUser (data, suc, fail) {
        defaultPost('/100/AuthRole/removeUser', data, suc, fail)
    },
    attachUser (data, suc, fail) {
        defaultPost('/100/AuthRole/attachUser', data, suc, fail)
    }
}

export default roleApi
