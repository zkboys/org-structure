import menus from '../menus';
import {hasParent} from '../../common/common';

/**
 * 获取node中第一个含有path节点的path
 * @param node {object}
 * @returns {*}
 */
function getFirstPath(node) {
    if (node.path) return node.path;
    let firstChild;
    for (let i = 0; i < menus.length; i++) {
        let menu = menus[i];
        if (menu.parentKey === node.key) {
            firstChild = menu;
            break;
        }
    }
    if (firstChild) {
        return firstChild.path || getFirstPath(firstChild);
    }
    return null;
}

const headMenus = menus.filter((menu, index, arr) => {
    return !hasParent(arr, menu);
});
headMenus.forEach((headMenu) => {
    headMenu.path = getFirstPath(headMenu) || '/';
});

export default headMenus;

