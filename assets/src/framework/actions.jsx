export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR ';
export const SET_HEADER_CURRENT_MENU = 'SET-HEADER-CURRENT-MENU ';
export const SET_SIDEBAR_MENUS_SHOW_OR_HIDE = 'SET_SIDEBAR_MENUS_SHOW_OR_HIDE';
export const SET_SIDEBAR_MENU_STATUS = 'SET_SIDEBAR_MENU_STATUS';

export function toggleSidebar() {
    return {
        type: TOGGLE_SIDEBAR,
    };
}
export function setHeaderCurrentMenu(currentHeadMenuKey) {
    return {
        type: SET_HEADER_CURRENT_MENU,
        currentHeadMenuKey,
    };
}


export function setSidebarMenusShowOrHide(currentHeaderMenuKey) {
    return {
        type: SET_SIDEBAR_MENUS_SHOW_OR_HIDE,
        currentHeaderMenuKey,
    };
}
export function setSidebarMenuStatus(status) {
    return {
        type: SET_SIDEBAR_MENU_STATUS,
        status,
    };
}
