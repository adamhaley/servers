const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin= require('copy-webpack-plugin');
const path = require('path');

module.exports = {
	context: __dirname + '/src',
	entry: {
		bundle: './js/main.js',
		webflow: './js/webflow.js',
		reset: './styl/reset.styl',
		style: './styl/main.styl',
	},
	mode: 'development',
	devtool: 'source-map',
    watch: true,
	output: {
		path: __dirname + '/dist',
		filename: '[name].js'
	},
	resolve: {
		alias: {
			// A standard alias that matches the first segment of an import path
			// Note: Tilde (~) is not required, but is convention for stylesheet aliases
			// Maps @import '~styl/*' to '/path/to/src/styl/*'
			'~styl': path.join(__dirname, 'styl'),

			// An "exact match" alias (i.e. will only match @import 'mixins')
			// @see https://webpack.js.org/configuration/resolve/#resolvealias
			// Maps @import 'mixins' to '/path/to/src/styl/mixins'
			'mixins$': path.join(__dirname, 'styl/mixins'),
		},
	},
	module: {
		rules: [
			{
				test: /\.styl$/,
				use: [
					{
						// Extracts CSS to a separate file
						loader: MiniCssExtractPlugin.loader
					},
					{
						// Translates CSS into CommonJS
						loader: 'css-loader',
						options: {
							// Required for Stylus source map output
							sourceMap: true,
						}
					},
					{
						// Compiles Stylus to CSS
						loader: 'stylus-native-loader',
						options: {
							/**
							 * Specify Stylus plugins to use. Plugins can be passed as
							 * strings instead of importing them in your Webpack config.
							 *
							 * @type {string|Function|(string|Function)[]}
							 * @default []
							 */
							use: 'nib',
						}
					},
				]
			},

			{test: /\.css$/i, use: [MiniCssExtractPlugin.loader, "css-loader"]},
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			ON_TEST: process.env.NODE_ENV === 'test'
		}),
        new HtmlWebpackPlugin({
          template: 'index.html'
        }),
		new MiniCssExtractPlugin({
			filename: '../[name].css'
		}),
		new CopyWebpackPlugin({
			patterns: [
				{from:'images',to:'../dist/images'},
			]
		}),
	],
	performance: {
		maxAssetSize: 100000,
		hints: false
	},
}
