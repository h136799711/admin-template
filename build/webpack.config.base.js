'use strict'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
require('babel-polyfill')
const utils = require('./utils')
const webpack = require('webpack');

const IsProduction = process.env.NODE_ENV === 'production'
const StaticDir = IsProduction ? "/static" : "static"
module.exports = {
    performance: {
        hints: IsProduction ? "warning" : false
    },
    entry: ['babel-polyfill', './src/index.js'],
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'assets': utils.resolve('assets'),
            'pages': utils.resolve('src/pages'),
            'store': utils.resolve('src/store'),
            'api': utils.resolve('src/api'),
            'components': utils.resolve('src/components'),
            '@': utils.resolve('./src'),
        }
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            }, {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        compact: true,
                        minified: IsProduction
                    }
                }
            }
        ]
    },

    plugins: [
		new webpack.DefinePlugin({
			__VUE_OPTIONS_API__: true,
			__VUE_PROD_DEVTOOLS__: false,
            // __VUE_I18N_FULL_INSTALL__: true,
            // __VUE_I18N_LEGACY_API__: true,
            // __VUE_I18N_PROD_DEVTOOLS__: false,
            // __INTLIFY_PROD_DEVTOOLS__: false,
		}),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            favicon: 'favicon.ico',
            template: 'index.html',
            inject: true
        }),
        new VueLoaderPlugin()
    ]
}
