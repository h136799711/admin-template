/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const configApi = {
	query (data, suc, fail) {
		data.service_type = 'by_Config_query'
		http.methods.defaultPost('', data, suc, fail)
	},
	create (data, suc, fail) {
		data.service_type = 'by_Config_create'
		http.methods.defaultPost('', data, suc, fail)
	},
	listCate (data, suc, fail) {
		data.service_type = 'by_Config_cate'
		http.methods.defaultPost('', data, suc, fail)
	},
	delete (data, suc, fail) {
		data.service_type = 'by_Config_delete'
		http.methods.defaultPost('', data, suc, fail)
	},
	info (data, suc, fail) {
		data.service_type = 'by_Config_info'
		http.methods.defaultPost('', data, suc, fail)
	},
	update (data, suc, fail) {
		data.service_type = 'by_Config_update'
		http.methods.defaultPost('', data, suc, fail)
	}
};

export default configApi;