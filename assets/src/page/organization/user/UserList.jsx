import React from 'react';
import assign from 'object-assign';
import Page from 'framework/page/Page';
import BaseComponent from 'component/base-component/BaseComponent';
import QueryTerms from 'component/query-terms/QueryTerms';
import PaginationComponent from 'component/pagination/PaginationComponent';
import SwitchRemote from 'component/switch-remote/SwitchRemote';
import ToolBar from 'component/tool-bar/ToolBar';
import {Table, Button, Form, message} from 'antd';
import UserEdit from './UserEdit';
import {hasPermission} from 'common/common';
import Operator from 'component/operator/Operator';

const createForm = Form.create;

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
        toggleLockingId: null,
        deletingId: null,
        resetingId: null,
        editingId: null,
        editingUser: null,
        roles: [],
        showAddBtn: hasPermission('user-add'),
        showToggleLock: hasPermission('user-toggle-lock'),
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
            ],
        ],
    };

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
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            render: (text) => {
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
            title: '电话',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '所属部门',
            dataIndex: 'org_key',
            key: 'org_key',
            render: (text) => {
                let orgName = '未指定';
                for (let org of this.state.organizations) {
                    if (org.key === text) {
                        orgName = org.name;
                        break;
                    }
                }
                return orgName;
            },
        },
        {
            title: '职位',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: '角色',
            dataIndex: 'role_id',
            key: 'role',
            render: (text) => {
                const role = this.state.roles.find((r) => {
                    return r._id === text;
                });
                if (role) {
                    return role.name;
                }
                return '未指定';
            },
        },
        {
            title: '是否锁定',
            dataIndex: 'is_locked',
            key: 'is_locked',
            render: (text, record) => {
                if (record.loginname === 'admin') { // 硬编码，管理员不可锁定
                    return '';
                }
                const id = record._id;
                let disabled = !this.state.showToggleLock;
                return (
                    <SwitchRemote
                        key={id} // 一定要加这个key，否则各分页之间有干扰
                        checked={record.is_locked}
                        disabled={disabled}
                        checkedKey="isLocked"
                        url="/organization/users/toggle_lock"
                        params={{id}}
                        onChange={(checked) => record.is_locked = checked} // 同步record，否则下次页面重新渲染，选中状态会错乱。
                    />
                );
            },
        },
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
                if (record.loginname === 'admin') { // 硬编码，管理员不可锁定
                    return '';
                }
                const id = record._id;
                const options = [
                    {
                        loading: this.state.editingId === id,
                        label: '编辑',
                        permission: 'user-update',
                        onClick: () => {
                            this.handleEdit(id);
                        },
                    },
                    {
                        loading: this.state.deletingId === id,
                        label: '删除',
                        permission: 'user-delete',
                        confirm: {
                            title: `您确定要删除“${record.name}”？`,
                        },
                        onClick: () => {
                            this.handleDelete(id);
                        },
                    },
                    {
                        loading: this.state.resetingId === id,
                        label: '重置密码',
                        permission: 'user-reset-pass',
                        confirm: {
                            title: `您确定要重置“${record.name}”的密码吗？`,
                        },
                        onClick: () => {
                            this.handleResetPass(id);
                        },
                    },
                ];
                return (<Operator options={options}/>);
            },
        },
    ];

    componentWillMount() {
        // console.log(this.currentUser.hasPermission('user-update'));
        this.handleSearch(this.state.queryData);
        this.request()
            .get('/organization/organizations')
            .success((data) => {
                if (data && data.length) {
                    this.setState({
                        organizations: data,
                    });
                }
            })
            .end();
        this.request()
            .get('/organization/roles')
            .success((result) => {
                const roles = result.results;
                if (roles && roles.length) {
                    this.setState({
                        roles,
                    });
                }
            })
            .end();
    }

    handleSearch = (queryData = this.state.queryData) => {
        queryData.size = queryData.pageSize;
        queryData.offset = (queryData.currentPage - 1) * queryData.pageSize;
        this.request()
            .get('/organization/users')
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
            editingUser: null,
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
            .del('/organization/users')
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
    handleResetPass = (id) => {
        if (this.state.resetingId) {
            return;
        }

        this.setState({
            resetingId: id,
        });
        this.request()
            .put('/organization/users/reset_pass')
            .params({id})
            .success(() => {
                message.success('重置成功！');
                this.handleSearch();
            })
            .end(() => {
                this.setState({
                    resetingId: null,
                });
            });
    };

    handleEdit = (id) => {
        this.setState({
            editingId: id,
        });
        this.request()
            .get(`/organization/users/${id}`)
            .success((data) => {
                this.setState({
                    editingUser: data,
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
            <Page loading={this.state.loading}>
                <QueryTerms options={this.queryOptions}/>
                <ToolBar style={{display: this.state.showAddBtn ? 'block' : 'none'}}>
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
                <UserEdit
                    show={this.state.showAddModal}
                    showModal={this.showEditModal}
                    hideModal={this.hideEditModal}
                    onOk={this.handleSearch}
                    user={this.state.editingUser}
                />
            </Page>
        );
    }
}
export default createForm()(UserList);
