/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const menuApi = {
	queryAll (data, suc, fail) {
		data.service_type = 'by_Menu_queryAll'
		http.methods.defaultPost('', data, suc, fail)
	},
	create (data, suc, fail) {
		data.service_type = 'by_Menu_create'
		http.methods.defaultPost('', data, suc, fail)
	},
	delete (data, suc, fail) {
		data.service_type = 'by_Menu_delete'
		http.methods.defaultPost('', data, suc, fail)
	},
	info (data, suc, fail) {
		data.service_type = 'by_Menu_info'
		http.methods.defaultPost('', data, suc, fail)
	},
	update (data, suc, fail) {
		data.service_type = 'by_Menu_update'
		http.methods.defaultPost('', data, suc, fail)
	}
};

export default menuApi;