/* eslint-disable */
'use strict'
import {promisePost} from '../assets/plugins/http.js'

const pickupPlaceApi = {
    async query (data) {
        return promisePost('/100/PickUpPlace/query', data)
    },
    async edit (data) {
        return promisePost('/100/PickUpPlace/edit', data);
    },
    async create (data) {
        return promisePost('/100/PickUpPlace/create', data);
    },
    async delete (data) {
        return promisePost('/100/PickUpPlace/delete', data);
    },
};

export default pickupPlaceApi
