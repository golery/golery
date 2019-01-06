import React from 'react';
import PropTypes from 'prop-types';

import styles from './NodeView.css';
import HtmlView from './Html/HtmlView';
import GoleryEditorLib from "golery-editor";

let {GoleryEditor, EditorController, htmlSerializer} = GoleryEditorLib;


export default class NodeView extends React.Component {
    constructor(props) {
        super(props);
        this.editorController = new EditorController();
        this.state = {html: null};
    }

    static getDerivedStateFromProps(props, state) {
        let {node} = props;
        let html = node.html || "";
        if (state.html !== html) {
            let value = htmlSerializer.deserialize(html);
            return {
                html: html,
                value: value,
                title: node.title || ""
            };
        }
        // when null is returned no update is made to the state
        return null;
    }

    render() {
        let editor;
        if (typeof(window) === "undefined") {
            // server side render html
            // This cause mismatch the html tag, potentially cause problem.
            // Later, we can update the golery editor to generate exact match html tags
            editor = <div dangerouslySetInnerHTML={{__html:this.state.html}}/>;
        } else {
            editor = <GoleryEditor value={this.state.value}
                                   onChange={(c) => this.setState({value: c.value})}
                                   readOnly={true}
                                   autoFocus={true}
                                   controller={this.editorController}/>;
        }
        return (
            <div
                className={[styles.component, "pencilTheme"].join(' ')}>
                <HtmlView html={this.props.node.title} className="nodeTitle"/>
                <div className={"nodeHtml"}>
                    {editor}
                </div>
            </div>);
    }
}

NodeView.propTypes = {
    node: PropTypes.object
};
