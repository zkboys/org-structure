import 'github-markdown-css/github-markdown.css';
import React from 'react';
import Page from '../framework/page/Page';

class Index extends React.Component {
    state = {
        toc: [],
        contents: [],
    }
    components = [
        {
            folder: 'base-component',
            title: '组件基类',
        },
        {
            folder: 'form-item',
            title: '表单组件',
        },
        {
            folder: 'query-terms',
            title: '查询条件组件',
        },
        {
            folder: 'switch-remote',
            title: '远程开关组件',
        },
        {
            folder: 'preview-image',
            title: '图片预览',
        },
    ];

    componentWillMount() {
        let toc = [];
        let contents = [];
        this.components.forEach((item, index) => {
            toc.push(
                <li key={`toc-${index}`}><a href={`#content-${index}`}>{item.title}</a></li>
            );
            contents.push(
                <div
                    id={`content-${index}`}
                    key={`content-${index}`}
                    style={{marginBottom: 50, paddingBottom: 10, borderBottom: '15px solid #eee'}}
                >
                    {this.readMe(item.folder)}
                    {this.demo(item.folder)}
                </div>
            );
        });
        this.setState({
            toc,
            contents,
        });
    }

    readMe(folder) {
        const readMeMarkDown = require(`./${folder}/README.md`);
        return (
            <div
                className="markdown-body"
                dangerouslySetInnerHTML={{__html: readMeMarkDown}}
            ></div>
        );
    }

    demo(folder) {
        const Demo = require(`./${folder}/Demo.jsx`);
        return (
            <div className="demo-body">
                <div className="markdown-body">
                    <div></div>
                    <h2>Demo</h2> {/* 前后加个div，控制样式 */}
                    <div></div>
                </div>
                <Demo/>
            </div>
        );
    }

    render() {
        return (
            <div>
                <Page>
                    <div style={{position: 'fixed', right: 100, top: 100, zIndex: 99}}>
                        <h1>目录</h1>
                        <ul>
                            {this.state.toc}
                        </ul>
                    </div>
                    <div>
                        {this.state.contents}
                    </div>
                </Page>
            </div>
        );
    }
}

export default Index;

