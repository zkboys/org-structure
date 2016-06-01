export default [
    {
        path: '/shop/ValidationDemo',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./ValidationDemo'));
            });
        },
    },
];
