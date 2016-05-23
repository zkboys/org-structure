import React from 'react';
import { Button, Form, Input, Tree, Row, Col} from 'antd';
import BaseComponent from '../../component/BaseComponent';
import Page from '../../framework/page/Page';
import menus from '../../framework/menus';
import {convert} from '../../framework/sidebar/SidebarMenuUtil';
import FIcon from '../../component/faicon/FAIcon'

const TreeNode = Tree.TreeNode;
const createForm = Form.create;
const FormItem = Form.Item;

class SystemMenu extends BaseComponent {
    state = {
        menus: [],
        gData: [],
        disableEditPath: false,
        disableEditKey: true,
        expandedKeys: [],
    };

    componentDidMount() {
        let menusData = menus;//TODO 这个menus需要通过ajax请求，实时请求后台数据。
        this.setState({
            menus: menusData,
            gData: convert(menusData),
        })

    };

    onDragEnter = (info)=> {
        //console.log(info);
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
    onDrop = (info)=> {
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
    handleTreeNodeClick = (selectedKeys, e)=> {
        let data = [...this.state.gData];
        let selectedKey = selectedKeys[0];
        let selectNodeData;
        this.findNodeByKey(data, selectedKey, (item, index, arr) => {
            selectNodeData = item;
        });
        if (!selectNodeData) return;
        console.log(selectNodeData);
        const { setFieldsValue} = this.props.form;
        this.setState({
            disableEditPath: selectNodeData.children && selectNodeData.children.length && selectNodeData.parentKey,
        });
        setFieldsValue({
            key: selectNodeData.key,
            text: selectNodeData.text,
            path: selectNodeData.path,
            icon: selectNodeData.icon,
        })
    };
    handleRightClick = (e)=> {
        console.log(e.node.props.eventKey);
    };
    handleReset = (e)=> {
        e.preventDefault();
        this.props.form.resetFields();
        this.setState({
            gData: convert(this.state.menus),
        })
    };

    handleSubmit = (e)=> {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }
            let data = [...this.state.gData];
            this.findNodeByKey(data, values.key, (item)=> {
                item.path = values.path;
                item.icon = values.icon;
                item.text = values.text;
            });
            this.setState({
                gData: data,
            });
        });
    };
    handleSave = ()=> {
        let data = [...this.state.gData];
        let painData = [];
        const loop = data => data.forEach((item) => {
            painData.push({
                key: item.key,
                parentKey: item.parentKey,
                text: item.text,
                icon: item.icon,
                path: item.path,
                order: item.order,
            });
            if (item.children && item.children.length) {
                loop(item.children)
            }
        });
        loop(data);
        //TODO 发起ajax请求，保存成功之后
        this.setState({
            menus: painData,
        });
        console.log(painData);
    };
    handleDelete = ()=> {
        alert('delete');
    };
    handleAddChild = ()=> {
        alert('addChild');
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
        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
        const keyProps = getFieldProps('key', {
            rules: [],
        });
        const textProps = getFieldProps('text', {
            rules: [
                {required: true, min: 2, message: '标题至少为 2 个字符'},
            ],
        });
        const iconProps = getFieldProps('icon', {
            rules: [
                //{required: true, min: 5, message: '用户名至少为 5 个字符'},
            ],
        });
        const pathProps = getFieldProps('path', {
            rules: [
                //{required: true, min: 5, message: '用户名至少为 5 个字符'},
            ],
        });
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
                <Row>
                    <Col span={6}>
                        <Tree
                            defaultExpandedKeys={this.state.expandedKeys}
                            openAnimation={{}}
                            draggable
                            onDragEnter={this.onDragEnter}
                            onDrop={this.onDrop}
                            onSelect={this.handleTreeNodeClick}
                            //onRightClick={this.handleRightClick}
                        >
                            {loop(this.state.gData)}
                        </Tree>
                    </Col>
                    <Col span={18}>
                        <Form horizontal form={this.props.form}>
                            <FormItem
                                {...formItemLayout}
                                label="key："
                                hasFeedback
                            >
                                <Input
                                    {...keyProps}
                                    onChange={(e)=>{
                                        keyProps.onChange(e);
                                        this.handleSubmit(e);
                                    }}
                                    placeholder="菜单数据的key，唯一不可重复"
                                />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="标题："
                                hasFeedback
                            >
                                <Input
                                    {...textProps}
                                    onChange={(e)=>{
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
                                    onChange={(e)=>{
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
                                    onChange={(e)=>{
                                        pathProps.onChange(e);
                                        this.handleSubmit(e);
                                    }}
                                    placeholder="菜单跳转路径"
                                />
                            </FormItem>

                            <FormItem wrapperCol={{ span: 20, offset: 4 }}>
                                <Button type="primary" onClick={this.handleDelete}>删除</Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button type="ghost" onClick={this.handleAddChild}>添加子节点</Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button type="primary" onClick={this.handleSave}>保存</Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button type="ghost" onClick={this.handleReset}>重置</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </Page>
        )
    }
}
SystemMenu = createForm()(SystemMenu);
export default SystemMenu;