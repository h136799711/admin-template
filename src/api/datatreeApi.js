/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const datatreeApi = {
  query (data, suc, fail) {
    let url = window.tools.getApiUrl();
    data.service_type = 'by_Datatree_query';
    http.methods.apiPost(url, data).then((res) => {
      if (res.code === 0) {
        if (typeof suc === 'function') {
          suc(res.data);
        } else {
          tools.alertSuc(res.msg);
        }
      } else {
        if (typeof fail === 'function') {
          fail(res);
        } else {
          tools.alertError(res.msg);
        }
      }
    });
  },
  delete (data, suc, fail) {
    let url = window.tools.getApiUrl('datatree/delete');
		data.service_type = 'by_Datatree_delete';
    http.methods.apiPost(url, data).then((res) => {
      if (res.code === 0) {
        if (typeof suc === 'function') {
          suc(res.data);
        } else {
          tools.alertSuc(res.msg);
        }
      } else {
        if (typeof fail === 'function') {
          fail(res);
        } else {
          tools.alertError(res.msg);
        }
      }
    });
  },
  add (data, suc, fail) {
    let url = window.tools.getApiUrl('datatree/add');
		data.service_type = 'by_Datatree_create';
    http.methods.apiPost(url, data).then((res) => {
      if (res.code === 0) {
        if (typeof suc === 'function') {
          suc(res.data);
        } else {
          tools.alertSuc(res.msg);
        }
      } else {
        if (typeof fail === 'function') {
          fail(res);
        } else {
          tools.alertError(res.msg);
        }
      }
    });
  },
  update (data, suc, fail) {
		data.service_type = 'by_Datatree_update';
    http.methods.defaultPost('datatree/update', data, suc, fail);
  }
};

export default datatreeApi;
