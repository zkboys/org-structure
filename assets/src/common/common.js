import assign from 'object-assign'
export function getScrollBarWidth() {
    var scrollDiv = document.createElement('div');
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.width = '50px';
    scrollDiv.style.height = '50px';
    scrollDiv.style.overflow = 'scroll';
    document.body.appendChild(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    window.document.body.removeChild(scrollDiv);
    return scrollbarWidth
}
function _hasParent(rows, row) {
    let parentKey = row.parentKey;
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].key == parentKey) return true;
    }
    return false;

};
export let hasParent = _hasParent;
/*
 *前台构造树方法。
 *rows:树所需的基本数据。
 *parentKey: 可选，根据给定的parentKey获取对应的子菜单。
 */
export function convertToTree(rows, parentNode) {
    // 这个函数会被多次调用，对rows做深拷贝，否则会产生副作用。
    rows = rows.map((row)=> {
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
            if (!_hasParent(rows, row.parentKey)) {
                nodes.push(row);
            }
        }
    }

    // 存放要处理的节点
    let toDo = nodes.map((v)=>v);

    while (toDo.length) {

        // 处理一个，头部弹出一个。
        let node = toDo.shift();
        // 获取子节点。
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            if (row.parentKey == node.key) {
                let child = row;
                let parentKeys = [node.key];
                if (node.parentKeys) {
                    parentKeys = node.parentKeys.concat(node.key)
                }
                child.parentKeys = parentKeys;
                let parentText = [node.text];
                if (node.parentText) {
                    parentText = node.parentText.concat(node.text)
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
