const tipMessage = {
    loginNameFormatError: '登录名不可用！',
    logoutError: '登录失败！',
    emailFormatError: '请输入正确的邮箱！',
    mobileFormatError: '请输入正确的电话号码！',
    canNotBeNull(name = '') {
        return `${name}不能为空！`;
    },
};
export default tipMessage;
