/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js'

const userWalletApi = {
	async info (data) {
		return http.promisePost('/100/UserWallet/info', data)
	},
	async query (data) {
		return http.promisePost('/100/UserWallet/queryLogHistory', data)
	}
};

export default userWalletApi
