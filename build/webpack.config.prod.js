'use strict'

const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
const DotEnv = require ('dotenv-webpack')

module.exports = merge(baseConfig, {
	mode: 'production',
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendor",
					chunks: "all",
				},
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.css?$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			}, {
				test: /\.styl(us)?$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'stylus-loader'
				]
			}
		]
	},
	plugins: [
		new DotEnv({
			path: './.env.prod', // load this now instead of the ones in '.env'
			safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
		}),
		new MiniCssExtractPlugin({
			filename: 'main.css'
		})
	]
})