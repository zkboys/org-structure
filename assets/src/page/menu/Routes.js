export default [
    {
        path: '/dev/menus',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./SystemMenu.jsx'));
            });
        },
    },
];
