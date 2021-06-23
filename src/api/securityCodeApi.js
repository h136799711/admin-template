'use strict';
import http from '../assets/plugins/http.js';

const securityCodeApi = {
  image_create (data, suc, fail) {
    data.accepter = window.tools.getSessionId();
    http.defaultPost('/100/SecurityCode/createImage', data, suc, fail);
  }
};

export default securityCodeApi;
