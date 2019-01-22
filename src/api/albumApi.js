/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const albumApi = {
	query(data, suc, fail) {
		data.service_type = 'by_Album_query';
		http.methods.defaultPost('', data, suc, fail);
	},
	create(data, suc, fail) {
		data.service_type = 'by_Album_create';
		http.methods.defaultPost('', data, suc, fail);
	},
	update(data, suc, fail) {
		data.service_type = 'by_Album_update';
		http.methods.defaultPost('', data, suc, fail);
	},
	listPhoto(data, suc, fail) {
		data.service_type = 'by_Album_listPhoto';
		http.methods.defaultPost('', data, suc, fail);
	},
	addPhoto(data, suc, fail) {
		data.service_type = 'by_Album_addPhoto';
		http.methods.defaultPost('', data, suc, fail);
	},
	updatePhoto(data, suc, fail) {
		data.service_type = 'by_Album_updatePhoto';
		http.methods.defaultPost('', data, suc, fail);
	},
	removePhoto(data, suc, fail) {
		data.service_type = 'by_Album_removePhoto';
		http.methods.defaultPost('', data, suc, fail);
	},
	info(data, suc, fail) {
		data.service_type = 'by_Album_info';
		http.methods.defaultPost('', data, suc, fail);
	},
	queryCategory(data, suc, fail) {
		data.service_type = 'by_AlbumCategory_query';
		http.methods.defaultPost('', data, suc, fail);
	},
	createCategory(data, suc, fail) {
		data.service_type = 'by_AlbumCategory_create';
		http.methods.defaultPost('', data, suc, fail);
	},
  updateCategory(data, suc, fail) {
		data.service_type = 'by_AlbumCategory_update';
		http.methods.defaultPost('', data, suc, fail);
	}
};

export default albumApi;
