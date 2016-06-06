import React from 'react';
import {Breadcrumb, Spin} from 'antd';
import {Link} from 'react-router';
import {getCurrentSidebarMenu} from '../sidebar/SidebarMenuUtil';
import Settings from '../settings/Settings';
import PubSubMsg from '../../common/pubsubmsg';
class Page extends React.Component {
    state = {
        pageHeader: '',
        showPageAnimate: Settings.pageAnimate(),
    };
    static defaultProps = {
        loading: false,
        animConfig: [
            {opacity: [1, 0], translateY: [0, 50]},
            {opacity: [1, 0], translateY: [0, -50]},
        ],
    };

    getPageHeaderDateByMenu() {
        let currentMenu = getCurrentSidebarMenu();
        let parentText = currentMenu ? currentMenu.parentText : [];
        let title = currentMenu ? currentMenu.text : '';
        let breadcrumbItems = [];
        for (let i = 0; i < parentText.length; i++) {
            breadcrumbItems.push({text: parentText[i]});
        }
        breadcrumbItems.push({text: title});
        return {
            title,
            breadcrumbItems,
        };
    }

    setPageHeader() {
        let pageHeaderJsx = '';
        let pageHeaderDate = null;
        if (this.props.header === 'auto') {
            pageHeaderDate = this.getPageHeaderDateByMenu();
        } else if (typeof this.props.header === 'object') {
            if (this.props.header.title || this.props.header.breadcrumbItems) {
                pageHeaderDate = {};
                if (this.props.header.title === 'auto') {
                    pageHeaderDate.title = this.getPageHeaderDateByMenu().title;
                } else if (this.props.header.title) {
                    pageHeaderDate.title = this.props.header.title;
                } else {
                    pageHeaderDate.title = ' ';
                }
                if (this.props.header.breadcrumbItems === 'auto') {
                    pageHeaderDate.breadcrumbItems = this.getPageHeaderDateByMenu().breadcrumbItems;
                } else if (this.props.header.breadcrumbItems) {
                    pageHeaderDate.breadcrumbItems = this.props.header.breadcrumbItems;
                } else {
                    pageHeaderDate.breadcrumbItems = '';
                }
            } else {
                pageHeaderJsx = (
                    <div className="admin-page-header">
                        {this.props.header}
                    </div>
                );
            }
        }
        if (pageHeaderDate) {
            let breadcrumbItems = [];
            let items = pageHeaderDate.breadcrumbItems;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let key = `page-breadcrumb-item${i}`;
                breadcrumbItems.push(
                    item.path ? <Breadcrumb.Item key={key}><Link to={item.path}>{item.text}</Link></Breadcrumb.Item>
                        : <Breadcrumb.Item key={key}>{item.text}</Breadcrumb.Item>
                );
            }
            let breadcrumb = '';
            if (pageHeaderDate.breadcrumbItems) {
                breadcrumb = (
                    <Breadcrumb>
                        {breadcrumbItems}
                    </Breadcrumb>
                );
            }
            pageHeaderJsx = (
                <div className="admin-page-header">
                    <h1 className="admin-page-header-title">{pageHeaderDate.title}</h1>
                    {breadcrumb}
                </div>
            );
        }
        this.setState({
            pageHeader: pageHeaderJsx,
        });
    }

    componentWillMount() {

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
