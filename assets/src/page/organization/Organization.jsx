import React from 'react';
import {Button, Form, Input, Tree, Row, Col, Modal, message} from 'antd';
import BaseComponent from '../../component/BaseComponent';
import Page from '../../framework/page/Page';
import {convertToTree} from '../../common/common';
import FIcon from '../../component/faicon/FAIcon';

const TreeNode = Tree.TreeNode;
const createForm = Form.create;
const FormItem = Form.Item;

class Organization extends BaseComponent {
    state = {
        showModal: false,
        organizations: [],
        gData: [],
        disableEditRemark: false,
        disableEditKey: true,
        expandedKeys: [],
        isAddTopOrg: false,
    };

    componentDidMount() {
        this.request()
            .get('/organizations')
            .success((data) => {
                if (data && data.length) {
                    let organizations = data.map(v => {
                        v.text = v.name;
                        return v;
                    });
                    this.setState({
                        organizations,
                        gData: convertToTree(organizations),
                    });
                }
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
            console.log(dragObj);
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
        console.log(selectedKey);
        let data = [...this.state.gData];
        let selectedKey = selectedKeys[0];
        let selectNodeData;
        this.findNodeByKey(data, selectedKey, (item) => {
            selectNodeData = item;
        });
        if (!selectNodeData) return;
        console.log(selectNodeData);
        const {setFieldsValue} = this.props.form;
        this.setState({
            disableEditRemark: selectNodeData.children && selectNodeData.children.length && selectNodeData.parentKey,
        });
        setFieldsValue({
            key: selectNodeData.key,
            text: selectNodeData.text,
            remark: selectNodeData.remark,
            description: selectNodeData.description,
        });
    };
    handleRightClick = (e) => {
        console.log(e.node.props.eventKey);
    };
    handleReset = (e) => {
        e.preventDefault();
        this.props.form.resetFields();
        this.setState({
            gData: convertToTree(this.state.organizations),
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(['key', 'text', 'description', 'remark'], (errors, values) => {
            if (!!errors) {
                return;
            }
            let data = [...this.state.gData];
            this.findNodeByKey(data, values.key, (item) => {
                item.remark = values.remark;
                item.description = values.description;
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
                name: item.text,
                description: item.description,
                remark: item.remark,
            });
            if (item.children && item.children.length) {
                loop(item.children);
            }
        });
        loop(data);
        this.request()
            .post('/organizations')
            .params({organizations: painData})
            .success((/* data, res */) => {
                message.success('保存成功');
                this.setState({
                    organizations: painData,
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
    handleAddTopOrg = () => {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({
            newText: '',
            newRemark: '',
            newDescription: '',
        });
        this.setState({
            isAddTopOrg: true,
        });
        this.showModal();
    };
    handleAddChild = () => {
        this.props.form.validateFields(['key', 'text'], (errors, values) => {
            if (!!errors) {
                message.info('请先选择一个组织');
                return;
            }
            const {setFieldsValue} = this.props.form;
            setFieldsValue({
                newText: '',
                newRemark: '',
                newDescription: '',
            });
            this.setState({
                isAddTopOrg: false,
            });
            this.showModal();
        });
    };
    handleModalOk = () => {
        this.props.form.validateFields(['newText', 'newDescription', 'newRemark'], (errors, values) => {
            if (!!errors) {
                return;
            }
            let data = [...this.state.gData];
            let parentKey = this.props.form.getFieldValue('key');
            const newNode = {
                parentKey,
                key: String(new Date().getTime()),
                text: values.newText,
                description: values.newDescription,
                remark: values.newRemark,
            };
            if (this.state.isAddTopOrg) {
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
            console.log(data);
            this.setState({
                gData: data,
            });
            this.hideModal();
        });
    };

    showModal = () => {
        this.setState({showModal: true});
    };

    hideModal = () => {
        this.setState({showModal: false});
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

    render() {
        const loop = data => data.map((item) => {
            if (item.children && item.children.length) {
                return (
                    <TreeNode
                        key={item.key}
                        title={<span><FIcon type={item.description}/> {item.text}</span>}
                    >
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return (
                <TreeNode
                    key={item.key}
                    title={<span><FIcon type={item.description}/> {item.text}</span>}
                />
            );
        });
        const {getFieldProps} = this.props.form;

        const keyFieldProps = {
            rules: [
                {required: true, message: 'key 不能为空！'},
            ],
        };
        const textFieldProps = {
            rules: [
                {required: true, min: 2, message: '标题至少为 2 个字符'},
            ],
        };
        const descriptionFieldProps = {
            rules: [
                // {required: true, min: 5, message: '用户名至少为 5 个字符'},
            ],
        };
        const remarkFieldProps = {
            rules: [
                // {required: true, min: 5, message: '用户名至少为 5 个字符'},
            ],
        };

        const keyProps = getFieldProps('key', keyFieldProps);

        const textProps = getFieldProps('text', textFieldProps);
        const newTextProps = getFieldProps('newText', textFieldProps);

        const descriptionProps = getFieldProps('description', descriptionFieldProps);
        const newDescriptionProps = getFieldProps('newDescription', descriptionFieldProps);

        const remarkProps = getFieldProps('remark', remarkFieldProps);
        const newRemarkProps = getFieldProps('newRemark', remarkFieldProps);

        if (this.state.disableEditRemark) {
            remarkProps.disabled = true;
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
                <Row>
                    <Col span={12} style={{textAlign: 'right'}}>
                        <div style={{textAlign: 'left', display: 'inline-block'}}>
                            <div style={{marginBottom: '10px'}}>
                                <Button type="primary" size="large" onClick={this.handleAddTopOrg}>添加顶级组织</Button>
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
                    <Col span={12}>
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
                                style={{display: 'none'}}
                            >
                                <Input
                                    {...keyProps}
                                    onChange={(e) => {
                                        keyProps.onChange(e);
                                        this.handleSubmit(e);
                                    }}
                                    placeholder="唯一不可重复。"
                                />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="名称："
                                hasFeedback
                            >
                                <Input
                                    {...textProps}
                                    onChange={(e) => {
                                        textProps.onChange(e);
                                        this.handleSubmit(e);
                                    }}
                                    placeholder="请输入组织名称"
                                />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="描述："
                                hasFeedback>
                                <Input
                                    {...descriptionProps}
                                    onChange={(e) => {
                                        descriptionProps.onChange(e);
                                        this.handleSubmit(e);
                                    }}
                                    placeholder="请输入组织描述"
                                />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="备注："
                                hasFeedback>
                                <Input
                                    {...remarkProps}
                                    onChange={(e) => {
                                        remarkProps.onChange(e);
                                        this.handleSubmit(e);
                                    }}
                                    placeholder="请输入备注"
                                />
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                <Modal title="添加子组织" visible={this.state.showModal} onOk={this.handleModalOk} onCancel={this.hideModal}>
                    <Form horizontal form={this.props.form}>
                        <FormItem
                            {...formItemLayout}
                            label="名称："
                            hasFeedback
                        >
                            <Input
                                {...newTextProps}
                                placeholder="请输入组织名称"
                            />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="描述："
                            hasFeedback>
                            <Input
                                {...newDescriptionProps}
                                placeholder="请输入组织描述"
                            />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="备注："
                            hasFeedback>
                            <Input
                                {...newRemarkProps}
                                placeholder="请输入备注"
                            />
                        </FormItem>
                    </Form>
                </Modal>
            </Page>
        );
    }
}
export default createForm()(Organization);
