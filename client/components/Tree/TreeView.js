import React from 'react';
import styles from './Tree.css';

import TreeNodeView from './TreeNodeView';
import ReorderNodePlugin from './ReorderNodePlugin';
import DragDropPlugin from './DragDropPlugin';
import RenderPlugin from './RenderPlugin';
import NodeSelectionPlugin from './NodeSelectionPlugin';

/** React component for Tree */
export default class TreeView extends React.Component {
    constructor(props) {
        super(props);
        this.treeModel = this.props.treeModel;
        this.treeViewModel = this.props.treeViewModel;

        this.elmRoot = null;

        this.renderPlugin = new RenderPlugin(this.treeModel,
            (node) => this._createTreeNodeView(node));
        this.nodeSelectionPlugin = new NodeSelectionPlugin(this.treeModel, this.treeViewModel, this.renderPlugin,
            this.props.listeners.onSelect);
        this.dragDropPlugin = new DragDropPlugin((e) => this._onStartDrag(e), (e) => this._onDrag(e),
            (e) => this._onEndDrag(e), (e) => this._onCancelDrag(e));
        this.reorderNodePlugin = new ReorderNodePlugin(this.treeModel, this.treeViewModel, this.renderPlugin, this.nodeSelectionPlugin);
    }

    getSelectedNodeId() {
        let {selectedNode} = this.treeViewModel;
        return !selectedNode ? null : selectedNode._id;
    }

    addNewNodeAsChildren(newNode) {
        let {selectedNode} = this.treeViewModel;
        if (!selectedNode) return;

        return this._addChild(selectedNode, newNode, 0);
    }

    addNewNodeAsNextSiblings(newNode) {
        let {selectedNode} = this.treeViewModel;
        if (!selectedNode) return;

        let parent = this.treeModel.getParentNode(selectedNode._id);
        if (!parent) {
            console.log("Parent node not found");
            return;
        }

        let index = parent.children.indexOf(selectedNode._id);
        const position = index + 1;

        return this._addChild(parent, newNode, position);
    }

    _addChild(parentNode, newNode, position) {
        // first update model
        this.treeModel.addChild(parentNode, newNode, position);

        // create node view
        let newNodeView = this._createTreeNodeView(newNode);
        this._renderNodeView(newNodeView, newNode);

        // update parent node view
        let parentNodeView = TreeNodeView.findByNodeId(parentNode._id);
        parentNodeView.addChildAtPosition(newNodeView, position);

        // update selected node
        this.nodeSelectionPlugin.selectNode(newNode);
        return {parentNode, position, nodeView: newNodeView};
    }

    deleteSelectedNode() {
        let {selectedNode, selectedNodeView} = this.treeViewModel;
        if (!selectedNodeView || !selectedNode) return;

        this.treeModel.delete(selectedNode._id);
        selectedNodeView.deleteElement();
    }

    _renderNodeView(nodeView, node) {
        nodeView.setText(this.treeModel.getNodeName(node));
    }

    _createTreeNodeView(node) {
        return TreeNodeView.create(node._id,
            (e) => this.nodeSelectionPlugin.onMouseDownNodeConnector(e, node),
            (e) => this.nodeSelectionPlugin.onClickNodeTextHolder(e, node),
            (e) => this.nodeSelectionPlugin.onMouseDownNodeTextHolder(e, node),
            (e) => this._onMouseEnterNode(e, node),
            (e) => this._onMouseLeaveNode(e, node),
            (e, nodeView) => this.reorderNodePlugin.onMouseMoveOverNode(e, node, nodeView),
            (e, nodeView) => this.reorderNodePlugin.onMouseLeaveNode());
    }

    _hasData() {
        return this.treeModel && this.treeModel.getRoot();
    }

    updateText(node) {
        let view = TreeNodeView.findByNodeId(node._id);
        if (!view) {
            return;
        }
        node.name = this.treeModel.getNodeName(node);
        view.setText(node.name);
    }

    componentDidMount() {
        if (!this._hasData()) return;

        this.renderPlugin.render(this.elmRoot, this.treeModel.getRoot());

        this.reorderNodePlugin.install(this.elmRoot);
    }

    render() {
        return <div className={styles.tree} ref={(e) => this.elmRoot = e}
                    onDragStart={e => e.preventDefault()}
                    onDrop={e => e.preventDefault()}
                    onMouseUp={(e) => this.dragDropPlugin.onMouseUp(e)}
                    onMouseDown={(e) => this.dragDropPlugin.onMouseDown(e)}
                    onMouseMove={(e) => this.dragDropPlugin.onMouseMove(e)}
                    onMouseLeave={(e) => this.dragDropPlugin.onMouseLeave(e)}/>;
    }

    _onStartDrag(e) {
        this.reorderNodePlugin.onStartDrag(e);
    }

    _onDrag(e) {
        this.reorderNodePlugin.onDrag(e);
    }

    _onEndDrag(e) {
        this.reorderNodePlugin.onEndDrag(e);
    }

    _onCancelDrag(e) {
        this.reorderNodePlugin.onCancelDrag(e);
    }

    _onMouseEnterNode(e, node) {
        this.treeViewModel.hover.node = node;
    }

    _onMouseLeaveNode(e) {
        this.treeViewModel.hover.node = null;
    }
}
