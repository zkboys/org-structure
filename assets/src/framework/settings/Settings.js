import storage from '../../common/storage';

function getSetValue(key, value, defaultValue) {
    if (value === undefined) {
        let result = storage.local.get(key);
        return result == null ? defaultValue : result;
    }
    storage.local.set(key, value);
}
export default {
    pageAnimate(value) {
        return getSetValue('showPageAnimate', value, true);
    },
    collapseSidebar(value) {
        return getSetValue('collapseBar', value, true);
    },
};
