import styles from './Tree.css';
/* Event handling: treeV2 =(mouseevent)=> dragDrop =(dragevent)=> SortPlugins */
const MODE_SELECT = "SELECT";
const MODE_DRAGGING = "SORT";
const DROP_MODE_AS_CHILDREN = "CHILDREN";
const DROP_MODE_AFTER = "AFTER";
const DROP_MODE_BEFORE = "BEFORE";

export default class ReorderNodePlugin {
    constructor(treeModel, treeViewModel, renderPlugin, nodeSelectionPlugin) {
        this.treeModel = treeModel;
        this.treeViewModel = treeViewModel;
        this.renderPlugin = renderPlugin;
        this.nodeSelectionPlugin = nodeSelectionPlugin;

        this._mode = MODE_SELECT;
        this._draggedNode = null;
        this._dragTargetNode = null;
        this._dragTargetNodeView = null;
        this._dragTargetMode = DROP_MODE_AS_CHILDREN;
        this._textAtCursorElm = null;

    }

    install(treeElement) {
        this._textAtCursorElm = this._createDraggingElm(treeElement);
    }

    onStartDrag() {
        let draggedNode = this._draggedNode = this.treeViewModel.selectedNode;
        if (!draggedNode)
            return;

        this._mode = MODE_DRAGGING;

        this._showDraggingElm(draggedNode.name);
        this.nodeSelectionPlugin.closeNode(draggedNode);
    }

    onDrag(e) {
        if (this._mode === MODE_DRAGGING) {
            this._updateDraggingElmPosition(e);
        }
    }

    onMouseMoveOverNode(e, node, nodeView) {
        if (this._mode === MODE_DRAGGING) {
            this._captureDropTarget(e, node, nodeView);
        }
    }

    _captureDropTarget(e, node, nodeView) {
        let mode = this._dragTargetMode = this._computeDropMode(e, node, nodeView);

        if (mode) {
            this._dragTargetNode = node;
            this._dragTargetNodeView = nodeView;
        } else {
            this._dragTargetNode = null;
            this._dragTargetNodeView = null;
        }

        this._updateDropDecorator(nodeView, mode);
    }

    _updateDropDecorator(nodeView, mode) {
        nodeView.removeDropDecorators();
        if (mode === DROP_MODE_BEFORE) {
            nodeView.decorateDropBefore();
        } else if (mode === DROP_MODE_AFTER) {
            nodeView.decorateDropAfter();
        } else if (mode === DROP_MODE_AS_CHILDREN) {
            nodeView.decorateDropAsChildren();
        }
    }

    /**
     * Decides if the drop is as-children, before, after or cannot drop
     * Drop before: outside of text & < 50% height OR inside of text & y < 20%height
     * Drop as-children: inside of text
     * Cannot drop: drop as children of current node, before or after current node
     * */
    _computeDropMode(e, targetNode, targetNodeView) {
        if (this._draggedNode === targetNode) return null;

        let x = e.clientX;
        let y = e.clientY;
        let bound = targetNodeView.getTextBoundingClientRect();
        let margin = (bound.bottom - bound.top) * 0.2;
        let mid = (bound.top + bound.bottom) / 2.0;
        let onTopMargin = y < bound.top + margin;
        let onBottomMargin = y > bound.bottom - margin;

        let horizontallyOutsideOfTextElm = x < bound.left || x > bound.right;
        if (horizontallyOutsideOfTextElm && y < mid || onTopMargin) {
            return DROP_MODE_BEFORE;
        }

        if (horizontallyOutsideOfTextElm && y >= mid || onBottomMargin) {
            return DROP_MODE_AFTER;
        }

        return DROP_MODE_AS_CHILDREN;
    }

    onMouseLeaveNode() {
        if (this._mode === MODE_SELECT) return;
        this._clearDropDecorator();
    }

    onEndDrag() {
        let mode = this._dragTargetMode;
        if (!mode || !this._draggedNode || !this._dragTargetNode || !this._dragTargetNodeView) return;

        let index = 0;
        let parent = this._dragTargetNode;
        if (mode === DROP_MODE_BEFORE || mode === DROP_MODE_AFTER) {
            parent = this.treeModel.getParentNode(this.treeModel.getId(this._dragTargetNode));
            index = this.treeModel.getChildPosition(parent, this._dragTargetNode);
            if (mode === DROP_MODE_AFTER) {
                index++;
            }
        }

        if (!parent) return;

        this._moveNode(this._draggedNode, parent, index);
        this.onCancelDrag();
    }

    onCancelDrag() {
        this._mode = MODE_SELECT;
        this._hideDraggingElm();
        this._clearDropDecorator();
    }

    _updateDraggingElmPosition(e) {
        let x = e.clientX;
        let y = e.clientY;
        if (e.touches && e.touches[0]) {
            let touch = e.touches[0];
            x = touch.clientX;
            y = touch.clientY;
        }
        if (x && y) {
            this._textAtCursorElm.style.left = x + 10;
            this._textAtCursorElm.style.top = y - 5;
        }
    }

    /* Show dragging element which is close to the mouse pointer */
    _showDraggingElm(text) {
        this._textAtCursorElm.innerHTML = text;
        this._textAtCursorElm.style.display = 'inline-block';
    }

    _hideDraggingElm() {
        this._textAtCursorElm.style.display = 'none';
    }

    /* When drag, the title of the node moves together with cursor, we create hidden element and show it when dragging */
    _createDraggingElm(elmContainer) {
        let draggingElm = document.createElement('div');
        draggingElm.className = styles.draggingText;

        elmContainer.append(draggingElm);
        return draggingElm;
    }

    _moveNode(draggedNode, newParentNode, newPositionIndex) {
        let oldParentNode = this.treeModel.getParentNode(this.treeModel.getId(draggedNode));
        this.treeModel.moveNode(draggedNode, newParentNode, newPositionIndex);
        this.nodeSelectionPlugin.openNode(newParentNode);
        this.renderPlugin.renderSubTree(newParentNode);
        this.renderPlugin.renderSubTree(oldParentNode);
    }

    _clearDropDecorator() {
        if (!this._dragTargetNodeView) return;
        this._dragTargetNodeView.removeDropDecorators();
    }
}
