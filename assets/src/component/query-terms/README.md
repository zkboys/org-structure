# 查询条件封装
## 代码是最好的文档，请查看Demo.jsx


## API
属性|必填|说明|类型|默认值
----|----|---|------
showSearchBtn|否|是否显示查询按钮|Bool|true
searchBtnText|否|查询按钮的text|String|查询
labelWidth|否|全局设置label长度，每个条件可以覆盖这个属性。|String|auto
fieldWidth|否|全局元素长度，每个条件可以覆盖这个属性。|String|150px
resultDateToString|否|查询条件日期相关数据是否转为字符串|Bool|true
extraAfterSearchButton|否|跟在查询按钮之后的内容，比如&lt;Button&gt;导出&lt;/Button&gt;|String|undefined
onComplete|否|查询组件所有数据装载完成之后（会有异步获取数据），会触发，data为初始化时，各个元素的值。|Function|-
onChange|否|元素onchange后触发，data为所有得元素数据|Function|-
onSubmit|是|点击查询按钮时的回调函数 data为所有的查询条件数据，可以在这个函数中发起请求等操作。|Function|-
getAllOptions|否|获取所有的items的options，这是异步操作，用户后端统一返回数据，而不是发多个ajax|Function|-
items|是|数组元素如果是对象，自己占据一行， 如果是数组，数组中所有的组件共占一行。下面是items属性的详细介绍|Array|-

### items API
属性|必填|说明|类型|默认值
----|----|---|------
type|是|查询条件类型|String|-
name|是|一般跟type一致，获取查询结果的字段名称|String|-
hidden|否|此查询条件是否隐藏,有些需求需要控制查询条件的显示，隐藏，可以通过这个字段进行切换。|Bool|默认false
label|否|查询条件显示的label|String|-
labelWidth|否|全局labelWidth，控制label大小，如果是Number类型，默认单位为px|String|-
labelUnifiedFontCount|否|用于上下两行label对其，比如上一行label5个字，下一行label2个字，那么下一行设置labelUnifiedFontCount：5即可|Number|-
fieldWidth|否|全局fieldWidth，控制输入框等大小，如果是Number类型，默认单位为px,|String|-
searchOnChange|否|值改变是否出发onSearch函数|Function|-
placeholder|否|默认为请输入[label],如果是select等选择类型|String|请选择\[label\]
defaultValue|否|筛选条件的初始值.checkbox，checkboxButton这个值为数组。|String,Array|-
fieldPropsOptions|否|form 的 getFieldProps方法第二个参数，用来添加校验等，[参见这里](http://ant.design/components/form/#this-props-form-getfieldprops-id-options)|Function|-
props|否|加在表单元素上的props 一般情况下不要用。|-|-
options|可选/必须|单值条件（input等）没有这个属性，多值条件（checkbox，checkboxButton,radioButton等）组件专用属性|Array|-
expandable|可选|是否启用展开收起功能|Bool|false
minCount|可选|如果使用展开收起功能，收起时显示的个数|Number|10
format|否|日期筛选格式化 yyyy-MM-dd yyyy-MM-dd HH:mm:ss HH:mm|String|-
startDefaultValue|否|日期、时间区间开始默认值|String|-
endDefaultValue|否|日期、时间区间结束默认值|String|-
min|否|type = inputNumber 专用。控制最小值|Number|-
max|否|type = inputNumber 专用。控制最大值|Number|-
url|否|请求地址，一般配合optionsFilter方法使用，对ajax返回的数据进行处理|String|-
component|否|当type = customer是，需要有这个属性，用于指定自定义的筛选组件。|Object|-



