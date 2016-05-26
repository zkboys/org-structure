import './style.less';
import React from "react";
import Request from '../../common/request';
import {Button, Form, Input} from 'antd';
import Storage from '../../common/storage';
const createForm = Form.create;
const FormItem = Form.Item;
function noop() {
    return false;
}

class SignIn extends React.Component {
    componentDidMount() {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({
            name: 'test',
            pass: '111111'
        })
    };

    state = {
        loading: false,
    };

    handleSubmit = (e)=> {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            console.log('Submit!!!');
            console.log(values);
            this.setState({
                loading: true,
            });
            Request
                .post('/signin')
                .send(values)
                .end((err, res) => {
                    console.log(err, res);
                    if (err || !res.ok) {
                        return 'error';
                    }
                    if (res.body.success) {
                        let refer = res.body.refer || '/';
                        let menus = res.body.menus || [];
                        let currentLoginUser = res.body.user;
                        Storage.session.set('currentLoginUser', currentLoginUser)
                        Storage.session.set('menus', menus);
                        location.href = refer;
                    }
                    this.setState({
                        loading: false,
                    });
                });
        });
    };

    render() {
        const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
        const nameProps = getFieldProps('name', {
            rules: [
                {required: true, message: '请填写用户名'},
            ],
        });
        const passwdProps = getFieldProps('pass', {
            rules: [
                {required: true, whitespace: true, message: '请填写密码'},
            ],
        });
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 17},
        };
        return (
            <div>
                <div className="login-box">
                    <h1 className='login-title'>用户登陆</h1>
                    <Form horizontal form={this.props.form}>
                        <FormItem
                            {...formItemLayout}
                            label="用户名："
                            hasFeedback
                        >
                            <Input {...nameProps} placeholder="请输入用户名"/>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="密码："
                            hasFeedback>
                            <Input
                                {...passwdProps}
                                type="password"
                                autoComplete="off"
                                onContextMenu={noop}
                                onPaste={noop}
                                onCopy={noop}
                                onCut={noop}
                            />
                        </FormItem>
                        <FormItem wrapperCol={{ span: 17, offset: 7 }}>
                            <Button
                                style={{width:'100%'}}
                                type="primary"
                                loading={this.state.loading}
                                onClick={this.handleSubmit}
                            >登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}
;

SignIn = createForm()(SignIn);
export default SignIn;
