import React from 'react';
import {message} from 'antd';
import Request from '../../common/request';
import TipMessage from '../../common/tip-message';
import {Storage} from 'common';

class BaseComponent extends React.Component {
    constructor() {
        super();
        this.currentUser = Storage.session.get('currentLoginUser');
        this.currentUser.hasPermission = (permission) => {
            const currentUserPermissions = this.currentUser.permissions;
            return currentUserPermissions && currentUserPermissions.indexOf(permission) > -1;
        };
    }

    // 页面上多个请求同时进行，用来记录loading数量
    loadings = 0;
    startLoading = () => {
        this.setState({
            loading: true,
        });
        this.loadings++;
    };
    endLoading = () => {
        this.loadings--;
        if (this.loadings === 0) {
            this.setState({
                loading: false,
            });
        }
    };
    requests = [];
    requestTimeouts = [];
    request = () => {
        let self = this;
        return {
            url: null,
            withNoMchId: false,
            errorMsg: null,
            type: null,
            paramsData: {},
            withNoLoading: false,
            startCb: null,
            errorCb: null,
            successCb: null,
            isEnd: false,
            get(url) {
                this.url = url;
                this.type = 'get';
                return this;
            },
            post(url) {
                this.url = url;
                this.type = 'post';
                return this;
            },
            put(url) {
                this.url = url;
                this.type = 'put';
                return this;
            },
            del(url) {
                this.url = url;
                this.type = 'delete';
                return this;
            },
            params(params) {
                this.paramsData = params;
                return this;
            },
            noLoading() {
                this.withNoLoading = true;
                return this;
            },
            setErrorMsg(errorMsg) {
                this.errorMsg = TipMessage[errorMsg];
                return this;
            },
            start(cb) {
                this.startCb = cb;
                return this;
            },
            error(cb) {
                this.errorCb = cb;
                return this;
            },
            success(cb) {
                this.successCb = cb;
                return this;
            },
            end(cb) {
                if (!this.url) {
                    throw Error('request need a url!');
                }
                // ajax结束回调函数
                let endCb = (err, res) => {
                    this.isEnd = true;
                    if (!this.withNoLoading) {
                        self.endLoading();
                    }
                    if (err || !res.ok) {
                        if (this.errorCb) {
                            this.errorCb(err, res);
                        } else {
                            // FIXME 这个判断不靠谱，但是暂时可用
                            if (String(err).indexOf('the network is offline') > -1) {
                                message.error('网络异常，请检查您得网络！', 1);
                            } else {
                                message.error(this.errorMsg || res && res.body && res.body.message || '未知系统错误', 1);
                            }
                        }
                    } else {
                        if (res.type === 'text/html') {
                            throw Error('The url maybe invalid!');
                        } else {
                            if (this.successCb) {
                                this.successCb(res.body || res, res);
                            }
                        }
                    }
                    // 所有处理完成之后的操作
                    if (cb) {
                        cb(err, res);
                    }
                };

                // ajax开始之前的一些自定义操作
                if (this.startCb) {
                    this.startCb();
                }

                if (!this.withNoLoading) {
                    self.startLoading();
                }
                this.isEnd = false;
                let request;
                const st = setTimeout(() => {
                    if (!this.isEnd && request) {
                        let errorMassage = '请求超时，请检查您的网络';
                        let err = new Error('timeout');
                        let res = {
                            body: {
                                message: errorMassage,
                            },
                        };
                        endCb(err, res);
                        request.abort();
                    }
                }, 1000 * 10); // 10ms 超时时间
                self.requestTimeouts.push(st);
                if (this.type === 'get') {
                    request = Request
                        .get(this.url)
                        .query(this.paramsData)
                        .end(endCb);
                } else if (this.type === 'put') {
                    request = Request
                        .put(this.url)
                        .send(this.paramsData)
                        .end(endCb);
                } else if (this.type === 'delete') {
                    request = Request
                        .del(this.url)
                        .send(this.paramsData)
                        .end(endCb);
                } else {
                    request = Request
                        .post(this.url)
                        .send(this.paramsData)
                        .end(endCb);
                }
                self.requests.push(request);
                return this;
            },
        };
    };

    componentWillUnmount() {
        // 组件卸载，打断当前组件未完成请求
        // 子类要是要使用componentWillUnmount，需要显示的调用super.componentWillUnmount();
        this.requests.forEach((r) => {
            r.abort();
        });
        this.requestTimeouts.forEach(t => {
            if (t) {
                clearTimeout(t);
            }
        });
    }
}

export default BaseComponent;
