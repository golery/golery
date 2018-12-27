import TreeNodeView from './TreeNodeView';

export default class NodeSelectionPlugin {
    constructor(treeModel, treeViewModel, renderPlugin, onSelectListener) {
        this.treeModel = treeModel;
        this.treeViewModel = treeViewModel;
        this.renderPlugin = renderPlugin;
        this.onSelectListener = onSelectListener;
        this.nodeIdToToggle = null;
    }

    /** When mouse down (even if user intends to drag node), select the node immediately.
     * Note that we only toggle the node when user fully clicks node */
    onMouseDownNodeTextHolder(e, node) {
        console.log('Select ', node.id);
        e.preventDefault();

        // Was target selected? If not, select node

        if (this._wasNodeSelected(node.id)) {
            this.nodeIdToToggle = node.id;
        } else {
            this.selectNode(node);
            this.nodeIdToToggle = null;
        }
    }

    onClickNodeTextHolder(e, child) {
        e.preventDefault();

        // when mouse down on selected node and user didn't drag the node then toggle node
        if (child.id && child.id === this.nodeIdToToggle) {
            this._toggleNode(child);
        }
    }

    onMouseDownNodeConnector(e, child) {
        e.preventDefault();

        // Was target selected? If not, select node

        if (!this._wasNodeSelected(child.id)) {
            this.selectNode(child);
        }
        this._toggleNode(child);
    }

    closeNode(node) {
        let open = this.treeModel.isOpen(node);
        if (open) {
            this._setOpen(node, false);
        }
    }

    openNode(node) {
        let open = this.treeModel.isOpen(node);
        if (!open) {
            this._setOpen(node, true);
        }
    }

    _wasNodeSelected(nodeId) {
        let {selectedNode, selectedNodeView} = this.treeViewModel;
        return selectedNodeView && selectedNode.id === nodeId;
    }

    _toggleNode(node) {
        // inverse open flag (in local repository)
        let open = !this.treeModel.isOpen(node);
        this._setOpen(node, open);
    }

    _setOpen(node, open) {
        this.treeModel.setOpen(node, open);
        let parent = this.treeModel.getParentNode(this.treeModel.getId(node));
        let newNodeView = this.renderPlugin.createSubTreeNodeView(node, parent);
        newNodeView.setElementAsSelected();
        this.treeViewModel.selectedNodeView = newNodeView;

        let nodeView = TreeNodeView.findByNodeId(this.treeModel.getId(node));
        nodeView.replaceRender(newNodeView);
    }

    selectNode(node) {
        let currentSelection = this.treeViewModel.selectedNodeView;
        if (currentSelection) {
            currentSelection.setElementAsUnselected();
        }

        this.treeViewModel.selectedNode = node;
        this.treeViewModel.selectedNodeView = TreeNodeView.findByNodeId(node.id);
        this.treeViewModel.selectedNodeView.setElementAsSelected();
        this.onSelectListener(node);
        return this.treeViewModel.selectedNodeView;
    }
}
