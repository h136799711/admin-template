/* eslint-disable */
'use strict';
import http from '../assets/js/http.js'

const rechargeApi = {
	query(data, suc, fail) {
		data.service_type = 'by_RechargeOrder_query'
		http.methods.defaultPost ('', data, suc, fail)
	},
	payInfo(data, suc, fail) {
		data.service_type = 'by_RechargeOrder_payInfo'
		http.methods.defaultPost ('', data, suc, fail)
	}
}

export default rechargeApi
