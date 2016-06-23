import React from 'react';
import {Button, Form, Input, message} from 'antd';
import {Page} from 'framework';
import {BaseComponent} from 'component';
const createForm = Form.create;
const FormItem = Form.Item;
function noop() {
    return false;
}
class ProfilePassWord extends BaseComponent {
    state = {
        loading: false,
    }
    handleReset = (e) => {
        e.preventDefault();
        this.props.form.resetFields();
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
            this.request()
                .put('/system/pass')
                .params(values)
                .success(() => {
                    message.success('修改成功！');
                })
                .end();
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
        const OrPasswdProps = getFieldProps('orPass', {
            rules: [
                {required: true, whitespace: true, message: '请填写原密码'},
            ],
        });
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
            labelCol: {span: 7},
            wrapperCol: {span: 12},
        };
        return (
            <Page>
                <Form horizontal form={this.props.form}>
                    <FormItem
                        {...formItemLayout}
                        label="原密码："
                    >
                        <Input
                            {...OrPasswdProps}
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
                        label="新密码："
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
                    <FormItem wrapperCol={{ span: 12, offset: 7 }}>
                        <Button type="primary" loading={this.state.loading} onClick={this.handleSubmit}>确定</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="ghost" onClick={this.handleReset}>重置</Button>
                    </FormItem>
                </Form>
            </Page>
        );
    }
}
export default createForm()(ProfilePassWord);
