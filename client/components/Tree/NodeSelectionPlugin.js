import TreeNodeView from './TreeNodeView';
import DelayTaskScheduler from './DelayTaskScheduler';
import {SelectContext} from './TreeConstants';

export default class NodeSelectionPlugin {
    constructor(treeModel, treeViewModel, renderPlugin, onSelectListener, options) {
        this.treeModel = treeModel;
        this.treeViewModel = treeViewModel;
        this.renderPlugin = renderPlugin;
        this.onSelectListener = onSelectListener;
        this.nodeIdToToggle = null;
        this.options = options;
        this.selectNodeScheduler = new DelayTaskScheduler();
    }

    onKeyDown(e) {
        let node = this.treeViewModel.selectedNode;
        if (!node) {
            return;
        }

        if (e.keyCode === 38) {
            // up
            this._consumeKeyEvent(e);
            this._selectPrev(node);
        } else if (e.keyCode === 40) {
            // down
            this._consumeKeyEvent(e);
            this._selectNext(node);
        } else if (e.keyCode === 37) {
            // left
            this._consumeKeyEvent(e);
            this._close(node);
        } else if (e.keyCode === 39) {
            // right
            this._consumeKeyEvent(e);
            this._open(node);
        }
    }

    _consumeKeyEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    _open(node) {
        let {treeModel} = this;
        if (treeModel.isOpen(node)) {
            let childrenIds = treeModel.getChildrenIds(node);
            if (childrenIds && childrenIds.length > 0) {
                let child = treeModel.findById(childrenIds[0]);
                if (child) {
                    this.selectNode(child);
                } else {
                    console.log('First child is orphan');
                }
            }
        } else {
            this._setOpen(node, true);
        }
    }

    _close(node) {
        let {treeModel} = this;
        if (treeModel.isOpen(node)) {
            this._setOpen(node, false);
        } else {
            let parent = treeModel.getParentNode(treeModel.getId(node));
            if (parent) {
                this.selectNode(parent);
            }
        }
    }

    _setOpen(node, open) {
        this.treeModel.setOpen(node, open);
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
        let childrenIds = treeModel.getChildrenIds(parent);
        let prevSibling;

        for (childPos -= 1; childPos >= 0 && !prevSibling; childPos -= 1) {
            // sometimes, there are orphan node (due to bug duplicate of node)
            // just skip those orphan nodes
            let prevSiblingId = childrenIds[childPos];
            prevSibling = treeModel.findById(prevSiblingId);
        }
        if (prevSibling) {
            let prev = this._findLastOpenNode(prevSibling);
            this.selectNode(prev, SelectContext.SELECT_BY_KEY);
        } else {
            // no sibling, just select parent
            this.selectNode(parent, SelectContext.SELECT_BY_KEY);
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
        let childrenIds = treeModel.getChildrenIds(node);
        if (childrenIds && childrenIds.length > 0 && treeModel.isOpen(node)) {
            // if node is open, select his first child
            let next = treeModel.findById(childrenIds[0]);
            this.selectNode(next, SelectContext.SELECT_BY_KEY);
        } else {
            let sibling = this._getNextSibling(treeModel, node);
            if (sibling) {
                this.selectNode(sibling, SelectContext.SELECT_BY_KEY);
            }
        }
    }

    _getNextSibling(treeModel, node) {
        let parent = treeModel.getParentNode(treeModel.getId(node));
        if (!parent) return null;
        let childrenIds = treeModel.getChildrenIds(parent);
        let childPos = treeModel.getChildPosition(parent, node);

        for (childPos += 1; childPos < childrenIds.length; childPos += 1) {
            // sometimes nodes are duplicated (not sure the reason), after delete there is orphan nodes
            // just skip those
            let nextId = childrenIds[childPos];
            let next = treeModel.findById(nextId);
            if (next) {
                return next;
            }
        }

        return this._getNextSibling(treeModel, parent);
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

    selectNode(node, selectContext) {
        let currentSelection = this.treeViewModel.selectedNodeView;
        if (currentSelection) {
            currentSelection.setElementAsUnselected();
        }

        this.treeViewModel.selectedNode = node;
        this.treeViewModel.selectedNodeView = TreeNodeView.findByNodeId(node.id);
        this.treeViewModel.selectedNodeView.setElementAsSelected(this.options.getScrollbar);

        this._callSelectListener(selectContext, node);

        return this.treeViewModel.selectedNodeView;
    }

    _callSelectListener(selectContext, node) {
        if (selectContext === SelectContext.SELECT_BY_KEY) {
            console.log('Delay select node');
            this.selectNodeScheduler.schedule(200, () => {
                // Don't select and render the node content immediately
                // because user can use keyboard to quickly navigate the node list
                this.onSelectListener(node, selectContext);
            });
        } else {
            this.onSelectListener(node, selectContext);
        }
    }
}
