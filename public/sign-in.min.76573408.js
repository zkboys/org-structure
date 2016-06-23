(function () {
    var Storage = {
        session: {
            get(key) {
                var strValue = sessionStorage.getItem(key);
                return JSON.parse(strValue);
            },
            set(key, jsonValue) {
                var strValue = JSON.stringify(jsonValue);
                sessionStorage.setItem(key, strValue);
            },
            remove(key) {
                sessionStorage.removeItem(key);
            },
        },
    };
    var isFirstLogin = false;
    var loginButton = document.getElementById('login-btn');
    var resetPassButton = document.getElementById('reset-pass-btn');
    var nameEle = document.getElementById('name');
    var passEle = document.getElementById('pass');
    var newPassEle = document.getElementById('new-pass');
    var reNewPassEle = document.getElementById('re-new-pass');
    var _csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    loginButton.onclick = handleLogin;
    resetPassButton.onclick = handleResetPass;
    nameEle.onkeydown = handleKeyDown;
    passEle.onkeydown = handleKeyDown;
    newPassEle.onkeydown = handleKeyDown;
    reNewPassEle.onkeydown = handleKeyDown;

    function handleLogin() {
        clearError();
        var name = nameEle.value;
        var pass = passEle.value;
        if (!name) {
            showError('请输入用户名');
            return;
        }
        if (!pass) {
            showError('请输入密码');
            return;
        }
        var params = {
            _csrf: _csrf,
            name: name,
            pass: pass
        };
        showLoading();
        superagent
            .post('/api/signin')
            .send(params)
            .end((err, res) => {
                if (err || !res.ok) {
                    showError(res.body.message);
                    // 出错清除loading状态，成功之后不清除状态，等待跳转。
                    hideLoading();
                } else {
                    if (res.body.user.is_first_login) {
                        hideLoading();
                        showFirstLogin();
                        return false;
                    }
                    var refer = res.body.refer || '/';
                    var menus = res.body.menus || [];
                    var currentLoginUser = res.body.user;
                    if (currentLoginUser.is_first_login) {
                        location.href = '/first_login';
                    } else {
                        Storage.session.set('currentLoginUser', currentLoginUser);
                        Storage.session.set('menus', menus);
                        location.href = refer;
                    }
                }
            });
    }

    function handleResetPass() {
        clearError();
        var newPass = newPassEle.value;
        var reNewPass = reNewPassEle.value;
        if (!newPass) {
            showError('请输入新密码');
            return;
        }
        if (!reNewPass) {
            showError('请输入确认新密码');
            return;
        }
        if (newPass !== reNewPass) {
            showError('两次输入密码不一致');
            return;
        }
        var params = {
            _csrf: _csrf,
            pass: newPass,
            rePass: reNewPass,
        };
        showLoading();
        superagent
            .put('/api/first_login')
            .send(params)
            .end((err, res) => {
                if (err || !res.ok) {
                    showError(res.body.message);
                    // 出错清除loading状态，成功之后不清除状态，等待跳转。
                    hideLoading();
                } else {
                    var refer = res.body.refer || '/';
                    var menus = res.body.menus || [];
                    var currentLoginUser = res.body.user;
                    Storage.session.set('currentLoginUser', currentLoginUser);
                    Storage.session.set('menus', menus);
                    location.href = refer;
                }
            });
    }

    function handleKeyDown(e) {
        if (e.keyCode === 13) {
            if (isFirstLogin) {
                handleResetPass();
            } else {
                handleLogin();
            }
        }
    }

    function showLoading() {
        if (isFirstLogin) {
            var resetPassLoading = '确认中。。。';
            resetPassButton.innerHTML = resetPassLoading;
            resetPassButton.innerText = resetPassLoading;
        } else {
            var loginLoading = '登录中。。。';
            loginButton.innerHTML = loginLoading;
            loginButton.innerText = loginLoading;
        }
    }

    function hideLoading() {
        if (isFirstLogin) {
            var resetPassButtonText = '确认';
            resetPassButton.innerHTML = resetPassButtonText;
            resetPassButton.innerText = resetPassButtonText;
        } else {
            var loginButtonText = '登录';
            loginButton.innerHTML = loginButtonText;
            loginButton.innerText = loginButtonText;
        }
    }

    function showFirstLogin() {
        var firstLoginEle = document.getElementById('first-login-box');
        var loginEle = document.getElementById('login-box');
        loginEle.style.display = 'none';
        firstLoginEle.style.display = 'block';
        isFirstLogin = true;
    }

    function showError(error) {
        if (isFirstLogin) {
            var resetPassErrorEle = document.getElementById('reset-pass-error');
            resetPassErrorEle.innerHTML = error;
            resetPassErrorEle.innerText = error;// ie?
        } else {
            var loginErrorEle = document.getElementById('login-error');
            loginErrorEle.innerHTML = error;
            loginErrorEle.innerText = error;// ie?
        }
    }

    function clearError() {
        var loginErrorEle = document.getElementById('login-error');
        var resetPassErrorEle = document.getElementById('reset-pass-error');
        loginErrorEle.innerHTML = '';
        loginErrorEle.innerText = '';// ie?
        resetPassErrorEle.innerHTML = '';
        resetPassErrorEle.innerText = '';// ie?
    };
})();
