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
  query3Level (data, suc, fail) {
    http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_query3Level' }), suc, fail)
  },
	delete (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_delete'}), suc, fail);
	},
	relateProp (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_relateProp'}), suc, fail);
	},
	removeProp (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_removeProp'}), suc, fail);
	},
	relateBrand (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_relateBrand'}), suc, fail);
	},
	removeBrand (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_removeBrand'}), suc, fail);
	},
	getProp (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_getProp'}), suc, fail);
	},
	getBrand (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpCate_getBrand'}), suc, fail);
	}
};

export default spCateApi;
