import React from 'react';
import {Menu} from 'antd';
class Sidebar extends React.Component {
    handleToggle = (info) => {
        this.props.onToggle(info);
    };

    render() {
        let {
            hidden,
            isSidebarCollapsed,
            innerWidth,
            sidebarMenus,
            openKeys,
            selectedKeys,
            } = this.props.sidebar;
        let className = isSidebarCollapsed ? 'collapsed' : 'expanded';
        let sidebarMode = isSidebarCollapsed ? 'vertical' : 'inline';
        if (hidden) {
            className = 'hidden';
        }
        return (
            <div className={`admin-sidebar ${className}`}>
                <div className="admin-sidebar-inner" style={{width: innerWidth}}>
                    {/* 不同模式的菜单要区分开写，否则互相干扰 */}
                    <Menu
                        style={{display: sidebarMode === 'inline' && !hidden ? 'block' : 'none'}}
                        openKeys={openKeys}
                        selectedKeys={[selectedKeys]}
                        onOpen={this.handleToggle}
                        onClose={this.handleToggle}
                        mode={sidebarMode}
                    >
                        {sidebarMenus}
                    </Menu>
                    <Menu
                        style={{display: sidebarMode === 'vertical' && !hidden ? 'block' : 'none'}}
                        selectedKeys={[selectedKeys]}
                        mode={sidebarMode}
                    >
                        {sidebarMenus}
                    </Menu>
                </div>
            </div>
        );
    }
}
export default Sidebar;
