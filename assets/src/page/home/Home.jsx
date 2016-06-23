import './style.css';
import React from 'react';
import { Breadcrumb } from 'antd';
import BaseComponent from 'component/base-component/BaseComponent';
import Page from 'framework/page/Page';

class Home extends BaseComponent {
    state = {
        loading: false,
    }

    render() {
        return (
            <Page title="首页" breadcrumb="" loading={this.state.loading}>
                <h1>首页</h1>
                <p>测试缓存啊</p>
                <p>这个坑啊 </p>
                <p>文件每次会不会有改动，这个哪个啥文什么呢？开发模式，和生产模式还不一样．开发模式生成的文件不会添加hash</p>
            </Page>
        );
    }

}
export default Home;
