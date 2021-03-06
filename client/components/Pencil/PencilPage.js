import themeStyles from './Content/Theme/Standard.scss';
import styles from "./PencilPage.scss";

import React from "react";
import Axios from "axios";

import NodeRepo from "../../services/NodeRepo";
import NodeEditor from "./Content/Editor/NodeEditor";
import TreeView from "../Tree/TreeView";
import TreeModel from "../Tree/TreeModel";
import TreeViewModel from "../Tree/TreeViewModel";
import HeadLineParser from "./HeadLineParser";
import Toolbar from "./Toolbar";
import TreeActionButtons from "./TreeActionButtons";
import Action from "./Action";
import LoadingPage from "./LoadingPage";
import SyncTracker from "./SyncTracker";
import NodeView from "./Content/View/NodeView";
import ShortcutHandler from "./ShortcutHandler";
import ContextMenuView from "./ContextMenuView";
import TermsView from "./TermsView";
import AppMenu from "./AppMenu";
import ModalDialog from "../Core/Dialog/ModalDialog";
import Scrollbar from "./Scrollbar";
import Sandbox, {ENABLE_SANDBOX} from "./Sandbox/Sandbox";

// = true: do not save the node data to database (use for dev)
const DISABLE_SAVE = false;

const EDITOR_HTML = Symbol();
const CONTENT_MODE_VIEW = "VIEW";
const CONTENT_MODE_EDIT = "EDIT";

class Node {
    constructor(_id, name) {
        this._id = _id;
        // short name to be displayed in tree
        this.name = name;
        // full title
        this.title = null;
        this.html = null;
        this.children = [];
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

        let {rootId, nodeId} = this.props.match ? this.props.match.params : {rootId: null, nodeId: null};
        let {initialNode} = this.props.serverState || {initialNode: null};
        initialNode = initialNode || null;

        this.state = {
            nodes: null,
            // view or edit
            contentMode: CONTENT_MODE_VIEW,
            editingId: nodeId,
            editor: EDITOR_HTML,
            editingNode: initialNode || null,
            showTree: initialNode === null,
        };

        this.contextMenuView = null;
        this.treeModel = null;

        // ref to treeView element
        this.treeView = null;

        this._load(rootId);

        this.onSelect = this.onSelect.bind(this);

        let commands = this.toolbarCommands = [];
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

        this._registerShortcutKeys();
    }

    render() {
        if (Sandbox.isEnabled()) {
            return <Sandbox/>
        }

        if (!this.treeModel && typeof window !== "undefined" && window.location.pathname === ("/pencil")) {
            // only show loading if there is no initial nodeId
            return <LoadingPage/>;
        }
        let styleEditing = '';
        if (this.state.contentMode === CONTENT_MODE_EDIT) styleEditing = styles.editing;

        return <div className={[styles.component, styleEditing].join(' ')}>
            {this._buildTreeElm()}
            {this._buildContentElm()}
            <ContextMenuView ref={(view) => this.contextMenuView = view}/>
            <AppMenu onLogout={() => this._onLogout()} onShowTerms={() => this._onShowTerms()}/>
        </div>;
    }

    _buildTreeElm() {
        let {showTree} = this.state;
        if (!showTree) return this._buildTreeCollapseElm();


        let listeners = {onSelect: this.onSelect};
        return <div className={styles.treeViewHolder} onContextMenu={(e) => this._onContextMenuOnTree(e)}>
            <Scrollbar>
                <TreeView treeModel={this.treeModel} treeViewModel={this.treeViewModel} listeners={listeners}
                          ref={(treeView) => this.treeView = treeView}/>
            </Scrollbar>
            <div className={styles.treeToolTipHolder}>
                Right click on tree or Double click to edit
            </div>
            <div className={styles.treeActionButtonsHolder}><TreeActionButtons actions={this.treeActions}/></div>
        </div>;
    }


    _buildContentElm() {
        if (!this.state.editingNode) return;

        if (this.state.contentMode === CONTENT_MODE_VIEW) {
            return <div className={styles.contentPane} onDoubleClick={() => this._onShowEditView()}>
                <Scrollbar>
                    <NodeView node={this.state.editingNode}/>
                </Scrollbar>
            </div>;
        }

        if (this.state.editor === EDITOR_HTML) {
            return <div className={styles.contentPane}>
                <NodeEditor node={this.state.editingNode}
                            listeners={{onChangeNodeName: (node) => this._onChangeNodeName(node)}}
                            ref={ref => this._nodeEditor = ref}/>
                <div className={styles.doneEditButton}
                     onClick={() => this._closeEditor()}>CLOSE
                </div>
            </div>;
        }
    }

    _closeEditor() {
        this.setState({contentMode: CONTENT_MODE_VIEW});
    }

    _buildTreeCollapseElm() {
        return <div className={styles.collapsedTree} onClick={() => this._toggleTree()}/>;
    }

    _toggleTree() {
        if (!this.state.showTree && !this.state.nodes) {
            window.location.href = "/pencil";
        }
        this.setState({showTree: !this.state.showTree});
    }

    _registerShortcutKeys() {
        let shortcutHandler = new ShortcutHandler();
        shortcutHandler.register('view', 'F2', () => this._onShowEditView());
        shortcutHandler.register('view', 'F3', (e) => {
            this._onAddNode();
            // F3 is search in chrome
            e.stopPropagation();
            e.preventDefault();
        });
        shortcutHandler.register('view', 'Escape', () => this._onShowContentView());
    }

    _renderThumbVertical() {
        return <div className={styles.scrollbarVerticalThumb}/>;
    }

    _renderThumbHorizontal() {
        return <div className={styles.scrollbarHorizontalThumb}/>;
    }

    _onShowEditView() {
        this.setState({contentMode: CONTENT_MODE_EDIT});
        window.setTimeout(() => {
            this._nodeEditor.focus();
        });
    }

    _onShowContentView() {
        this.setState({contentMode: CONTENT_MODE_VIEW});
    }

    _load(rootId) {
        if (typeof window === 'undefined') return;
        return NodeRepo.load(rootId).then(({nodes, rootNode}) => {
            this.treeModel = new PencilTreeModel(nodes, rootNode._id, {
                onMoveNode: (nodeId, newParentId, newPosition) => this._onMoveNode(nodeId, newParentId, newPosition)
            });
            this.treeViewModel = new TreeViewModel();

            let state = {nodes: nodes, rootId: rootNode._id};
            this.setState(state);
        })
    }

    _onMoveNode(nodeId, newParentId, newPosition) {
        let taskId = this.syncTracker.startTask();
        NodeRepo.moveNode(nodeId, newParentId, newPosition)
            .then(() => this.syncTracker.stopTask(taskId));
    }

    onSelect(node) {
        this.setState({editingNode: node, contentMode: CONTENT_MODE_VIEW});
    }

    _onAddNode(asNextSibling) {
        if (!this.treeViewModel.selectedNode) return;

        let newNode = this._createNewEmptyNode();

        let {parentNode, position, nodeView} = asNextSibling ?
            this.treeView.addNewNodeAsNextSiblings(newNode) :
            this.treeView.addNewNodeAsChildren(newNode);

        this._onShowEditView();

        // save async
        NodeRepo.create(parentNode._id, position).then(createdNode => {
            let newId = createdNode._id;
            console.log("Create new node successfully at server side ", newId);
            console.log("Replace nodeId ", newNode._id, " by ", newId);
            this.treeModel.updateNodeId(newNode, parentNode, newId);
            nodeView.changeNodeId(newId);
        });
    }

    _createNewEmptyNode() {
        let node = new Node("TEMP" + this._uuidv4(), null);
        node.html = "<ol><li/></ol>";
        return node;
    }

    _onDeleteNode() {
        let nodeId = this.treeView.getSelectedNodeId();
        if (!nodeId) return;

        // immediately remove from view
        this.treeView.deleteSelectedNode();

        // then delete node async
        NodeRepo.delete(nodeId).then(() => {
            console.log("Delete node successfully at server side ", nodeId);
        });
    }

    _onPlay() {
        let selectedNode = this.treeViewModel.selectedNode;
        if (!selectedNode) return;
        console.log(selectedNode);
        let id = selectedNode._id;
        window.open("#/card/" + id, '_blank');
    }

    _uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    }

    _onChangeNodeName(node) {
        this.treeView.updateText(node);
    }

    _onContextMenuOnTree(e) {
        this.contextMenuView.show(e.clientX, e.clientY, [{
            name: 'Add',
            action: () => this._onAddNode(false)
        }, {
            name: 'Add below',
            action: () => this._onAddNode(true)
        }, {
            name: 'Remove',
            action: () => this._onDeleteNode()
        }, {
            name: 'Edit',
            action: () => this._onShowEditView()
        }, {
            name: 'Play',
            action: () => this._onPlay()
        }]);
        e.stopPropagation();
        e.preventDefault();
    }

    _onLogout() {
        Axios.post("/api/secure/logout").then(function () {
            location.reload();
        }).catch(error => {
            alert('Fail to logout');
        });
    }

    _onShowTerms() {
        new ModalDialog().show(<TermsView/>);
    }
}
