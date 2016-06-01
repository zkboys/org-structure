# 工具条封装
就是一个div，应用了如下样式，使内部直接子节点，全部间距10px
```less
.default-tool-bar {
    & > * {
        margin-right: 10px;
    }
}
```
