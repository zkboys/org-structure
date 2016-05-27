export default{
    getCookie(objName) { // 获取指定名称的cookie的值
        let arrStr = document.cookie.split('; ');
        for (let i = 0; i < arrStr.length; i++) {
            let temp = arrStr[i].split('=');
            if (temp[0] === objName) return unescape(temp[1]);
        }
        return '';
    },
};
