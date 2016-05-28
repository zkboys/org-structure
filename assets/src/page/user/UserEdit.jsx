import React from 'react';
import BaseComponent from '../../component/BaseComponent';
import {Form, Input, Radio, Icon, TreeSelect, Row, Col, Modal, message} from 'antd';
import ValidationRule from '../../common/validation-rule';
import {convertToTree} from '../../common/common';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class UserEdit extends BaseComponent {
    state = {
        show: false,
        orgData: [{
            label: '节点一',
            value: '0-0',
            key: '0-0',
            children: [{
                label: '子节点一',
                value: '0-0-1',
                key: '0-0-1',
            }, {
                label: '子节点二',
                value: '0-0-2',
                key: '0-0-2',
            }],
        }, {
            label: '节点二',
            value: '0-1',
            key: '0-1',
        }],
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.show,
        });
    }

    componentWillMount() {
        this.request()
            .get('/api/organization/organizations')
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

    showModal = () => {
        this.setState({
            show: true,
        });
    }
    hideModal = () => {
        this.setState({
            show: false,
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }

    handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            console.log(values);
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            this.request()
                .post('/api/organization/users')
                .params(values)
                .success((data, res) => {
                    message.success('保存成功！');
                })
                .end();
        });
    }

    render() {
        const {getFieldProps} = this.props.form;
        const nameProps = getFieldProps('name');
        const loginnameProps = getFieldProps('loginname', {
            rules: [
                ValidationRule.required('登录名'),
                ValidationRule.loginName(),
                ValidationRule.checkLoginNameExist(),
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
                title="添加人员"
                visible={this.state.show}
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
