/**
 * Created by peach on 16-5-31.
 */
import React from 'react';
import PreviewImage from './PreviewImage';
class Demo extends React.Component {
    state = {
        showMenu: false,
    };

    render() {
        let srcData = 'http://7xrioc.com1.z0.glb.clouddn.com/img/illustration/spaceStart.jpg';

        return (
            <div>
                <PreviewImage src={srcData} noImgSize width="100"/>
                <PreviewImage noImgSize width="100"/>
            </div>
        );
    }
}
export default Demo;
