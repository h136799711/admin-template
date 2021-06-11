/* eslint-disable */
'use strict';
import http from '../assets/js/http.js';

const datatreeApi = {
  query (data, suc, fail) {
    data.service_type = 'by_Datatree_query';
    http.methods.defaultPost('', data, suc, fail);
  },
  delete (data, suc, fail) {
    data.service_type = 'by_Datatree_delete';
    http.methods.defaultPost('', data, suc, fail);
  },
  add (data, suc, fail) {
    data.service_type = 'by_Datatree_create';
    http.methods.defaultPost('', data, suc, fail);
  },
  update (data, suc, fail) {
		data.service_type = 'by_Datatree_update';
    http.methods.defaultPost('datatree/update', data, suc, fail);
  }
};

export default datatreeApi;
