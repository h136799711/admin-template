/* eslint-disable */
'use strict';
import http from '../assets/plugins/http.js';

const datatreeApi = {
  query (data, suc, fail) {
    http.defaultPost('/100/Datatree/query', data, suc, fail);
  },
  delete (data, suc, fail) {
    http.defaultPost('/100/Datatree/delete', data, suc, fail);
  },
  add (data, suc, fail) {
    http.defaultPost('/100/Datatree/create', data, suc, fail);
  },
  update (data, suc, fail) {
    http.defaultPost('/100/Datatree/update', data, suc, fail);
  }
};

export default datatreeApi;
