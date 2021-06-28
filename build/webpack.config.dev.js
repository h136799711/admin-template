'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const DotEnv = require('dotenv-webpack')
const path = require('path')

module.exports = merge(baseConfig, {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-browser.js'
        }
    },
    devServer: {
        clientLogLevel: 'warning',
        hot: true,
        contentBase: '/',
        compress: false, //
        host: 'localhost',
        port: '8082',
        open: true,
        progress: true,
        overlay: { warnings: true, errors: true },
        publicPath: '/',
        quiet: true,
        watchOptions: {
            poll: true
        }
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader'
                }
            }, {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                }
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                }
            }
        ]
    },

    plugins: [
        new DotEnv({
            path: './.env.dev',
            safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
        }), new webpack.DefinePlugin({
            // __VUE_OPTIONS_API__: true,
            // __VUE_PROD_DEVTOOLS__: false,
            __VUE_I18N_FULL_INSTALL__: true,
            __VUE_I18N_LEGACY_API__: true,
            __VUE_I18N_PROD_DEVTOOLS__: false,
            __INTLIFY_PROD_DEVTOOLS__: false,
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
})
