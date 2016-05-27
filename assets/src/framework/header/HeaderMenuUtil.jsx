import headMenus from './HeaderMenus';

/**
 * 根据url获取对应的头部当行菜单数据
 * @returns {*}
 */
export const getCurrentHeaderMenuByUrl = function () {
    let pathNames = location.pathname.split('/');
    let headerMenuCurrent = null;
    if (pathNames && pathNames.length > 0) {
        headerMenuCurrent = pathNames[1];
    }
    for (let i = 0; i < headMenus.length; i++) {
        if (headerMenuCurrent === headMenus[i].key) {
            return headMenus[i];
        }
    }
    return null;
};
