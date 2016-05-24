import './style.less';
import React from 'react';
import {Breadcrumb, Button} from 'antd'
import {Link} from 'react-router'
import error404 from './404.png'

export default React.createClass({
    render() {
        return (
            <div className="error-wrap">
                <img src={error404} alt="404图片"/>
                <p className="error-text">您访问的页面不存在...</p>
                <Button type="primary" className="error-btn" onClick={()=>{this.props.history.goBack()}}><a href="javascript:;">返回上一级</a></Button>
                <Button type="primary" className="error-btn error-btn-right"> <Link to="/">返回首页</Link></Button>
            </div>
        );
    }
});
