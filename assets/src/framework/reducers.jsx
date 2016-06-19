import {combineReducers} from 'redux';
import assign from 'object-assign';
import headerMenus from './header/HeaderMenus';
import Settings from './settings/Settings';
import {getScrollBarWidth} from '../common/common';
import {getSidebarMenus} from './sidebar/SidebarMenuUtil';
import {
    TOGGLE_SIDEBAR,
    SET_HEADER_CURRENT_MENU,
    SET_SIDEBAR_MENUS,
    SET_SIDEBAR_MENU_STATUS,
} from './actions';
let maxWidth = 200;
let minWidth = 60;
let scrollBarWidth = getScrollBarWidth();
let isSidebarCollapsed = Settings.collapseSidebar();
let defaultState = {
    headerNav: {
        current: '1',
        headMenus: headerMenus,
    },
    sidebar: {
        isSidebarCollapsed,
        innerWidth: isSidebarCollapsed ? minWidth : maxWidth + scrollBarWidth,
        sidebarMenus: [],
        hidden: false,
        openKeys: [],
        selectedKeys: '',
        mode: '',
    },
};

export default combineReducers({
    headerNav(state = defaultState.headerNav, action) {
        let pathNames = location.pathname.split('/');
        let currentHeadMenuKey = pathNames && pathNames.length && pathNames[1];
        switch (action.type) {
            case SET_HEADER_CURRENT_MENU :// 设置头部菜单选中状态
                return assign({}, state, {
                    current: currentHeadMenuKey,
                });
            default:
                return state;
        }
    },

    sidebar(state = defaultState.sidebar, action) {
        switch (action.type) {
            case SET_SIDEBAR_MENUS :// 是否显示或者隐藏左侧菜单
                const sidebarMenus = getSidebarMenus();
                if (!sidebarMenus || !sidebarMenus.length) {
                    return assign({}, state, {
                        hidden: true,
                    });
                }
                return assign({}, state, {
                    sidebarMenus,
                    hidden: false,
                });
            case SET_SIDEBAR_MENU_STATUS:// 设置左侧菜单状态，展开状态以及选中状态
                return assign({}, state, {
                    openKeys: action.status.openKeys,
                    selectedKeys: action.status.selectedKeys,
                });
            case TOGGLE_SIDEBAR :// 展开收起左侧菜单栏
                const isCollapsed = !state.isSidebarCollapsed;
                Settings.collapseSidebar(isCollapsed);
                return assign(
                    {},
                    state,
                    {
                        isSidebarCollapsed: isCollapsed,
                        innerWidth: isCollapsed ? minWidth : maxWidth + scrollBarWidth,
                    });

            default:
                return state;
        }
    },
});
