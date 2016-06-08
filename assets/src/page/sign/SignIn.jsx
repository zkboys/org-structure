import './style.less';
import React from 'react';
import {Request, Storage} from 'common';
import Bg from './bg.jpg';
import decorateImage from './bg4.png';
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
            this.showError('请输入登录名');
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
            this.showError('请输入密码');
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

    handleSubmit = (e) => {
        if (this.state.loading) {
            return;
        }

        e.preventDefault();
        const name = this.state.name;
        const pass = this.state.pass;
        if (!name) {
            return this.showError('请输入登录名');
        }
        if (!pass) {
            return this.showError('请输入密码');
        }
        const params = {
            name,
            pass,
        };
        Request
            .post('/signin')
            .send(params)
            .end((err, res) => {
                this.setState({
                    loading: false,
                });
                if (err || !res.ok) {
                    this.showError(res.body.message);
                } else {
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

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit(e);
        }
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
                <div className="login-box">
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
            </div>
        );
    }
}

export default SignIn;
