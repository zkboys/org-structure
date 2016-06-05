import React from 'react';
import {BaseComponent, FAIcon} from 'component';
import {Form, Input, Tree, Modal, message} from 'antd';
import {ValidationRule, Common} from 'common';

const convertToTree = Common.convertToTree;
const TreeNode = Tree.TreeNode;
const createForm = Form.create;
const FormItem = Form.Item;

class RoleEdit extends BaseComponent {
    state = {
        isSaving: false,
        gData: [],
    };

    componentWillMount() {
        this.request()
            .get('/system/menus')
            .success((data) => {
                let defaultMenu = {
                    key: 'super',
                    parentKey: undefined,
                    text: '未设置',
                    icon: '',
                    path: '',
                    order: 1,
                };
                let menus = [defaultMenu];
                if (data && data.length) {
                    menus = data;
                }
                // menus = require('../../framework/menus.back.js');
                this.setState({
                    menus,
                    gData: convertToTree(menus),
                });
            })
            .end();
    }

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
            'permissions',
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
    };
    findNodeByKey = (data, key) => {
        for (let item of data) {
            if (item.key === key) {
                item.isMenu = true;
                return item;
            }
            if (item.functions) {
                for (let f of item.functions) {
                    if (f.key === key) {
                        f.isfunction = true;
                        return f;
                    }
                }
            }
            if (item.children) {
                return this.findNodeByKey(item.children, key);
            }
        }
    };
    onCheck = (info, e) => {
        const checkedNodes = e.checkedNodes;
        let permissions = new Set();
        if (checkedNodes && checkedNodes.length) {
            checkedNodes.forEach(checkNode => {
                const key = checkNode.key;
                const node = this.findNodeByKey(this.state.gData, key);
                if (node) {
                    const keys = [...node.parentKeys];
                    keys.push(key);
                    keys.forEach(k => {
                        if (k !== void 0) {
                            permissions.add(k);
                        }
                    });
                }
            });
        }
        this.props.form.setFieldsValue({
            permissions: Array.from(permissions),
        });
    };

    render() {
        const loop = data => data.map((item) => {
            if (item.children && item.children.length) {
                return (
                    <TreeNode
                        key={item.key}
                        title={<span><FAIcon type={item.icon}/> {item.text}</span>}
                    >
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            if (item.functions && item.functions.length) {
                return (
                    <TreeNode
                        key={item.key}
                        title={<span><FAIcon type={item.icon}/> {item.text}</span>}
                    >
                        {item.functions.map(v => {
                            v.parentKeys = [...item.parentKeys];
                            v.parentKeys.push(item.key);
                            return (
                                <TreeNode
                                    key={v.key}
                                    title={<span>{v.name}</span>}
                                />
                            );
                        })}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={item.key}
                    title={<span><FAIcon type={item.icon}/> {item.text}</span>}
                />
            );
        });

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
        getFieldProps('permissions', {
            initialValue: role.permissions,
            rules: [],
        });
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18},
        };
        let keys = role.permissions || [];
        keys = keys.filter(v => {
            let node = this.findNodeByKey(this.state.gData, v);
            return node && !(node.children && node.children.length || node.functions && node.functions.length);
        });
        return (
            <Modal
                width="60%"
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
                <div>
                    选择权限
                    <Tree
                        checkable
                        defaultExpandedKeys={keys}
                        defaultCheckedKeys={keys}
                        onCheck={this.onCheck}
                    >
                        {loop(this.state.gData)}
                    </Tree>
                </div>
            </Modal>
        );
    }
}
export default createForm()(RoleEdit);
