import React from 'react';
import Page from '../page/Page';
import { Form, Checkbox} from 'antd';
import Settings from './Settings';
import PubSubMsg from '../../common/pubsubmsg';
const FormItem = Form.Item;

class SettingsPage extends React.Component {
    state = {
        showPageAnimate: Settings.pageAnimate(),
    };

    handleShowPageAnimate = () => {
        this.setState({
            showPageAnimate: !this.state.showPageAnimate,
        });
        Settings.pageAnimate(!this.state.showPageAnimate);
    }

    render() {
        const pageHeader = {
            title: '系统设置',
            breadcrumbItems: [
                {text: '系统设置'},
            ],
        };
        return (
            <Page header={pageHeader}>
                系统的相关设置
            </Page>
        );
    }
}
export default SettingsPage;
