import React from 'react';
import PropTypes from 'prop-types';

import styles from './NodeEditor.css';
import HtmlEditor from './HtmlEditor/HtmlEditor';
import DelayTaskScheduler from "../../DelayTaskScheduler";
import NodeRepo from "../../../../services/NodeRepo";
import HeadLineParser from "../../HeadLineParser";

// = true: do not save the node data to database (use for dev)
const DISABLE_SAVE = false;
const TITLE_EDITOR_TOOLBAR_COMMANDS = ['bold', 'underline', 'italic'];
const DELAY_UPDATE_TITLE_MS = 400;
const DELAY_SAVE_MS = 3000;

export default class NodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.elmNodeHtml = null;

        this.updateNodeNameScheduler = new DelayTaskScheduler();
        this.saveNodeScheduler = new DelayTaskScheduler();

    }

    componentDidMount() {
        this.elmNodeHtml.focus();
    }

    render() {
        let {node} = this.props;

        return <div className={[styles.component, "pencilTheme"].join(' ')}>
            <HtmlEditor html={node.title}
                        placeHolder="<page-title>"
                        contentEditableClassName="nodeTitle"
                        toolbar={TITLE_EDITOR_TOOLBAR_COMMANDS}
                        onChange={html => this._onChangeTitle(html)}
            />
            <HtmlEditor html={node.html}
                        contentEditableClassName="nodeHtml"
                        onChange={html => this._onChangeNodeHtml(html)}
                        ref={ref=> {this.elmNodeHtml = ref}}
            />
        </div>;
    }

    _onChangeTitle(html) {
        const node = this.props.node;
        node.title = html;
        this._onUpdateNode(node);
    }

    _onChangeNodeHtml(html) {
        const node = this.props.node;
        node.html = html;
        this._onUpdateNode(node);
    }


    _onUpdateNode(node) {
        this.updateNodeNameScheduler.schedule(DELAY_UPDATE_TITLE_MS, () => {
            let htmlToExtract = node.title ? node.title : node.html;
            node.name = HeadLineParser.parseTitle(htmlToExtract);
            if (node.title && !node.name) {
                node.name = HeadLineParser.parseTitle(node.html);
            }
            this.props.listeners.onChangeNodeName(node);
        });
        this.saveNodeScheduler.schedule(DELAY_SAVE_MS, () => {
            if (DISABLE_SAVE) return;
            NodeRepo.save(node);
        });
    }

    focus() {
        this.elmNodeHtml.focus();
    }
}

NodeEditor.propTypes = {
    node: PropTypes.object,
    listeners: PropTypes.shape({
        onChangeNodeName: PropTypes.func
    })
};
