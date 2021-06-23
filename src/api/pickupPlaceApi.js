/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const pickupPlaceApi = {
    async query (data) {
        return http.promisePost('/100/PickUpPlace/query', data)
    },
    async edit (data) {
        return http.promisePost('/100/PickUpPlace/edit', data);
    },
    async create (data) {
        return http.promisePost('/100/PickUpPlace/create', data);
    },
    async delete (data) {
        return http.promisePost('/100/PickUpPlace/delete', data);
    },
};

export default pickupPlaceApi
