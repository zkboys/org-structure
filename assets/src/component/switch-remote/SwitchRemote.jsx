import React from 'react';
import {Switch, Icon, message} from 'antd';
import Request from '../../common/request';

class SwitchRemote extends React.Component {
    state = {
        isLoading: false,
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
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            checked: nextProps.checked,
        });
    }

    handleClick = () => {
        if (this.state.isLoading) {
            return false;
        }
        const url = `/api/${this.props.url}`;
        const params = this.props.params;
        const loading = <Icon type="loading"/>;
        this.setState({
            isLoading: true,
            checkedChildren: loading,
            unCheckedChildren: loading,
        });
        Request
            .put(url)
            .send(params)
            .end((err, res) => {
                if (err || !res.ok) {
                    message.error('操作失败！');
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
                    checked={this.state.checked}
                    checkedChildren={this.state.checkedChildren}
                    unCheckedChildren={this.state.unCheckedChildren}
                />
            </span>
        );
    }
}
export default SwitchRemote;
