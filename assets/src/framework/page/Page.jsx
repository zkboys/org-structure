import React from 'react';
import {Breadcrumb, Spin} from 'antd';
import {Link} from 'react-router';
import {getCurrentSidebarMenu} from '../sidebar/SidebarMenuUtil';
import PubSubMsg from '../../common/pubsubmsg';
class Page extends React.Component {
    state = {
        pageHeader: '',
    };
    static defaultProps = {
        loading: false,
    };
    static propTypes = {
        title: React.PropTypes.string,
        breadcrumb: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.string,
        ]),
    };

    getPageHeaderDateByMenu() {
        let currentMenu = getCurrentSidebarMenu();
        let parentText = currentMenu ? currentMenu.parentText : [];
        let title = currentMenu ? currentMenu.text : '';
        let path = currentMenu ? currentMenu.path : '';
        let breadcrumbItems = [];
        for (let i = 0; i < parentText.length; i++) {
            breadcrumbItems.push({text: parentText[i]});
        }
        breadcrumbItems.push({text: title, path});
        return {
            title,
            breadcrumbItems,
        };
    }

    setPageHeader() {
        let pageHeaderJsx = '';
        let title = '';
        let breadcrumb = '';
        if (this.props.title) {
            title = this.props.title;
        } else if (this.props.title === '') { // 传入空字符串，表示没有title
            title = '';
        } else { // 默认自动获取
            title = this.getPageHeaderDateByMenu().title;
        }

        if (this.props.breadcrumb) {
            breadcrumb = this.props.breadcrumb;
        } else if (this.props.breadcrumb === '') {
            breadcrumb = '';
        } else { // 默认自动获取
            breadcrumb = this.getPageHeaderDateByMenu().breadcrumbItems;
        }

        let breadcrumbJsx = '';
        if (breadcrumb && breadcrumb.length) {
            const lastOne = breadcrumb[breadcrumb.length - 1];
            if (lastOne.text !== title && title) {
                breadcrumb.push({
                    text: title,
                });
            }
            let breadcrumbItems = [];
            for (let i = 0; i < breadcrumb.length; i++) {
                let item = breadcrumb[i];
                let key = `page-breadcrumb-item${i}`;
                let breadJxs = '';
                if (item.path) {
                    breadJxs = <Breadcrumb.Item key={key}><Link to={item.path}>{item.text}</Link></Breadcrumb.Item>;
                } else {
                    breadJxs = <Breadcrumb.Item key={key}>{item.text}</Breadcrumb.Item>;
                }
                breadcrumbItems.push(breadJxs);
            }
            breadcrumbJsx = (
                <Breadcrumb>
                    {breadcrumbItems}
                </Breadcrumb>
            );
        }
        if (title || breadcrumbJsx) {
            pageHeaderJsx = (
                <div className="admin-page-header">
                    <h1 className="admin-page-header-title">{title}</h1>
                    {breadcrumbJsx}
                </div>
            );
        }
        this.setState({
            pageHeader: pageHeaderJsx,
        });
    }

    componentDidMount() {
        if (super.componentDidMount) {
            super.componentDidMount();
        }
        PubSubMsg.subscribeOnceAcceptOldMsg('set-header-breadcrumb', () => {
            this.setPageHeader();
        });
    }

    render() {
        let pageChildren = (
            <div>
                {this.state.pageHeader}
                {this.props.children}
            </div>
        );
        return (
            <div className={"admin-page "}>
                <Spin spinning={this.props.loading}>
                    {pageChildren}
                </Spin>
            </div>
        );
    }
}

export default Page;
