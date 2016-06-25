/*
 * 这个文件用来配置，无法在模块中配置的路由
 * */
export default [
    {
        path: '/dev/components',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../component/Index.jsx'));
            });
        },
    },
    {
        path: '/dev/query-terms',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../component/query-terms/Demo.jsx'));
            });
        },
    },
];

