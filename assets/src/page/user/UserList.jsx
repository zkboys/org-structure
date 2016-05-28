import React from 'react';
import assign from 'object-assign';
import QueryTerms from '../../component/query-terms/QueryTerms';
import PaginationComponent from '../../component/pagination/PaginationComponent';
import Page from '../../framework/page/Page';
import BaseComponent from '../../component/BaseComponent';
import {Table, Button, Modal, Form, Input, Radio, Icon, TreeSelect} from 'antd';
import ValidationRule from '../../common/validation-rule';
import {convertToTree} from '../../common/common';
import UserEdit from './UserEdit';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class UserList extends BaseComponent {
    state = {
        queryData: {
            currentPage: 1,
            pageSize: 10,
        },
        organizations: [],
        totalCount: 0,
        tableData: [],
        showAddModal: false,
    };
    queryOptions = {
        showSearchBtn: true,
        onSubmit: (data) => {
            let queryData = assign({}, this.state.queryData, data, {currentPage: 1});
            this.setState({
                queryData,
            });
            this.handleSearch(queryData);
        },
        items: [
            [
                {
                    type: 'input',
                    name: 'loginname',
                    label: '登录名',
                },
                {
                    type: 'input',
                    name: 'name',
                    label: '用户名',
                },
                {
                    type: 'input',
                    name: 'mobile',
                    label: '电话',
                },
            ]
        ],
    }
    columns = [
        {
            title: '登录名',
            dataIndex: 'loginname',
            key: 'loginname',
        },
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '电话',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            render(text, record) {
                let gender = '未填写';
                if (text === 'male') {
                    gender = '男';
                }
                if (text === 'female') {
                    gender = '女';
                }
                return gender;
            },
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            key: 'avatar',
        },
        {
            title: '职位',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: '所属部门',
            dataIndex: 'org_id',
            key: 'org_id',
            render: (text, record) => {
                let orgName = '未指定';
                for (let org of this.state.organizations) {
                    if (org._id === text) {
                        orgName = org.name;
                        break;
                    }
                }
                return orgName;
            },
        },
        {
            title: '是否锁定',
            dataIndex: 'is_locked',
            key: 'is_locked',
            render(text, record) {
                return text ? '是' : '否';
            },
        },
        {
            title: '操作',
            key: 'operator',
            render(text, record) {
                return (
                    <div>
                        <a href="#">编辑</a> | <a href="#">删除</a> | <a href="#">锁定</a>
                    </div>
                );
            },
        },
    ];

    componentWillMount() {
        this.handleSearch(this.state.queryData);
        this.request()
            .get('/api/organization/organizations')
            .success((data) => {
                if (data && data.length) {
                    this.setState({
                        organizations: data,
                    });
                }
            })
            .end();
    }

    handleSearch = (queryData) => {
        this.hideAddModal();
        queryData.size = queryData.pageSize;
        queryData.offset = (queryData.currentPage - 1) * queryData.pageSize;
        console.log(queryData);
        this.request()
            .get('/api/organization/users')
            .params(queryData)
            .success((data, res) => {
                console.log(data, res);
                let tableData = data.results.map((v, i) => {
                    if (v.key === undefined) {
                        v.key = i;
                    }
                    return v;
                });
                const totalCount = data.totalCount;
                this.setState({
                    queryData,
                    tableData,
                    totalCount,
                });
            })
            .end();
    };
    hideAddModal = () => {
        this.setState({
            showAddModal: false,
        });
    }
    showAddModal = () => {
        this.setState({
            showAddModal: true,
        });
    }
    handleAdd = () => {
        this.showAddModal();
    }

    render() {
        const data = this.state.tableData;
        const paginationOptions = {
            showSizeChanger: true,
            showQuickJumper: true,
            showMessage: true,
            pageSize: this.state.queryData.pageSize,
            currentPage: this.state.queryData.currentPage,
            totalCount: this.state.totalCount,
            onChange: (currentPage, pageSize) => {
                let queryData = assign({}, this.state.queryData, {currentPage, pageSize});
                this.setState({
                    queryData,
                });
                this.handleSearch(queryData);
            },
        };
        return (
            <Page header={'auto'} loading={this.state.loading}>
                <QueryTerms options={this.queryOptions}/>
                <div className="toolbar-top">
                    <Button type="primary" size="large" onClick={this.handleAdd}> 添加</Button>
                </div>
                <Table
                    columns={this.columns}
                    dataSource={data}
                    pagination={false}
                />
                <PaginationComponent options={paginationOptions}/>
                <UserEdit show={this.state.showAddModal}/>
            </Page>
        );
    }
}
export default createForm()(UserList);
