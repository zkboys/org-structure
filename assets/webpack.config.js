var path = require('path');
var join = path.join;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var child_process = require('child_process');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var nodeENV = process.env.NODE_ENV || 'dev';
var config = require('./config');
var cfg = config[nodeENV] || config.dev; // 获取不同的环境配置
var library = cfg.library; // 第三方js库，分离出来能提高打包速度

var babelQuery = {
    presets: ['es2015', 'react', 'stage-0'],
    plugins: ['add-module-exports', 'typecheck']
};
var projectRoot = path.resolve(__dirname, './src/page');

module.exports = {
    resolve: {
        root: [path.resolve('./src')],
        modulesDirectories: ['node_modules', (0, join)(__dirname, './node_modules')], // 指定node_modules目录, 如果项目中存在多个node_modules时,这个很重要.
        extensions: ['', '.js', '.jsx'] // import js或者jsx文件时，可以忽略后缀名
    },
    resolveLoader: {
        modulesDirectories: ['node_modules', (0, join)(__dirname, './node_modules')]
    },
    entry: { // 入口文件配置
        //"index": ["./src/home/home.jsx", "./src/home/home-content.jsx"],//会合并成一个index.js
        "index": './src/entry/index.jsx',
    },
    output: {
        pathinfo: false, // 去掉生成文件的相关注释??
        path: join(__dirname, cfg.path), // 构建之后的文件存放目录
        publicPath: cfg.publicPath, // js或css等文件，浏览器访问时路径，cdn
        filename: "[name].min.js",// 构建之后的文件名 name为 entry　配置的名称
        chunkFilename: "[name].[chunkhash:8].min.js",//非entry，但是需要单独打包出来的文件名配置，添加[chunkhash:8]　防止浏览器缓存不更新．
        //libraryTarget: 'umd',
        'libraryTarget': 'var'
        //umdNamedDefine: true
    },
    externals: {// 这些在页面上通过script标签引入，不参与webpack的构建，提高构建速度。这些文件本身九构建好的，浏览器可以直接执行的，如果需要构建的，使用dll插件解决。
        'react': 'React',
        'react-dom': 'ReactDOM',
        'antd': 'antd',
        'moment': 'moment',
        'superagent': 'superagent',
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx$/,
                loader: 'eslint',
                include: projectRoot,
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'eslint',
                include: projectRoot,
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: babelQuery
            }, {
                test: /\.jsx$/,
                loader: 'babel',
                query: babelQuery
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css?sourceMap&-restructuring!' + 'autoprefixer-loader')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('css?sourceMap!' + 'autoprefixer-loader!' + 'less?{"sourceMap":true,"modifyVars":{}}')
            },
            {
                test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: '[name]-[hash:7].[ext]'
                }
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&minetype=application/font-woff'
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&minetype=application/font-woff'
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&minetype=application/octet-stream'
            }, {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'}, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&minetype=image/svg+xml'
            }, {
                test: /\.md$/,
                loader: 'html!markdown'
            },
        ]
    },
    plugins: [
        //new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
        new webpack.optimize.CommonsChunkPlugin({ // 公共文件配置
            name: "common",
            minChunks: 2
        }),
        new ExtractTextPlugin("[name].min.css", { // css单独打包成一个css文件 比如entry.js引入了多个less，最终会都打到一个xxx.css中。
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        /*
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch' // 这样写法 fetch就可以全局使用了，各个不用单独import
        }),
        */
        new webpack.DefinePlugin({ // 定义变量，各个js文件内部可以直接使用
            'PUBLICPATH': JSON.stringify(cfg.publicPath),
            'process.env': {
                'NODE_ENV': JSON.stringify(nodeENV)
            },

        }),
        new CopyWebpackPlugin(library) //拷贝externals文件到指定静态目录，webpack-dev-server也可以获取到这些文件。
    ]
};
