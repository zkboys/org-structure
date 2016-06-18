import './style.less';
import React from 'react';
import {Request, Storage} from 'common';
import Bg from './bg.jpg';
import decorateImage from './bg4.png';
import TipMessage from '../../common/tip-message';
function noop() {
    return false;
}

class SignIn extends React.Component {
    state = {
        loading: false,
        loaded: false,
        name: '',
        pass: '',
        error: '',
        showFirstLogin: false,
        newPass: '',
        reNewPass: '',
        newPassError: '',
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loaded: true,
            });
        }, 500);
        const script = window.document.createElement('script');
        script.src = `${PUBLICPATH}antd.min.js`; // FIXME 注意这个路径PUBLICPATH，webpack配置传递过来的。
        const link = window.document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${PUBLICPATH}antd.min.css`;
        window.document.head.appendChild(script);
        window.document.head.appendChild(link);
    }

    handleNameChange = (e) => {
        const value = e.target.value;
        if (!value) {
            this.showError(TipMessage.loginNameIsRequired);
        } else {
            this.showError('');
        }
        this.setState({
            name: value,
        });
    };
    handlePassChange = (e) => {
        const value = e.target.value;
        if (!value) {
            this.showError(TipMessage.passIsRequired);
        } else {
            this.showError('');
        }
        this.setState({
            pass: value,
        });
    };
    showError = (errorMessage) => {
        this.setState({
            error: errorMessage,
        });
    }
    handleNewPassChange = (e) => {
        const value = e.target.value;
        if (!value) {
            this.showNewPassError(TipMessage.newPassIsRequired);
        } else if (value.length < 6) {
            this.showNewPassError(TipMessage.passFormatError);
        } else {
            this.showNewPassError('');
        }
        this.setState({
            newPass: value,
        });
    };
    handleReNewPassChange = (e) => {
        const value = e.target.value;
        if (!value) {
            this.showNewPassError(TipMessage.reNewPassIsRequired);
        } else if (value !== this.state.newPass) {
            this.showNewPassError(TipMessage.towPassIsDifferent);
        } else if (value.length < 6) {
            this.showNewPassError(TipMessage.passFormatError);
        } else {
            this.showNewPassError('');
        }
        this.setState({
            reNewPass: value,
        });
    };
    showNewPassError = (errorMessage) => {
        this.setState({
            newPassError: errorMessage,
        });
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit(e);
        }
    };
    handleNewPassKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleNewPassSubmit(e);
        }
    };
    handleNewPassSubmit = (e) => {
        if (this.state.loading) {
            return;
        }
        e.preventDefault();
        const pass = this.state.newPass;
        const rePass = this.state.reNewPass;
        if (!pass) {
            return this.showNewPassError(TipMessage.newPassIsRequired);
        }
        if (!rePass) {
            return this.showNewPassError(TipMessage.reNewPassIsRequired);
        }
        if (pass !== rePass) {
            return this.showNewPassError(TipMessage.towPassIsDifferent);
        }
        const values = {
            pass,
            rePass,
        }
        this.setState({
            loading: true,
        });
        Request
            .put('/first_login')
            .send(values)
            .end((err, res) => {
                if (err || !res.ok) {
                    this.setState({
                        loading: false,
                    });
                    this.showNewPassError(res.body.message);
                } else {
                    let refer = res.body.refer || '/';
                    let menus = res.body.menus || [];
                    let currentLoginUser = res.body.user;
                    Storage.session.set('currentLoginUser', currentLoginUser);
                    Storage.session.set('menus', menus);
                    location.href = refer;
                }
            });
    }
    handleSubmit = (e) => {
        if (this.state.loading) {
            return;
        }

        e.preventDefault();
        const name = this.state.name;
        const pass = this.state.pass;
        if (!name) {
            return this.showError(TipMessage.loginNameIsRequired);
        }
        if (!pass) {
            return this.showError(TipMessage.passIsRequired);
        }
        const params = {
            name,
            pass,
        };
        this.setState({
            loading: true,
        });
        Request
            .post('/signin')
            .send(params)
            .end((err, res) => {
                if (err || !res.ok) {
                    this.showError(res.body.message);
                    // 出错清除loading状态，成功之后不清除状态，等待跳转。
                    this.setState({
                        loading: false,
                    });
                } else {
                    if (res.body.user.is_first_login) {
                        this.setState({
                            showFirstLogin: true,
                            loading: false,
                        });
                        return false;
                    }
                    let refer = res.body.refer || '/';
                    let menus = res.body.menus || [];
                    let currentLoginUser = res.body.user;
                    if (currentLoginUser.is_first_login) {
                        location.href = '/first_login';
                    } else {
                        Storage.session.set('currentLoginUser', currentLoginUser);
                        Storage.session.set('menus', menus);
                        location.href = refer;
                    }
                }
            });
    };


    render() {
        return (
            <div className="login-wrap" style={{backgroundImage: `url(${Bg})`}}>
                <div className={`img-box ${this.state.loaded ? 'loaded' : ''}`}>
                    <img src={decorateImage} alt="img"/>
                    <lable className="circle-label small yellow position1">监控</lable>
                    <lable className="circle-label large blue position2">智能</lable>
                    <lable className="circle-label large red position3">巡检</lable>
                    <lable className="circle-label large purple position4">安全</lable>
                    <div className="massage position2">智能方便
                        <div className="line"></div>
                    </div>
                    <div className="massage position3">快速巡检
                        <div className="line"></div>
                    </div>
                    <div className="massage position4">安全可靠的技术支持
                        <div className="line"></div>
                    </div>
                </div>
                <div className="login-box" style={{display: !this.state.showFirstLogin ? 'block' : 'none'}}>
                    <h1 className="login-title">用户登录</h1>
                    <div className="form-item">
                        <label htmlFor="name">用户名：</label>
                        <input
                            id="name"
                            type="text"
                            value={this.state.name}
                            onChange={this.handleNameChange}
                            onKeyDown={this.handleKeyDown}
                            placeholder="请输入登录名"
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="name">密码：</label>
                        <input
                            id="name"
                            type="password"
                            value={this.state.pass}
                            onChange={this.handlePassChange}
                            onKeyDown={this.handleKeyDown}
                            placeholder="请输入密码"
                            onContextMenu={noop}
                            onPaste={noop}
                            onCopy={noop}
                            onCut={noop}
                        />
                    </div>
                    <div className="error">{this.state.error}</div>
                    <div
                        className={`button ${this.state.loading ? 'loading' : ''}`}
                        onClick={this.handleSubmit}
                    >
                        {this.state.loading ? '登录中。。。' : '登录'}
                    </div>
                </div>
                <div className="login-box" style={{display: this.state.showFirstLogin ? 'block' : 'none'}}>
                    <h1 className="login-title" style={{marginBottom: 0, paddingBottom: 10}}>首次登录</h1>
                    <div style={{textAlign: 'center', paddingBottom: 15}}>您为首次登录，请修改您的初始密码</div>

                    <div className="form-item">
                        <label htmlFor="name">新密码：</label>
                        <input
                            id="name"
                            type="password"
                            value={this.state.newPass}
                            onChange={this.handleNewPassChange}
                            onKeyDown={this.handleNewPassKeyDown}
                            placeholder="请输入新密码"
                        />
                    </div>
                    <div className="form-item">
                        <label htmlFor="name">确认密码：</label>
                        <input
                            id="name"
                            type="password"
                            value={this.state.reNewPass}
                            onChange={this.handleReNewPassChange}
                            onKeyDown={this.handleNewPassKeyDown}
                            placeholder="请输入确认新密码"
                            onContextMenu={noop}
                            onPaste={noop}
                            onCopy={noop}
                            onCut={noop}
                        />
                    </div>
                    <div className="error">{this.state.newPassError}</div>
                    <div
                        className={`button ${this.state.loading ? 'loading' : ''}`}
                        onClick={this.handleNewPassSubmit}
                    >
                        {this.state.loading ? '确认中。。。' : '确认'}
                    </div>
                </div>
            </div>
        );
    }
}

export default SignIn;
