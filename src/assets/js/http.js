/* eslint-disable */
'use strict';
const apiMethods = {
  methods: {
    defaultPost: function (url, data, suc, fail) {
      url = window.tools.getApiUrl(url);
      this.apiPost(url, data).then((res) => {
        if (res.code === 0) {
          if (typeof suc === 'function') {
            suc(res.data);
          } else {
            window.tools.alertSuc(res.msg);
          }
        } else {
          if (typeof fail === 'function') {
            fail(res);
          } else {
            window.tools.alertError(res.msg);
          }
        }
      });
    },
    apiPost (url, data) {
      return new Promise((resolve, reject) => {
        var qs = require('qs');
        if (!data) data = {};
        data.app_version = window.tools.getVersion();
        data.app_type = 'vue-web';
				data.client_id = window.tools.getAppId();
				data.sid = window.tools.getSessionId();
				data.uid = window.tools.getUID();
				data.deviceType = window.tools.getDeviceType();
				data.deviceToken = window.tools.getDeviceToken();

        data = qs.stringify(data);
        axios.post(url, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'BY-CLIENT-ID': window.tools.getAppId(),
            'BY-SESSION-ID': window.tools.getSessionId()
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1111) {
            window.tools.alertWarn(itboye.vue_instance.$i18n.t('Please Login Again'));
            // reject(data);
            window.itboye.vue_instance.$router.push('/login');
            resolve(data);
          } else {
            resolve(data);
          }
        }).catch((response) => {
          console.log(response);
          window.tools.alertWarn(itboye.vue_instance.$i18n.t('Please Try Again'));
          resolve(response);
        });
      });
    },
    // apiGet(url, data) {
    //     return new Promise((resolve, reject) => {
    //         axios.get(url, data).then((response) => {
    //             resolve(response.data)
    //         }, (response) => {
    //             reject(response);
    //             bus.$message({
    //                 message: '请求超时，请检查网络',
    //                 type: 'warning'
    //             })
    //         })
    //     })
    // },

    // apiDelete(url, id) {
    //     return new Promise((resolve, reject) => {
    //         axios.delete(url + id).then((response) => {
    //             resolve(response.data)
    //         }, (response) => {
    //             reject(response);
    //             bus.$message({
    //                 message: '请求超时，请检查网络',
    //                 type: 'warning'
    //             })
    //         })
    //     })
    // },
    // apiPut(url, id, obj) {
    //     return new Promise((resolve, reject) => {
    //         axios.put(url + id, obj).then((response) => {
    //             resolve(response.data)
    //         }, (response) => {
    //             _g.closeGlobalLoading();
    //             bus.$message({
    //                 message: '请求超时，请检查网络',
    //                 type: 'warning'
    //             });
    //             reject(response)
    //         })
    //     })
    // },
    handelResponse (res, cb, errCb) {
      _g.closeGlobalLoading();
      if (res.code == 200) {
        cb(res.data);
      } else {
        if (typeof errCb === 'function') {
          errCb();
        }
        this.handleError(res);
      }
    },
    handleError (res) {
      if (res.code) {
      } else {
        console.log('default error');
      }
    },
    reAjax (url, data) {
      return new Promise((resolve, reject) => {
        axios.post(url, data).then((response) => {
          resolve(response.data);
        }, (response) => {
          reject(response);
          bus.$message({
            message: window.tools.alertWarn(itboye.vue_instance.$i18n.t('Please Try Again')),
            type: 'warning'
          });
        });
      });
    }
  },
  computed: {
    showLoading () {
      return store.state.globalLoading;
    }
  }
};

export default apiMethods;
