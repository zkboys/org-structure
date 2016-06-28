import './style.less';
import React from 'react';
import assign from 'object-assign';
import moment from 'moment';
import {DatePicker, TimePicker} from 'antd';

class RadioItem extends React.Component {
    state = {
        format: '',
        momentFormat: '',
        disableBefore: null,
        disableAfter: null,
        startValue: this.props.startFieldProps.value || this.props.startDefaultValue,
        endValue: this.props.endFieldProps.value || this.props.endDefaultValue,
    };
    static defaultProps = {};
    static propTypes = {};

    componentWillMount() {
        let defaultFormat = {
            date: 'yyyy-MM-dd',
            dateArea: 'yyyy-MM-dd',
            time: 'HH:mm',
            timeArea: 'HH:mm',
            dateTime: 'yyyy-MM-dd HH:mm',
            dateTimeArea: 'yyyy-MM-dd HH:mm',
        };
        const isDate = this.props.date;
        const isDateArea = this.props.dateArea;
        const isTime = this.props.time;
        const isTimeArea = this.props.timeArea;
        const isDateTime = this.props.dateTime;
        const isDateTimeArea = this.props.dateTimeArea;
        const itemType =
            isDate && 'date'
            || isDateArea && 'dateArea'
            || isTime && 'time'
            || isTimeArea && 'timeArea'
            || isDateTime && 'dateTime'
            || isDateTimeArea && 'dateTimeArea';
        const format = this.props.format || defaultFormat[itemType];
        const momentFormat = format.replace('yyyy', 'YYYY').replace('dd', 'DD');
        this.setState({
            format,
            momentFormat,
        });

        let disableBefore = this.props.disableBefore;
        let disableAfter = this.props.disableAfter;
        if (typeof disableBefore === 'string') {
            disableBefore = this.stringToDate(disableBefore, format);
        }
        if (typeof disableAfter === 'string') {
            disableAfter = this.stringToDate(disableAfter, format);
        }
        this.setState({
            disableBefore,
            disableAfter,
        });
    }

    dateToString = (date) => {
        return moment(date).format(this.state.momentFormat);
    };
    stringToDate = (str) => {
        return moment(str, this.state.momentFormat).toDate();
    };

    timeStampToString = (timeStamp) => {
        return moment(timeStamp).format(this.state.momentFormat);
    };

    disabledStartDate = (startValue) => {
        let endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        if (typeof endValue === 'string') {
            endValue = this.stringToDate(endValue);
        }

        startValue = this.timeStampToString(startValue.getTime());
        endValue = this.timeStampToString(endValue.getTime());
        let disEnd = startValue > endValue;
        let disBefore = false;
        let disableBefore = this.state.disableBefore;
        if (disableBefore) {
            disableBefore = this.timeStampToString(disableBefore.getTime());
            disBefore = startValue < disableBefore;
        }
        let disAfter = false;
        let disableAfter = this.state.disableAfter;
        if (disableAfter) {
            disableAfter = this.timeStampToString(disableAfter.getTime());
            disAfter = startValue > disableAfter;
        }
        return disEnd || disBefore || disAfter;
    };

    disabledEndDate = (endValue) => {
        let startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        if (typeof startValue === 'string') {
            startValue = this.stringToDate(startValue);
        }

        startValue = this.timeStampToString(startValue.getTime());
        endValue = this.timeStampToString(endValue.getTime());

        let disStart = endValue < startValue;
        let disBefore = false;
        let disableBefore = this.state.disableBefore;
        if (disableBefore) {
            disableBefore = this.timeStampToString(disableBefore.getTime());
            disBefore = endValue < disableBefore;
        }
        let disAfter = false;
        let disableAfter = this.state.disableAfter;
        if (disableAfter) {
            disableAfter = this.timeStampToString(disableAfter.getTime());
            disAfter = endValue > disableAfter;
        }
        return disStart || disBefore || disAfter;
    };


    render() {
        const isDateArea = this.props.dateArea;
        const isTimeArea = this.props.timeArea;
        const isDateTimeArea = this.props.dateTimeArea;
        const width = this.props.width;
        let splitWidth = 10;
        const itemWidth = width; // `${((window.parseInt(width) - splitWidth) / 2)}px`;
        splitWidth = `${splitWidth}px`;
        const eleProps = {
            style: {width: '100%'},
        };
        if (isDateTimeArea) {
            eleProps.showTime = true;
        }
        const startFieldPropsOptions = this.props.startFieldProps;
        const endFieldPropsOptions = this.props.endFieldProps;
        const startEleProps = assign({}, eleProps);
        const endEleProps = assign({}, eleProps);

        let startDefaultValue = startFieldPropsOptions.value || this.props.startDefaultValue;
        let endDefaultValue = endFieldPropsOptions.value || this.props.endDefaultValue;
        if (startDefaultValue && typeof startDefaultValue === 'string') {
            startDefaultValue = this.stringToDate(startDefaultValue);
        }
        if (endDefaultValue && typeof endDefaultValue === 'string') {
            endDefaultValue = this.stringToDate(endDefaultValue);
        }
        let startPicker;
        let endPicker;
        if (isDateArea || isDateTimeArea) {
            startPicker = (
                <DatePicker
                    disabledDate={this.disabledStartDate}
                    {...startFieldPropsOptions}
                    defaultValue={startDefaultValue}
                    format={this.state.format}
                    {...startEleProps}
                />
            );
            endPicker = (
                <DatePicker
                    disabledDate={this.disabledEndDate}
                    {...endFieldPropsOptions}
                    defaultValue={endDefaultValue}
                    format={this.state.format}
                    {...endEleProps}
                />
            );
        }
        if (isTimeArea) {
            startPicker = (
                <TimePicker
                    {...startFieldPropsOptions}
                    defaultValue={startDefaultValue}
                    format={this.state.format}
                    {...startEleProps}
                />
            );
            endPicker = (
                <TimePicker
                    {...endFieldPropsOptions}
                    defaultValue={endDefaultValue}
                    format={this.state.format}
                    {...endEleProps}
                />
            );
        }

        return (
            <div className="form-item form-item-datetime-area">
                <div className="area-item" style={{width: itemWidth}}>
                    {startPicker}
                </div>
                <div className="area-split" style={{width: splitWidth}}>
                    <p className="ant-form-split">-</p>
                </div>
                <div className="area-item" style={{width: itemWidth}}>
                    {endPicker}
                </div>
            </div>
        );
    }
}
export default RadioItem;
