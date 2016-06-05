import './style.less';
import React from 'react';
import {Request, Storage} from 'common';
import {Button, Form, Input, message} from 'antd';
import Bg from './bg.jpg';
import decorateImage from './bg4.png';
const createForm = Form.create;
const FormItem = Form.Item;
function noop() {
    return false;
}

class SignIn extends React.Component {
    state = {
        loading: false,
        loaded: false,
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loaded: true,
            });
        }, 500);
    }

    handleSubmit = (e) => {
        if (this.state.loading) {
            return;
        }

        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return message.error('用户名或密码错误');
            }
            this.setState({
                loading: true,
            });
            Request
                .post('/signin')
                .send(values)
                .end((err, res) => {
                    this.setState({
                        loading: false,
                    });
                    if (err || !res.ok) {
                        message.error(res.body.message);
                    } else {
                        let refer = res.body.refer || '/';
                        let menus = res.body.menus || [];
                        let currentLoginUser = res.body.user;
                        if (currentLoginUser.is_first_login) {
                            location.href = '/first_login';
                        } else {
                            Storage.session.set('currentLoginUser', currentLoginUser);
                            Storage.session.set('menus', menus);
                            location.href = refer;
                        }
                    }
                });
        });
    };

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit(e);
        }
    };

    render() {
        const {getFieldProps} = this.props.form;
        const nameProps = getFieldProps('name', {
            initialValue: 'admin',
            rules: [
                {required: true, message: '请填写用户名'},
            ],
        });
        const passwdProps = getFieldProps('pass', {
            initialValue: '111111',
            rules: [
                {required: true, whitespace: true, message: '请填写密码'},
            ],
        });
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16},
        };
        return (
            <div className="login-wrap" style={{backgroundImage: `url(${Bg})`}}>
                <div className={`img-box ${this.state.loaded ? 'loaded' : ''}`}>
                    <img src={decorateImage} alt="img"/>
                    <lable className="circle-label small yellow position1">监控</lable>
                    <lable className="circle-label large blue position2">智能</lable>
                    <lable className="circle-label large red position3">巡检</lable>
                    <lable className="circle-label large purple position4">安全</lable>
                    <div className="massage position2">智能方便
                        <div className="line"></div>
                    </div>
                    <div className="massage position3">快速巡检
                        <div className="line"></div>
                    </div>
                    <div className="massage position4">安全可靠的技术支持
                        <div className="line"></div>
                    </div>
                </div>
                <div className="login-box">
                    <h1 className="login-title">用户登录</h1>
                    <Form horizontal form={this.props.form}>
                        <FormItem
                            {...formItemLayout}
                            label="用户名："
                        >
                            <Input
                                {...nameProps}
                                onKeyDown={this.handleKeyDown}
                                placeholder="请输入用户名"
                            />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="密码："
                        >
                            <Input
                                {...passwdProps}
                                type="password"
                                autoComplete="off"
                                onContextMenu={noop}
                                onPaste={noop}
                                onCopy={noop}
                                onCut={noop}
                                onKeyDown={this.handleKeyDown}
                            />
                        </FormItem>
                        <FormItem wrapperCol={{ span: 16, offset: 5 }}>
                            <Button
                                style={{width: '100%'}}
                                type="primary"
                                loading={this.state.loading}
                                onClick={this.handleSubmit}
                            >登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default createForm()(SignIn);
