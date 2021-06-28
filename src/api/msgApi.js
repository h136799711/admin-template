/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js';

const msgApi = {
	async delete(data) {
		return http.promisePost('/100/Message/delete', data)
	},
	async editMessage(data) {
		return http.promisePost('/100/Message/editMessage', data)
	},
	async querySystem (data) {
		return http.promisePost('/100/Message/querySystemMessage', data)
	},
	async createSystem (data) {
		return http.promisePost('/100/Message/createSystemMessage', data)
	},
	getUnreadCount (suc, fail) {
		http.defaultPost( '/100/Message/countUserUnreadMessage', {lc_key: '100_Message_countUserUnreadMessage', lc_expire: 600}, suc, fail)
	},
	queryPublicMsg (data, suc, fail) {
		http.defaultPost('/100/Message/queryPublicMessage', data, suc, fail)
	},
	queryAllMsg (data, suc, fail) {
		http.defaultPost('/100/Message/queryAllMessage', data, suc, fail)
	},
	queryUserMsg (data, suc, fail) {
		http.defaultPost('/100/Message/queryUserMessage', data, suc, fail)
	},
	readBatch (data, suc, fail) {
		http.defaultPost('/100/Message/readBatch', data, suc, fail)
	},
	info (data, suc, fail) {
		http.defaultPost('/100/Message/info', data, suc, fail)
	}
};

export default msgApi;
