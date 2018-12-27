import TreeNodeView from "./TreeNodeView";

export default class RenderPlugin {
    constructor(treeModel, createNodeView) {
        this.treeModel = treeModel;
        this.createNodeView = createNodeView;
    }

    render(elmHolder, root) {
        let rootNodeView = this.createSubTreeNodeView(root, null);
        elmHolder.appendChild(rootNodeView._element);
    }


    renderSubTree(node) {
        let nodeView = TreeNodeView.findByNodeId(this.treeModel.getId(node));
        let newNodeView = this.createSubTreeNodeView(node);
        nodeView.replaceRender(newNodeView);
    }

    /**
     * @param node - in order to render correctly the connector, we need to know if a node is the last node
     *             - This parameter is for performance. It's optional. If it's not password, method will find from
     *               node structure
     * @return subtree node view. This node view is not attached to DOM tree */
    createSubTreeNodeView(node, parent) {
        if (parent === undefined) {
            parent = this.treeModel.getParentNode(node.id);
        }
        let rootNodeView = this._renderNode(node, parent);

        if (!this._isChildrenListVisible(node)) return rootNodeView;

        for (let childId of node.children) {
            let child = this.treeModel.findById(childId);
            if (!child) {
                console.log('Child Id not found', childId);
            } else {
                let childNodeView = this.createSubTreeNodeView(child, node);
                rootNodeView.appendChild(childNodeView);
            }
        }
        return rootNodeView;
    }

    static _isLastChild(parent, root) {
        return parent && parent.children[parent.children.length - 1] === root.id;
    }

    static _updateConnectorBox(child, view, open) {
        let openBox = child.children !== null && child.children.length > 0 ? open : null;
        view.setConnectorBox(openBox);
    }

    _isChildrenListVisible(root) {
        if (!root.children || root.children.length === 0) return false;
        return this.treeModel.isOpen(root);

    }

    _renderNode(node, parent) {
        let rootNodeView = this.createNodeView(node, !parent);
        RenderPlugin._updateConnectorBox(node, rootNodeView, this.treeModel.isOpen(node));
        rootNodeView.setText(this.treeModel.getNodeName(node));
        if (RenderPlugin._isLastChild(parent, node)) {
            rootNodeView.setAsLastChild();
        }
        return rootNodeView;
    }
}
