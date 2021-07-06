'use strict';
import {defaultPost} from '../assets/plugins/http.js';
import { dbhTool } from '@peter_xiter/dbh-js-tools'

const securityCodeApi = {
  image_create (data, suc, fail) {
    data.accepter = dbhTool.getSessionId();
    defaultPost('/100/SecurityCode/createImage', data, suc, fail);
  }
};

export default securityCodeApi;
