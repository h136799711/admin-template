/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const spPropApi = {
	create (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpProperty_create'}), suc, fail);
	},
	info (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpProperty_info'}), suc, fail);
	},
	update (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpProperty_update'}), suc, fail);
	},
	query (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpProperty_query'}), suc, fail);
	},
	delete (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_SpProperty_delete'}), suc, fail);
	}
};

export default spPropApi;
