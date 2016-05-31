import React from 'react';
import assign from 'object-assign';
import QueryTerms from '../../component/query-terms/QueryTerms';
import PaginationComponent from '../../component/pagination/PaginationComponent';
import Page from '../../framework/page/Page';
import BaseComponent from '../../component/BaseComponent';
import {Table, Button, Modal, Form, message, Icon, Popconfirm} from 'antd';
import SwitchRemote from '../../component/switch-remote/SwitchRemote';
import UserEdit from './UserEdit';

const createForm = Form.create;
const confirm = Modal.confirm;

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
        editingUserId: null,
        editingUser: null,
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
            render(text) {
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
            dataIndex: 'org_id',
            key: 'org_id',
            render: (text) => {
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
            title: '职位',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: '是否锁定',
            dataIndex: 'is_locked',
            key: 'is_locked',
            render: (text, record) => {
                const id = record._id;
                const isLocked = record.is_locked;
                return (
                    <SwitchRemote
                        key={id} // 一定要加这个key，否则各分页之间有干扰
                        checked={isLocked}
                        url="/organization/users/toggle_lock"
                        params={{id, isLocked}}
                        onChange={(checked) => record.is_locked = checked} // 同步record，否则下次页面重新渲染，选中状态会错乱。
                    />
                );
            },
        },
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
                const id = record._id;
                const dealing = <span style={{padding: '0px 6px'}}><Icon type="loading"/></span>;
                let deleteText = this.state.deletingId === id ? dealing : '删除';
                let editText = this.state.editingUserId === id ? dealing : '编辑';
                return (
                    <div>
                        <a href="#" onClick={() => this.handleEdit(id)}>{editText}</a>
                        <span className="ant-divider"/>
                        <Popconfirm title={`您确定要删除“${record.name}”？`} onConfirm={() => this.handleDelete(id)}>
                            <a href="#">{deleteText}</a>
                        </Popconfirm>
                    </div>
                );
            },
        },
    ];

    componentWillMount() {
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
    }

    handleSearch = (queryData = this.state.queryData) => {
        queryData.size = queryData.pageSize;
        queryData.offset = (queryData.currentPage - 1) * queryData.pageSize;
        console.log(queryData);
        this.request()
            .get('/organization/users')
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
    hideEditModal = () => {
        this.setState({
            showAddModal: false,
        });
        this.setState({
            editingUserId: null,
        });
    }
    showEditModal = () => {
        this.setState({
            showAddModal: true,
        });
    }
    handleAdd = () => {
        this.setState({
            editingUser: null,
        });
        this.showEditModal();
    }

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
    }

    handleEdit = (id) => {
        this.setState({
            editingUserId: id,
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