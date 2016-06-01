import './style.less';
import React from 'react';
class ToolBar extends React.Component {
    state = {};

    render() {
        return (
            <div className="default-tool-bar">
                {this.props.children}
            </div>
        );
    }
}

export default ToolBar;
