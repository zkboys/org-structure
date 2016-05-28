# org-structure （人员管理系统）

## 路由约定
### 跳转页面的路由
所有跳转页面的路由，写在web_router.js中；

### ajax请求
所有ajax请求，要返回json数据的请求，写在api_router.js中；比如：/api/system/menus

```
请求以api开头；/api/大模块/具体模块
由于app.use('/api', cors(), apiRouter);
api_router中 只写/system/menus即可

restfull约定
查询：
GET /api/system/menus
修改
PUT /api/system/menus
删除
DELETE /api/system/menus
添加
POST /api/system/menus
```

