'use strict';
import http from '../assets/js/http.js';

const securityCodeApi = {
  image_create (data, suc, fail) {
    data.service_type = 'by_SecurityCode_createImage';
    data.accepter = window.tools.getSessionId();

    http.methods.defaultPost('', data, suc, fail);
  }
};

export default securityCodeApi;
