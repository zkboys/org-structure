import React from 'react';
import {Link} from 'react-router'
import assign from 'object-assign';
import {Menu, Tooltip, Icon} from 'antd';
import FAIcon from '../../component/faicon/FAIcon';
import Settings from './../settings/Settings';
import menus from '../menus';
import {getCurrentHeaderMenuByUrl} from '../header/HeaderMenuUtil'
import {convertToTree} from '../../common/common'

const SubMenu = Menu.SubMenu;

function getCurrentSidebarMenu() {
    let currentPath = location.pathname;
    let headMenu = getCurrentHeaderMenuByUrl();
    let menusTree = convertToTree(menus, headMenu);
    while (menusTree && menusTree.length) {
        // 处理一个，头部弹出一个。
        let node = menusTree.shift();
        if (node.path == currentPath) {
            return node;
        }
        if (node.children) {
            node.children.forEach((v)=> {
                menusTree.push(v);
            })
        }
    }
}
function getSidebarMenus() {
    let headMenu = getCurrentHeaderMenuByUrl();
    if (!headMenu) {
        return []
    }
    let menusTree = convertToTree(menus, headMenu);
    return menusTree && menusTree.map(getMenuJsx);
}

function getMenuJsx(node) {
    const min = !!Settings.collapseSidebar();
    const key = node.key;
    const path = node.path;
    const icon = node.icon;
    const text = node.text;
    if (node.children) {
        return (
            <SubMenu key={key} title={<span><FAIcon type={icon} /><span>{text}</span></span>}>
                {node.children.map(getMenuJsx)}
            </SubMenu>
        );
    } else {
        let item = <Link to={path} activeClassName="active"><FAIcon type={icon}/><span>{text}</span></Link>;
        if (min && node.parentKeys.length === 1) { // FIXME 这个判断有些不好。
            item =
                <Tooltip placement="right" title={<Link to={path} activeClassName="active" style={{color:'#fff'}}><span>{text}</span></Link>}>
                    <Link to={path} activeClassName="active">
                        <FAIcon type={icon}/><span>{text}</span>
                    </Link>
                </Tooltip>;
        }
        return (
            <Menu.Item key={key}>
                {item}
            </Menu.Item>
        );
    }
}

export {getSidebarMenus, getCurrentSidebarMenu}