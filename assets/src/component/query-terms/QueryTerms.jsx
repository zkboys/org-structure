import './style.less';
import React from 'react';
import assign from 'object-assign';
import moment from 'moment';
import EventProxy from 'eventproxy';
import {CheckBoxItem, RadioItem, SelectItem, ComboboxItem, DateTimeAreaItem} from '../form-item/index';
import {Button, DatePicker, TimePicker, InputNumber, Input, Form, Cascader, Row, Col, Tabs} from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const ep = new EventProxy();

class QueryTerms extends React.Component {
    state = {
        allOptions: {},
    };
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
        let eventNames = [];
        const getAllOptions = this.props.options.getAllOptions;
        const items = this.props.options.items;
        const onComplete = this.props.options.onComplete;
        if (getAllOptions) {
            const allOptionsEvenName = Symbol();
            eventNames.push(allOptionsEvenName);
            getAllOptions((allOptions) => {
                this.setState({
                    allOptions,
                });
                ep.emit(allOptionsEvenName, allOptions);
            });
        }
        // 提取所有的异步（根据是否有url判断）
        items.forEach((item) => {
            if (item instanceof Array) {
                item.forEach((i) => {
                    if (i.url) {
                        eventNames.push(i.name);
                    }
                });
            } else if (item.url) {
                eventNames.push(item.name);
            }
        });

        if (eventNames.length) {
            ep.all(eventNames, () => {
                if (onComplete) {
                    onComplete(this.props.form.getFieldsValue());
                }
            });
        }
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
        const name = itemOptions.name;
        const itemType = itemOptions.type;
        const isRadioOrCheckBox = ['radio', 'radioButton', 'checkboxButton', 'checkbox'].indexOf(itemType) > -1;
        if (isRadioOrCheckBox && !itemOptions.fieldWidth) {
            itemOptions.fieldWidth = 'auto';
        }
        const defaultItemOptions = {
            fieldWidth: options.fieldWidth || 150,
            labelWidth: options.labelWidth || 'auto',
            labelFontSize: options.labelFontSize || 12,
            size: 'large',
            //initialValue: '',
            //startInitialValue: '',
            //endInitialValue: '',
            format: this.format[itemType],
        };
        itemOptions = assign({}, defaultItemOptions, itemOptions);
        if (this.state.allOptions[name]) {
            itemOptions.options = this.state.allOptions[name];
        }
        const resultDateToString = options.resultDateToString;
        const searchOnChange = itemOptions.searchOnChange;
        const label = itemOptions.label;
        const startName = itemOptions.startName;
        const endName = itemOptions.endName;
        const fieldWidth = itemOptions.fieldWidth;
        const labelUnifiedFontCount = itemOptions.labelUnifiedFontCount;
        const labelFontSize = itemOptions.labelFontSize;
        const initialFirst = itemOptions.initialFirst;
        const onComplete = itemOptions.onComplete;
        let onChange = itemOptions.onChange;
        let onKeyDown = itemOptions.onKeyDown;
        let labelWidth = itemOptions.labelWidth;
        let placeholder = itemOptions.placeholder;
        const hasOptions = itemOptions.options && itemOptions.options.length;
        const isSelect = ['select', 'selectSearch', 'selectMultiple'].indexOf(itemType) > -1;
        // 从options根据selected checked属性，获取默认值
        if ((isSelect || isRadioOrCheckBox) && hasOptions) {
            if (['selectMultiple', 'checkbox', 'checkboxButton'].indexOf(itemType) > -1) {
                let initialValues = [];
                itemOptions.options.forEach((opt) => {
                    if (opt.selected || opt.checked) {
                        initialValues.push(opt.value);
                    }
                });
                itemOptions.initialValue = initialValues;
            } else {
                for (let opt of itemOptions.options) {
                    if (opt.selected || opt.checked) {
                        itemOptions.initialValue = opt.value;
                        break;
                    }
                }
            }
        }
        // 处理异步数据，默认第一个
        if (initialFirst && hasOptions) {
            const firstOption = itemOptions.options[0];
            if (typeof firstOption === 'string') {
                itemOptions.initialValue = itemOptions.options[0];
            } else {
                itemOptions.initialValue = itemOptions.options[0].value;
            }
        }
        // 统一处理默认值
        if (itemOptions.initialValue
            && !(itemOptions.initialValue instanceof Array)
            && ['selectMultiple', 'checkbox', 'checkboxButton'].indexOf(itemType) > -1) {
            itemOptions.initialValue = [itemOptions.initialValue];
        }
        // 处理异步数据完成之后回调
        itemOptions.onComplete = (data) => {
            ep.emit(name, data);
            if (onComplete) {
                onComplete(data);
            }
        };

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
                setTimeout(() => { // 不这么做，获取name的value是上一个值
                    options.onChange(getFieldsValue());
                });
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
                endFieldPropsOptions = getFieldProps(endName, assign({}, fp, itemOptions));
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
        if (isSelect) {
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
        if (itemType === 'cascader') {
            return (
                <Col>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <Cascader
                            {...fieldPropsOptions}
                        />
                    </FormItem>
                </Col>
            );
        }
        if (isRadioOrCheckBox) {
            itemProps.style.marginBottom = '0px';
            const type = ['radioButton', 'checkboxButton'].indexOf(itemType) > -1 ? 'button' : 'radio';
            const expandable = itemOptions.expandable;
            const Element = ['checkbox', 'checkboxButton'].indexOf(itemType) > -1 ? CheckBoxItem : RadioItem;
            if (type === 'button') {
                fieldPropsOptions.button = true;
            }
            if (expandable) {
                fieldPropsOptions.expandable = true;
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
                                {...fieldPropsOptions}
                            />
                        </div>
                    </FormItem>
                </Col>
            );
        }
        if (['date', 'dateTime', 'time', 'month'].indexOf(itemType) > -1) {
            let Element = DatePicker;
            if (itemType === 'month') {
                Element = DatePicker.MonthPicker;
            }
            if (itemType === 'time') {
                Element = TimePicker;
            }
            if (itemType === 'dateTime') {
                fieldPropsOptions.showTime = true;
            }
            return (
                <Col>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <Element
                            {...fieldPropsOptions}
                        />
                    </FormItem>
                </Col>
            );
        }
        if (['dateArea', 'timeArea', 'dateTimeArea'].indexOf(itemType) > -1) {
            let typeProps = {
                [itemType]: true,
            };
            if (options.resultDateToString) {
                eleProps.resultDateToString = true;
            }
            let width = window.parseInt(itemProps.style.width);
            itemProps.style.width = width * 2 + 10; // 10为中间的分隔符宽度
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
        if (['tabsCard', 'tabs'].indexOf(itemType) > -1) {
            if (itemType === 'tabsCard') {
                fieldPropsOptions.type = 'card';
            }
            return (
                <Tabs
                    {...fieldPropsOptions}
                    defaultActiveKey={itemOptions.initialValue}
                >
                    {itemOptions.options.map((v) => {
                        return (
                            <TabPane tab={v.label} key={v.value}/>
                        );
                    })}
                </Tabs>
            );
        }
        if (itemType === 'customer') {
            let Component = itemOptions.component;
            return (
                <Col>
                    {labelJsx}
                    <FormItem {...itemProps}>
                        <Component
                            {...fieldPropsOptions}
                        />
                    </FormItem>

                </Col>
            );
        }
        throw Error(`查询条件没有此类型type:${itemType}`);
    }

    render() {
        let options = this.props.options;
        const defaultOptions = {
            searchBtnText: '查询',
            resultDateToString: true,
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
