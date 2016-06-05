# 组件基类
所有的业务要继承BaseComponent，BaseComponent封装了一些公共处理
## 功能
### 获取当前登录用户
```
this.currentUser;
```
### 当前用户权限检测
```
this.currentUser.hasPermission('user-update');
```
### 全屏loading
```
this.startLoading();
this.endLoading();
```

### request封装，链式调用

1. 自动startLoading,endLoading
1. 自动处理异常：服务端返回异常，断网异常，超时异常
1. 自动根据约定处理返回结果

```
this.request()
.get(url)
.timeout(1000*10) // 设置超时时间，默认是10秒
.params({}) // 内部会区分，get请求使用query，post，put，del请求使用send
.noLoading() // 不会调用全屏loading，如果需要自己处理loading，会用到此函数
.setErrorMsg(errorMsg) // 自定义错误提示信息，否则内部会自动尝试给出错误提示
.start(cb) // ajax开始之间的回调函数 cb:function()
.error(cb) // 出错时回调函数 cb:functin(err, res)
.success(cb) // 成功回调，尝试根据约定处理结果（result results约定），如果结果不是自己想要的，可以从res中获取，cb:function(result || results || res.body || res, res)
.end(cb) // 以上方法只是在做准备，end函数才真正根据前面得准备发送请求。所以一定要调用end。cb可选，cb:function(err, res)
```

### 组件卸载，自动打断未结束请求
```
componentWillUnmount() {
        // 组件卸载之后，打断所有未结束得请求，
        // 子类要是要使用componentWillUnmount，需要显示的调用super().componentWillUnmount();
        this.requests.forEach(r => {
            r.abort();
        });
    }
```
