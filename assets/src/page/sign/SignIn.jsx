import './style.less';
import React from 'react';
import Request from '../../common/request';
import {Button, Form, Input, message} from 'antd';
import Storage from '../../common/storage';
const createForm = Form.create;
const FormItem = Form.Item;
function noop() {
    return false;
}

class SignIn extends React.Component {
    state = {
        loading: false,
    };

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
                .post('/api/signin')
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
                        Storage.session.set('currentLoginUser', currentLoginUser);
                        Storage.session.set('menus', menus);
                        location.href = refer;
                    }
                });
        });
    };

    render() {
        const {getFieldProps} = this.props.form;
        const nameProps = getFieldProps('name', {
            initialValue: 'test',
            rules: [
                {required: true, message: '请填写用户名'},
            ],
        });
        const passwdProps = getFieldProps('pass', {
            initialValue: 't123456',
            rules: [
                {required: true, whitespace: true, message: '请填写密码'},
            ],
        });
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17},
        };
        return (
            <div>
                <div className="login-box">
                    <h1 className="login-title">用户登陆</h1>
                    <Form horizontal form={this.props.form}>
                        <FormItem
                            {...formItemLayout}
                            label="用户名："
                            hasFeedback
                        >
                            <Input {...nameProps} placeholder="请输入用户名"/>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="密码："
                            hasFeedback>
                            <Input
                                {...passwdProps}
                                type="password"
                                autoComplete="off"
                                onContextMenu={noop}
                                onPaste={noop}
                                onCopy={noop}
                                onCut={noop}
                            />
                        </FormItem>
                        <FormItem wrapperCol={{ span: 17, offset: 7 }}>
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
