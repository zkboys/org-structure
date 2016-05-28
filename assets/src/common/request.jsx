import superagent from 'superagent';
import {getCsrf} from './common';

const filter = (req) => {
    req.on('response', (res) => {
        if (res.status === 401) {
            window.location.href = '/singin';
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
        return superagent
            .get(url)
            .use(filter);
    },
    post(url) {
        return superagent
            .post(url)
            .use(filter)
            .send({_csrf: getCsrf()});
    },
    put(url) {
        return superagent
            .put(url)
            .use(filter)
            .send({_csrf: getCsrf()});
    },
    del(url) {
        return superagent
            .del(url)
            .use(filter)
            .send({_csrf: getCsrf()});
    },
};
