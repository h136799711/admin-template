'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const DotEnv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(baseConfig, {
    mode: 'development',

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
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
})
