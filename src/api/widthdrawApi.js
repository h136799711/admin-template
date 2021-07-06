/* eslint-disable */
'use strict'
import {defaultPost} from '../assets/plugins/http.js'

const widthdrawApi = {
    query (data, suc, fail) {
        defaultPost('/100/UserWithdraw/query', data, suc, fail)
    },
    pass (data, suc, fail) {
        defaultPost('/100/UserWithdraw/pass', data, suc, fail)
    },
    deny (data, suc, fail) {
        defaultPost('/100/UserWithdraw/deny', data, suc, fail)
    }
}

export default widthdrawApi
