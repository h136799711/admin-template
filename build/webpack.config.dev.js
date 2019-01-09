'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const DotEnv = require ('dotenv-webpack')
const HtmlWebpackPlugin = require ('html-webpack-plugin')

module.exports = merge(baseConfig, {
	mode: 'development',

	devServer: {
		clientLogLevel: 'warning',
		hot: true,
		contentBase: 'dist',
		compress: true,
		host: 'localhost',
		port: '8082',
		open: true,
		overlay: { warnings: false, errors: true },
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
			}
		]
	},

	plugins: [
		new DotEnv({
			path: './.env.dev', // load this now instead of the ones in '.env'
			safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
		}),
		new webpack.HotModuleReplacementPlugin()
	]
})