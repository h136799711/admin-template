/* eslint-disable */
'use strict'
import axios from 'axios'
import {dbhTool} from '@peter_xiter/dbh-js-tools/index';

const promisePost = function (servicePath, data) {
    let url = config.getApiUrl() + servicePath
    return apiPost(url, data).then((resp) => {
        return resp.data
    })
}
const defaultPost = function (servicePath, data, suc, fail) {
    let url = config.getApiUrl() + servicePath
    apiPost(url, data).then((data) => {
        if (typeof suc === 'function') {
            suc(data.data)
        } else {
            window.dbh.alertSuc(data.msg)
        }
    }).catch((err) => {
        if (typeof fail === 'function') {
            fail(err)
        } else {
            window.dbh.alertError(err)
        }
    })
}
const convertFormData = function (obj) {
    let fd = new FormData()
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (Array.isArray(obj[i])) {
                for (let j = 0; j < obj[i].length; j++) {
                    let value = obj[i][j];
                    if (typeof value === 'number') {
                        value = value.toFixed(2);
                    }
                    fd.append(i + '[' + j + ']', value)
                }
            } else {
                let value = obj[i];
                if (typeof value === 'number') {
                    value = value.toFixed(2);
                }
                fd.append((i), value)
            }
        }
    }
    return fd
}
const apiPost = function (url, data) {
    return new Promise((resolve, reject) => {
        if (!data) data = {}
        data.app_version = window.config.getVersion()
        data.app_type = 'admin-pc'
        data.client_id = window.config.getClientId()
        data.device_type = dbhTool.getDeviceType()
        data.device_token = dbhTool.getSessionId();
        let headers = {
            'Content-Type': 'multipart/form-data',
        }
        let bear = dbhTool.getJwt()
        if (bear.length > 0) {
            headers.Authorization = 'Bearer ' + bear
        }

        axios.defaults.timeout = 30000
        axios.defaults.headers['Content-Type'] = 'application/json'
        axios.defaults.withCredentials = false

        axios.post(url, convertFormData(data), {
            headers: headers
        }).then((response) => {
            let data = response.data

            if (data.code === 1111) {
                window.dbh.alertWarn(dbh.vue_instance.$i18n.t('Please Login Again'))
                // reject(data);
                window.dbh.vue_instance.$router.push('/login')
                resolve(data)
            } else {
                if (0 === parseInt(data.code)) {
                    resolve(data)
                } else {
                    reject(data.msg)
                }
            }
        }).catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                reject(error.response.data)
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                reject('server no response')
                console.debug(error.request)
            } else {
                // Something happened in setting up the request that triggered an Error
                reject(error.message)
                console.debug('Error', error.message)
            }
        })
    })
}

const apiMethods = {
    defaultPost,
    promisePost
}

export default apiMethods
