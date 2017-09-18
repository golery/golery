import styles from "./PencilPage.css";

import React from "react";
import {Scrollbars} from 'react-custom-scrollbars';

import NodeRepo from "../../services/NodeRepo";
import HtmlEditor from "./Editor/HtmlEditor/HtmlEditor";
import HtmlSourceEditor from "./Editor/HtmlSourceEditor";
import TreeView from "../Tree/TreeView";
import TreeModel from "../Tree/TreeModel";
import TreeViewModel from "../Tree/TreeViewModel";
import HeadLineParser from "./HeadLineParser";
import DelayTaskScheduler from "./DelayTaskScheduler";
import Toolbar from "./Toolbar";
import TreeActionButtons from "./TreeActionButtons";
import Action from "./Action";
import LoadingPage from "./LoadingPage";
import SyncTracker from "./SyncTracker";
import HtmlContentView from "./Content/View/Html/HtmlContentView";
import ShortcutHandler from "./ShortcutHandler";

// = true: do not save the node data to database (use for dev)
const DISABLE_SAVE = false;

const DELAY_UPDATE_TITLE_MS = 400;
const DELAY_SAVE_MS = 3000;
const EDITOR_HTML = Symbol();
const EDITOR_HTML_SOURCE = Symbol();
const CONTENT_MODE_VIEW = "VIEW";
const CONTENT_MODE_EDIT = "EDIT";

class Node {
    constructor(_id, name) {
        this._id = _id;
        this.name = name;
    }
}

class PencilTreeModel extends TreeModel {
    constructor(nodes, rootId, listeners) {
        super(nodes, rootId, listeners);
    }

    getNodeName(node) {
        let name = node.name || HeadLineParser.parseTitle(node.html);
        if (!name || name.trim().length === 0)
            return "&lt;empty&gt;";
        return name;
    }
}

export default class PencilPage extends React.Component {
    constructor(props) {
        super(props);

        let {rootId, nodeId} = this.props.match ? this.props.match.params : {null, null};

        this.state = {
            nodes: null,
            contentMode: CONTENT_MODE_VIEW,
            editingId: nodeId,
            editor: EDITOR_HTML
        };
        this.treeModel = null;

        // ref to treeView element
        this.treeView = null;

        this.updateNodeTitleScheduler = new DelayTaskScheduler();
        this.saveNodeScheduler = new DelayTaskScheduler();

        this._load(rootId);

        this.onSelect = this.onSelect.bind(this);
        this.onUpdateEditor = this.onUpdateEditor.bind(this);

        let commands = this.treeCommands = [];
        Toolbar.addCommand(commands, this, 'Add', this._onAddNode, 'fa fa-plus');
        Toolbar.addCommand(commands, this, 'Delete', this._onDeleteNode, 'fa fa-close');
        Toolbar.addCommand(commands, this, 'Refresh', this._onShowEditView, 'fa fa-pencil');
        Toolbar.addCommand(commands, this, 'Play', this._onPlay, 'fa fa-play');

        this.treeActions = [
            new Action('fa fa-plus', () => this._onAddNode()),
            new Action('fa fa-close', () => this._onDeleteNode()),
            new Action('fa fa-pencil', () => this._onShowEditView()),
            new Action('fa fa-play', () => this._onPlay())
        ];

        this.syncTracker = new SyncTracker({
            startAnimation: () => {
            },
            stopAnimation: () => {
            }
        });

        this.shortcutHandler = new ShortcutHandler();
        this.shortcutHandler.register('view', 'F2', () => this._onShowEditView());
        this.shortcutHandler.register('view', 'Escape', () => this._onShowContentView());
    }

    render() {
        if (!this.treeModel) {
            return <LoadingPage/>;
        }

        let listeners = {onSelect: this.onSelect};
        return <div className={styles.component}>
            <div className={styles.treeViewHolder}>
                <div className={styles.treeToolbarHolder}>
                    <Toolbar commands={this.treeCommands} themeLight={true}/>
                </div>
                <Scrollbars autoHide={false} autoHideTimeout={500} autoHideDuration={100} universal
                            renderThumbVertical={this._renderThumbVertical}
                            renderThumbHorizontal={this._renderThumbHorizontal}>
                    <TreeView treeModel={this.treeModel} treeViewModel={this.treeViewModel} listeners={listeners}
                              ref={(treeView) => this.treeView = treeView}/>
                </Scrollbars>
                <div className={styles.treeActionButtonsHolder}><TreeActionButtons actions={this.treeActions}/>
                </div>
            </div>
            <div className={styles.editorHolder}>
                {this._buildContentElm()}
            </div>
        </div>;
    }

    _renderThumbVertical() {
        return <div className={styles.scrollbarVerticalThumb}/>;
    }

    _renderThumbHorizontal() {
        return <div className={styles.scrollbarHorizontalThumb}/>;
    }

    _onShowEditView() {
        this.setState({contentMode: CONTENT_MODE_EDIT});
        this._htmlEditor.focusEditor();
    }

    _onShowContentView() {
        this.setState({contentMode: CONTENT_MODE_VIEW});
    }


    _buildContentElm() {
        if (!this.state.editingNode) return;

        console.log(this.state);
        if (this.state.contentMode === CONTENT_MODE_VIEW) {
            return <HtmlContentView html={this.state.editingNode.html}></HtmlContentView>
        }
        if (this.state.editor === EDITOR_HTML) {
            return <HtmlEditor html={this.state.editingNode.html} editingContext={this.state.editingNode}
                               updateListener={this.onUpdateEditor}
                               ref={(ref) => this._htmlEditor = ref}
            />;
        }
        if (this.state.editor === EDITOR_HTML_SOURCE) {
            return <HtmlSourceEditor html={this.state.editingNode.html} editingContext={this.state.editingNode}
                                     updateListener={this.onUpdateEditor}/>;
        }
    }

    _load(rootId) {
        return NodeRepo.load(rootId).then(({nodes, rootNode}) => {
            this.treeModel = new PencilTreeModel(nodes, rootNode._id, {
                onMoveNode: (nodeId, newParentId, newPosition) => this._onMoveNode(nodeId, newParentId, newPosition)
            });
            this.treeViewModel = new TreeViewModel();

            let editingNode = null;
            if (this.state.editingId) {
                editingNode = this.treeModel.findById(this.state.editingId);
            }
            this.setState({nodes: nodes, rootId: rootNode._id, editingNode: editingNode});
        })
    }

    _onMoveNode(nodeId, newParentId, newPosition) {
        let taskId = this.syncTracker.startTask();
        NodeRepo.moveNode(nodeId, newParentId, newPosition)
            .then(() => this.syncTracker.stopTask(taskId));
    }

    onUpdateEditor(node, newHtml) {
        this.updateNodeTitleScheduler.schedule(DELAY_UPDATE_TITLE_MS, () => {
            node.html = newHtml;
            node.name = HeadLineParser.parseTitle(newHtml);
            this.treeView.updateText(node);
        });
        this.saveNodeScheduler.schedule(DELAY_SAVE_MS, () => {
            if (DISABLE_SAVE) return;
            NodeRepo.save(node);
        });
    }

    onSelect(node) {
        console.log(node);
        if (this._htmlEditor) {
            this._htmlEditor.focusEditor();
        }
        this.setState({editingNode: node, contentMode: CONTENT_MODE_VIEW});
    }

    _onAddNode() {
        let parentNode = this.treeViewModel.selectedNode;
        let parentNodeView = this.treeViewModel.selectedNodeView;
        if (!parentNode || !parentNodeView) return;

        NodeRepo.create(this.treeModel.getId(parentNode)).then(node => {
            this.treeView.newNodeAsChildren(node, parentNode, parentNodeView);
            this._onShowEditView();
        });
    }

    _onDeleteNode() {
        let nodeId = this.treeView.getSelectedNodeId();
        if (!nodeId) return;

        NodeRepo.delete(nodeId).then(() => {
            this.treeView.deleteSelectedNode();
        });
    }

    _onPlay() {
        let selectedNode = this.treeViewModel.selectedNode;
        if (!selectedNode) return;
        console.log(selectedNode);
        let id = selectedNode._id;
        window.open("#/card/" + id, '_blank');
    }
}