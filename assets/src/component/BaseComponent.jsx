import React from 'react';
import {message} from 'antd';
import Request from '../common/request';
import TipMessage from '../common/tip-message';

class BaseComponent extends React.Component {
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
            delete(url) {
                this.url = url;
                this.type = 'delete';
                return this;
            },
            params(params) {
                this.paramsData = params;
                return this;
            },
            noMchId() {
                this.withNoMchId = true;
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
                    console.error('request need a url!');
                    return this;
                }

                // ajax结束回调函数
                let endCb = (err, res) => {
                    if (err || !res.ok) {
                        if (this.errorCb) {
                            this.errorCb(err, res);
                        } else {
                            message.error(this.errorMsg || res && res.body && res.body.message || '未知系统错误', 1);
                        }
                    } else {
                        if (res.type === 'text/html') {
                            throw Error('The url maybe invalid!');
                        } else {
                            let result;
                            let results;
                            if (res.body) {
                                results = res.body.results;
                                result = res.body.result;
                            }
                            if (this.successCb) {
                                this.successCb(result || results || res.body || res, res);
                            }
                        }
                    }
                    if (!this.withNoLoading) {
                        self.endLoading();
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
                if (this.type === 'get') {
                    Request
                        .get(this.url, this.withNoMchId)
                        .query(this.paramsData)
                        .end(endCb);
                } else if (this.type === 'put') {
                    Request
                        .put(this.url, this.withNoMchId)
                        .send(this.paramsData)
                        .end(endCb);
                } else if (this.type === 'delete') {
                    Request
                        .delete(this.url, this.withNoMchId)
                        .send(this.paramsData)
                        .end(endCb);
                } else {
                    Request
                        .post(this.url, this.withNoMchId)
                        .send(this.paramsData)
                        .end(endCb);
                }
                return this;
            },
        };
    };
    exportFile = (url, params) => {
        let urlParams = [];
        for (let p of Object.keys(params)) {
            let key = p;
            let value = params[p];
            if (value !== undefined && value !== null && value !== '') {
                urlParams.push({
                    key,
                    value,
                });
            }
        }
        let exportForm = document.createElement('form');
        exportForm.method = 'get';
        exportForm.action = url;
        urlParams.forEach((v) => {
            let input = document.createElement('input');
            input.type = 'text';
            input.name = v.key;
            input.value = v.value;
            exportForm.appendChild(input);
        });
        exportForm.submit();
    };
}

export default BaseComponent;
