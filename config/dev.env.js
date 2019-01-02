'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT_URI: '"https://api.hebidu.cn"',
	PICTURE_UPLOAD_URI: '"https://api.hebidu.cn/picture/upload"',
  CLIENT_ID: '"by04esfH0fdc6Y"',
  SITE_ROOT_URI: '"http://127.0.0.1:8081"',
	PLATFORM_NAME: '"管理平台"',
	APP_VERSION: '"v0.0.2"',
})
