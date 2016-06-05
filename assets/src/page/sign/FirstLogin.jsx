import './first-login-style.less';
import React from 'react';
import {Button, Form, Input, message} from 'antd';
import {Request, Storage} from 'common';
const createForm = Form.create;
const FormItem = Form.Item;
function noop() {
    return false;
}
class FirstLogin extends React.Component {
    state = {
        loading: false,
    }
    handleSubmit = (e) => {
        if (this.state.loading) {
            return;
        }

        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return false;
            }
            this.setState({
                loading: true,
            });
            Request
                .put('/first_login')
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
    }

    checkPass = (rule, value, callback) => {
        const { validateFields } = this.props.form;
        if (value) {
            validateFields(['rePass'], {force: true});
        }
        callback();
    }

    checkRePass = (rule, value, callback) => {
        const { getFieldValue } = this.props.form;
        if (value && value !== getFieldValue('pass')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    }

    render() {
        const {getFieldProps} = this.props.form;
        const passwdProps = getFieldProps('pass', {
            rules: [
                {required: true, whitespace: true, message: '请填写密码'},
                {validator: this.checkPass},
            ],
        });
        const rePasswdProps = getFieldProps('rePass', {
            rules: [
                {
                    required: true,
                    whitespace: true,
                    message: '请再次输入密码',
                },
                {
                    validator: this.checkRePass,
                },
            ],
        });
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16},
        };
        return (
            <div className="first-login-box">
                <h1 className="title">首次登录，请修改您的密码</h1>
                <Form horizontal form={this.props.form}>
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
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="确认密码："
                    >
                        <Input
                            {...rePasswdProps}
                            type="password"
                            autoComplete="off"
                            onContextMenu={noop}
                            onPaste={noop}
                            onCopy={noop}
                            onCut={noop}
                        />
                    </FormItem>
                    <FormItem wrapperCol={{ span: 16, offset: 5 }}>
                        <Button
                            style={{width: '100%'}}
                            type="primary"
                            loading={this.state.loading}
                            onClick={this.handleSubmit}
                        >确认</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
export default createForm()(FirstLogin);
