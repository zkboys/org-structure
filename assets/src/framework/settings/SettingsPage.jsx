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
                <Form horizontal>
                    <FormItem wrapperCol={{span: 6, offset: 1}}>
                        <label className="ant-checkbox-vertical" style={{cursor: 'pointer'}}>
                            <Checkbox checked={this.state.showPageAnimate} onChange={this.handleShowPageAnimate}/>
                            &nbsp;&nbsp;启用页面切换动画
                        </label>
                    </FormItem>
                </Form>
            </Page>
        );
    }
}
export default SettingsPage;
