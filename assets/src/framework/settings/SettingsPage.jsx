import React from 'react';
import Page from '../page/Page';

class SettingsPage extends React.Component {
    state = {};

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
