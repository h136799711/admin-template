/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const roleApi = {
	create (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_AuthRole_create'}), suc, fail);
	},
	update (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_AuthRole_update'}), suc, fail);
	},
	query (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_AuthRole_query'}), suc, fail);
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
	attachMenus (data, suc, fail) {
		data.service_type = 'by_AuthRole_attachMenus'
		http.methods.defaultPost('', data, suc, fail);
	},
	policy (data, suc, fail) {
		data.service_type = 'by_AuthRole_listPolicies';
		http.methods.defaultPost('', data, suc, fail);
	},
	removePolicies (data, suc, fail) {
		data.service_type = 'by_AuthRole_removePolicies';
		http.methods.defaultPost('', data, suc, fail);
	},
	attachPolicies (data, suc, fail) {
		data.service_type = 'by_AuthRole_attachPolicies';
		http.methods.defaultPost('', data, suc, fail);
	},
	user (data, suc, fail) {
		data.service_type = 'by_AuthRole_listUsers';
		http.methods.defaultPost('', data, suc, fail);
	},
	removeUser (data, suc, fail) {
		data.service_type = 'by_AuthRole_removeUser';
		http.methods.defaultPost('', data, suc, fail);
	},
	attachUser (data, suc, fail) {
		data.service_type = 'by_AuthRole_attachUser';
		http.methods.defaultPost('', data, suc, fail);
	}
};

export default roleApi;
