var Menu = require('../proxy/Menu');
exports.getAllMenus = function (req, res, next) {
    Menu.getAllMenus(function (err, menus) {
        if (err) {
            return res.sendError(err, '获取菜单信息失败', 422);
        }
        res.send(menus)
    });
}
exports.updateAllMenus = function (req, res, next) {
    var menus = req.body.menus;
    Menu.updateAllMenus(menus,function(err){
       if(err){
           return res.sendError(err, '更新菜单失败', 422);
       }
        res.send({})
    });
}
