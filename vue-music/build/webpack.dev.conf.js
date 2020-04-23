'use strict'
// 为了配置后台接口代理的  start
var express = require('express')
var axios = require('axios')
var app = express()
var apiRoutes = express.Router()
app.use('/api', apiRoutes)
// 为了配置后台接口代理的  end
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
      clientLogLevel: 'warning',
      historyApiFallback: {
          rewrites: [
              {from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html')},
          ],
      },
      hot: true,
      contentBase: false, // since we use CopyWebpackPlugin.
      compress: true,
      host: HOST || config.dev.host,
      port: PORT || config.dev.port,
      open: config.dev.autoOpenBrowser,
      overlay: config.dev.errorOverlay
          ? {warnings: false, errors: true}
          : false,
      publicPath: config.dev.assetsPublicPath,
      proxy: config.dev.proxyTable,
      quiet: true, // necessary for FriendlyErrorsPlugin
      watchOptions: {
          poll: config.dev.poll,
      },
      before(app){
          app.get('/api/getTopBanner', function (req, res) {
              const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
              const jumpPrefixMap = {
                  10002: 'https://y.qq.com/n/yqq/album/',
                  10014: 'https://y.qq.com/n/yqq/playlist/',
                  10012: 'https://y.qq.com/n/yqq/mv/v/'
              }

              axios.get(url, {
                  headers: {
                      referer: 'https://u.y.qq.com/',
                      host: 'u.y.qq.com'
                  },
                  params: req.query
              }).then((response) => {
                  response = response.data
                  if (response.code === 0) {
                      const slider = []
                      const content = response.focus.data && response.focus.data.content
                      if (content) {
                          for (let i = 0; i < content.length; i++) {
                              const item = content[i]
                              const sliderItem = {}
                              const jumpPrefix = jumpPrefixMap[item.type || 10002]
                              sliderItem.id = item.id
                              sliderItem.linkUrl = jumpPrefix + item.jump_info.url + '.html'
                              sliderItem.picUrl = item.pic_info.url
                              slider.push(sliderItem)
                          }
                      }
                      res.json({
                          code: 0,
                          data: {
                              slider
                          }
                      })
                  } else {
                      res.json(response)
                  }
              }).catch((e) => {
                  console.log(e)
              })
          })
          app.get('/api/getDiscList', function (req, res) {
              const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
              axios.get(url, {
                  params: req.query,
                  headers: {
                      referer: 'https://c.y.qq.com/',
                      host: 'c.y.qq.com'
                  }
              }).then((response) => {
                  res.json(response.data);
              }).catch((err) => {
                  consloe.log(err);
              })
          })
      }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
