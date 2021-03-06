import assign from 'object-assign';
import Storage from './storage';
import Request from './request';

/**
 * 导出文件，内部使用form实现
 * @param url {String} 路径
 * @param params {Object} 请求参数
 */
export function exportFile(url, params) {
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
}

/**
 * 获取csrf字符串
 * @returns {string}
 */
export function getCsrf() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

/**
 * 获取当前登陆用户数据，如果获取失败，跳转登录。
 * @returns {object}
 */
export function getCurrentLoginUser() {
    // 这个session是浏览器tab页关闭就清除
    // 后台存放用户信息的session是浏览器窗口关闭才失效
    // 如果关闭tab，前端session清除，后端session未清除，后端允许跳转未登录页面（对于后端来说，是已经登录状态）
    // 调用如下代码，就会返回null，然后报错。
    // 调用signout接口，清除后端得session，重新跳转当前页面，就会重新走登录。
    // 这样关闭tab页，就算用户退出登录。
    const currentLoginUser = Storage.session.get('currentLoginUser');
    if (!currentLoginUser) {
        const pathName = location.pathname;
        Request
            .post('/signout')
            .send({_csrf: getCsrf()})
            .end((err, res) => {
                if (err || !res.ok) {
                    location.href = '/signin';
                } else {
                    location.href = pathName;
                }
            });
        return null;
    }
    return currentLoginUser;
}

/**
 * 当前登录用户是否有某个权限
 * @param permission
 */
export function hasPermission(permission) {
    const currentLoginUser = getCurrentLoginUser();
    const permissions = currentLoginUser.permissions;
    let has = false;
    if (permissions) {
        has = permissions.indexOf(permission) > -1;
    }
    return has;
}

/**
 * 获取浏览器滚动条宽度
 * @returns {number}
 */
export function getScrollBarWidth() {
    let scrollDiv = document.createElement('div');
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.width = '50px';
    scrollDiv.style.height = '50px';
    scrollDiv.style.overflow = 'scroll';
    document.body.appendChild(scrollDiv);
    let scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    window.document.body.removeChild(scrollDiv);
    return scrollBarWidth;
}

/**
 * 检测某个节点是否有parent节点
 * @param rows 所有节点
 * @param row 需要判断得节点
 * @returns {boolean}
 */
export function hasParent(rows, row) {
    let parentKey = row.parentKey;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].key === parentKey) return true;
    }
    return false;
}

/**
 * js构造树方法。
 * @param rows 具有key，parentKey关系的扁平数据结构，标题字段为text
 * @param parentNode 开始节点
 * @returns {array}
 */
export function convertToTree(rows, parentNode) {
    // 这个函数会被多次调用，对rows做深拷贝，否则会产生副作用。
    rows = rows.map((row) => {
        return assign({}, row);
    });
    parentNode = assign({}, parentNode);

    let nodes = [];
    if (parentNode) {
        nodes.push(parentNode);
    } else {
        // 获取所有的顶级节点
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if (!hasParent(rows, row.parentKey)) {
                nodes.push(row);
            }
        }
    }

    // 存放要处理的节点
    let toDo = nodes.map((v) => v);

    while (toDo.length) {
        // 处理一个，头部弹出一个。
        let node = toDo.shift();
        // 获取子节点。
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if (row.parentKey === node.key) {
                let child = row;
                let parentKeys = [node.key];
                if (node.parentKeys) {
                    parentKeys = node.parentKeys.concat(node.key);
                }
                child.parentKeys = parentKeys;
                let parentText = [node.text];
                if (node.parentText) {
                    parentText = node.parentText.concat(node.text);
                }
                child.parentText = parentText;

                if (node.children) {
                    node.children.push(child);
                } else {
                    node.children = [child];
                }
                // child加入toDo，继续处理
                toDo.push(child);
            }
        }
    }
    if (parentNode) {
        return nodes[0].children;
    }
    return nodes;
}
