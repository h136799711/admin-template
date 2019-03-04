/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const articleApi = {
	create (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_CmsArticle_create'}), suc, fail);
	},
	update (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_CmsArticle_update'}), suc, fail);
	},
	query (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_CmsArticle_queryAdmin'}), suc, fail);
	},
	cate (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_CmsArticle_cate'}), suc, fail);
	},
	delete (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_CmsArticle_delete'}), suc, fail);
	},
	publish (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_CmsArticle_publish'}), suc, fail);
	},
	draft (data, suc, fail) {
		http.methods.defaultPost('', Object.assign(data, { service_type: 'by_CmsArticle_draft'}), suc, fail);
	}

}

export default articleApi;