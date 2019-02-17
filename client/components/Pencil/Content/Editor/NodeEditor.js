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
import {openUploadImageDialog} from "./HtmlEditor/Image/UploadImageDialog";
import Scrollbar from '../../Scrollbar';
// = true: do not save the node data to database (use for dev)
const DISABLE_SAVE = false;
const DELAY_UPDATE_TITLE_MS = 400;
const DELAY_SAVE_MS = 3000;

import GoleryEditorLib from "golery-editor";

let {EditorToolbar, htmlSerializer, EditorController} = GoleryEditorLib;

class GoleryController extends EditorController {
    /**
     * When clicking on image button in toolbar, this method is called to open image dialge
     * Injected by library user
     * */
    async openInsertImageDialog() {
        return openUploadImageDialog();
    }

    /**
     * When paste an image, this method is called and allow user to modify image
     * Injected by library user
     * */
    async editImageOnPaste(pasteBlobUrl) {
        return openUploadImageDialog(pasteBlobUrl);
    }
}

export default class NodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.elmTopToolbarHolder = null;
        this.elmToolbar = null;

        let {node} = this.props;
        let html = node.html || ' ';
        let value = htmlSerializer.deserialize(html);
        if (value.texts.size === 0) {
            // This is a bug in slate: if the text is empty. There is exception
            value = htmlSerializer.deserialize(' ');
        }

        this.state = {showToolbar: false, slateValue: value};

        this.updateNodeNameScheduler = new DelayTaskScheduler();
        this.saveNodeScheduler = new DelayTaskScheduler();
        this.controller = new GoleryController();

        this.editorToolbarOptions = this.controller.getToolbarOptions();
        this.titleRef = React.createRef();
        this.htmlEditorRef = React.createRef();
    }

    render() {
        let {node, leftRightPadding} = this.props;
        let toggleToolbarButton = "fas fa-minus";
        let {slateValue} = this.state;
        const onChange = (change) => this._onChangeHtml(change);

        let elmToolbar;
        if (this.state.showToolbar) {
            elmToolbar = <EditorToolbar value={slateValue} onChange={onChange} options={this.editorToolbarOptions}/>;
        } else {
            elmToolbar = null;
            toggleToolbarButton = "fas fa-grip-horizontal";
        }

        const classNameContentPadding = leftRightPadding ? styles.contentPaddingLeftRightPadding : styles.contentPadding;
        return (
            <div className={[styles.component, "pencilTheme"].join(' ')}>
                <div>
                    {elmToolbar}
                </div>
                <div className={styles.contentHolder}>
                    <div className={classNameContentPadding}>
                        <TitleEditor
                            html={node.title}
                            placeHolder="<page-title>"
                            contentEditableClassName="nodeTitle"
                            onChange={html => this._onChangeTitle(html)}
                            ref={this.titleRef}
                            listeners={{onFinishEditing: () => this._onFinishEditTitle()}}
                        />

                        <HtmlEditor
                            value={slateValue}
                            contentEditableClassName="nodeHtml pencilTheme"
                            onChange={onChange}
                            addToolbar={(toolbarElm) => this._addToolbar(toolbarElm)}
                            controller={this.controller}
                            ref={this.htmlEditorRef}
                        />
                    </div>
                </div>
                <div className={styles.toggleToolbarButton} onClick={() => this._toggleToolbar()}>
                    <i className={toggleToolbarButton} />
                </div>
            </div>
        );
    }

    _onFinishEditTitle() {
        this.htmlEditorRef.current.focus();
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
        const {node} = this.props;
        node.title = html;
        this._onUpdateNode(node);
    }

    _onChangeNodeHtml(html) {
        const {node} = this.props;
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
        let {node} = this.props;
        if (!node.title) {
            this.titleRef.current.focus();
        } else {
            this.htmlEditorRef.current.focus();
        }
    }

    _onClickShare() {
        let modal = new ModalDialog();
        modal.show(<div><ShareEditor node={this.props.node}/></div>);
    }

    _onChangeHtml(change) {
        let value = change.value;
        let html = htmlSerializer.serialize(value);
        console.log("CHanged:", html);
        this._onChangeNodeHtml(html);

        this.setState({slateValue: value});
    }
}

NodeEditor.propTypes = {
    node: PropTypes.object,
    listeners: PropTypes.shape({
        onChangeNodeName: PropTypes.func
    })
};
