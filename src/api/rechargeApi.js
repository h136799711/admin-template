/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js'

const rechargeApi = {
	query(data, suc, fail) {
		http.defaultPost ('/100/RechargeOrder/query', data, suc, fail)
	},
	payInfo(data, suc, fail) {
		http.defaultPost ('/100/RechargeOrder/payInfo', data, suc, fail)
	}
}

export default rechargeApi
