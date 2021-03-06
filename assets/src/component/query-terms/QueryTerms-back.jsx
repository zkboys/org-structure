import './style.less';
import React from 'react';
import assign from 'object-assign';
import moment from 'moment';
import {CheckBoxItem, RadioItem, SelectItem, ComboboxItem, DateTimeAreaItem} from '../form-item/index';
import {Button, DatePicker, TimePicker, InputNumber, Input, Form, Cascader, Row, Col, Tabs} from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class QueryTerms extends React.Component {
    componentWillMount() {
        // 默认值要写在这里
        this.props.options.items.forEach((v) => {
            if (v instanceof Array) {
                v.forEach((value) => {
                    this.setDefaultValue(value);
                });
            } else {
                this.setDefaultValue(v);
            }
        });
    }

    componentDidMount() {
        let onDidMount = this.props.options.onDidMount;
        let onChange = this.props.options.onChange;
        const formData = this.getFormData();
        if (onDidMount) {
            onDidMount(formData);
        }
        if (onChange) {
            onChange(formData);
        }
    }

    static defaultProps = {};
    setDefaultValue = (itemOptions) => {
        const type = itemOptions.type;
        let defaultValue = itemOptions.defaultValue;
        const name = itemOptions.name;
        const startName = itemOptions.startName;
        const endName = itemOptions.endName;
        let startDefaultValue = itemOptions.startDefaultValue;
        let endDefaultValue = itemOptions.endDefaultValue;
        let options = itemOptions.options;

        // 时间相关的默认格式
        let format = {
            date: 'yyyy-MM-dd',
            dateArea: 'yyyy-MM-dd',
            time: 'HH:mm',
            timeArea: 'HH:mm',
            dateTime: 'yyyy-MM-dd HH:mm',
            dateTimeArea: 'yyyy-MM-dd HH:mm',
            month: 'yyyy-MM',
        };
        itemOptions.format = itemOptions.format || format[type];

        // 日期相关的默认值，如果时string，转为date，方便处理
        if (['date', 'time', 'dateTime', 'month'].indexOf(type) > -1) {
            if (typeof defaultValue === 'string') {
                defaultValue = this.stringToDate(defaultValue, format[type]);
            }
            if (typeof startDefaultValue === 'string') {
                startDefaultValue = this.stringToDate(startDefaultValue, format[type]);
            }
            if (typeof endDefaultValue === 'string') {
                endDefaultValue = this.stringToDate(endDefaultValue, format[type]);
            }
        }
        // tabs相关默认值
        if ((type === 'tabs' || type === 'tabsCard') && !defaultValue) {
            defaultValue = options[0].value;
        }
        this.props.form.setFieldsValue({
            [name]: defaultValue,
            [startName]: startDefaultValue,
            [endName]: endDefaultValue,
        });
    };

    state = {};
    getFormData = () => {
        let formData = null;
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!', errors);
                return;
            }
            const options = this.props.options;
            const dateToString = options.resultDateToString === undefined ? true : options.resultDateToString;

            if (dateToString) {
                options.items.forEach((value) => {
                    if (value instanceof Array) {
                        value.forEach((v) => {
                            const format = v.format;
                            const name = v.name;
                            const startName = v.startName;
                            const endName = v.endName;

                            if (values[name] instanceof Date) {
                                values[name] = this.dateToString(values[name], format);
                            }
                            if (values[startName] instanceof Date) {
                                values[startName] = this.dateToString(values[startName], format);
                            }
                            if (values[endName] instanceof Date) {
                                values[endName] = this.dateToString(values[endName], format);
                            }
                        });
                    } else {
                        const format = value.format;
                        const name = value.name;
                        const startName = value.startName;
                        const endName = value.endName;

                        if (values[name] instanceof Date) {
                            values[name] = this.dateToString(values[name], format);
                        }
                        if (values[startName] instanceof Date) {
                            values[startName] = this.dateToString(values[startName], format);
                        }
                        if (values[endName] instanceof Date) {
                            values[endName] = this.dateToString(values[endName], format);
                        }
                    }
                });
            }
            formData = values;
        });
        return formData;
    };
    handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }
        const formData = this.getFormData();
        if (formData) {
            this.props.options.onSubmit(formData);
        }
    };

    dateToString = (date, format) => {
        format = format.replace('yyyy', 'YYYY');
        format = format.replace('dd', 'DD');
        return moment(date).format(format);
    };
    stringToDate = (str, format) => {
        format = format.replace('yyyy', 'YYYY');
        format = format.replace('dd', 'DD');
        return moment(str, format).toDate();
    };

    getItem = (options, itemOptions) => {
        itemOptions = assign({}, {
            fieldWidth: '150px',
            labelWidth: options.labelWidth || 'auto',
        }, itemOptions);
        const searchOnChange = itemOptions.searchOnChange;
        const itemType = itemOptions.type;
        const label = itemOptions.label;
        const name = itemOptions.name;
        const startName = itemOptions.startName;
        const endName = itemOptions.endName;
        const props = itemOptions.props;
        const fieldWidth = itemOptions.fieldWidth;
        let labelWidth = itemOptions.labelWidth;
        const labelUnifiedFontCount = itemOptions.labelUnifiedFontCount;
        const labelFontSize = 12;
        // 优先级 px > labelUnifiedFontCount > auto
        if (labelWidth === 'auto' && labelUnifiedFontCount) {
            labelWidth = `${(labelUnifiedFontCount + 1) * labelFontSize}px`;
        }
        let placeholder = itemOptions.placeholder;
        if (placeholder === undefined) {
            if (['input', 'inputNumber', 'combobox'].indexOf(itemType)> -1) {
                placeholder = `请输入${label}`;
            } else {
                placeholder = `请选择${label}`;
            }
        }
        const labelProps = {
            className: 'query-terms-label',
            style: {
                width: labelWidth,
            },
        };
        let itemProps = {
            className: 'query-terms-item',
            style: {
                width: fieldWidth,
            },
        };
        let eleProps = assign(
            {},
            {
                placeholder,
                style: {
                    width: '100%',
                },
            },
            props
        );

        const {getFieldProps, setFieldsValue} = this.props.form;
        let fieldPropsOptions;
        let startFieldPropsOptions;
        let endFieldPropsOptions;
        if (name) {
            fieldPropsOptions = getFieldProps(name, itemOptions.fieldPropsOptions);
        }
        if (startName) {
            startFieldPropsOptions = getFieldProps(startName, itemOptions.fieldPropsOptions);
        }
        if (endName) {
            endFieldPropsOptions = getFieldProps(endName, itemOptions.fieldPropsOptions);
        }
        const labelJsx = label ? (
            <div {...labelProps}>
                {label}：
            </div>
        ) : '';
        const searchDelay = 300;
        eleProps.onChange = (e) => {
            const value = e && e.target ? e.target.value : e;
            setFieldsValue({
                [name]: value,
            });
            if (['input', 'inputNumber', 'combobox'].indexOf(itemType) > -1) {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    if (searchOnChange) {
                        this.handleSubmit();
                    }
                }, searchDelay);
            } else {
                if (searchOnChange) {
                    this.handleSubmit();
                }
            }
            if (itemOptions.onChange) {
                itemOptions.onChange(value);
            }
            if (options.onChange) {
                options.onChange(this.getFormData());
            }
        };
        eleProps.onKeyDown = (e) => {
            if (e.key === 'Enter') {
                this.handleSubmit();
            }
        };
        switch (itemType) {
            case 'input':
            {
                return (
                    <Col>
                        {labelJsx}
                        <FormItem {...itemProps}>
                            <Input {...fieldPropsOptions} {...eleProps}/>
                        </FormItem>
                    </Col>
                );
            }
            case 'inputNumber':
            {
                const min = itemOptions.min;
                const max = itemOptions.max;
                const inputProps = {};
                if (min !== undefined) {
                    inputProps.min = min;
                }
                if (max !== undefined) {
                    inputProps.max = max;
                }
                return (
                    <Col>
                        {labelJsx}
                        <FormItem {...itemProps}>
                            <InputNumber {...fieldPropsOptions} {...inputProps} {...eleProps}/>
                        </FormItem>
                    </Col>
                );
            }
            case 'combobox':
            {
                let separator = itemOptions.separator;
                const size = itemOptions.size;
                const opts = itemOptions.options;
                const optionsFilter = itemOptions.optionsFilter;
                const url = itemOptions.url;
                const defaultValue = itemOptions.defaultValue;
                return (
                    <Col>
                        {labelJsx}
                        <FormItem {...itemProps}>
                            <ComboboxItem
                                separator={separator}
                                size={size}
                                url={url}
                                defaultValue={defaultValue}
                                options={opts}
                                optionsFilter={optionsFilter}
                                {...fieldPropsOptions}
                                {...eleProps}
                            />
                        </FormItem>
                    </Col>
                );
            }
            case 'select':
            case 'selectSearch':
            case 'selectMultiple':
            {
                const size = itemOptions.size;
                const opts = itemOptions.options;
                const optionsFilter = itemOptions.optionsFilter;
                const url = itemOptions.url;
                const defaultValue = itemOptions.defaultValue;
                if (itemType === 'selectSearch') {
                    eleProps = assign({}, {showSearch: true}, eleProps);
                }
                if (itemType === 'selectMultiple') {
                    eleProps = assign({}, {multiple: true}, eleProps);
                }
                return (
                    <Col>
                        {labelJsx}
                        <FormItem {...itemProps}>
                            <SelectItem
                                size={size}
                                url={url}
                                defaultValue={defaultValue}
                                options={opts}
                                optionsFilter={optionsFilter}
                                {...fieldPropsOptions}
                                {...eleProps}
                            >
                                {opts.map((v, i) => {
                                    return <Option key={i} value={v.value}>{v.label}</Option>;
                                })}
                            </SelectItem>
                        </FormItem>
                    </Col>
                );
            }
            case 'cascader':
            {
                return (
                    <Col>
                        {labelJsx}
                        <FormItem {...itemProps}>
                            <Cascader
                                {...fieldPropsOptions}
                                options={itemOptions.options}
                                {...eleProps}
                            />
                        </FormItem>
                    </Col>
                );
            }
            case 'radio':
            case 'radioButton':
            case 'checkboxButton':
            case 'checkbox':
            {
                itemProps.style.marginBottom = '0px';
                const type = ['radioButton', 'checkboxButton'].indexOf(itemType) > -1 ? 'button' : 'radio';
                const size = itemOptions.size;
                const opts = itemOptions.options;
                const optionsFilter = itemOptions.optionsFilter;
                const minCount = itemOptions.minCount;
                const url = itemOptions.url;
                const expandable = itemOptions.expandable;
                const defaultValue = itemOptions.defaultValue;
                const Element = ['checkbox', 'checkboxButton'].indexOf(itemType) > -1 ? CheckBoxItem : RadioItem;
                if (type === 'button') {
                    eleProps.button = true;
                }
                if (expandable) {
                    eleProps.expandable = true;
                }
                let marginLeft = '0px';
                if (labelWidth !== 'auto') {
                    marginLeft = labelWidth;
                } else if (label) {
                    marginLeft = `${(label.length + 1) * labelFontSize}px`;
                }
                return (

                    <Col>
                        <FormItem {...itemProps} >
                            <div className="text-label" ref="label">
                                {labelJsx}
                            </div>
                            <div style={{marginLeft}}>
                                <Element
                                    type={type}
                                    size={size}
                                    url={url}
                                    minCount={minCount}
                                    defaultValue={defaultValue}
                                    options={opts}
                                    optionsFilter={optionsFilter}
                                    {...eleProps}
                                />
                            </div>
                        </FormItem>
                    </Col>
                );
            }
            case 'date':
            case 'dateTime':
            case 'time':
            case 'month':
            {
                let format = itemOptions.format;
                let Element = DatePicker;
                if (itemType === 'month') {
                    Element = DatePicker.MonthPicker;
                }
                if (itemType === 'time') {
                    Element = TimePicker;
                }
                if (itemType === 'dateTime') {
                    eleProps.showTime = true;
                }
                return (
                    <Col>
                        {labelJsx}
                        <FormItem {...itemProps}>
                            <Element
                                {...fieldPropsOptions}
                                format={format}
                                {...eleProps}
                            />
                        </FormItem>
                    </Col>
                );
            }
            case 'dateArea':
            case 'timeArea':
            case 'dateTimeArea':
            {
                let typeProps = {
                    [itemType]: true,
                };
                if (options.resultDateToString) {
                    eleProps.resultDateToString = true;
                }
                return (
                    <Col>
                        {labelJsx}
                        <FormItem {...itemProps}>
                            <DateTimeAreaItem
                                {...typeProps}
                                width={fieldWidth}
                                startFieldProps={startFieldPropsOptions}
                                endFieldProps={endFieldPropsOptions}
                                {...eleProps}
                            />
                        </FormItem>
                    </Col>
                );
            }
            case 'tabsCard':
            case 'tabs':
            {
                let tabsProps = {};
                // 统一tab样式
                /* if(itemType === 'tabsCard'){
                 props.type = 'card';
                 } */
                return (
                    <Tabs
                        onChange={eleProps.onChange}
                        defaultActiveKey={itemOptions.defaultValue}
                        {...tabsProps}
                    >
                        {itemOptions.options.map((v) => {
                            return (
                                <TabPane tab={v.label} key={v.value}/>
                            );
                        })}
                    </Tabs>
                );
            }
            case 'customer':
            {
                let Component = itemOptions.component;
                return (
                    <Col>
                        {labelJsx}
                        <FormItem {...itemProps}>
                            <Component
                                {...fieldPropsOptions}
                                {...eleProps}
                            />
                        </FormItem>

                    </Col>
                );
            }
            default:
            {
                throw Error(`查询条件没有此类型：type:${itemType}`);
            }
        }
    };

    render() {
        const options = this.props.options;
        const searchBtnText = options.searchBtnText || '查询';
        const extraAfterSearchButton = options.extraAfterSearchButton;
        const items = options.items.map((value, index, array) => {
            if (value.hidden) return '';
            const rowProps = {
                type: 'flex',
                justify: 'start',
                align: 'top',
            };
            let buttons = [];
            if (index === array.length - 1) {
                if (options.showSearchBtn) {
                    buttons.push(
                        <Col key="search-btn">
                            <FormItem className="query-terms-item" style={{marginTop: '-1px'}}>
                                <Button type="primary" onClick={this.handleSubmit}>{searchBtnText}</Button>
                            </FormItem>
                        </Col>
                    );
                }
                if (extraAfterSearchButton) {
                    buttons.push(
                        <Col key="extra-btn">
                            <FormItem className="query-terms-item" style={{marginTop: '-1px'}}>
                                {extraAfterSearchButton}
                            </FormItem>
                        </Col>
                    );
                }
            }
            if (value instanceof Array) {
                // 一行多个查询条件
                return (
                    <Row key={index} {...rowProps}>
                        {value.map((v, i, a) => {
                            return [
                                this.getItem(options, v),
                                i === a.length - 1 ? buttons : undefined,
                            ];
                        })}
                    </Row>
                );
            }
            // 一行一个查询条件
            return (
                <Row key={index} {...rowProps}>
                    {this.getItem(options, value)}
                    {buttons}
                </Row>
            );
        });
        return (
            <div className="query-terms">
                <Form horizontal form={this.props.form}>
                    {items}
                </Form>
            </div>
        );
    }
}

export default createForm()(QueryTerms);
