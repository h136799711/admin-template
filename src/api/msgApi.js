/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const msgApi = {
	getUnreadCount (data, suc, fail) {
		data.service_type = 'by_Message_countUserUnreadMessage';
		http.methods.defaultPost('', data, suc, fail)
	},
	queryPublicMsg (data, suc, fail) {
		data.service_type = 'by_Message_queryPublicMessage'
		http.methods.defaultPost('', data, suc, fail)
	},
	queryAllMsg (data, suc, fail) {
		data.service_type = 'by_Message_queryAllMessage'
		http.methods.defaultPost('', data, suc, fail)
	},
	queryUserMsg (data, suc, fail) {
		data.service_type = 'by_Message_queryUserMessage'
		http.methods.defaultPost('', data, suc, fail)
	},
	readBatch (data, suc, fail) {
		data.service_type = 'by_Message_readBatch'
		http.methods.defaultPost('', data, suc, fail)
	},
	info (data, suc, fail) {
		data.service_type = 'by_Message_info'
		http.methods.defaultPost('', data, suc, fail)
	}
};

export default msgApi;