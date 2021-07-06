/* eslint-disable */
'use strict'
import {defaultPost, promisePost} from '../assets/plugins/http.js'

const freightApi = {
    create (data, suc, fail) {
        defaultPost('/100/SpFreight/create', data, suc, fail)
    },
    update (data, suc, fail) {
        defaultPost('/100/SpFreight/update' , data, suc, fail)
    },
    query (data) {
        return promisePost('/100/SpFreight/query', data)
    },
    delete (data, suc, fail) {
        defaultPost('/100/SpFreight/delete' , data, suc, fail)
    }
}

export default freightApi
