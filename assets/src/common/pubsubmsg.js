/** ========================================================
 *  发布订阅模式,带有消息队列 生产者消费者 性质
 *  =======================================================*/
class PubSubMsg {
    topics = {};
    unConsumedMsg = {};

    /**
     * 发布或广播事件
     * @param topic {string} 事件名称
     * @param args {*} 回调参数
     * @returns {*}
     */
    publish(topic, args) {
        /*
         * 消息统一放入消息队列当中。
         * 注意：为了后订阅的所有订阅者都能接受到消息，这个消息队列不会被清空，如果存在大量的后订阅情况，小心内存溢出。
         * */
        this.unConsumedMsg[topic] = args;
        if (!this.topics[topic]) {
            return false;
        }

        for (let p of Object.keys(this.topics[topic])) {
            const func = this.topics[topic][p].func;
            const once = this.topics[topic][p].once;
            if (func) {
                func(args);
                if (once) {
                    delete (this.topics[topic][p]);
                }
            }
        }
        return this;
    }

    /**
     * 同subscribe，但是回调函数只触发一次
     * @param topic {string} 事件名称
     * @param name {string} 订阅者名称
     * @param func {function} 回调函数
     */
    subscribeOnce(topic, name, func) {
        if (typeof name === 'function') {
            func = name;
            name = new Date().getTime(); // 未指定name，使用时间戳，指定一个
        }
        return this.commonSubscribe(topic, name, func, true, false);
    }

    /**
     * 同subscribeOnce,但是会消费历史消息
     * @param topic {string} 事件名称
     * @param name {string} 订阅者名称
     * @param func {function} 回调函数
     */
    subscribeOnceAcceptOldMsg(topic, name, func) {
        if (typeof name === 'function') {
            func = name;
            name = new Date().getTime(); // 未指定name，使用时间戳，指定一个
        }
        return this.commonSubscribe(topic, name, func, true, true);
    }

    /**
     * subscribe,但是会消费历史消息
     * @param topic {string} 事件名称
     * @param name {string} 订阅者名称
     * @param func {function} 回调函数
     */
    subscribeAcceptOldMsg(topic, name, func) {
        if (typeof name === 'function') {
            func = name;
            name = new Date().getTime(); // 未指定name，使用时间戳，指定一个
        }
        return this.commonSubscribe(topic, name, func, false, true);
    }

    /**
     * 单纯的订阅.
     * @param topic {string} 事件名称
     * @param name {string} 订阅者名称
     * @param func {function} 回调函数
     */
    subscribe(topic, name, func) {
        if (typeof name === 'function') {
            func = name;
            name = new Date().getTime(); // 未指定name，使用时间戳，指定一个
        }
        return this.commonSubscribe(topic, name, func, false, false);
    }

    /**
     *
     * @param topic {string} 事件名称
     * @param name {string} 订阅者名称
     * @param func {function} 回调函数
     * @param once {bool} 回调函数是否只触发一次
     * @param acceptOldMsg {bool} 是否消费历史消息
     * @returns {PubSubMsg} 返回当前对象，便于链式调用
     */
    commonSubscribe(topic, name, func, once, acceptOldMsg) {
        if (!this.topics[topic]) {
            this.topics[topic] = {};
        }
        this.topics[topic][name] = {
            func,
            once,
        };
        if (acceptOldMsg) {
            /* 对应topic下加入回调函数
             * 查询是否有未消费的相应消息，如果有，立即执行回调。
             * */
            if (topic in this.unConsumedMsg) {
                let data = this.unConsumedMsg[topic];
                func(data);
            }
        }
        return this;
    }

    /**
     * 根据事件名称，订阅者名称，取消订阅
     * @param topic {string} 事件名称
     * @param name {string} 订阅者名称
     * @returns {*}
     */
    unsubscribe(topic, name) {
        if (!this.topics[topic]) {
            return false;
        }

        if (!name) { // 解绑所有 topic 事件
            delete(this.topics[topic]);
        } else if (this.topics[topic][name]) { // 解绑 topic 事件下的指定 name 订阅者
            delete(this.topics[topic][name]);
        }
        return this;
    }

}
export default new PubSubMsg;
