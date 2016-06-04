export default [
    {
        path: '/system/profile/message',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./ProfileMessage.jsx'));
            });
        },
    },
    {
        path: '/system/profile/pass',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./ProfilePassWord.jsx'));
            });
        },
    },
];
