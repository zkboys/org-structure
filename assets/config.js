module.exports = {
    dev: {
        path: '../public',
        publicPath: 'http://localhost:8088/s/',
        port: 5001,
        library: [
            {from: './favicon.png'},
            {from: 'node_modules/antd/dist/antd.css', to: 'antd.min.css'},
            {from: 'node_modules/antd/dist/antd.js', to: 'antd.min.js'},
            {from: 'node_modules/react/dist/react.js', to: 'react.min.js'},
            {from: 'node_modules/react-dom/dist/react-dom.js', to: 'react-dom.min.js'},
            {from: 'node_modules/moment/min/moment-with-locales.min.js', to: 'moment.min.js'},
            {from: 'node_modules/superagent/superagent.js', to: 'superagent.min.js'},
            // 登录页面相关
            {from: 'src/page/sign-in/background.jpg'},
            {from: 'src/page/sign-in/des-img.png'},
            {from: 'src/page/sign-in/sign-in.css', to: 'sign-in.min.css'},
            {from: 'src/page/sign-in/sign-in.js', to: 'sign-in.min.js'},
        ]
    },
    test: {
        path: '../public',
        publicPath: '/public/'
    },
    pro: {
        path: '../public',
        publicPath: '/public/',
        library: [
            {from: './favicon.png'},
            {from: 'node_modules/antd/dist/antd.min.css'},
            {from: 'node_modules/antd/dist/antd.min.js'},
            {from: 'node_modules/react/dist/react.min.js'},
            {from: 'node_modules/react-dom/dist/react-dom.min.js'},
            {from: 'node_modules/moment/min/moment-with-locales.min.js', to: 'moment.min.js'},
            {from: 'node_modules/superagent/superagent.js', to: 'superagent.min.js'},
            // 登录页面相关
            {from: 'src/page/sign-in/background.jpg'},
            {from: 'src/page/sign-in/des-img.png'},
            {from: 'src/page/sign-in/sign-in.css', to: 'sign-in.min.css'},
            {from: 'src/page/sign-in/sign-in.js', to: 'sign-in.min.js'},
        ]
    }
};
