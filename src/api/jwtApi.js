/* eslint-disable */
'use strict'
import http from '../assets/plugins/http.js'

const jwtApi = {
    async refresh(data) {
        return http.promisePost('/100/JwtToken/refresh', data);
    }
}

export default jwtApi
