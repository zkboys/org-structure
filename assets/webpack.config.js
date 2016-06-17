var path = require('path');
var join = path.join;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var child_process = require('child_process');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var nodeENV = process.env.NODE_ENV || 'development';
var generateLibrary = require('./generate-library.js');

/*
 * 基于不同模式，区分配置
 * */
var configs = {
    development: {
        path: '../public',
        publicPath: 'http://localhost:8088/s/',
        library: [
            {from: (0, join)(__dirname, './favicon.png')},
            {from: (0, join)(__dirname, './node_modules/antd/dist/antd.css')},
            {from: (0, join)(__dirname, './node_modules/react/dist/react.js')},
            {from: (0, join)(__dirname, './node_modules/react-dom/dist/react-dom.js')},
            {from: (0, join)(__dirname, './node_modules/antd/dist/antd.js')},
            {from: (0, join)(__dirname, './node_modules/moment/min/moment-with-locales.min.js')},
        ]
    },
    test: {
        path: '../public',
        publicPath: '/public/'
    },
    production: {
        path: '../public',
        publicPath: '/public/',
        library: [
            {from: (0, join)(__dirname, './favicon.png')},
            {from: (0, join)(__dirname, './node_modules/antd/dist/antd.min.css')},
            {from: (0, join)(__dirname, './node_modules/react/dist/react.min.js')},
            {from: (0, join)(__dirname, './node_modules/react-dom/dist/react-dom.min.js')},
            {from: (0, join)(__dirname, './node_modules/antd/dist/antd.min.js')},
            {from: (0, join)(__dirname, './node_modules/moment/min/moment-with-locales.min.js')},
        ]
    }
};


/*
 * 获取不同的环境配置
 * */
var cfg = configs[nodeENV] || configs.development;
/*
 * 第三方js库，分离出来能提高打包速度
 * */
var generatedLibrary = generateLibrary.getAllLibrary(cfg.library);
var library = generatedLibrary.library;

/*
 * 定义entry
 * 如果项目结构命名有良好的约定，是否考虑使用代码自动生成entry？
 * */
var _entry = {
    //"index": ["./src/home/home.jsx", "./src/home/home-content.jsx"],//会合并成一个index.js
    "index": './src/entry/index.jsx',
    "signin": './src/entry/signin.jsx',
    "first-login": './src/entry/first-login.jsx',
};

/*
 * babel参数
 * */
var babelQuery = {
    presets: ['es2015', 'react', 'stage-0'],
    plugins: ['add-module-exports', 'typecheck']
};

/*
 * webpack配置
 * */
module.exports = {
    /*
     * 指定node_modules目录, 如果项目中存在多个node_modules时,这个很重要.
     * import js或者jsx文件时，可以忽略后缀名
     * */
    resolve: {
        root: [path.resolve('./src')],
        modulesDirectories: ['node_modules', (0, join)(__dirname, './node_modules')],
        extensions: ['', '.js', '.jsx']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules', (0, join)(__dirname, './node_modules')]
    },
    /*
     * 入口文件配置
     * */
    entry: _entry,
    /*
     * 输出配置
     * path：构建之后的文件存放目录
     * publicPath：js或css等文件，浏览器访问时路径
     * filename：构建之后的文件名
     * */
    output: {
        pathinfo: false,//去掉生成文件的相关注释
        path: join(__dirname, cfg.path),
        publicPath: cfg.publicPath,
        filename: "[name].[chunkhash].min.js",// entry　配置的文件
        chunkFilename: "[name].[chunkhash].min.js",//非entry，但是需要单独打包出来的文件名配置，添加[chunkhash:8]　防止浏览器缓存不更新．
        //libraryTarget: 'umd',
        'libraryTarget': 'var'
        //umdNamedDefine: true
    },
    externals: {// 这些在页面上通过script标签引入，不参与webpack的构建，提高构建速度。
        'react': 'React',
        'react-dom': 'ReactDOM',
        'antd': 'antd',
        'moment': 'moment',
        'request': 'request',
    },
    module: {
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
        new HtmlWebpackPlugin({
            publicPath: cfg.publicPath,
            extraFiles: {
                css: generatedLibrary.cssFiles,
                js: generatedLibrary.jsFiles,
                favicon: generatedLibrary.favicon,
            },
            title: '管理系统',
            filename: 'index.html',
            template: './src/html-template/index.html',
            excludeChunks: ['signin', 'first-login'],
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            publicPath: cfg.publicPath,
            extraFiles: {
                css: generatedLibrary.cssFiles,
                js: generatedLibrary.jsFiles,
                favicon: generatedLibrary.favicon,
            },
            title: '管理系统',
            filename: 'signin.html',
            template: './src/html-template/index.html',
            excludeChunks: ['index', 'first-login'],
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        /*
         * 公共文件配置
         * */
        //new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            minChunks: 2
        }),
        /*
         * css单独打包成一个css文件
         * 比如entry.js引入了多个less，最终会都打到一个xxx.css中。
         * */
        new ExtractTextPlugin("[name].[chunkhash].min.css", {
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        /*
         * 这样写法 fetch就可以全局使用了，各个不用单独import
         * */
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        /*
         * 定义变量，各个js文件内部可以直接使用
         * */
        new webpack.DefinePlugin({
            'PUBLICPATH': JSON.stringify(cfg.publicPath),
            'process.env': {
                'NODE_ENV': JSON.stringify(nodeENV)
            },

        }),
        /*
         * 拷贝externals文件到指定静态目录，webpack-dev-server也可以获取到这些文件。
         * */
        new CopyWebpackPlugin(library)
    ]
};
