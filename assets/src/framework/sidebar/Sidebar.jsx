import React from 'react';
import {Menu} from 'antd';
import assign from 'object-assign';
class Sidebar extends React.Component {
    handleToggle = (info) => {
        this.props.onToggle(info);
    };

    render() {
        const {
            sidebarStyle,
            sidebarInnerStyle,
            sidebarMode,
            } = this.props.style;
        let {
            hidden,
            sidebarMenus,
            openKeys,
            selectedKeys,
            } = this.props.sidebar;
        let style = assign({}, sidebarStyle, hidden ? {width: 0} : {});
        let innerStyle = assign({}, sidebarInnerStyle, hidden ? {width: 0} : {});

        return (
            <div className="admin-sidebar" style={style}>
                <div className="admin-sidebar-inner" style={innerStyle}>
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
