import React from 'react';
import {Badge, Menu, Popconfirm, message} from 'antd';
import {Link} from 'react-router';
import FAIcon from '../../component/faicon/FAIcon';
import Request from '../../common/request';
import {getCurrentLoginUser, getCsrf} from '../../common/common';
import UserAvatar from '../../component/user-avatar/UserAvatar';
import TipMessage from '../../common/tip-message';
class Header extends React.Component {
    handleExit = () => {
        Request
            .post('/signout')
            .send({_csrf: getCsrf()})
            .end((err, res) => {
                if (err || !res.ok) {
                    message.error(TipMessage.logoutError);
                } else {
                    location.href = '/signin';
                }
            });
    };

    render() {
        const {
            headerLogoWidth,
            headerLogo,
            } = this.props.style;
        const {
            current,
            headMenus, // TODO item.subMenus如果有子菜单，再处理
            } = this.props.headerNav;

        let headMenusJsx = [];
        headMenus.forEach((item) => {
            if (item.key !== 'system') { // 系统的顶级菜单不在头部导航显示
                headMenusJsx.push(
                    <Menu.Item key={item.key}>
                        <Link to={item.path}>
                            <FAIcon type={item.icon}/><span>{item.text}</span>
                        </Link>
                    </Menu.Item>
                );
            }
        });
        const currentLoginUser = getCurrentLoginUser();
        return (
            <header className="admin-header">
                <div className="admin-logo" style={{width: headerLogoWidth}}><Link to="/">{headerLogo}</Link></div>
                <a className="admin-sidebar-toggle" onClick={this.props.onToggleSidebar}><FAIcon type="fa-bars"/></a>
                <Menu
                    className="admin-header-sys"
                    selectedKeys={[current]}
                    mode="horizontal">
                    {headMenusJsx}
                </Menu>

                <ul className="admin-header-menu">
                    <li className="admin-header-menu-item">
                        <Link to="/system/mail/unread">
                            <Badge dot>
                                <FAIcon type="fa-envelope-o"/>
                            </Badge>
                            <span>我的邮件</span>
                        </Link>
                    </li>
                    <li className="admin-header-menu-item">
                        <Link to="/system/remind">
                            <Badge dot>
                                <FAIcon type="fa-bell-o"/>
                            </Badge>
                            <span>系统提醒</span>
                        </Link>
                    </li>
                    <li className="admin-header-menu-item">
                        <Link to="/system/settings">
                            <FAIcon type="fa-cogs"/>
                            <span>系统设置</span>
                        </Link>
                    </li>
                    <li className="admin-header-menu-item">
                        <Link to="/system/profile/message">
                            <UserAvatar className="admin-user-avatar" user={currentLoginUser}/>
                            <span>{currentLoginUser.name || currentLoginUser.loginname}</span>
                        </Link>
                    </li>
                    <li className="admin-header-menu-item">
                        <Popconfirm title="您确定要退出系统吗？" onConfirm={this.handleExit}>
                            <a href="#">
                                <FAIcon type="fa-sign-out"/>
                                <span>退出系统</span>
                            </a>
                        </Popconfirm>
                    </li>
                </ul>
            </header>
        );
    }
}
export default Header;
