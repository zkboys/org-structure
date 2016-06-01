# 前端项目架构
*基于node.js 和 ant.design*
如果安装比较卡，可以翻墙，或者使用cnpm
安装cnpm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
## 需要node.js版本
```
node 4.x
```
## 准备
```
sudo npm install webpack -g
sudo npm install webpack-dev-server -g
```
## 前端环境安装启动
```
cd assets
npm install
npm run dev #开启前端静态服务器，结合后端服务器可以做到浏览器自动刷新，方便开发。详见下面说明

npm run build-development #构建development（开发）环境前端代码
npm run build-test #构建test（测试）环境前端代码
npm run build-production #构建production（生产）环境前端代码
```

## dev模式
- 结合webpack-dev-server 可以做到代码改动,浏览器自动刷新.
- 使用webpack-dev-server 作为静态服务器,以--inline方式启动,js中会添加热刷新相关的代码.前后端各添加一个开发服务器的配置,对项目基本无侵入.
- 注意前端静态服务器的端口，硬编码方式，多处有对应。

nodejs为例:

后台正式服务器添加一个启动模式:

```
site_static_host: 'http://localhost:8086/s/' //这个指向webpack-dev-server服务器
```

前端webpack.config.js添加一个启动模式:

```
development: {
    ...
    publicPath: 'http://localhost:8088/s/',
    ...
},
```

webpack-dev-server 启动方式:(以dev方式启动)

*可以在assets目录中直接执行`npm run dev`*    

```
cross-env NODE_ENV=development webpack-dev-server --port 8088 --progress --inline
```

后端启动方式:(以devserver方式启动)

*可以在根目录中直接执行`npm run dev`*

```
cross-env PORT=3001 cross-env NODE_ENV=development supervisor -w ./api,./common,./controllers,./middlewares,./models,./proxy ./app.js
```

浏览器输入下面连接访问,就可以达到浏览器自动刷新,尤其适合双屏开发，调整页面细节情况.

```
http://localhost:3001/    
```    

## 约定
### 目录结构
```
-assets
    -src
        -common                 通用工具代码
        -component              通用组件
        -entry                  项目入口文件
        -framework              框架，头部，左侧导航等通用代码，Redux实现。各位同学不要修改这个文件夹下面的代码，如果有bug，或者需求，向有关同学提出。
        -page                   业务相关,平时开发主要在这个文件夹下进行.
            -所有文件夹          各个页面/模块业务代码,详见下面说明
            -Routes.js          前端路由配置
    -.eslintrc                  ESLint配置
    -favicon.png                网站图标
    -LICENSE                    协议
    -package.json               项目资源管理配置文件.
    -READEME.md                 说明文档
    -webpack.config.js          构建工具webpack配置              
```

每个页面为一个单独组件，统一放在page目录下,每个页面所用到的资源都放到一个文件夹下面,比如home

```
home
    -img
        -home.jpg
    -Home.jsx    
    -style.less
    -Routes.js
organization
    -organization
        -Organization.jsx
    -user
        -UserEdit.jsx
        -UserList.jsx
    Routes.js // 名字一定要是Routes.js，以后可能会做自动提取。    
```
做大型应用时，route比较多，写在一个Routes.js文件中，一是Routes.js会过于庞大，不好维护，二是团队协作时，很容易产生冲突。因此每个模块的路由，写在自己的模块下(以Routes.js命名)，统一在page/Routes.js中定义各个模块无法定义的router。所有的路由最终规整到page-routes.js文件下，甚至可以通过代码，自动提取。

### URL(路由&菜单path)
需要根据路由同步页面状态（浏览器url同步页面状态，主要是头部导航和左侧菜单的选中状态，以及页面要渲染哪个组件），所以需要有固定格式的url，方便提取信息。

```
初步定为：http[s]://www.xxxx.com/sys-path/menu-path
sys-path：对应头部导航，确定是哪个系统，确定左侧显示哪组菜单
menu-path：左侧菜单对应的path，同时跟路由有对应。menu-path可以多级，比如users/lists/...
```
### 路由&菜单
后端所有的get请求最终没有被截获的，都打到index.html

```
node后端路由配置（routes.js）：
router.get('*', function (req, res, next) {
    // ajax请求 抛出404,其他请求直接render index.html 
    res.render('index.html');
});
```

前端所有没有截获的path，都打到Error404组件。

```
详见 framework/Routes.jsx
```

页面跳转要使用Link，否则会跳出单页面应用。

```
import {Link} from 'react-router'
<Link to="/xxxxx">XXXXX</Link>
```
### 前端路由结构规范
*特殊情况，不能按照规范实现，与各位leader商榷*

1. 多单词使用“_”链接，不要使用“-”，或其他特殊字符。
1. 根据菜单结构，定义url结构，RestFull 约定，具体看下面例子。

例如：
```
菜单结构：
系统 # system
    -用户管理 # user 
        -添加用户
        -用户列表

对应的菜单为  

列表页：
http:localhost:8080/users
详情页 12为id
http:localhost:8080/users/12
添加页
http:localhost:8080/users/new
修改页
http:localhost:8080/users/12/edit
```
菜单结构
```
门店  # store
    -订单 # order 一级
        -外卖订单 # take_out 二级
            -新订单 # new_order 可点击跳转页面
            -所有订单 # all_order 可点击跳转页面
```
对应的菜单为：
```
列表页
http:localhost:8080/store/order/take_out/new_orders
详情页
http:localhost:8080/store/order/take_out/new_orders/12
添加页
http:localhost:8080/store/order/take_out/new_orders/new
修改页
http:localhost:8080/store/order/take_out/new_orders/21/edit
```

#### 菜单数据来源：
左侧菜单数据由后台提供，会包含path，路由前端单独维护，通过path跟菜单（或者Link）关联。

*注:头部和左侧菜单也可以前端硬编码,根据项目具体需求,具体决定.*

```
左侧菜单数据:详见 framework/sidebar/
头部导航菜单:详见 framework/header/
```

#### 菜单数据结构：
采用扁平化结构，后台存储更具有通用性，前端会有转换函数，转为树状结构。如果后端提供的数据结构字段名无法对应，做一层数据转换，或者修改转换函数。

```javascript
[
    {
        key: 'system',
        parentKey: undefined,
        order: 1,
        icon: 'fa-th-list',
        text: '系统',
        path: undefined,
    },
    {
        key: 'shop', // 跟url有关
        parentKey: undefined,
        order: 1,
        icon: 'fa-th-list',
        text: '顶级菜单1',
        path: undefined, // 如果顶级菜单作为头部导航，这个path是点击之后的跳转。默认获取第一个带有path的子节点，如果获取不到，path='/'
    },
]
```

#### 地址栏与菜单自动关联
点击菜单时(或其他链接)，不需要绑定事件，直接通过Link走路由跳转，地址栏改变后，会触发监听事件，同步头部导航和左侧菜单状态

```
browserHistory.listen(function (data) {
//细节参见 具体代码 framework/Routes.jsx
}}
```

### 各个页面头部的写法：
#### 目前一共三种写法：

第一种，直接写jsx：

```
let pageHeader = <div>
    <h1 className="admin-page-header-title">Dashboard</h1>
    <Breadcrumb>
        <Breadcrumb.Item>首页</Breadcrumb.Item>
        <Breadcrumb.Item href="">应用中心</Breadcrumb.Item>
        <Breadcrumb.Item href="">应用列表</Breadcrumb.Item>
        <Breadcrumb.Item>某应用</Breadcrumb.Item>
    </Breadcrumb>
</div>;
<Page header={pageHeader}>
    ...
</Page>
```

第二种，js对象：

```
let pageHeader = {
    title: '表单校验', // 缺省将不显示标题；'auto' 将会根据左侧导航，自动获取当前菜单名作为标题
    breadcrumbItems: [// 缺省将不显示面包屑导航； 'auto' 将会根据左侧导航，自动获取当前菜单展开状态作为面包屑导航。
        {text: '某应用'},
        {text: '我的时间', path: '/myTime3'},
        {text: '表单校验'}
    ]
};  
<Page header={pageHeader}>
    ...
</Page>
```

第三种，根据左侧菜单自动获取：

```
<Page header='auto'>
    ...
</Page>
```

### 页面加载状态切换
传给Page loading（true/false）属性即可

```
<Page loading={this.state.loading}>
    ...
</Page>
```

### 进场动画
Page组件中有默认进场动画，各个页面可以自定义进场动画

```
let animConfig = [
            {opacity: [1, 0], translateX: [0, 50]},
            {opacity: [1, 0], translateX: [0, -50]}
        ];
<Page animConfig={animConfig}>
    ...
</Page>
```

## 按需加载
react-router改成如下写法就可以按需加载:

```
{
    path: '/system/mail/read', getComponent: (location, cb) => {
    require.ensure([], (require) => {
        cb(null, require('./mail/ReadMail'));
    })
}
```
按需加载的模块，就不要重复import，否则不会单独生成文件，按需加载会失效。

具体某个模块改动，只会影响到当前模块对应生成的文件和common.js不会影响其他生成的文件，可以提高文件的缓存利用率，加速首页加载．

## 待解决问题
- *处理有些页面没有左侧菜单的情况，隐藏左侧菜单以及头部“切换菜单状态”按钮 done*
- *通过发布订阅或者其他模式，统一管理头部导航和左侧菜单，以及url与页面状态的对应。由于地址栏改变事件会提前于菜单渲染，发布订阅模式是否合适？生产者消费者？还是使用发布订阅，通过状态检测？有点恶心。。。 done*
- *react react-dom antd 做成全局，节省打包时间。done*
- *ajax封装，使用promise模式。 done promise 模式无法打断,不考虑使用promise模式.*
- *框架级的东西，单独打包成一个组件，也通过npm方式安装，提高各个项目之间的通用性。方便统一维护。 done 架构相关代码暂时先区分到了同一个目录下。*
- *表单校验 done ant.design官网有提供*
- *执行构建有些慢 done 第三方库直接全局引入，构建慢一般可以接受，watch速度还是可以的。*
- *根据地址定位左侧菜单 目前使用全局持有菜单句柄的方法，有点恶心，有没有好一点的方法？ done 使用发布订阅模式解决*
- *根据左侧菜单修改右上角对应的面包屑 done*
- *由于这个是一个单页面应用,从新发送ajax请求的时候,一些ajax请求需要被打断,否则用户网络情况不好,点击了多个按钮,最终不能确定哪个ajax会被执行,会导致页面错乱问题. done 通过xhr的abort方法取消请求.*
- *组件之间的通信*
    - *父级->子级 props*
    - *子级->父级 props传递回调函数*
    - *没有级联关系组件之间 flux,redux 不考虑使用，会增加项目的复杂度，一般不会涉及这种情况，如果有必要，使用发布订阅。*
- *同一个组件,使用不同的react-router path,会导致这个组件渲染页面特变慢 done,要避免这种情况，如果需要不同路径渲染同一个组件，使用路径传参数方式区分。*
    ```
    比如:
    path: 'aaaaa', component: Dashboard
    path: 'bbbbb', component: Dashboard
    这样一个路由,会导致Dashboard渲染页面特别慢
    ```
- *前端代码生成工具，主要针对CRUD页面。done webstorm等ide有文件模板*    


## React ES6+写法
```
// 多加一层继承, 可以在BaseComponent中做一些文章.
class BaseComponent extends React.Component{
    // 构造函数
    constructor(props){
        super(props);
    }
    // ...其他公用代码,方法等封装
}    
//定义类 并继承BaseComponent
class App extends BaseComponent{
    // 构造函数
    constructor(props){
        super(props);
    }
    // 初始化state,替代原getInitialState, 注意前面没有static
    state = {
        showMenu:false
    };
    // 替代原propTypes 属性,注意前面有static,属于静态方法.
    static propTypes = {
        autoPlay: React.PropTypes.bool.isRequired
    }
    // 默认defaultProps,替代原getDefaultProps方法, 注意前面有static
    static defaultProps = {
        loading:false
    };
    //事件的写法,这里要使用箭头函数,箭头函数不会改变this的指向,否这函数内,this指的就不是当前对象了,React.CreatClass方式React会自动绑定this,ES6写法不会.详见下一小节说明.
    handleClick = (e)=>{
        this.setState();//这里的this指的还是App
    };
    componentDidMount() {
        // React内置的周期函数,这里要显示的调用父类的相应函数,否则一旦父类中有封装,子类会把父类相应函数覆盖掉,不会执行父类的函数.
        // 需要判断一下...父类一旦没有实现componentDidMount,这里直接调用就会报错,最好是父类都实现相应的方法,子类就不用判断了.
        if (super.componentDidMount) {
            super.componentDidMount();
        }
        // do something yourself...
    }
}
```
## 官方的一个例子:
```
export class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  tick() {
    this.setState({count: this.state.count + 1});
  }
  render() {
    return (
      <div onClick={this.tick.bind(this)}>
        Clicks: {this.state.count}
      </div>
    );
  }
}
Counter.propTypes = { initialCount: React.PropTypes.number };
Counter.defaultProps = { initialCount: 0 };
```
## React ES6 事件绑定
老写法的官方原话:
Autobinding: When creating callbacks in JavaScript, you usually need to explicitly bind a method to its instance such that the value of this is correct. With React, every method is automatically bound to its component instance. React caches the bound method such that it's extremely CPU and memory efficient. It's also less typing!

新的ES6写法如果要实现this还指向当前对象,有三种写法:个人感觉箭头函数写法最优雅.
```
第一种:this._handleClick.bind(this)

_handleClick(e) {
    console.log(this);
}
render() {
    return (
        <div>
            <h1 onClick={this._handleClick.bind(this)}>点击</h1>
        </div>
    );
}
第二种:this._handleClick = this._handleClick.bind(this)

constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this)
}
_handleClick(e) {
    console.log(this);
}
render() {
    return (
        <div>
            <h1 onClick={this._handleClick}>点击</h1>
        </div>
    );
}
第三种:_handleClick = (e) => {}

_handleClick = (e) => {
    // 使用箭头函数(arrow function)
    console.log(this);
}
render() {
    return (
        <div>
            <h1 onClick={this._handleClick}>点击</h1>
        </div>
    );
}

```

## React ES6 写法,做封装一些待解决的问题
- 多层继承,props state等属性如何继承?
- 一些周期函数子类如何自动调用?而不是super.componentDidMount()这种显示调用


## 组件
- 请求：superagent
- cookie:
- 本地存储：
- 时间处理：moment
