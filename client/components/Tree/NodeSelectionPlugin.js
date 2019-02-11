import TreeNodeView from './TreeNodeView';

export default class NodeSelectionPlugin {
    constructor(treeModel, treeViewModel, renderPlugin, onSelectListener) {
        this.treeModel = treeModel;
        this.treeViewModel = treeViewModel;
        this.renderPlugin = renderPlugin;
        this.onSelectListener = onSelectListener;
        this.nodeIdToToggle = null;
    }

    onKeyDown(e) {
        console.log(e.keyCode);
        let node = this.treeViewModel.selectedNode;
        if (!node) {
            return;
        }

        if (e.keyCode === 38) {
            this._selectPrev(node);
        }
        else if (e.keyCode === 40) {
            this._selectNext(node);
        }
        else if (e.keyCode === 37) {
            // left arrow
        }
        else if (e.keyCode === 39) {
            // right arrow
        }
    }

    _selectPrev(node) {
        let {treeModel} = this;
        let id = treeModel.getId(node);
        let parent = treeModel.getParentNode(id);
        if (!parent) {
            // Root node
            return;
        }
        let childPos = treeModel.getChildPosition(parent, node);
        if (childPos === 0) {
            this.selectNode(parent);
        } else {
            childPos -= 1;
            let nextId = treeModel.getChildrenIds(parent)[childPos];
            let next = treeModel.findById(nextId);
            next = this._findLastOpenNode(next);
            this.selectNode(next);
        }
    }

    _findLastOpenNode(node) {
        let {treeModel} = this;
        if (!treeModel.isOpen(node)) {
            return node;
        }

        let children = treeModel.getChildrenIds(node);
        if (!children || children.length === 0) {
            return node;
        }

        let lastChild = treeModel.findById(children[children.length - 1]);
        return this._findLastOpenNode(lastChild);
    }

    _selectNext(node) {
        let {treeModel} = this;
        let id = treeModel.getId(node);
        let parent = treeModel.getParentNode(id);
        if (!parent) {
            // Root node
            return;
        }

        let childrenIds = treeModel.getChildrenIds(parent, node);
        if (childrenIds && childrenIds.length > 0 && treeModel.isOpen(node)) {
            let next = treeModel.findById(childrenIds[0]);
            this._selectNext(next);
        } else {
            let childPos = treeModel.getChildPosition(parent, node);
            if (childPos < childrenIds.length - 1) {
                childPos += 1;
                let nextId = childrenIds[childPos];
                let next = treeModel.findById(nextId);
                this.selectNode(next);
            } else {
                this._selectNext(parent);
            }
        }
    }

    /** When mouse down (even if user intends to drag node), select the node immediately.
     * Note that we only toggle the node when user fully clicks node */
    onMouseDownNodeTextHolder(e, node) {
        console.log('Select ', node.id, node.id62);
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
