import React from 'react';
import SwitchRemote from './SwitchRemote';

class Demo extends React.Component {
    render() {
        let record = {
            id: '1',
            is_locked: true,
        }
        let id = record.id;
        let isLocked = record.is_locked;
        return (
            <div>
                <SwitchRemote
                    key={1} // 表格内一定要加这个key，否则各分页之间有干扰
                    checked={isLocked}
                    checkedKey="isLocked"
                    url="/organization/users/toggle_lock"
                    params={{id, isLocked}}
                    onChange={(checked) => record.is_locked = checked} // 同步record，否则下次页面重新渲染，选中状态会错乱。
                />
            </div>
        );
    }
}

export default Demo;

