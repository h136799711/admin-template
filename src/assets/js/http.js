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
        data = qs.stringify(data);
        axios.post(url, data, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'BY-APP-ID': tools.getAppId(),
            'BY-SESSION-ID': tools.getSessionId()
          }
        }).then((response) => {
          let data = response.data;
          if (data.code === 1111) {
            window.tools.alertWarn('请重新登录');
            // reject(data);
            window.itboye.vue_instance.$router.push('/login');
            resolve(data);
          } else {
            resolve(data);
          }
        }).catch((response) => {
          console.log(response);
          window.tools.alertWarn('请求超时，请检查网络');
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
            message: '请求超时，请检查网络',
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
