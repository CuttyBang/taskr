var debug = process.env.NODE_ENV !== "production";
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var packageData = require('./package.json');
var filename = ['bundle', 'js'];
var minify = process.argv.indexOf('--minify') != -1;
    filename.splice(filename.length - 1, 0, 'min');
    plugins.push(new webpack.optimize.UglifyJsPlugin());
}
var plugins = debug ? [] : [
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
  new HtmlWebpackPlugin({
    title: 'Taskr',
    filename: '../index.html',
    template: './index.ejs',
    minify: {
     collapseWhitespace: true
    },
  }),
  new ExtractTextPlugin({
    filename: 'main.css',
    disable: false,
    allChunks: true
 }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  })
];

var dirs = {
  theme:'../',
  assets:'assets/',
  css:'css/',
  js:'js/',
  scss:'./scss/'
};


module.exports = {
  context: __dirname,
  devtool: debug ? 'inline-courcemap' : null,
  entry: "./js/index.js",
  output: {
    path: path.resolve(__dirname, dirs.theme + dirs.assets),
    filename: filename.join('.'),
  },

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['latest', 'react']
        }
      },
    ],
   rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader','sass-loader'],
            publicPath:path.resolve(__dirname, dirs.theme + dirs.assets+dirs.css)
        })
     }
   ]
  },
  node: {
  readline: 'empty'
},
  externals: {
    jquery: 'jQuery'
  },
  plugins: plugins
}
