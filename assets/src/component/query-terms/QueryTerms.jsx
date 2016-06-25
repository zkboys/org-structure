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
    state = {};
    format = {
        date: 'yyyy-MM-dd',
        dateArea: 'yyyy-MM-dd',
        time: 'HH:mm',
        timeArea: 'HH:mm',
        dateTime: 'yyyy-MM-dd HH:mm',
        dateTimeArea: 'yyyy-MM-dd HH:mm',
        month: 'yyyy-MM',
    };

    componentWillMount() {

    }

    componentDidMount() {

    }

    static defaultProps = {};
    handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }
        const formData = this.props.form.getFieldsValue();
        if (formData) {
            this.props.options.onSubmit(formData);
        }
    };

    getItem = (options, itemOptions) => {
        const {getFieldProps, getFieldValue, getFieldsValue} = this.props.form;
        const defaultItemOptions = {
            fieldWidth: options.fieldWidth || 150,
            labelWidth: options.labelWidth || 'auto',
            labelFontSize: options.labelFontSize || 12,
            initialValue: '',
            startInitialValue: '',
            endInitialValue: '',
        };
        itemOptions = assign({}, defaultItemOptions, itemOptions);
        const resultDateToString = options.resultDateToString;
        const searchOnChange = itemOptions.searchOnChange;
        const itemType = itemOptions.type;
        const label = itemOptions.label;
        const name = itemOptions.name;
        const startName = itemOptions.startName;
        const endName = itemOptions.endName;
        const fieldWidth = itemOptions.fieldWidth;
        const labelUnifiedFontCount = itemOptions.labelUnifiedFontCount;
        const labelFontSize = itemOptions.labelFontSize;
        let onChange = itemOptions.onChange;
        let onKeyDown = itemOptions.onKeyDown;
        let labelWidth = itemOptions.labelWidth;
        let placeholder = itemOptions.placeholder;

        // 处理label宽度，优先级 px > labelUnifiedFontCount > auto
        if (labelWidth === 'auto' && labelUnifiedFontCount) {
            labelWidth = `${(labelUnifiedFontCount + 1) * labelFontSize}px`;
        }

        if (placeholder === undefined) {
            if (['input', 'inputNumber', 'combobox'].indexOf(itemType) > -1) {
                placeholder = `请输入${label}`;
            } else {
                placeholder = `请选择${label}`;
            }
        }
        //  处理事件
        itemOptions.onChange = (e) => {
            // getFieldValue 获取的值是上一个值，这里通过e获取。
            const value = e && e.target ? e.target.value : e;
            if (onChange) {
                onChange(value, e);
            }
            if (options.onChange) {
                options.onChange(assign(getFieldsValue(), {[name]: value}), e); // 不这么做，获取name的value是上一个值
            }
            if (searchOnChange) {
                if (['input', 'inputNumber', 'combobox'].indexOf(itemType) > -1) {
                    clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                        this.handleSubmit();
                    }, 300);
                } else {
                    this.handleSubmit();
                }
            }
        };
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

        let eleProps = {
            placeholder,
            style: {
                width: '100%',
            },
        };

        let fieldPropsOptions;
        let startFieldPropsOptions;
        let endFieldPropsOptions;
        const onKeyDownFn = (e) => {
            if (onKeyDown) {
                onKeyDown(e);
            }
            if (e.key === 'Enter') {
                this.handleSubmit();
            }
        };
        const getValueFn = () => {
            if (['date', 'time', 'dateTime', 'month'].indexOf(itemType) > -1) {
                return {
                    getValueFromEvent(date, dateString) {
                        if (resultDateToString) {
                            return dateString;
                        }
                        return date;
                    },
                };
            }
            return {};
        };
        if (name) {
            let fp = assign({}, getValueFn());
            fieldPropsOptions = getFieldProps(name, assign({}, fp, itemOptions));
            fieldPropsOptions = assign({}, itemOptions, fieldPropsOptions, eleProps);
            fieldPropsOptions.onKeyDown = onKeyDownFn;
        } else {
            if (startName) {
                let fp = assign({
                    initialValue: itemOptions.startInitialValue,
                }, getValueFn());
                startFieldPropsOptions = getFieldProps(startName, assign({}, fp, itemOptions));
                startFieldPropsOptions = assign({}, itemOptions, startFieldPropsOptions, eleProps);
                startFieldPropsOptions.onKeyDown = onKeyDownFn;
            }
            if (endName) {
                let fp = assign({
                    initialValue: itemOptions.endInitialValue,
                }, getValueFn());
                endFieldPropsOptions = getFieldProps(startName, assign({}, fp, itemOptions));
                endFieldPropsOptions = assign({}, itemOptions, endFieldPropsOptions, eleProps);
                endFieldPropsOptions.onKeyDown = onKeyDownFn;
            }
        }
        const labelJsx = label ? (
            <div {...labelProps}>
                {label}：
            </div>
        ) : '';
        if (itemType === 'input') {
            return (
                <Col>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <Input {...fieldPropsOptions}/>
                    </FormItem>
                </Col>
            );
        }
        if (itemType === 'inputNumber') {
            return (
                <Col>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <InputNumber {...fieldPropsOptions}/>
                    </FormItem>
                </Col>
            );
        }
        if (itemType === 'combobox') {
            return (
                <Col>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <ComboboxItem {...fieldPropsOptions} />
                    </FormItem>
                </Col>
            );
        }
        if (itemType === 'select'
            || itemType === 'selectSearch'
            || itemType === 'selectMultiple') {
            if (itemType === 'selectSearch') {
                fieldPropsOptions = assign({}, {showSearch: true}, fieldPropsOptions);
            }
            if (itemType === 'selectMultiple') {
                fieldPropsOptions = assign({}, {multiple: true}, fieldPropsOptions);
            }
            return (
                <Col>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <SelectItem {...fieldPropsOptions} />
                    </FormItem>
                </Col>
            );
        }
    }

    render() {
        let options = this.props.options;
        const defaultOptions = {
            searchBtnText: '查询',
        };
        options = assign({}, defaultOptions, options);
        const searchBtnText = options.searchBtnText;
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
