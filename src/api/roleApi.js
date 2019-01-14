/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const roleApi = {
	query (data, suc, fail) {
		data.service_type = 'by_AuthRole_query';
		http.methods.defaultPost('', data, suc, fail);
	},
	enable (data, suc, fail) {
		data.service_type = 'by_AuthRole_changeStatus';
		http.methods.defaultPost('', data, suc, fail);
	},
	menu (data, suc, fail) {
		data.service_type = 'by_AuthRole_listMenus';
		http.methods.defaultPost('', data, suc, fail);
	},
	deleteMenu (data, suc, fail) {
		data.service_type = 'by_AuthRole_removeMenus';
		http.methods.defaultPost('', data, suc, fail);
	},
	attachMenu (data, suc, fail) {
		data.service_type = 'by_AuthRole_attachMenu';
		http.methods.defaultPost('', data, suc, fail);
	}
};

export default roleApi;