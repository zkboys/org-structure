import {combineReducers} from 'redux';
import assign from 'object-assign';
import headerMenus from './header/HeaderMenus';
import Settings from './settings/Settings';
import {getScrollBarWidth} from '../common/common';
import {getSidebarMenus} from './sidebar/SidebarMenuUtil';
import {
    TOGGLE_SIDEBAR,
    SET_HEADER_CURRENT_MENU,
    SET_SIDEBAR_MENUS_SHOW_OR_HIDE,
    SET_SIDEBAR_MENU_STATUS,
} from './actions';

let minLogo = 'super';
let maxLogo = '超级管理系统';
let maxWidth = 200;
let minWidth = 60;
let scrollBarWidth = getScrollBarWidth();
let isSidebarCollapsed = Settings.collapseSidebar();
let collapsedStyle = {// 收起的
    headerLogoWidth: minWidth,
    headerLogo: minLogo,
    sidebarStyle: {width: minWidth, overflow: 'visible'},
    sidebarInnerStyle: {width: minWidth, overflow: 'visible'},
    sidebarMode: 'vertical',
    centerLeft: minWidth,
    isSidebarCollapsed: true,
};
let expandedStyle = {// 展开的
    headerLogoWidth: maxWidth,
    headerLogo: maxLogo,
    sidebarStyle: {width: maxWidth, overflow: 'hidden'},
    sidebarInnerStyle: {width: (maxWidth + scrollBarWidth), overflowY: 'scroll'},
    sidebarMode: 'inline',
    centerLeft: maxWidth,
    isSidebarCollapsed: false,
};

let defaultState = {
    style: isSidebarCollapsed ? collapsedStyle : expandedStyle,
    headerNav: {
        current: '1',
        headMenus: headerMenus,
    },
    sidebar: {
        hidden: false,
        openKeys: [],
        selectedKeys: '',
        mode: '',
    },
};

export default combineReducers({

    style(state = defaultState.style, action) {
        switch (action.type) {
        case TOGGLE_SIDEBAR :// 展开收起左侧菜单栏
            Settings.collapseSidebar(!state.isSidebarCollapsed);
            return assign({}, state, !state.isSidebarCollapsed ? collapsedStyle : expandedStyle);
        default:
            return state;
        }
    },

    headerNav(state = defaultState.headerNav, action) {
        switch (action.type) {
        case SET_HEADER_CURRENT_MENU :// 设置头部菜单选中状态
            return assign({}, state, {
                current: action.currentHeadMenuKey,
            });
        default:
            return state;
        }
    },

    sidebar(state = defaultState.sidebar, action) {
        const sideBarMenu = getSidebarMenus();
        switch (action.type) {
        case SET_SIDEBAR_MENUS_SHOW_OR_HIDE :// 是否显示或者隐藏左侧菜单
            if (!action.currentHeaderMenuKey || !sideBarMenu || !sideBarMenu.length) {
                return assign({}, state, {
                    hidden: true,
                });
            }
            return assign({}, state, {
                hidden: false,
            });
        case SET_SIDEBAR_MENU_STATUS:// 设置左侧菜单状态，展开状态以及选中状态
            return assign({}, state, {
                openKeys: action.status.openKeys,
                selectedKeys: action.status.selectedKeys,
            });
        default:
            return state;
        }
    },
});
