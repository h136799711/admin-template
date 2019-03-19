/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const spCateApi = {
	create (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_create'}), suc, fail);
	},
	info (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_info'}), suc, fail);
	},
	update (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_update'}), suc, fail);
	},
	query (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_query'}), suc, fail);
	},
	delete (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_delete'}), suc, fail);
	},
};

export default spCateApi;
