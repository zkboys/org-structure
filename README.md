# org-structure （人员管理系统）

## 安装&开发
1. 安装 `Node.js/io.js[必须]` `MongoDB[必须]` `Redis[必须]`
2. 启动 MongoDB 和 Redis
3. npm install 
4. cd assets && npm install 
5. cd assets && npm run dev
6. npm run dev 
7. http://localhost:3001

## 路由约定
### 跳转页面的路由
所有跳转页面的路由，写在web_router.js中；

### ajax请求
所有ajax请求，要返回json数据的请求，写在api_router.js中；比如：/api/system/menus

```
请求以api开头；/api/大模块/具体模块
由于app.use('/api', cors(), apiRouter),api_router中 只写/system/menus即可
前端BaseComponent.jsx组件封装的request方法，会拼接/api，前端直接写/system/menus即可。如果不想拼接使用：.isApi(false)

restfull约定
id查询
GET /api/system/menus/:id
条件查询：
GET /api/system/menus
修改
PUT /api/system/menus
删除
DELETE /api/system/menus
添加
POST /api/system/menus
```
### 静态文件

请求本站的静态文件，统一使用public开头，比如 '/public/imgs/xxx.jpg'等

## api接口编写说明
遵循一定的约定，可以同意代码风格，自动处理很多事情，少些代码

### 数据命名
直接相关数据，使用result/results命名

### 成功
处理成功之后，返回数据,不要使用success:true等标记，正常返回的就是成功数据，前端使用success处理，失败数据通过设置status，前端使用error处理

- 单数（一个对象，一个数值等）:`res.send(obj)`
- 负数（一个数组）:`res.send([obj1, obj2,obj3])`
- 混合数据，直接返回一个对象: `res.send({xxx:12, result: obj, results: [obj1, obj2, obj3]})`, 约定关键字：单条使用result，条使用results
- 不发送数据: `res.sendSuccess();`

### 失败
任何失败要使用`res.sendError(err, message, status)`处理，默认status为400

常用的status:

- 400 bad request 请求参数有问题
- 422 请求没问题，但是无法获取数据，或者获取数据出问题了。
- 403 权限不足，无权访问
- 404 资源不存在
- 500 代码错误

### demo
以用户相关结构为例

```
getUserById // 获取单条数据
成功返回 res.send(user) 或 res.send({count:1, result: user})
失败返回 res.sendError(err,'获取用户失败', 422);

getUsersByPage // 获取多条数据
成功返回 res.send({count:1000, currentPage: 1, results: users})
失败返回 res.sendError(err,'获取用户失败', 422);
```
## 权限管理
`api_router.js` 中使用`permission` 中间件进行权限检测
```
router.get('/organization/users', permission('user-search'), user.getByPage);
```
其中 `user-search` 为配置的权限key，配置时，注意语义化。

前端`BaseComponent.jsx`组件中，提供了`this.currentUser.permissions;`可以获取当前用户的所有权限。`this.currentUser.hasPermission('user-update');`判断当前用户是否有某个权限。
  

