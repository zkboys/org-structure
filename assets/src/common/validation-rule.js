import TipMessage from './tip-message';
import Request from 'superagent';
export default {
    required(name) {
        return {required: true, message: TipMessage.canNotBeNull(name)};
    },
    loginName(message) {
        return {
            validator(rule, value, callback) {
                if (value && !(/^[a-zA-Z0-9\-_]+$/i).test(value)) {
                    callback(new Error(message || TipMessage.loginNameFormatError));
                } else {
                    callback();
                }
            },
        };
    },
    checkLoginNameExist() {
        return {
            validator(rule, value, callback) {
                if (!value) {
                    callback();
                } else {
                    Request
                        .get(`/api/organization/users/loginname/${value}`)
                        .end((err, res) => {
                            if (err || !res.ok) {
                                callback([new Error(res && res.body && res.body.message || '未知系统错误')]);
                            } else if (res.body && value === res.body.loginname) {
                                callback([new Error('抱歉，该登录名已被占用！')]);
                            } else {
                                callback();
                            }
                        });
                }
            },
        };
    },
    mobile(message) {
        return {
            validator(rule, value, callback) {
                // FIXME 这个校验规则不太好
                /*
                 * 匹配格式：
                 11位手机号码
                 3-4位区号，7-8位直播号码，1－4位分机号
                 如：12345678901、1234-12345678-1234
                 * */
                const re = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
                if (value && !re.test(value)) {
                    callback(new Error(message || TipMessage.mobileFormatError));
                } else {
                    callback();
                }
            },
        };
    },
    email(message) {
        return {type: 'email', message: message || TipMessage.emailFormatError};
    },
};
