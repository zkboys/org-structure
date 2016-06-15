import React from 'react';
import {Switch, Icon, message} from 'antd';
import Request from '../../common/request';

class SwitchRemote extends React.Component {
    state = {
        isLoading: false,
        disabled: this.props.disabled,
        checked: this.props.checked,
        checkedChildren: this.props.checkedChildren,
        unCheckedChildren: this.props.unCheckedChildren,
    };

    static defaultProps = {
        checkedChildren: '是',
        unCheckedChildren: '否',
    };

    static propTypes = {
        url: React.PropTypes.string.isRequired,
        params: React.PropTypes.object,
        checked: React.PropTypes.bool.isRequired,
        checkedKey: React.PropTypes.string.isRequired,
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            checked: nextProps.checked,
        });
    }

    handleClick = () => {
        if (this.state.isLoading || this.state.disabled) {
            return false;
        }
        const url = this.props.url;
        const params = this.props.params;
        const loading = <Icon type="loading"/>;
        this.setState({
            isLoading: true,
            checkedChildren: loading,
            unCheckedChildren: loading,
        });
        params[this.props.checkedKey] = this.state.checked;
        Request
            .put(url)
            .send(params)
            .end((err, res) => {
                if (err || !res.ok) {
                    const errorMessage = res.body && res.body.message || '操作失败！';
                    message.error(errorMessage);
                } else {
                    const checked = !this.state.checked;
                    this.setState({
                        checked,
                    });
                    const onChange = this.props.onChange;
                    if (onChange) {
                        onChange(checked);
                    }
                }
                // 切换过程中有动画，等待动画结束，才算loading完成，防止用户疯狂点击，会出现状态不符的情况。
                setTimeout(() => {
                    this.setState({
                        isLoading: false,
                    });
                }, 335);
                this.setState({
                    checkedChildren: this.props.checkedChildren,
                    unCheckedChildren: this.props.unCheckedChildren,
                });
            });
    };

    render() {
        return (
            <span onClick={this.handleClick}>
                <Switch
                    disabled={this.state.disabled}
                    checked={this.state.checked}
                    checkedChildren={this.state.checkedChildren}
                    unCheckedChildren={this.state.unCheckedChildren}
                />
            </span>
        );
    }
}
export default SwitchRemote;
