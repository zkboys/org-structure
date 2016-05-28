import React from 'react';
import assign from 'object-assign';
import QueryTerms from '../../component/query-terms/QueryTerms';
import PaginationComponent from '../../component/pagination/PaginationComponent';
import Page from '../../framework/page/Page';
import BaseComponent from '../../component/BaseComponent';
import {Table} from 'antd';

class UserList extends BaseComponent {
    state = {
        queryData: {
            currentPage: 1,
            pageSize: 10,
        },
        totalCount: 0,
        tableData: [],
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
            {
                type: 'input',
                name: 'name',
                label: '用户名',
            },
        ],
    }
    columns = [
        {
            title: '用户名',
            dataIndex: 'name',
            key: '1',
        },
        {
            title: '登录名',
            dataIndex: 'created',
            key: '3',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: '5',
        },
        {
            title: '电话',
            dataIndex: 'mobile',
            key: '7',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: '9',
        },
        {
            title: '头像',
            dataIndex: 'avatar',
            key: '11',
        },
        {
            title: '职位',
            dataIndex: 'position',
            key: '12',
        },
        {
            title: '所属部门',
            dataIndex: 'org_id',
            key: '13',
            render(text, record) {

            },
        },
        {
            title: '是否锁定',
            dataIndex: 'is_locked',
            key: '14',
        },
    ];

    componentWillMount() {
        this.handleSearch(this.state.queryData);
    }

    handleSearch = (queryData) => {
        queryData.size = queryData.pageSize;
        queryData.offset = (queryData.currentPage - 1) * queryData.pageSize;
        console.log(queryData);
        this.request()
            .get('/organization/users')
            .params(queryData)
            .success((data) => {
                console.log(data);
                return;
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
                <Table
                    columns={this.columns}
                    dataSource={data}
                    pagination={false}
                />
                <PaginationComponent options={paginationOptions}/>
            </Page>
        );
    }
}
export default UserList;
