import React from 'react';
import assign from 'object-assign';
import BaseComponent from '../../component/BaseComponent';
import {Form, Input, Radio, Icon, TreeSelect, Row, Col, Modal, message} from 'antd';
import ValidationRule from '../../common/validation-rule';
import {convertToTree} from '../../common/common';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class UserEdit extends BaseComponent {
    state = {
        isSaving: false,
        orgData: [],
    };

    user = null; // 存放要添加，或者要修改的用户信息

    componentWillReceiveProps(nextProps) {
        const {setFieldsValue} = nextProps.form;
        const user = nextProps.user;
        // 这里不能正常使用setFieldsValue，会产生死循环。
        if (user && !this.user) {
            setFieldsValue(user);
        }
        this.user = user;
    }

    componentWillMount() {
        this.request()
            .get('/organization/organizations')
            .success((data) => {
                if (data && data.length) {
                    let organizations = data.map(v => {
                        v.text = v.name;
                        v.label = v.name;
                        v.value = v._id;
                        return v;
                    });
                    this.setState({
                        organizations,
                        orgData: convertToTree(organizations),
                    });
                }
            })
            .end();
        this.props.form.setFieldsValue({
            is_locked: false,
        });
    }

    hideModal = () => {
        this.user = null;
        this.props.hideModal();
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
            'loginname',
            'email',
            'mobile',
            'gender',
            'position',
            'org_id',
            'is_locked',
        ];
        this.props.form.validateFieldsAndScroll(fields, (errors, values) => {
            if (!!errors) {
                return;
            }
            this.setState({
                isSaving: true,
            });
            let request = this.request();
            let url = '/organization/users';
            let id = this.user._id;
            if (id) { // 存在id，是修改操作
                request.put(url);
                values._id = id;
            } else {
                request.post(url);
            }
            request.params(values)
                .success((data, res) => {
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
        const {getFieldProps, getFieldValue} = this.props.form;
        let title = '添加人员';
        let ignoreValues = [];
        if (this.user && this.user._id) { // _id 存在，修改操作。
            title = '修改人员';
            ignoreValues.push(this.user.loginname);
        }
        const nameProps = getFieldProps('name');
        const loginnameProps = getFieldProps('loginname', {
            rules: [
                ValidationRule.required('登录名'),
                ValidationRule.loginName(),
                ValidationRule.checkLoginNameExist(ignoreValues),
            ],
        });
        const emailProps = getFieldProps('email', {
            rules: [
                ValidationRule.email(),
            ],
        });
        const mobileProps = getFieldProps('mobile', {
            rules: [
                ValidationRule.mobile(),
            ],
        });
        const genderProps = getFieldProps('gender', {
            rules: [],
        });
        const positionProps = getFieldProps('position', {
            rules: [],
        });
        const orgProps = getFieldProps('org_id', {
            rules: [],
        });
        const isLockedProps = getFieldProps('is_locked', {
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
                    <Row>
                        <Col span={12}>
                            <FormItem
                                labelCol={{span: 8}}
                                wrapperCol={{span: 16}}
                                label="登录名："
                                hasFeedback
                            >
                                <Input
                                    {...loginnameProps}
                                    placeholder="请输入登录名"
                                />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                labelCol={{span: 6}}
                                wrapperCol={{span: 14}}
                                label="用户名："
                                hasFeedback
                            >
                                <Input
                                    {...nameProps}
                                    placeholder="请输入用户名"
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                labelCol={{span: 8}}
                                wrapperCol={{span: 16}}
                                label="邮箱："
                                hasFeedback
                            >
                                <Input
                                    {...emailProps}
                                    placeholder="请输入邮箱"
                                />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                labelCol={{span: 6}}
                                wrapperCol={{span: 14}}
                                label="电话："
                                hasFeedback
                            >
                                <Input
                                    {...mobileProps}
                                    placeholder="请输入电话"
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        {...formItemLayout}
                        label="性别：">
                        <RadioGroup {...genderProps}>
                            <Radio value="male">男</Radio>
                            <Radio value="female">女</Radio>
                        </RadioGroup>
                        <span><Icon type="info-circle-o"/> 暂不支持其它性别</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="所属部门：">
                        <TreeSelect
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择部门"
                            allowClear
                            treeDefaultExpandAll
                            treeData={this.state.orgData}
                            {...orgProps}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="职位：">
                        <Input
                            {...positionProps}
                            placeholder="请输入职位"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="锁定：">
                        <RadioGroup {...isLockedProps}>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}
export default createForm()(UserEdit);