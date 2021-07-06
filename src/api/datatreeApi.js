/* eslint-disable */
'use strict';
import {defaultPost} from '../assets/plugins/http.js';

const datatreeApi = {
  query (data, suc, fail) {
    defaultPost('/100/Datatree/query', data, suc, fail);
  },
  delete (data, suc, fail) {
    defaultPost('/100/Datatree/delete', data, suc, fail);
  },
  add (data, suc, fail) {
    defaultPost('/100/Datatree/create', data, suc, fail);
  },
  update (data, suc, fail) {
    defaultPost('/100/Datatree/update', data, suc, fail);
  }
};

export default datatreeApi;
