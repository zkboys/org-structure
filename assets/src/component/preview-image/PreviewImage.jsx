/**
 * Created by peach on 16-5-25.
 */
import React from 'react';
import {Form, Input, Button, message} from 'antd';

/*
* url min-width height string [] */

//定义类 并继承baseComponent
class PreviewImage extends React.Component {
    // 构造函数
    constructor(props) {
        super(props);
    }

    // 初始化state,替代原getInitialState, 注意前面没有static
    state = {
        showMenu: false
    };
    // 替代原propTypes，指定props参数规范， 属性,注意前面有static,属于静态方法.
    static propTypes = {
        autoPlay: React.PropTypes.bool.isRequired
    }
    // 默认defaultProps,替代原getDefaultProps方法, 注意前面有static,属于静态方法.
    static defaultProps = {
        loading: false
    };

    componentDidMount() {
        // do something yourself...
    }

    // 事件的写法,这里要使用箭头函数,箭头函数不会改变this的指向,否则函数内,this指的就不是当前对象了
    // React.CreatClass方式React会自动绑定this,ES6写法不会.
    handleClick = (e)=> {
        this.setState();//这里的this指的还是App
    };

    render() {
        const formData = this.state.formData;

        return (
            <div>

            </div>
        )
    }
}
export default PreviewImage;