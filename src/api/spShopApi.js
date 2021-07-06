/* eslint-disable */
'use strict'
import {defaultPost} from '../assets/plugins/http.js'

const spShopApi = {
    close (data, suc, fail) {
        defaultPost('/100/SpShop/close' , data, suc, fail)
    },
    opening (data, suc, fail) {
        defaultPost('/100/SpShop/opening' , data, suc, fail)
    },
    create (data, suc, fail) {
        defaultPost('/100/SpShop/create' , data, suc, fail)
    },
    queryGoods (data, suc, fail) {
        defaultPost('/100/SpShop/queryGoods' , data, suc, fail)
    },
    addGoods (data, suc, fail) {
        defaultPost('/100/SpShop/addGoods' , data, suc, fail)
    },
    removeGoods (data, suc, fail) {
        defaultPost('/100/SpShop/removeGoods' , data, suc, fail)
    },
    update (data, suc, fail) {
        defaultPost('/100/SpShop/update' , data, suc, fail)
    },
    query (data, suc, fail) {
        defaultPost('/100/SpShop/query' , data, suc, fail)
    },
    delete (data, suc, fail) {
        defaultPost('/100/SpShop/delete' , data, suc, fail)
    }
}

export default spShopApi
