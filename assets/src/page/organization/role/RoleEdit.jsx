import React from 'react';
import {BaseComponent} from 'component';
import {Form, Input, Radio, Modal, message} from 'antd';
import {ValidationRule, Common} from 'common';

const createForm = Form.create;
const FormItem = Form.Item;

class RoleEdit extends BaseComponent {
    state = {
        isSaving: false,
    };

    hideModal = () => {
        this.props.hideModal();
        // 关闭需要reset，否则会影响下一次内容
        this.handleReset();
    }
    handleReset = () => {
        this.props.form.resetFields();
    }

    handleSubmit = () => {
        if (this.state.loading) {
            return;
        }
        const fields = [
            'name',
            'description',
        ];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!!errors) {
                return;
            }
            this.setState({
                isSaving: true,
            });
            let request = this.request();
            let url = '/organization/roles';
            let id = this.props.role && this.props.role._id;
            if (id) { // 存在id，是修改操作
                request.put(url);
                values._id = id;
            } else {
                request.post(url);
            }
            request.params(values)
                .success(() => {
                    message.success('保存成功！');
                    const onOk = this.props.onOk;
                    if (onOk) {
                        onOk();
                    }
                    this.hideModal();
                })
                .end(() => {
                    this.setState({
                        isSaving: false,
                    });
                });
        });
    }

    render() {
        const {getFieldProps} = this.props.form;
        let title = '添加角色';
        let ignoreValues = [];
        let role = this.props.role;
        if (!role) {
            role = {};
        }
        if (role._id) { // _id 存在，修改操作。
            title = '修改角色';
            ignoreValues.push(role.name);
        }
        const nameProps = getFieldProps('name', {
            initialValue: role.name,
            rules: [
                ValidationRule.required('角色名'),
                ValidationRule.checkRoleNameExist(ignoreValues),
            ],
        });
        const descriptionProps = getFieldProps('description', {
            initialValue: role.description,
            rules: [],
        });
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18},
        };
        return (
            <Modal
                title={title}
                visible={this.props.show}
                confirmLoading={this.state.isSaving}
                okText="保存"
                onOk={this.handleSubmit}
                onCancel={this.hideModal}
            >
                <Form horizontal form={this.props.form}>
                    <FormItem
                        {...formItemLayout}
                        label="角色名："
                        hasFeedback
                    >
                        <Input
                            {...nameProps}
                            placeholder="请输入登录名"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="描述：">
                        <Input
                            type="textarea"
                            {...descriptionProps}
                            placeholder="角色描述"
                        />
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}
export default createForm()(RoleEdit);
