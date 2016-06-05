exports.permission = function (key) {
    return function (req, res, next) {
        var currentLoginUser = req.session.user;
        if (currentLoginUser.loginname === 'admin') {
            next();
        } else {
            var userPermission = currentLoginUser.permissions;
            if (!userPermission || !userPermission.length || !key) {
                res.sendError(new Error('权限不足'), '您无权进行此操作', 403);
            } else if (userPermission.indexOf(key) > -1) {
                next();
            } else {
                res.sendError(new Error('权限不足'), '您无权进行此操作', 403);
            }
        }
    }
};
