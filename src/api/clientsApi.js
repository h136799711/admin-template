/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const clientsApi = {
  info (data, suc, fail) {
    let url = window.tools.getApiUrl();
    data.service_type = 'by_Clients_info';
    http.methods.apiPost(url, data).then((res) => {
    	console.log(res);
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
		let url = window.tools.getApiUrl();
		data.service_type = 'by_Clients_update';
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
	renew (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_Clients_renew'}), suc, fail);
	},
	reset (data, suc, fail) {
		let url = window.tools.getApiUrl ();
		data.service_type = 'by_Clients_resetClientSecretKey';
		http.methods.apiPost (url, data).then ((res) => {
			if (res.code === 0) {
				if (typeof suc === 'function') {
					suc (res.data);
				} else {
					tools.alertSuc (res.msg);
				}
			} else {
				if (typeof fail === 'function') {
					fail (res);
				} else {
					tools.alertError (res.msg);
				}
			}
		});
	}
};

export default clientsApi;
