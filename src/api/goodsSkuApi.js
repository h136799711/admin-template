/* eslint-disable */
'use strict'
import {defaultPost} from '../assets/plugins/http.js'

const goodsSkuApi = {
    create (data, suc, fail) {
        defaultPost('/100/SpGoodsSku/create', data, suc, fail)
    },
    query (data, suc, fail) {
        defaultPost('/100/SpGoodsSku/query' , data, suc, fail)
    }
}

export default goodsSkuApi
