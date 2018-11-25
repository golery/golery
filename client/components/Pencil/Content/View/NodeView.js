import React from 'react';
import PropTypes from 'prop-types';

import styles from './NodeView.css';
import HtmlView from './Html/HtmlView';
import GoleryEditorLib from "golery-editor";
let {GoleryEditor, EditorController, htmlSerializer} = GoleryEditorLib;


export default class NodeView extends React.Component{
    constructor(props) {
        super(props);
        this.editorController = new EditorController();
    }
    render()
    {
        let {node} = this.props;
        let html = node.html || "";
        let value = htmlSerializer.deserialize(html);
        console.log(html);
        return <div className={[styles.component, "pencilTheme"].join(' ')}>
            {/*<HtmlView html={node.title} className="nodeTitle"/>*/}
            <div className={"nodeHtml"}>
            <GoleryEditor value={value}
                          readOnly={true}
                          autoFocus={true}
                          controller={this.editorController}/>
            </div>
            {/*<HtmlView html={node.html} className="nodeHtml"/>*/}
        </div>;
    }
}

NodeView.propTypes = {
    node: PropTypes.object
};
