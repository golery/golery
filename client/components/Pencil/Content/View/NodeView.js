import React from 'react';
import PropTypes from 'prop-types';

import styles from './NodeView.css';
import HtmlView from './Html/HtmlView';
import GoleryEditorLib from "golery-editor/dist/index.dev";
let {GoleryEditor, htmlSerializer} = GoleryEditorLib;


export default class NodeView extends React.Component{
    constructor(props) {
        super(props);
    }
    render()
    {
        let {node} = this.props;
        let html = node.html || "";
        let value = htmlSerializer.deserialize(html);
        console.log(html);
        return <div className={[styles.component, "pencilTheme"].join(' ')}>
            <HtmlView html={node.title} className="nodeTitle"/>
            <GoleryEditor value={value}
                          readOnly={true}
                          autoFocus={true}
                          ref={this.goleryEditor}/>
            {/*<HtmlView html={node.html} className="nodeHtml"/>*/}
        </div>;
    }
}

NodeView.propTypes = {
    node: PropTypes.object
};
