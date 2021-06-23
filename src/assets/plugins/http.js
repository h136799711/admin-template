/* eslint-disable */
'use strict'
const promisePost = function (servicePath, data) {
    let url = tools.getApiUrl() + servicePath
    return apiPost(url, data).then((resp) => {
        return resp.data
    })
}
const defaultPost = function (servicePath, data, suc, fail) {
    let url = tools.getApiUrl() + servicePath
    apiPost(url, data).then((data) => {
        if (typeof suc === 'function') {
            suc(data.data)
        } else {
            window.tools.alertSuc(data.msg)
        }
    }).catch((err) => {
        if (typeof fail === 'function') {
            fail(err)
        } else {
            window.tools.alertError(err)
        }
    })
}
const convertFormData = function (obj) {
    let fd = new FormData()
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (Array.isArray(obj[i])) {
                for (let j = 0; j < obj[i].length; j++) {
                    fd.append(i + '[' + j + ']', obj[i][j])
                }
            } else {
                fd.append((i), (obj[i]))
            }
        }
    }
    return fd
}
const apiPost = function (url, data) {
    return new Promise((resolve, reject) => {
        if (!data) data = {}
        data.app_version = window.tools.getVersion()
        data.app_type = window.tools.getDeviceType()
        data.client_id = window.tools.getAppId()
        data.device_type = window.tools.getDeviceType()
        data.device_token = window.tools.getDeviceToken()
        let headers = {
            'Content-Type': 'multipart/form-data',
        }
        let bear = window.tools.getJwt()
        if (bear.length > 0) {
            headers.Authorization = 'Bearer ' + bear
        }

        axios.post(url, convertFormData(data), {
            headers: headers
        }).then((response) => {
            let data = response.data

            if (data.code === 1111) {
                window.tools.alertWarn(itboye.vue_instance.$i18n.t('Please Login Again'))
                // reject(data);
                window.itboye.vue_instance.$router.push('/login')
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
