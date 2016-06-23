import React from 'react';
import {BaseComponent} from 'component';
import {Form, Input, Radio, Icon, message, Button} from 'antd';
import {ValidationRule, Common} from 'common';
import {Page} from 'framework';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class ProfileMessage extends BaseComponent {
    state = {
        loading: false,
        isSaving: false,
        user: {},
    };

    componentWillMount() {
        const currentLoginUser = Common.getCurrentLoginUser();
        this.request()
            .get(`/organization/users/${currentLoginUser._id}`)
            .success((user) => {
                this.setState({
                    user,
                });
            })
            .end();
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
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            this.setState({
                isSaving: true,
            });
            let request = this.request();
            request.put('/system/message')
                .params(values)
                .success(() => {
                    message.success('保存成功！');
                })
                .end(() => {
                    this.setState({
                        isSaving: false,
                    });
                });
        });
    }

    render() {
        const user = this.state.user;
        const {getFieldProps} = this.props.form;
        const idProps = getFieldProps('_id', {initialValue: user._id});
        const nameProps = getFieldProps('name', {initialValue: user.name});
        const emailProps = getFieldProps('email', {
            initialValue: user.email,
            rules: [
                ValidationRule.email(),
            ],
        });
        const mobileProps = getFieldProps('mobile', {
            initialValue: user.mobile,
            rules: [
                ValidationRule.mobile(),
            ],
        });
        const genderProps = getFieldProps('gender', {
            initialValue: user.gender,
            rules: [],
        });
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 12},
        };
        return (
            <Page loading={this.state.loading}>
                <Form horizontal form={this.props.form}>
                    <FormItem
                        {...formItemLayout}
                        label="用户id："
                        style={{display: 'none'}}
                        hasFeedback
                    >
                        <Input
                            {...idProps}
                            placeholder="请输入登录名"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户名："
                        hasFeedback
                    >
                        <Input
                            {...nameProps}
                            placeholder="请输入用户名"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="邮箱："
                        hasFeedback
                    >
                        <Input
                            {...emailProps}
                            placeholder="请输入邮箱"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="电话："
                        hasFeedback
                    >
                        <Input
                            {...mobileProps}
                            placeholder="请输入电话"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="性别：">
                        <RadioGroup {...genderProps}>
                            <Radio value="male">男</Radio>
                            <Radio value="female">女</Radio>
                        </RadioGroup>
                        <span><Icon type="info-circle-o"/> 暂不支持其它性别</span>
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
export default createForm()(ProfileMessage);
