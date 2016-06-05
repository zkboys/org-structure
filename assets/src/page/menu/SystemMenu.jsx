import React from 'react';
import {Button, Form, Input, Tree, Row, Col, Alert, Modal, message, Table, Popconfirm} from 'antd';
import BaseComponent from '../../component/base-component/BaseComponent';
import Page from '../../framework/page/Page';
import {convertToTree} from '../../common/common';
import FIcon from '../../component/faicon/FAIcon';

const TreeNode = Tree.TreeNode;
const createForm = Form.create;
const FormItem = Form.Item;

class SystemMenu extends BaseComponent {
    state = {
        showModal: false,
        menus: [],
        gData: [],
        disableEditPath: false,
        disableEditKey: true,
        expandedKeys: [],
        isAddTopMenu: false,
        functions: [],
    };

    componentDidMount() {
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

    onDragEnter = (info) => {
        console.log(info);
        // expandedKeys 需要受控时设置
        // this.setState({
        //   expandedKeys: info.expandedKeys,
        // });
    };
    findNodeByKey = (data, key, callback) => {
        data.forEach((item, index, arr) => {
            if (item.key === key) {
                return callback(item, index, arr);
            }
            if (item.children) {
                return this.findNodeByKey(item.children, key, callback);
            }
        });
    };
    onDrop = (info) => {
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        // const dragNodesKeys = info.dragNodesKeys;
        const data = [...this.state.gData];
        let dragObj;
        this.findNodeByKey(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });
        if (info.dropToGap) {
            let ar;
            let i;
            this.findNodeByKey(data, dropKey, (item, index, arr) => {
                dragObj.parentKey = item.parentKey;
                ar = arr;
                i = index;
            });
            ar.splice(i, 0, dragObj);
        } else {
            this.findNodeByKey(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert 示例添加到尾部，可以是随意位置
                dragObj.parentKey = item.key;
                item.children.push(dragObj);
            });
        }
        this.setState({
            gData: data,
        });
    };
    handleTreeNodeClick = (selectedKeys) => {
        let data = [...this.state.gData];
        let selectedKey = selectedKeys[0];
        let selectNodeData;
        this.findNodeByKey(data, selectedKey, (item) => {
            selectNodeData = item;
        });
        if (!selectNodeData) return;
        const {setFieldsValue} = this.props.form;
        this.setState({
            disableEditPath: selectNodeData.children && selectNodeData.children.length && selectNodeData.parentKey,
            functions: selectNodeData.functions,
        })
        ;
        setFieldsValue({
            key: selectNodeData.key,
            text: selectNodeData.text,
            path: selectNodeData.path,
            icon: selectNodeData.icon,
        });
    };
    handleRightClick = (e) => {
        console.log(e.node.props.eventKey);
    };
    handleReset = (e) => {
        e.preventDefault();
        this.props.form.resetFields();
        this.setState({
            gData: convertToTree(this.state.menus),
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['key', 'text', 'icon', 'path'], (errors, values) => {
            if (!!errors) {
                return;
            }
            let data = [...this.state.gData];
            this.findNodeByKey(data, values.key, (item) => {
                item.path = values.path;
                item.icon = values.icon;
                item.text = values.text;
            });
            this.setState({
                gData: data,
            });
        });
    };
    handleSave = () => {
        let data = [...this.state.gData];
        let painData = [];
        const loop = d => d.forEach((item) => {
            painData.push({
                key: item.key,
                parentKey: item.parentKey,
                text: item.text,
                icon: item.icon,
                path: item.path,
                order: item.order,
                functions: item.functions,
            });
            if (item.children && item.children.length) {
                loop(item.children);
            }
        });
        loop(data);
        this.request()
            .post('/system/menus')
            .params({menus: painData})
            .success((/* data, res */) => {
                message.success('保存成功');
                this.setState({
                    menus: painData,
                });
            })
            .end();
    };
    handleDelete = () => {
        this.props.form.validateFields(['key'], (errors, values) => {
            if (!!errors) {
                return;
            }
            const key = values.key;
            let data = [...this.state.gData];
            let loop = (d) => {
                d.forEach((v, i, arr) => {
                    if (v.key === key) {
                        arr.splice(i, 1);
                    }
                    if (v.children && v.children.length) {
                        loop(v.children);
                    }
                });
            };
            loop(data);
            this.setState({
                gData: data,
            });
            this.props.form.resetFields();
        });
    };
    handleFunctionDelete = (functionKey) => {
        this.props.form.validateFields(['key'], (errors) => {
            if (!!errors) {
                return;
            }
            let data = [...this.state.gData];
            let loop = (d) => {
                d.forEach((v) => {
                    if (v.functions && v.functions.length) {
                        v.functions.forEach((f, index, array) => {
                            if (f.key === functionKey) {
                                array.splice(index, 1);
                            }
                        });
                    }
                    if (v.children && v.children.length) {
                        loop(v.children);
                    }
                });
            };
            loop(data);
            this.setState({
                gData: data,
            });
        });
    };
    handleAddChild = () => {
        this.props.form.validateFields(['key'], (errors, values) => {
            if (!!errors) {
                return;
            }
            const {setFieldsValue} = this.props.form;
            setFieldsValue({
                newKey: values.key,
                newText: '',
                newPath: '',
                newIcon: '',
            });
            this.setState({
                isAddTopMenu: false,
            });
            this.showModal();
        });
    };
    handleAddTopMenu = () => {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({
            newKey: '',
            newText: '',
            newPath: '',
            newIcon: '',
        });
        this.setState({
            isAddTopMenu: true,
        });
        this.showModal();
    };
    handleAddFunction = () => {
        this.props.form.validateFields(['key'], (errors) => {
            if (!!errors) {
                return;
            }
            const {setFieldsValue} = this.props.form;
            setFieldsValue({
                functionKey: '',
                functionName: '',
                functionDescription: '',
            });
            this.showFunctionModal();
        });
    }
    handleAddSubmit = () => {
        this.props.form.validateFields(['newKey', 'newText', 'newIcon', 'newPath'], (errors, values) => {
            if (!!errors) {
                return;
            }
            let data = [...this.state.gData];
            let parentKey = this.props.form.getFieldValue('key');
            let newNode = {
                parentKey,
                key: values.newKey,
                text: values.newText,
                icon: values.newIcon,
                path: values.newPath,
            };
            if (this.state.isAddTopMenu) {
                newNode.parentKey = undefined;
                data.push(newNode);
            } else {
                this.findNodeByKey(data, parentKey, (item) => {
                    if (!item.children) {
                        item.children = [];
                    }
                    item.children.push(newNode);
                });
            }

            this.setState({
                gData: data,
            });
            this.hideModal();
        });
    };
    handleAddFunctionSubmit = () => {
        this.props.form.validateFields(['functionKey', 'functionName', 'functionDescription'], (errors, values) => {
            if (!!errors) {
                return;
            }
            let data = [...this.state.gData];
            let parentKey = this.props.form.getFieldValue('key');
            let newFunction = {
                key: values.functionKey,
                name: values.functionName,
                description: values.functionDescription,
            };

            this.findNodeByKey(data, parentKey, (item) => {
                if (!item.functions) {
                    item.functions = [];
                }
                item.functions.push(newFunction);
            });

            this.setState({
                gData: data,
            });
            this.hideFunctionModal();
        });
    };

    showModal = () => {
        this.setState({showModal: true});
    };

    hideModal = () => {
        this.setState({showModal: false});
    };

    showFunctionModal = () => {
        this.setState({showFunctionModal: true});
    };

    hideFunctionModal = () => {
        this.setState({showFunctionModal: false});
    };

    nodeExists = (rule, value, callback) => {
        if (!value) {
            callback();
        } else {
            const data = [...this.state.gData];
            let isFind = false;
            this.findNodeByKey(data, value, () => {
                isFind = true;
            });
            if (isFind) {
                callback([new Error('抱歉，该key已被占用。')]);
            } else {
                callback();
            }
        }
    };
    functionExists = (rule, value, callback) => {
        if (!value) {
            callback();
        } else {
            const data = [...this.state.gData];
            let isFind = false;
            let loop = (d) => {
                d.forEach((v) => {
                    if (v.functions && v.functions.length) {
                        v.functions.forEach((f, index, array) => {
                            if (f.key === value) {
                                isFind = true;
                            }
                        });
                    }
                    if (v.children && v.children.length) {
                        loop(v.children);
                    }
                });
            };
            loop(data);

            if (isFind) {
                callback([new Error('抱歉，该key已被占用。')]);
            } else {
                callback();
            }
        }
    };

    render() {
        const loop = data => data.map((item) => {
            if (item.children && item.children.length) {
                return (
                    <TreeNode
                        key={item.key}
                        title={<span><FIcon type={item.icon}/> {item.text}</span>}
                    >
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={item.key}
                    title={<span><FIcon type={item.icon}/> {item.text}</span>}
                />
            );
        });
        const {getFieldProps} = this.props.form;

        const keyFieldProps = {
            rules: [
                {required: true, message: 'key 不能为空！'},
            ],
        };
        const newKeyFieldProps = {
            rules: [
                {required: true, message: 'key 不能为空！'},
                {validator: this.nodeExists},
            ],
        };
        const textFieldProps = {
            rules: [
                {required: true, min: 2, message: '标题至少为 2 个字符'},
            ],
        };
        const iconFieldProps = {
            rules: [
                // {required: true, min: 5, message: '用户名至少为 5 个字符'},
            ],
        };
        const pathFieldProps = {
            rules: [
                // {required: true, min: 5, message: '用户名至少为 5 个字符'},
            ],
        };

        const keyProps = getFieldProps('key', keyFieldProps);
        const newKeyProps = getFieldProps('newKey', newKeyFieldProps);

        const textProps = getFieldProps('text', textFieldProps);
        const newTextProps = getFieldProps('newText', textFieldProps);

        const iconProps = getFieldProps('icon', iconFieldProps);
        const newIconProps = getFieldProps('newIcon', iconFieldProps);

        const pathProps = getFieldProps('path', pathFieldProps);
        const newPathProps = getFieldProps('newPath', pathFieldProps);

        const functionKeyProps = getFieldProps('functionKey', {
            rules: [
                {required: true, message: 'key 不能为空！'},
                {validator: this.functionExists},
            ],
        });
        const functionNameProps = getFieldProps('functionName', {
            rules: [
                {required: true, message: '名称 不能为空！'},
            ],
        });
        const functionDescriptionProps = getFieldProps('functionDescription', {});
        if (this.state.disableEditPath) {
            pathProps.disabled = true;
        }
        if (this.state.disableEditKey) {
            keyProps.disabled = true;
        }
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 10},
        };
        return (
            <Page header={'auto'} loading={this.state.loading}>
                <Alert message="菜单存在Storage.session中，修改该保存之后，重新登陆会获取最新菜单。 菜单数据的key，唯一不可重复，有可能和权限关联，添加后不可修改。" type="warning" showIcon/>
                <Row>
                    <Col span={8} style={{textAlign: 'right'}}>
                        <div style={{textAlign: 'left', display: 'inline-block'}}>
                            <div style={{marginBottom: '10px'}}>
                                <Button type="primary" size="large" onClick={this.handleAddTopMenu}>添加顶级菜单</Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button type="primary" size="large" onClick={this.handleSave}>保存</Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button type="ghost" size="large" onClick={this.handleReset}>重置</Button>
                            </div>
                            <Tree
                                defaultExpandedKeys={this.state.expandedKeys}
                                openAnimation={{}}
                                draggable
                                onDragEnter={this.onDragEnter}
                                onDrop={this.onDrop}
                                onSelect={this.handleTreeNodeClick}
                                // onRightClick={this.handleRightClick}
                            >
                                {loop(this.state.gData)}
                            </Tree>
                        </div>
                    </Col>
                    <Col span={8}>
                        <Form horizontal form={this.props.form}>
                            <FormItem wrapperCol={{ span: 20, offset: 4 }}>
                                <Button type="primary" onClick={this.handleDelete}>删除</Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button type="ghost" onClick={this.handleAddChild}>添加子节点</Button>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="key："
                                hasFeedback
                            >
                                <Input
                                    {...keyProps}
                                    onChange={(e) => {
                                        keyProps.onChange(e);
                                        this.handleSubmit(e);
                                    }}
                                    placeholder="菜单数据的key，唯一不可重复。"
                                />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="标题："
                                hasFeedback
                            >
                                <Input
                                    {...textProps}
                                    onChange={(e) => {
                                        textProps.onChange(e);
                                        this.handleSubmit(e);
                                    }}
                                    placeholder="菜单标题，必填"
                                />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="图标："
                                hasFeedback>
                                <Input
                                    {...iconProps}
                                    onChange={(e) => {
                                        iconProps.onChange(e);
                                        this.handleSubmit(e);
                                    }}
                                    placeholder="菜单的icon，选填"
                                />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="路径："
                                hasFeedback>
                                <Input
                                    {...pathProps}
                                    onChange={(e) => {
                                        pathProps.onChange(e);
                                        this.handleSubmit(e);
                                    }}
                                    placeholder="菜单跳转路径"
                                />
                            </FormItem>
                        </Form>
                    </Col>
                    <Col span={8}>
                        <div style={{marginBottom: '25px'}}>
                            <Button
                                type="primary"
                                size="large"
                                onClick={this.handleAddFunction}
                            >
                                添加内部功能
                            </Button>
                        </div>
                        <Table
                            pagination={false}
                            columns={
                                [
                                    {
                                        title: 'key',
                                        dataIndex: 'key',
                                        key: 'key',
                                    },
                                    {
                                        title: '名称',
                                        dataIndex: 'name',
                                        key: 'name',
                                    },
                                    {
                                        title: '描述',
                                        dataIndex: 'description',
                                        key: 'description',
                                    },
                                    {
                                        title: '操作',
                                        key: 'operator',
                                        render: (text, record) => {
                                            const key = record.key;
                                            return (
                                                <Popconfirm title={`您确定要删除“${record.name}”？`} onConfirm={() => this.handleFunctionDelete(key)}>
                                                    <a href="#">删除</a>
                                                </Popconfirm>
                                            );
                                        },
                                    },
                                ]
                            }
                            dataSource={this.state.functions}
                        />
                    </Col>
                </Row>
                <Modal title="添加子节点" visible={this.state.showModal} onOk={this.handleAddSubmit} onCancel={this.hideModal}>
                    <Form horizontal form={this.props.form}>
                        <FormItem
                            {...formItemLayout}
                            label="key："
                            hasFeedback
                        >
                            <Input
                                {...newKeyProps}
                                placeholder="唯一不可重复，添加之后不可修改！"
                            />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="标题："
                            hasFeedback
                        >
                            <Input
                                {...newTextProps}
                                placeholder="菜单标题，必填"
                            />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="图标："
                            hasFeedback>
                            <Input
                                {...newIconProps}
                                placeholder="菜单的icon，选填"
                            />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="路径："
                            hasFeedback>
                            <Input
                                {...newPathProps}
                                placeholder="菜单跳转路径"
                            />
                        </FormItem>
                    </Form>
                </Modal>
                <Modal
                    title="添加功能"
                    visible={this.state.showFunctionModal}
                    onOk={this.handleAddFunctionSubmit}
                    onCancel={this.hideFunctionModal}
                >
                    <Form horizontal form={this.props.form}>
                        <FormItem
                            {...formItemLayout}
                            label="key："
                            hasFeedback
                        >
                            <Input
                                {...functionKeyProps}
                                placeholder="唯一不可重复！"
                            />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="名称："
                            hasFeedback
                        >
                            <Input
                                {...functionNameProps}
                                placeholder="功能名称"
                            />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="描述："
                            hasFeedback>
                            <Input
                                {...functionDescriptionProps}
                                placeholder="功能描述"
                            />
                        </FormItem>
                    </Form>
                </Modal>
            </Page>
        );
    }
}
export default createForm()(SystemMenu);
