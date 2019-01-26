/* eslint-disable */
'use strict';
import http from '../assets/js/http.js'

const bannersApi = {
	query(data, suc, fail) {
		data.service_type = 'by_Banners_query'
		http.methods.defaultPost ('', data, suc, fail)
	},
	create(data, suc, fail) {
		data.service_type = 'by_Banners_create'
		http.methods.defaultPost ('', data, suc, fail)
	},
	update(data, suc, fail) {
		data.service_type = 'by_Banners_update';
		http.methods.defaultPost ('', data, suc, fail);
	}
}

export default bannersApi