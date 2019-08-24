'use strict'

const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const MiniCssExtractPlugin  = require('mini-css-extract-plugin')
const DotEnv = require ('dotenv-webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const utils = require('./utils')

module.exports = merge(baseConfig, {
	mode: 'production',
	output: {
		path: utils.resolve('dist'),
		filename: 'js/[name].[hash:7].js'
	},
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
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: (resourcePath, context) => {
								// publicPath is the relative path of the resource to the context
								// e.g. for ./css/admin/main.css the publicPath will be ../../
								// while for ./css/main.css the publicPath will be ../
								return path.relative(path.dirname(resourcePath), context) + '/'
							},
							hmr: process.env.NODE_ENV === 'development'
						}
					},
					'css-loader'
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
			filename: 'css/[name].[hash:8].css',
			chunkFilename: 'css/[name].[hash:8].css',
			ignoreOrder: false
		}),
		new CleanWebpackPlugin()
	]
})
