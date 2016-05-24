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

    handleReset = (e)=> {
        e.preventDefault();
        this.props.form.resetFields();
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
            Request
                .post('/signin')
                .send(values)
                .end(function (err, res) {
                    console.log(err, res);
                    if (err || !res.ok) {
                        return 'error'
                    }
                    let refer = res.body.refer || '/';
                    let menus = res.body.menus || [];
                    if (res.body.success) {
                        Storage.session.set('menus', menus);
                        location.href = refer;
                    }
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
            wrapperCol: {span: 12},
        };
        return (
            <div>
                <h1 style={{textAlign:'center',padding:'50px'}}>用户登陆</h1>
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
                    <FormItem wrapperCol={{ span: 12, offset: 7 }}>
                        <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="ghost" onClick={this.handleReset}>重置</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
;

SignIn = createForm()(SignIn);
export default SignIn;
