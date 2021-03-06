import React from 'react';
import {Router} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import PubSubMsg from '../common/pubsubmsg';
import {getCurrentSidebarMenu} from './sidebar/SidebarMenuUtil';
import pageRouts from '../page/AllRoutes';

const browserHistory = createBrowserHistory();
/*
 * 根据菜单数据，初始化路由
 * */
const routes = {
    path: '/',
    component: require('./Index'),
    indexRoute: {
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../page/home/Home'));
            });
        },
    },
    childRoutes: pageRouts,
};
pageRouts.push(
    {
        path: '/system/settings',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('./settings/SettingsPage'));
            });
        },
    },
    {
        path: '*',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../page/error/Error404'));
            });
        },
    }
);

/*
 * 监听地址栏改变，通过左侧菜单状态
 * */
browserHistory.listen((/* data */) => {
    PubSubMsg.publish('current-header-menu');
    PubSubMsg.publish('set-sidebar-menus');

    let currentSidebarMenu = getCurrentSidebarMenu();
    let selectedKeys = currentSidebarMenu ? currentSidebarMenu.key : '';
    let openKeys = currentSidebarMenu ? currentSidebarMenu.parentKeys : [];
    PubSubMsg.publish('current-sidebar-menu', {
        selectedKeys,
        openKeys,
    });
    PubSubMsg.publish('set-header-breadcrumb');
});

export default function () {
    return (
        <Router
            routes={routes}
            history={browserHistory}
        />
    );
}
