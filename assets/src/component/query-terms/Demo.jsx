import React from 'react';
import QueryTerms from './QueryTerms';
class Demo extends React.Component {
    state = {};

    render() {
        const queryTermOption = {
            labelFontSize: 12, // 可选，默认12，跟labelUnifiedFontCount配合使用，确定label宽度
            showSearchBtn: true,              // 可选，默认true 是否显示查询按钮
            searchBtnText: '查询',            // 可选，默认 查询 ，查询按钮的text
            extraAfterSearchButton: '',       // 可选，默认 undefined，跟在查询按钮之后的内容，比如<Button>导出</Button>
            labelWidth: '100px',               // 可选，默认：‘auto’,全局设置label长度，每个条件可以覆盖这个属性。
            fieldWidth: '150px',              // 可选，默认：‘150px’,全局元素长度，每个条件可以覆盖这个属性。
            resultDateToString: false,         // 可选，默认 true，查询条件日期相关数据是否转为字符串
            getAllOptions: (callBack) => {
                // 发送ajax请求，一次性获取多个options,如果具体item中写了options，item中的options将被合并。
                const tempOptions = {
                    combobox: [
                        '111.com',
                        '222.com',
                        '333.com',
                    ],
                    urlCombobx: [
                        {value: 1, label: 2},
                    ],
                };
                setTimeout(() => {
                    callBack(tempOptions);
                }, 1000);
            },
            onSubmit: (data) => {       // 必选，点击查询按钮时的回调函数 data为所有的查询条件数据，可以在这个函数中发起请求等操作。
                console.log('查询', data);
            },
            onChange: (data) => { // 可选 元素onchange后触发，data为所有得元素数据
                console.log('options 顶级 change， 得到的数据为：', data);
            },
            onComplete: (data) => { // 可选，查询组件所有（异步）数据加载完成之后，会触发，data为初始化时，各个元素的值。一般用于查询条件初始化完成之后，进行一次查询
                console.log('onComplete 可以做页面初始化时的查询， 得到的数据为：', data);
            },
            items: [
                {
                    // 公共属性
                    type: 'input', // 必填，查询条件类型
                    name: 'input', // 必填 查询条件name
                    label: '输入框', // 可选，默认- 查询条件label，缺省将不显示label
                    placeholder: '请输入内容', // 可选，默认为 请输入[label] 或者 请选择[label]
                    initialValue: 11, // 可选，默认- 默认值，this.props.form.getFieldProps(name, options) 中 options 属性，默认值优先级：initialValue<selected<initialFirst
                    hidden: false, // 可选，默认未false，是否隐藏，可作为切换查询条件状态
                    // labelWidth: 150, // 可选，默认auto
                    // labelUnifiedFontCount: 6, // 可选，默认- label统一字数，用作对齐。
                    fieldWidth: 200, // 可选，默认150
                    searchOnChange: true, // 可选，默认false，change时是否触发查询 即：onSubmit函数
                    onChange: (value) => { // 可选，默认 -
                        console.log('item change', value);
                    },
                    // 下拉，多选，单选，提示输入框
                    // url: '', // 可选， 默认- 获取options的url，如果url和options同时存在，异步获取的数据将push到options中
                    options: [], // 必填 默认- 下拉，多选，单选的数据
                    optionsFilter: (/* res */) => { // 可选， 默认- 对url异步获取的数据进行处理
                        return [ // 返回数据格式
                            {label: 'xxx', value: 'xxx'},
                            {label: 'xxx', value: 'xxx'},
                        ];
                    },
                    // 多选，单选
                    expandable: true, // 可选，默认false，是否可展开
                    minCount: 10, // 可选，默认10，expandable为true时，收起状态展现个数
                    // 日期
                    format: 'yyyy-MM-dd',
                    startName: 'startName',
                    endName: 'endName',
                    startInitialValue: '2016-06-25',
                    endInitialValue: '2016-06-25',
                    // 数字输入框
                    min: 0,
                    max: 100,
                    // customer 自定义
                    component: '',
                },
                {
                    type: 'inputNumber',
                    name: 'inputNumber',
                    label: '数字输入框',
                    initialValue: 30,
                    min: 10,
                    max: 20,
                },
                {
                    type: 'combobox',
                    name: 'combobox',
                    label: '提示输入框',
                    initialValue: '3@qq.com',
                    options: [
                        '136.com',
                        'qq.com',
                        'gmail.com',
                    ],
                },
                {
                    type: 'combobox',
                    name: 'urlcombobox',
                    label: '异步提示输入框',
                    url: '/api/options',
                    initialValue: 3,
                    separator: '@', // 可选，默认@ 提示下拉分隔符
                    options: [
                        'in options',
                    ],
                    optionsFilter: (res) => {
                        return res.body.map((d) => d.label);
                    },
                },
                {
                    type: 'selectMultiple',
                    name: 'select',
                    label: '下拉',
                    // initialFirst: true, // 可选，默认false，异步请求数据，不知道value，要默认选中第一个。
                    options: [
                        {label: '全部', value: 'all'},
                        {label: '选项1', value: 1},
                        {label: '选项2', value: 2},
                        {label: '选项3', value: 3},
                        {label: '选项4', value: 4},
                    ],
                },
                {
                    type: 'select',
                    name: 'urlselect',
                    label: '异步下拉',
                    // initialValue: 'all',
                    url: '/api/options',
                    optionsFilter: (res) => {
                        return res.body;
                    },
                    onChange: (value) => {
                        console.log('url select ', value);
                    },
                    onComplete: (options) => { // 可选， 默认- ，异步请求完成事件
                        console.log('urlselect onComplete', options.length);
                    },
                    options: [
                        {label: '全部', value: 'all'},
                        {label: '选项1', value: 1111, selected: true},
                        {label: '选项2', value: 2222},
                        {label: '选项3', value: 3333},
                        {label: '选项4', value: 4444},
                    ],
                },
                {
                    type: 'cascader',
                    name: 'cascaderName',
                    label: '级联下拉',
                    options: [
                        {
                            value: 'zhejiang',
                            label: '浙江',
                            children: [{
                                value: 'hangzhou',
                                label: '杭州',
                            }],
                        },
                        {
                            value: 'beijing',
                            label: '北京',
                            children: [
                                {
                                    value: 'xichengqu',
                                    label: '西城区',
                                },
                                {
                                    value: 'xidan',
                                    label: '西单',
                                },
                            ],
                        },
                    ],
                },
                /*
                 * itemType === 'radio'
                 || itemType === 'radioButton'
                 || itemType === 'checkboxButton'
                 || itemType === 'checkbox'
                 * */
                {
                    type: 'checkbox',
                    name: 'radio',
                    label: '单选',
                    // initialValue: 'all',
                    fieldWidth: 'auto', // radio和checkbox 默认的是auto 否则会串行。
                    url: '/api/options',
                    optionsFilter: (res) => {
                        return res.body;
                    },
                    expandable: true,
                    minCount: 5,
                    options: [
                        {value: 'all', label: '全部'},
                        {value: 1111, label: 'a', checked: true},
                        {value: 2222, label: 'b', checked: true},
                        {value: 3333, label: 'c'},
                    ],
                },

                // 'date', 'dateTime', 'time', 'month',
                {
                    type: 'month',
                    name: 'date',
                    label: '日期',
                    // initialValue: '2016-06-30',
                },
                // 'dateArea', 'timeArea', 'dateTimeArea'
                {
                    type: 'dateArea',
                    startName: 'startDateAreaName',
                    endName: 'endDateAreaName',
                    label: '日期区间',
                    // initialValue: '2016-06-30',
                },
                // tabsCard', 'tabs
                {
                    type: 'tabs',
                    name: 'tabs',
                    label: '日期区间',
                    initialValue: 'tab2',
                    options: [
                        {value: 'tab1', label: 'Tab页1'},
                        {value: 'tab2', label: 'Tab页2'},
                        {value: 'tab3', label: 'Tab页3'},
                    ],
                },
                {
                    type: 'tabsCard',
                    name: 'tabsCard',
                    label: '日期区间',
                    initialValue: 'tab2',
                    options: [
                        {value: 'tab1', label: 'Tab页1'},
                        {value: 'tab2', label: 'Tab页2'},
                        {value: 'tab3', label: 'Tab页3'},
                    ],
                },
            ],
        };
        return (
            <div>
                <QueryTerms options={queryTermOption}/>
            </div>
        );
    }
}
export default Demo;
