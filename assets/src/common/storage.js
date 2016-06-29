/**
 *  本地存储封装，项目中其他地方不要直接使用localStorage和sessionStorage，统一使用封装。
 *  简化接口，字符串json转换。
 *  如果本地存储使用比较多，可以考虑封装LRU（Least Recently Used最近最少使用）
 */
export default {
    global: {
        get(key) {
            return window.globalStorage ? window.globalStorage[key] : null;
        },
        set(key, jsonValue) {
            window.globalStorage = window.globalStorage ? window.globalStorage : {};
            window.globalStorage[key] = jsonValue;
        },
        remove(key) {
            if (window.globalStorage) {
                delete window.globalStorage[key];
            }
        },
        removeAll() {
            window.globalStorage = {};
        },
    },
    local: {
        get(key) {
            const strValue = localStorage.getItem(key);
            return JSON.parse(strValue);
        },
        set(key, jsonValue) {
            const strValue = JSON.stringify(jsonValue);
            localStorage.setItem(key, strValue);
        },
        remove(key) {
            localStorage.removeItem(key);
        },
        removeAll() {
            localStorage.clear();
        },
    },
    session: {
        get(key) {
            const strValue = sessionStorage.getItem(key);
            return JSON.parse(strValue);
        },
        set(key, jsonValue) {
            const strValue = JSON.stringify(jsonValue);
            sessionStorage.setItem(key, strValue);
        },
        remove(key) {
            sessionStorage.removeItem(key);
        },
        removeAll() {
            sessionStorage.clear();
        },
    },
};
