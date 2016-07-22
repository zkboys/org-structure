// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'), // index.html文件生成之后存放的位置，可以直接指定到后端的views目录
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'public', // 生成得所有文件（webpack编译生成的，static下的），统一放到这个目录下（assetsRoot/assetsSubDirectory即：dist/public）
    assetsPublicPath: '/', // 静态文件前缀，cdn等。
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 5080,
    proxyTable: {}
  }
}
