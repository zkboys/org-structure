import React from 'react';
import QueryTerms from './QueryTerms';
import {Input} from 'antd';
class Demo extends React.Component {
    onChange = (v) => {
        console.log('所选的查询分类为：', v);
    };
    onSubmit = (data) => {
        console.log('获取到的查询条件为：', data);
    };
    render() {
        const FontCount = 9;
        const fontCount6 = 6;
        let options = {
            onChange: (data) => {// 可选 元素onchange后触发，data为所有得元素数据
            },
            onDidMount: (data)=> {
            },            //可选，查询组件DidMount之后，会触发，data为初始化时，各个元素的值。
            showSearchBtn: true,              // 可选，默认true 是否显示查询按钮
            searchBtnText: '查询',            // 可选，默认 查询 ，查询按钮的text
            extraAfterSearchButton: '',       // 可选，默认 undefined，跟在查询按钮之后的内容，比如<Button>导出</Button>
            labelWidth: 'auto',               // 可选，默认：‘auto’,全局设置label长度，每个条件可以覆盖这个属性。
            fieldWidth: '150px',              // 可选，默认：‘150px’,全局元素长度，每个条件可以覆盖这个属性。
            resultDateToString: true,         // 可选，默认 true，查询条件日期相关数据是否转为字符串
            onSubmit: function (data) {       // 必选，点击查询按钮时的回调函数 data为所有的查询条件数据，可以在这个函数中发起请求等操作。
                console.log('***', data);
            },
            items: [
                // 如果是对象，自己占据一行， 如果是数组，数组中所有的组件共占一行
                {
                    hidden: true,// 此查询条件是否隐藏，默认false，有些需求需要控制查询条件的显示，隐藏，可以通过这个字段进行切换。
                    type: 'tabsCard', // tab页，页只是做个查询条件，不是真实的tab页切换，只是用了个tab头
                    name: 'tabsCardName',
                    defaultValue: 'tab2',
                    searchOnChange: true,
                    onChange: function (v) {// v为当前组件的数据。
                        alert(v);
                    },
                    options: [
                        {value: 'tab1', label: 'Tab页1'},
                        {value: 'tab2', label: 'Tab页2'},
                        {value: 'tab3', label: 'Tab页3'},
                        {value: 'tab4', label: 'Tab页4'},
                    ]
                },
                {
                    type: 'tabs', // tab页，页只是做个查询条件，不是真实的tab页切换，只是用了个tab头
                    name: 'tabsName',
                    defaultValue: 'tab2',
                    searchOnChange: true,
                    options: [
                        {value: 'tab1', label: 'Tab页1'},
                        {value: 'tab2', label: 'Tab页2'},
                        {value: 'tab3', label: 'Tab页3'},
                        {value: 'tab4', label: 'Tab页4'},
                    ]
                },
                {
                    type: 'customer', // 自定义组件，需要提供一个component
                    name: 'customerName',
                    defaultValue: '我是自定义条件',
                    searchOnChange: true,
                    component: Input
                },
                {
                    type: 'input',             // 必须，查询条件类型
                    name: 'userName',          // 必须，查询条件数据name
                    label: '普通输入框',        // 可选，查询条件显示的label，缺省将不显示label
                    labelWidth: '100px',       // 可选，默认为 全局labelWidth，如果是Number类型，默认单位为px
                    labelUnifiedFontCount: 5,  // 可选，用于上下两行label对其，比如上一行label5个字，下一行label2个字，那么下一行设置labelUnifiedFontCount：5即可
                    fieldWidth: '250px',       // 可选，默认为 全局fieldWidth，控制输入框等大小，如果是Number类型，默认单位为px, 可以为auto
                    searchOnChange: true,      // 可选，默认：false， 值改变是否出发onSearch函数
                    //placeholder: '我是提示',  // 可选，默认为请输入[label],如果是select等选择类型，默认为：请选择[label]
                    defaultValue: 'all',       // 可选，默认值，checkbox，checkboxButton这个值为数组。
                    fieldPropsOptions: {},     // 可选，form 的 getFieldProps方法第二个参数，用来添加校验等，参见http://ant.design/components/form/#this-props-form-getfieldprops-id-options
                    min: undefined,            // 可选，inputNumber 专用
                    max: undefined,            // 可选，inputNumber 专用
                    props: {},                 // 可选，加在表单元素上的props 一般情况下不要用。
                    format: '',                // 可选，yyyy-MM-dd yyyy-MM-dd HH:mm:ss HH:mm
                    options: [                 // 可选/必须，单值条件（input等）没有这个属性，多值条件（checkbox，checkboxButton,radioButton等）组件专用属性
                        {value: 'all', label: '全部'},
                        {value: '1', label: '和平门'},
                        {value: '2', label: '前门大街'},
                        {value: '3', label: '东直门'},
                        {value: '4', label: '宋家庄'}
                    ]
                },
                {
                    type: 'inputNumber',
                    name: 'number',
                    label: '数字',
                    min: 0,
                    max: 100,
                    defaultValue: 88,
                    searchOnChange: true
                },
                {
                    type: 'combobox',
                    name: 'comboboxName',
                    label: '提示输入框',
                    separator: '@',
                    defaultValue: '111@163.com',
                    options: [
                        '163.com',
                        'qq.com',
                        '126.com',
                        'xx.com',
                    ],
                },
                [
                    {
                        type: 'month',
                        name: 'monthName',
                        label: '月份',
                        searchOnChange: true,
                        // fieldWidth: '300px',
                        // defaultValue: new Date(), // 这样也可以
                        defaultValue: '2016-05-08',
                    },
                ],

                [
                    {
                        type: 'date',
                        name: 'dateName',
                        label: '日期',
                        // fieldWidth: '300px',
                        //defaultValue: new Date(), // 这样也可以
                        defaultValue: '2016-05-08',
                    },
                    {
                        type: 'dateArea',
                        startName: 'dateAreaNameStart',
                        endName: 'dateAreaNameEnd',
                        //startDefaultValue: new Date(),
                        endDefaultValue: new Date(),
                        //startDefaultValue: '2016-05-30 23:59:59',
                        //endDefaultValue: '2016-05-30 00:00:00',
                        searchOnChange: true,
                        label: '日期区间',
                        fieldWidth: '300px',
                        format: 'yyyy-MM-dd',
                    },
                ],
                [
                    {
                        type: 'time',
                        name: 'timeName',
                        label: '时间',
                        // fieldWidth: '300px',
                        //defaultValue: new Date(),
                        defaultValue: '22:22',
                    },
                    {
                        type: 'timeArea',
                        startName: 'timeAreaNameStart',
                        endName: 'timeAreaNameEnd',
                        //startDefaultValue: new Date(),
                        //endDefaultValue: new Date(),
                        startDefaultValue: '22:22',
                        endDefaultValue: '22:22',
                        label: '时间区间',
                        fieldWidth: '300px',
                        format: 'HH:mm',
                    },
                ],
                [
                    {
                        type: 'dateTime',
                        name: 'dateTimeName',
                        label: '日期+时间',
                        // fieldWidth: '300px',
                        format: 'yyyy-MM-dd HH:mm:ss',
                        //defaultValue: new Date(),
                        defaultValue: '2016-05-08 02:53:58',
                    },


                    {
                        type: 'dateTimeArea',
                        startName: 'dateTimeAreaNameStart',
                        endName: 'dateTimeAreaNameEnd',
                        //startDefaultValue: new Date(),
                        //endDefaultValue: new Date(),
                        startDefaultValue: '2016-05-08 22:22',
                        endDefaultValue: '2016-05-08 22:22',
                        label: '日期+时间区间',
                        fieldWidth: '300px',
                        format: 'yyyy-MM-dd HH:mm',
                    },
                ],
                {
                    type: 'checkbox',
                    name: 'checkboxName',
                    label: '多选框',
                    searchOnChange: true,
                    fieldWidth: 'auto',
                    defaultValue: ['33'],
                    url: '/api/m/1/stores.json',
                    optionsFilter(res){// 对ajax返回的数据进行处理
                        return res.body.results.map((v)=> {
                            return {value: v.id, label: v.name}
                        })
                    },
                    options: [
                        {value: '11', label: '中国'},
                        {value: '22', label: '美国'},
                        {value: '33', label: '俄罗斯'},
                        {value: '44', label: '加拿大'},
                    ],
                },
                {
                    type: 'checkboxButton',
                    name: 'checkboxButtonName',
                    label: '多选按钮',
                    searchOnChange: true,
                    fieldWidth: 'auto', // 启用展开收起功能时，fieldWidth建议使用auto
                    defaultValue: ['33'],
                    expandable: true,// 可选，默认false，是否启用展开收起功能
                    minCount: 10,     // 可选，默认10，如果使用展开收起功能，收起时显示的个数
                    url: '/api/m/1/stores.json',
                    optionsFilter(res){// 对ajax返回的数据进行处理
                        return res.body.results.map((v)=> {
                            return {value: v.id, label: v.name}
                        })
                    },
                    options: [
                        {value: 'all', label: '全部'},
                        {value: '11', label: '中国'},
                        {value: '22', label: '美国'},
                        {value: '33', label: '俄罗斯'},
                        // {value: '44', label: '加拿大44'},
                        // {value: '55', label: '加拿大55'},
                        // {value: '66', label: '加拿大66'},
                        // {value: '77', label: '加拿大77'},
                        // {value: '88', label: '加拿大88'},
                        // {value: '99', label: '加拿大99'},
                        // {value: '119', label: '加拿大119'},
                        // {value: '112', label: '加拿大112'},
                        // {value: '113', label: '加拿大113'},
                        // {value: '114', label: '加拿大114'},
                        // {value: '115', label: '加拿大115'},
                        // {value: '116', label: '加拿大116'},
                        // {value: '117', label: '加拿大117'},
                    ],
                },
                {
                    type: 'radio',
                    name: 'radioName',
                    label: '单选',
                    fieldWidth: 'auto',
                    searchOnChange: true,
                    defaultValue: 1,
                    url: '/api/m/1/stores.json',
                    optionsFilter(res){// 对ajax返回的数据进行处理
                        return res.body.results.map((v)=> {
                            return {value: v.id, label: v.name}
                        })
                    },
                    options: [
                        {value: 1, label: '单选一'},
                        {value: 2, label: '单选二'},
                        {value: 3, label: '单选三'},
                        {value: 4, label: '单选四'},
                    ]
                },
                {
                    type: 'radioButton',
                    name: 'radioButton',
                    label: '单选按钮',
                    fieldWidth: 'auto',
                    searchOnChange: true,
                    defaultValue: 1,
                    url: '/api/m/1/stores.json',
                    optionsFilter(res){// 对ajax返回的数据进行处理
                        return res.body.results.map((v)=> {
                            return {value: v.id, label: v.name}
                        })
                    },
                    options: [
                        {value: 'all', label: '全部'},
                        {value: 1, label: '单选一', disabled: true},
                        {value: 2, label: '单选二'},
                        {value: 3, label: '单选三'},
                        {value: 4, label: '单选四'},
                    ]
                },
                {
                    type: 'radioButton',
                    name: 'radioButton2',
                    label: '可收展单选按钮',
                    fieldWidth: 'auto', // 启用展开收起功能时，fieldWidth建议使用auto
                    searchOnChange: true,
                    defaultValue: 'all',
                    expandable: true,// 可选，默认false，是否启用展开收起功能
                    minCount: 5,     // 可选，默认10，如果使用展开收起功能，收起时显示的个数
                    options: [
                        {value: 'all', label: '全部'},
                        {value: 1, label: '单选一'},
                        {value: 2, label: '单选二'},
                        {value: 3, label: '单选三'},
                        {value: 4, label: '单选四'},
                        {value: 5, label: '单选五'},
                        {value: 6, label: '单选六'},
                        {value: 7, label: '单选七'},
                        {value: 8, label: '单选八'},
                        {value: 9, label: '单选九'},
                        {value: 10, label: '单选十'},
                        {value: 11, label: '单选十一'},
                        {value: 12, label: '单选十二'},
                        {value: 13, label: '单选十三'},
                        {value: 14, label: '单选十四'},
                        {value: 15, label: '单选十五'},
                        {value: 16, label: '单选十六'},
                        {value: 17, label: '单选十七'},
                        {value: 18, label: '单选十八'},
                        {value: 19, label: '单选十九'},
                    ]
                },
                [
                    {
                        type: 'select',
                        name: 'selectName',
                        label: '普通下拉',
                        defaultValue: '112',
                        options: [
                            {value: '111', label: '中国'},
                            {value: '112', label: '中国1'},
                            {value: '113', label: '中国2'},
                            {value: '22', label: '美国3'},
                            {value: '33', label: '俄罗斯'},
                            {value: '44', label: '加拿大'},
                        ],
                    },
                    {
                        type: 'selectSearch',
                        name: 'selectUrlName',
                        label: '异步下拉',
                        url: '/api/m/1/stores.json',
                        optionsFilter(res){// 对ajax返回的数据进行处理
                            return res.body.results.map((v)=> {
                                return {value: v.id, label: v.name}
                            })
                        },
                        defaultValue: 'all',
                        options: [// 如果有url，这个数据会添加到后台请求数据之前。
                            {value: 'all', label: '全部'},
                        ],
                    },
                    {
                        type: 'selectSearch',
                        name: 'selectSearchName',
                        label: '搜索下拉',
                        defaultValue: '112',
                        options: [
                            {value: '11', label: '中国'},
                            {value: '111', label: '中国1'},
                            {value: '112', label: '中国2'},
                            {value: '113', label: '中国3'},
                            {value: '22', label: '美国'},
                            {value: '33', label: '俄罗斯'},
                            {value: '44', label: '加拿大'},
                        ],
                    },
                    {
                        type: 'selectMultiple',
                        name: 'selectMultipleName',
                        label: '多选下拉',
                        fieldWidth: '200px',
                        //defaultValue: '112', // 这样也可以
                        defaultValue: ['11', '112'],
                        options: [
                            {value: '11', label: '中国'},
                            {value: '111', label: '中国1'},
                            {value: '112', label: '中国2'},
                            {value: '113', label: '中国3'},
                            {value: '22', label: '美国'},
                            {value: '33', label: '俄罗斯'},
                            {value: '44', label: '加拿大'},
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
                                    }
                                ],
                            },
                        ]
                    },
                ],
            ],
        };

        let tabsCardOption = {
            items: [
                {
                    type: 'tabsCard',
                    name: 'tabsCardName',
                    defaultValue: 'tab2',
                    onChange: this.onChange,
                    options: [
                        {value: 'tab1', label: 'Tab页1'},
                        {value: 'tab2', label: 'Tab页2'},
                        {value: 'tab3', label: 'Tab页3'},
                    ],
                },
            ],
        };
        let inputOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'input',             // 必须，查询条件类型
                    name: 'userName',          // 必须，查询条件数据name
                    label: '普通输入框',        // 可选，查询条件显示的label，缺省将不显示label
                    labelUnifiedFontCount: FontCount,  // 可选，用于上下两行label对其，比如上一行label5个字，下一行label2个字，那么下一行设置labelUnifiedFontCount：5即可
                    searchOnChange: true,      // 可选，默认：false， 值改变是否出发onSearch函数
                    // placeholder: '我是提示',  // 可选，默认为请输入[label],如果是select等选择类型，默认为：请选择[label]
                    defaultValue: 'all',       // 可选，默认值，checkbox，checkboxButton这个值为数组。
                    fieldPropsOptions: {},     // 可选，form 的 getFieldProps方法第二个参数，用来添加校验等，参见http://ant.design/components/form/#this-props-form-getfieldprops-id-options
                    props: {},                 // 可选，加在表单元素上的props 一般情况下不要用。
                    format: '',                // 可选，yyyy-MM-dd yyyy-MM-dd HH:mm:ss HH:mm
                },
            ],
        };
        let inputNumberOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'inputNumber',
                    name: 'number',
                    label: '数字',
                    labelUnifiedFontCount: FontCount,
                    min: 0,
                    max: 100,
                    defaultValue: 88,
                    searchOnChange: true,
                },
            ],
        };
        let comboboxOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'combobox',
                    name: 'comboboxName',
                    label: '提示输入框',
                    labelUnifiedFontCount: FontCount,
                    separator: '@',
                    defaultValue: '111@163.com',
                    options: [
                        '163.com',
                        'qq.com',
                        '126.com',
                        'xx.com',
                    ],
                },
            ],
        };
        let customerOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'customer', // 自定义组件，需要提供一个component
                    name: 'customerName',
                    label: '自定义',
                    labelUnifiedFontCount: FontCount,
                    defaultValue: '我是自定义条件',
                    searchOnChange: true,
                    component: Input,
                },
            ],
        };
        let dateOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'date',
                    name: 'dateName',
                    label: '日期',
                    labelUnifiedFontCount: FontCount,
                    // fieldWidth: '300px',
                    // defaultValue: new Date(), // 这样也可以
                    defaultValue: '2016-05-08',
                },
            ],
        };
        let monthOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'month',
                    name: 'monthName',
                    label: '月份',
                    labelUnifiedFontCount: FontCount,
                    searchOnChange: true,
                    // fieldWidth: '300px',
                    // defaultValue: new Date(), // 这样也可以
                    defaultValue: '2016-05-08',
                },
            ],
        };
        let timeOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'time',
                    name: 'timeName',
                    label: '时间',
                    // fieldWidth: '300px',
                    // defaultValue: new Date(),
                    defaultValue: '22:22',
                    labelUnifiedFontCount: FontCount,
                },
            ],
        };
        let dateTimeOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'dateTime',
                    name: 'dateTimeName',
                    label: '日期+时间',
                    // fieldWidth: '300px',
                    format: 'yyyy-MM-dd HH:mm:ss',
                    // defaultValue: new Date(),
                    labelUnifiedFontCount: FontCount,
                    defaultValue: '2016-05-08 02:53:58',
                },
            ],
        };
        let dateAreaOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'dateArea',
                    startName: 'dateAreaNameStart',
                    endName: 'dateAreaNameEnd',
                    // startDefaultValue: new Date(),
                    endDefaultValue: new Date(),
                    // startDefaultValue: '2016-05-30 23:59:59',
                    // endDefaultValue: '2016-05-30 00:00:00',
                    searchOnChange: true,
                    labelUnifiedFontCount: FontCount,
                    label: '日期区间',
                    fieldWidth: '300px',
                    format: 'yyyy-MM-dd',
                },
            ],
        };
        let timeAreaOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'timeArea',
                    startName: 'timeAreaNameStart',
                    endName: 'timeAreaNameEnd',
                    // startDefaultValue: new Date(),
                    // endDefaultValue: new Date(),
                    startDefaultValue: '22:22',
                    endDefaultValue: '22:22',
                    label: '时间区间',
                    labelUnifiedFontCount: FontCount,
                    fieldWidth: '300px',
                    format: 'HH:mm',
                },
            ],
        };
        let dateTimeAreaOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'dateTimeArea',
                    startName: 'dateTimeAreaNameStart',
                    endName: 'dateTimeAreaNameEnd',
                    // startDefaultValue: new Date(),
                    // endDefaultValue: new Date(),
                    startDefaultValue: '2016-05-08 22:22',
                    endDefaultValue: '2016-05-08 22:22',
                    label: '（日期+时间）区间',
                    fieldWidth: '300px',
                    labelUnifiedFontCount: FontCount,
                    format: 'yyyy-MM-dd HH:mm',
                },
            ],
        };
        let selectOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'select',
                    name: 'selectName',
                    label: '普通下拉',
                    defaultValue: '112',
                    labelUnifiedFontCount: FontCount,
                    options: [
                        {value: '111', label: '中国'},
                        {value: '112', label: '中国1'},
                        {value: '113', label: '中国2'},
                        {value: '22', label: '美国3'},
                        {value: '33', label: '俄罗斯'},
                        {value: '44', label: '加拿大'},
                    ],
                },
            ],
        };
        let selectSearchOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'selectSearch',
                    name: 'selectSearchName',
                    label: '搜索下拉',
                    defaultValue: '112',
                    labelUnifiedFontCount: FontCount,
                    options: [
                        {value: '11', label: '中国'},
                        {value: '111', label: '中国1'},
                        {value: '112', label: '中国2'},
                        {value: '113', label: '中国3'},
                        {value: '22', label: '美国'},
                        {value: '33', label: '俄罗斯'},
                        {value: '44', label: '加拿大'},
                    ],
                },
            ],
        };
        let selectSearchSyncOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'selectSearch',
                    name: 'selectUrlName',
                    label: '异步下拉',
                    url: '/api/m/1/stores.json',
                    labelUnifiedFontCount: FontCount,
                    optionsFilter(res) { // 对ajax返回的数据进行处理
                        return res.body.results.map((v) => {
                            return {value: v.id, label: v.name};
                        });
                    },
                    defaultValue: 'all',
                    options: [// 如果有url，这个数据会添加到后台请求数据之前。
                        {value: 'all', label: '全部'},
                    ],
                },
            ],
        };
        let selectMultipleOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'selectMultiple',
                    name: 'selectMultipleName',
                    label: '多选下拉',
                    fieldWidth: '200px',
                    // defaultValue: '112', // 这样也可以
                    defaultValue: ['11', '112'],
                    labelUnifiedFontCount: FontCount,
                    options: [
                        {value: '11', label: '中国'},
                        {value: '111', label: '中国1'},
                        {value: '112', label: '中国2'},
                        {value: '113', label: '中国3'},
                        {value: '22', label: '美国'},
                        {value: '33', label: '俄罗斯'},
                        {value: '44', label: '加拿大'},
                    ],
                },
            ],
        };
        let cascaderOption = {
            showSearchBtn: true,
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'cascader',
                    name: 'cascaderName',
                    label: '级联下拉',
                    labelUnifiedFontCount: FontCount,
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
            ],
        };
        let radioOption = {
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'radio',
                    name: 'radioName',
                    label: '单选',
                    labelUnifiedFontCount: fontCount6,
                    fieldWidth: 'auto',
                    searchOnChange: true,
                    defaultValue: 1,
                    url: '/api/m/1/stores.json',
                    optionsFilter(res) { // 对ajax返回的数据进行处理
                        return res.body.results.map((v) => {
                            return {value: v.id, label: v.name};
                        });
                    },
                    options: [
                        {value: 1, label: '单选一'},
                        {value: 2, label: '单选二'},
                        {value: 3, label: '单选三'},
                        {value: 4, label: '单选四'},
                    ],
                },
            ],
        };
        let checkboxOption = {
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'checkbox',
                    name: 'checkboxName',
                    label: '多选框',
                    labelUnifiedFontCount: fontCount6,
                    searchOnChange: true,
                    fieldWidth: 'auto',
                    defaultValue: ['33'],
                    url: '/api/m/1/stores.json',
                    optionsFilter(res) { // 对ajax返回的数据进行处理
                        return res.body.results.map((v) => {
                            return {value: v.id, label: v.name};
                        });
                    },
                    onChange: this.onChange,
                    options: [
                        {value: '11', label: '中国'},
                        {value: '22', label: '美国'},
                        {value: '33', label: '俄罗斯'},
                        {value: '44', label: '加拿大'},
                    ],
                },
            ],
        };
        let radioButtonOption = {
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'radioButton',
                    name: 'radioButton',
                    label: '单选按钮',
                    labelUnifiedFontCount: fontCount6,
                    fieldWidth: 'auto',
                    searchOnChange: true,
                    defaultValue: 1,
                    url: '/api/m/1/stores.json',
                    optionsFilter(res) { // 对ajax返回的数据进行处理
                        return res.body.results.map((v) => {
                            return {value: v.id, label: v.name};
                        });
                    },
                    onChange: this.onChange,
                    options: [
                        {value: 'all', label: '全部'},
                        {value: 1, label: '单选一', disabled: true},
                        {value: 2, label: '单选二'},
                        {value: 3, label: '单选三'},
                        {value: 4, label: '单选四'},
                    ],
                },
            ],
        };
        let checkboxButtonOption = {
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'checkboxButton',
                    name: 'checkboxButtonName',
                    label: '多选按钮',
                    labelUnifiedFontCount: fontCount6,
                    searchOnChange: true,
                    fieldWidth: 'auto', // 启用展开收起功能时，fieldWidth建议使用auto
                    defaultValue: ['33'],
                    minCount: 10,     // 可选，默认10，如果使用展开收起功能，收起时显示的个数
                    url: '/api/m/1/stores.json',
                    optionsFilter(res) { // 对ajax返回的数据进行处理
                        return res.body.results.map((v) => {
                            return {value: v.id, label: v.name};
                        });
                    },
                    onChange: this.onChange,
                    options: [
                        {value: 'all', label: '全部'},
                        {value: '11', label: '中国'},
                        {value: '22', label: '美国'},
                        {value: '33', label: '俄罗斯'},
                    ],
                },
            ],
        };
        let checkboxButtonExpandableOption = {
            onSubmit: this.onSubmit,
            items: [
                {
                    type: 'radioButton',
                    name: 'radioButton2',
                    label: '可收展按钮',
                    labelUnifiedFontCount: fontCount6,
                    fieldWidth: 'auto', // 启用展开收起功能时，fieldWidth建议使用auto
                    searchOnChange: true,
                    defaultValue: 'all',
                    expandable: true, // 可选，默认false，是否启用展开收起功能
                    minCount: 5,     // 可选，默认10，如果使用展开收起功能，收起时显示的个数
                    onChange: this.onChange,
                    options: [
                        {value: 'all', label: '全部'},
                        {value: 1, label: '单选一'},
                        {value: 2, label: '单选二'},
                        {value: 3, label: '单选三'},
                        {value: 4, label: '单选四'},
                        {value: 5, label: '单选五'},
                        {value: 6, label: '单选六'},
                        {value: 7, label: '单选七'},
                        {value: 8, label: '单选八'},
                        {value: 9, label: '单选九'},
                        {value: 10, label: '单选十'},
                        {value: 11, label: '单选十一'},
                        {value: 12, label: '单选十二'},
                        {value: 13, label: '单选十三'},
                        {value: 14, label: '单选十四'},
                        {value: 15, label: '单选十五'},
                        {value: 16, label: '单选十六'},
                        {value: 17, label: '单选十七'},
                        {value: 18, label: '单选十八'},
                        {value: 19, label: '单选十九'},
                    ],
                },
            ],
        };
        return (
            <div>
                <h2>1. tab页切换查询</h2>
                <QueryTerms options={tabsCardOption}/>

                <h2>2. 输入框查询（关键字，自定义，日期，区间，下拉，等）</h2>
                <QueryTerms options={inputOption}/>
                <QueryTerms options={inputNumberOption}/>
                <QueryTerms options={comboboxOption}/>
                <QueryTerms options={customerOption}/>
                <QueryTerms options={dateOption}/>
                <QueryTerms options={monthOption}/>
                <QueryTerms options={timeOption}/>
                <QueryTerms options={dateTimeOption}/>
                <QueryTerms options={dateAreaOption}/>
                <QueryTerms options={timeAreaOption}/>
                <QueryTerms options={dateTimeAreaOption}/>
                <QueryTerms options={selectOption}/>
                <QueryTerms options={selectSearchOption}/>
                <QueryTerms options={selectSearchSyncOption}/>
                <QueryTerms options={selectMultipleOption}/>
                <QueryTerms options={cascaderOption}/>

                <h2>3. 按钮查询（单选，多选，单选按钮，多选按钮，可折叠等）</h2>
                <QueryTerms options={radioOption}/>
                <QueryTerms options={checkboxOption}/>
                <QueryTerms options={radioButtonOption}/>
                <QueryTerms options={checkboxButtonOption}/>
                <QueryTerms options={checkboxButtonExpandableOption}/>
            </div>
        );
    }
}
export default Demo;
