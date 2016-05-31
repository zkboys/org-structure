import React from 'react';
import PaginationComponent from './PaginationComponent';

class Demo extends React.Component {
    state = {
        currentPage: 1,
        pageSize: 10,
    };

    render() {
        let pageSize = this.state.pageSize;
        let currentPage = this.state.currentPage;
        let options = {
            showSizeChanger: true, // 默认true
            showQuickJumper: true, // 默认true
            showMessage: true, // 默认 true
            pageSize,
            currentPage,
            totalCount: 100,
            onChange: (currentPage, pageSize) => {
                this.setState({
                    currentPage,
                    pageSize,
                });
                console.log(currentPage, pageSize);
            },
        };
        return (
            <PaginationComponent options={options}/>
        );
    }
}
export default Demo;
