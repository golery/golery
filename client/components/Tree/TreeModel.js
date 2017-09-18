/**
 * The library does not know about the structure of Node.
 * All access and manipulate are done via TreeModel (including _id, children).
 * The application who uses the TreeComponent and override method in TreeModel to have a customized node structure
 * WARN ! This is the only class who has direct access to Node object
 * */
class Node {
    // Only TreeModel can directly access and manipulate the attribute via method
    // Ex: access to _id must be go through getId();
    constructor(_id) {
        this._id = _id;
        // a list of node ID (not node object)
        // there is a method TreeModel.findById() to find the node object
        this.children = null;
    }
}

/** Maintains the list of nodes, the map from id to Node object, the map to parent Id */
export default class TreeModel {
    constructor(nodes, rootId, listeners) {
        this.nodes = nodes;
        this.map = this._buildMap(nodes);
        // key: node Id, value: parent node Id
        this._parentMap = this._buildParentMap(nodes);
        this.root = this.findById(rootId);
        this.listeners = listeners || {};
    }

    delete(_id) {
        let parentId = this.getParentId(_id);
        let parent = this.findById(parentId);
        let index = parent.children.indexOf(_id);
        if (index >= 0) {
            parent.children.splice(index, index + 1);
        }
    }

    _buildMap(nodes) {
        let map = {};
        for (let node of nodes) {
            map[node._id] = node;
        }
        return map;
    }

    _buildParentMap(nodes) {
        let map = {};
        for (let node of nodes) {
            if (node.children) {
                for (let childrenId of node.children) {
                    map[childrenId] = node._id;
                }
            }
        }
        return map;
    }

    getParentId(childId) {
        return this._parentMap[childId];
    }

    getParentNode(nodeId) {
        if (nodeId._id) throw 'Need id rather than node object';

        let parentId = this.getParentId(nodeId);
        if (!parentId) return null;
        return this.findById(parentId);
    }

    getChildPosition(parent, node) {
        if (!parent.children) return null;

        let id = node._id;
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i] === id) return i;
        }
        return null;
    }

    getChildrenIds(node) {
        return node.children;
    }

    addChild(parent, child) {
        let childId = child._id;
        if (!parent.children) {
            parent.children = [childId];
        } else {
            parent.children.unshift(childId);
        }
        this.map[childId] = child;
        this._parentMap[childId] = parent._id;
    }

    findById(id) {
        if (!id) {
            console.log('Undefined id');
            return null;
        }

        let node = this.map[id];
        if (!node) {
            console.log('Node ', id, ' not found');
        }
        return node;
    }

    getRoot() {
        return this.root;
    }

    isOpen(node) {
        if (this._isRoot(node)) {
            // Root node is always open
            return true;
        }

        let id = node._id;
        let open = localStorage.getItem(this._getLocalStorageKey(id));
        return open === "true";
    }

    setOpen(node, open) {
        if (this._isRoot(node)) return;
        localStorage.setItem(this._getLocalStorageKey(node._id), open);
    }

    _isRoot(node) {
        if (!node) return false;
        return node._id === this.root._id;
    }

    _getLocalStorageKey(nodeId) {
        return "node.open." + nodeId;
    }

    getId(node) {
        return node._id;
    }

    moveNode(node, newParent, newPosition) {
        let id = node._id;
        let curParent = this.getParentNode(id);
        if (curParent._id !== newParent._id) {
            this._changeParent(node, newParent, newPosition);
        } else {
            this._changePosition(node, curParent, newPosition);
        }

        if (this.listeners.onMoveNode) {
            this.listeners.onMoveNode(id, newParent._id, newPosition);
        }
    }

    _changeParent(node, newParent, newPosition) {
        if (this._isAncestor(node, newParent)) {
            throw 'Cannot set a node to be a child of its child node. This cause a loop';
        }

        let id = node._id;
        let curParent = this.getParentNode(id);

        // remove from current parent
        let arr = curParent.children;
        let index = arr.indexOf(id);
        arr.splice(index, 1);

        // add to new parent
        newParent.children = newParent.children || [];
        newParent.children.splice(newPosition, 0, id);

        // update index
        this._parentMap[id] = newParent._id;
    }

    _changePosition(node, parent, newIndex) {
        console.log("Change position to ", newIndex);
        // new index is the index without removing dragged node§
        let id = node._id;
        let childrenIds = parent.children;
        let curIndex = childrenIds.indexOf(id);

        // remove or add the order depends on whether newIndex < curIndex
        if (newIndex <= curIndex) {
            childrenIds.splice(curIndex, 1);
            childrenIds.splice(newIndex, 0, id);
        } else {
            childrenIds.splice(newIndex, 0, id);
            childrenIds.splice(curIndex, 1);
        }
    }

    _isAncestor(ancestor, node) {
        // quick test
        if (ancestor === node) return true;
        let childrenIds = ancestor.children;
        if (!childrenIds || childrenIds.length === 0) return false;

        // iterate up to root of tree
        let id = node._id;
        while (id) {
            if (id === ancestor._id) {
                return true;
            }
            id = this.getParentId(id);
        }
        return false;
    }
}
