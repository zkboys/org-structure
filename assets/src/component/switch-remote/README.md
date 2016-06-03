# SwitchRemote 远程开关
切换某个属性得状态，比如锁定/解锁（true/false），发起远程请求，请求过程中，Switch为loading状态，并且不可用，切换结束之后，才可以进行下一次点击。

## API
属性|必填|说明|类型|默认值
----|----|---|-----
checked|是|开启状态，true为开启，false为关闭|bool|false
url|是|请求后台的url，由于状态切换属于修改操作，所以使用put发送请求|string|-                       
checkedKey|是|要切换的数据key，后端会接受此参数|string|-                       
params|否|请求参数，比如id等|object|-                    
onChange|否|状态改变触发|function(checked)|-
checkedChildren|否|开启式显示文字|string/jsx|"是"                    
unCheckedChildren|否|关闭显示文字|string/jsx|"否"  
                    
## 说明
1. url对应的后台接口对状态进行切换，如果checkedKey对应参数传入true，数据库对应数据状态改为false，如果checkedKey对应参数传入false，数据库对应数据状态改为true
1. 表格中使用是，一定要加上key，否则多页之间有干扰
1. 要通过onChange改变数据状态，否则页面重新渲染之后，Switch状态会不准确。                    
 
