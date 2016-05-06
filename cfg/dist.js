'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/index'),
  cache: false,//增量编译
  devtool: 'sourcemap',//在output对应文件生成sourcemap,方便我们在浏览器调试
  plugins: [

    new webpack.optimize.DedupePlugin(),//用来检测相似的文件或者文件中重复的内容，然后将这些冗余在output中消除掉
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new webpack.optimize.UglifyJsPlugin(),//用来压缩输出的JavaScript代码
    new webpack.optimize.OccurenceOrderPlugin(),//按照引用频度来排序各个模块，bundleId引用的越频繁Id值越短已便达到减小文件大小的效果
    new webpack.optimize.AggressiveMergingPlugin(), //用来优化生成的代码段，合并相似的trunk，提取公共部分
    new webpack.NoErrorsPlugin()//用来保证编译过程不能出错
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;
