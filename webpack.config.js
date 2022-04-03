const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const robotoAsyncGoogleFontLink = `<link rel="stylesheet" media="print" onload="this.onload=null;this.removeAttribute('media');" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"></link>`;

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: ({ htmlWebpackPlugin }) => `
      <!DOCTYPE html><html>
      <head>
      ${robotoAsyncGoogleFontLink}
      <meta charset=\"utf-8\">
      <title>Wordle</title><meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body><div id=\"app\"></div></body></html>`,
      filename: 'index.html',
    }),
    new LodashModuleReplacementPlugin,
    new MiniCssExtractPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    })
  ]
};

module.exports = config;