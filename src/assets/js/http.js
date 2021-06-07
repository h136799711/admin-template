/* eslint-disable */
'use strict'
const apiMethods = {
  methods: {
    promisePost: function (data, url) {
      url = url || window.tools.getApiUrl(url)
      return new Promise((resolve, reject) => {
        if (!data) data = {}
        data.app_version = window.tools.getVersion()
        data.app_type = window.tools.getDeviceType()
        data.client_id = window.tools.getAppId()
        data.device_type = window.tools.getDeviceType()
        data.device_token = window.tools.getDeviceToken()

        let headers = {
          'Content-Type': 'multipart/form-data',
        };
        let bear = window.tools.getJwt();
        if (bear.length > 0) {
          headers.Authorization = 'Bearer ' + bear;
        }

        axios.post(url, this.convertFormData(data), {
          headers: headers
        }).then((response) => {
          let ret = response.data
          if (ret.code === 1111) {
            window.tools.alertWarn(itboye.vue_instance.$i18n.t('Please Login Again'))
            // reject(data);
            window.itboye.vue_instance.$router.push('/login')
            reject(ret.msg)
          } else {
            if (ret.code == 0) {
              resolve(ret.data)
            } else {
              reject(ret.msg);
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
    },
    defaultPost: function (servicePath, data, suc, fail) {
      if (typeof  data.service_type === 'string') {
        let tmp = data.service_type.split("_");
        if (tmp.length === 3) {
          if (typeof  data.service_version === 'undefined') {
            servicePath = '/100/' + tmp[1] + '/' + tmp[2];
          } else {
            delete (data.service_version);
            servicePath = '/' + data.service_version + '/' + tmp[1] + '/' + tmp[2];
          }
        }
        delete (data.service_type);
      }
      let url = window.tools.getApiUrl('')
      this.apiPost(url + servicePath, data).then((res) => {
        if (res.code === 0) {
          if (typeof suc === 'function') {
            suc(res.data)
          } else {
            window.tools.alertSuc(res.msg)
          }
        } else {
          if (typeof fail === 'function') {
            fail(res)
          } else {
            window.tools.alertError(res.msg)
          }
        }
      })
    },
    convertFormData(obj) {
      let fd = new FormData()
      for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
          if (Array.isArray(obj[i])) {
            for (let j = 0; j < obj[i].length; j++) {
              fd.append(i + '[' + j + ']', obj[i][j]);
            }
          } else {
            fd.append((i), (obj[i]));
          }
        }
      }
      return fd;
    },
    apiPost (url, data) {
      return new Promise((resolve, reject) => {
        if (!data) data = {}
        data.app_version = window.tools.getVersion()
        data.app_type = window.tools.getDeviceType()
        data.client_id = window.tools.getAppId()
        // data.sid = window.tools.getSessionId()
        // data.uid = window.tools.getUID()
        data.device_type = window.tools.getDeviceType()
        data.device_token = window.tools.getDeviceToken()
        let headers = {
          'Content-Type': 'multipart/form-data',
        };
        let bear = window.tools.getJwt();
        if (bear.length > 0) {
          headers.Authorization = 'Bearer ' + bear;
        }

        axios.post(url, this.convertFormData(data), {
          headers: headers
        }).then((response) => {
          let data = response.data
          if (data.code === 1111) {
            window.tools.alertWarn(itboye.vue_instance.$i18n.t('Please Login Again'))
            // reject(data);
            window.itboye.vue_instance.$router.push('/login')
            resolve(data)
          } else {
            resolve(data)
          }
        }).catch((response) => {
          console.log(response)
          window.tools.alertWarn(itboye.vue_instance.$i18n.t('Please Try Again'))
          resolve(response)
        })
      })
    }
  }
}

export default apiMethods
