export default [
    {
        path: '/organization/organizations',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./organization/Organization.jsx'));
            });
        },
    },
    {
        path: '/organization/users',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./user/UserList.jsx'));
            });
        },
    },
    {
        path: '/organization/roles',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./role/RoleList.jsx'));
            });
        },
    },
];

