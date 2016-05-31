import superagent from 'superagent';
import {getCsrf} from './common';

const filter = (req) => {
    req.on('response', (res) => {
        if (res.status === 401) {
            // window.location.href = '/singin';
            // 重新刷新之后，会根据当前url请求后端，后端发现未登录，会记录当前url，并跳转登录，登录之后会跳转回当前url
            window.location.reload();
        }
    });

    // req.on('request', () => {
    //    console.log(req);
    // });

    // 设置超时
    req.timeout(1000 * 30);
    // 打断
    req.on('abort', () => {
    });

    // req.on('end', () => {
    //    console.log('我是end');
    //    req.timeout(Number.MAX_SAFE_INTEGER);
    //    //req.abort(123);
    // })
};
export default {
    get(url) {
        // 根据约定，所有得ajax请求以api开头
        url = `/api${url}`;
        return superagent
            .get(url)
            .use(filter);
    },
    post(url) {
        url = `/api${url}`;
        return superagent
            .post(url)
            .use(filter)
            .send({_csrf: getCsrf()});
    },
    put(url) {
        url = `/api${url}`;
        return superagent
            .put(url)
            .use(filter)
            .send({_csrf: getCsrf()});
    },
    del(url) {
        url = `/api${url}`;
        return superagent
            .del(url)
            .use(filter)
            .send({_csrf: getCsrf()});
    },
};
