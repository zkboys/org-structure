import './../style.less';
import assign from 'object-assign';
import React from 'react';
import {connect} from 'react-redux';
import HeaderBar from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import PubSubMsg from '../../common/pubsubmsg';
import {
    toggleSidebar,
    setHeaderCurrentMenu,
    setSidebarMenus,
    setSidebarMenuStatus,
} from '../actions';

class Container extends React.Component {

    handleToggleSidebar = () => {
        this.props.dispatch(toggleSidebar());
    };

    handleToggleMenu = (info) => {
        let selectedKeys = this.props.sidebar.selectedKeys;
        let data = {
            selectedKeys,
            openKeys: info.openKeys,
        };
        this.props.dispatch(setSidebarMenuStatus(data));
    };

    componentDidMount() {
        let dispatch = this.props.dispatch;
        PubSubMsg.subscribeAcceptOldMsg('current-header-menu', () => {
            dispatch(setHeaderCurrentMenu());
        });
        PubSubMsg.subscribeAcceptOldMsg('set-sidebar-menus', () => {
            dispatch(setSidebarMenus());
        });
        PubSubMsg.subscribeAcceptOldMsg('current-sidebar-menu', (data) => {
            dispatch(setSidebarMenuStatus(data));
        });
    }

    render() {
        let centerLeft = this.props.sidebar.hidden ? 0 : this.props.style.centerLeft;
        return (
            <div>
                <HeaderBar {...this.props} onToggleSidebar={this.handleToggleSidebar}/>
                <Sidebar {...this.props} onToggle={this.handleToggleMenu}/>
                <div className="admin-container" style={{left: centerLeft}}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return assign({}, state);
}
export default connect(mapStateToProps)(Container);
