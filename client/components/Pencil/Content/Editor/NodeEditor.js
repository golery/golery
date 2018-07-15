import React from 'react';
import PropTypes from 'prop-types';

import styles from './NodeEditor.scss';
import HtmlEditor from './HtmlEditor/HtmlEditor';
import TitleEditor from './HtmlEditor/TitleEditor';
import DelayTaskScheduler from "../../DelayTaskScheduler";
import HeadLineParser from "../../HeadLineParser";
import ShareEditor from './ShareEditor';
import NodeRepo from '../../../../services/NodeRepo';
import ModalDialog from '../../../Core/Dialog/ModalDialog';
import Scrollbar from '../../Scrollbar';

// = true: do not save the node data to database (use for dev)
const DISABLE_SAVE = false;
const DELAY_UPDATE_TITLE_MS = 400;
const DELAY_SAVE_MS = 3000;

export default class NodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.elmHtmlEditor = null;
        this.elmTopToolbarHolder = null;
        this.elmToolbar = null;

        this.state = {showToolbar: false};

        this.updateNodeNameScheduler = new DelayTaskScheduler();
        this.saveNodeScheduler = new DelayTaskScheduler();
    }

    render() {
        let {node} = this.props;
        let toolbarClassName = styles.topToolbarHolder;
        let toogleToolbarIconClassName = "fa fa-close";
        if (!this.state.showToolbar) {
            toolbarClassName += ' ' + styles.displaynone;
            toogleToolbarIconClassName = "fa fa-css3";
        }
        return <div className={[styles.component, "pencilTheme"].join(' ')}>
            <div className={toolbarClassName} ref={ref => this.elmTopToolbarHolder = ref}/>

            <div className={styles.toogleToolbarButton} onClick={() => this._toggleToolbar()}>
                <i className={toogleToolbarIconClassName}></i>
            </div>

            <div className={styles.contentHolder}>
                <Scrollbar>
                    <TitleEditor html={node.title}
                                 placeHolder="<page-title>"
                                 contentEditableClassName="nodeTitle"
                                 onChange={html => this._onChangeTitle(html)}
                    />

                    <HtmlEditor html={node.html}
                                contentEditableClassName="nodeHtml"
                                onChange={html => this._onChangeNodeHtml(html)}
                                addToolbar={(toolbarElm) => this._addToolbar(toolbarElm)}
                                ref={ref => {
                                    this.elmHtmlEditor = ref;
                                }}/>
                </Scrollbar>
            </div>
        </div>;
    }

    _toggleToolbar() {
        this.setState({showToolbar: !this.state.showToolbar});
    }

    _addToolbar(elmToolbar) {
        this.elmToolbar = elmToolbar;

        if (this.elmTopToolbarHolder && this.elmToolbar) {
            this.elmTopToolbarHolder.appendChild(this.elmToolbar);
            console.log('Add toolbar', this.elmToolbar);
        }
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
        this.elmHtmlEditor.focus();
    }

    _onClickShare() {
        let modal = new ModalDialog();
        modal.show(<div><ShareEditor node={this.props.node}/></div>);
    }
}

NodeEditor.propTypes = {
    node: PropTypes.object,
    listeners: PropTypes.shape({
        onChangeNodeName: PropTypes.func
    })
};
