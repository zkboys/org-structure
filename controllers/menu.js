var Menu = require('../proxy').Menu;
exports.getAllMenus = function (req, res, next) {
    Menu.getAllMenus(function (err, menus) {
        if (err) {
            res.status(422);
            res.send({error: '获取菜单信息失败'});
        }
        res.send(menus)
    });
}
exports.updateAllMenus = function (req, res, next) {
    var menus = req.body.menus;
    Menu.updateAllMenus(menus,function(err){
       if(err){
           res.status(422);
           res.send({error: '更新菜单失败'});
       }
        res.send({success:true})
    });
}