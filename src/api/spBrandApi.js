/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const spBrandApi = {
	create (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpBrand_create'}), suc, fail);
	},
	info (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpBrand_info'}), suc, fail);
	},
	update (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpBrand_update'}), suc, fail);
	},
	query (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpBrand_query'}), suc, fail);
	},
	delete (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpBrand_delete'}), suc, fail);
	}
};

export default spBrandApi;
