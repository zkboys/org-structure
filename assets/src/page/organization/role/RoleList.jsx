import React from 'react';
import assign from 'object-assign';
import {Page} from 'framework';
import BaseComponent from 'component/base-component/BaseComponent';
import QueryTerms from 'component/query-terms/QueryTerms';
import PaginationComponent from 'component/pagination/PaginationComponent';
import ToolBar from 'component/tool-bar/ToolBar';
import {Table, Button, Form, message} from 'antd';
import RoleEdit from './RoleEdit';
import Operator from 'component/operator/Operator';

const createForm = Form.create;
class RoleList extends BaseComponent {
    state = {
        queryData: {
            currentPage: 1,
            pageSize: 10,
        },
        totalCount: 0,
        tableData: [],
        showAddModal: false,
        deletingId: null,
        editingRoleId: null,
        editingRole: null,
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
                    name: 'name',
                    label: '角色名称',
                },
            ],
        ],
    };

    columns = [
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
                const id = record._id;
                const options = [
                    {
                        loading: this.state.editingId === id,
                        label: '编辑',
                        permission: 'role-update',
                        onClick: () => {
                            this.handleEdit(id);
                        },
                    },
                    {
                        loading: this.state.deletingId === id,
                        label: '删除',
                        permission: 'role-delete',
                        confirm: {
                            title: `您确定要删除“${record.name}”？`,
                        },
                        onClick: () => {
                            this.handleDelete(id);
                        },
                    },
                ];
                return (<Operator options={options}/>);
            },
        },
    ];

    componentWillMount() {
        this.handleSearch(this.state.queryData);
    }

    handleSearch = (queryData = this.state.queryData) => {
        queryData.size = queryData.pageSize;
        queryData.offset = (queryData.currentPage - 1) * queryData.pageSize;
        this.request()
            .get('/organization/roles')
            .params(queryData)
            .success((data) => {
                let tableData = data.results;
                const totalCount = data.totalCount;
                this.setState({
                    queryData,
                    tableData,
                    totalCount,
                });
            })
            .end();
    };

    hideEditModal = () => {
        this.setState({
            showAddModal: false,
        });
        this.setState({
            editingId: null,
        });
    };

    showEditModal = () => {
        this.setState({
            showAddModal: true,
        });
    };

    handleAdd = () => {
        this.setState({
            editingRole: null,
        });
        this.showEditModal();
    };

    handleDelete = (id) => {
        if (this.state.deletingId) {
            return;
        }

        this.setState({
            deletingId: id,
        });
        this.request()
            .del('/organization/roles')
            .params({id})
            .success(() => {
                message.success('删除成功！');
                this.handleSearch();
            })
            .end(() => {
                this.setState({
                    deletingId: null,
                });
            });
    };

    handleEdit = (id) => {
        this.setState({
            editingId: id,
        });
        this.request()
            .get(`/organization/roles/${id}`)
            .success((data) => {
                this.setState({
                    editingRole: data,
                });
                this.showEditModal();
            })
            .end();
    };

    render() {
        const data = this.state.tableData;
        const paginationOptions = {
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
                <ToolBar>
                    <Button type="primary" onClick={this.handleAdd}> 添加</Button>
                </ToolBar>
                <Table
                    size="middle"
                    rowKey={(record) => record._id}
                    columns={this.columns}
                    dataSource={data}
                    pagination={false}
                />
                <PaginationComponent options={paginationOptions}/>
                <RoleEdit
                    show={this.state.showAddModal}
                    showModal={this.showEditModal}
                    hideModal={this.hideEditModal}
                    onOk={this.handleSearch}
                    role={this.state.editingRole}
                />
            </Page>
        );
    }
}
export default createForm()(RoleList);
