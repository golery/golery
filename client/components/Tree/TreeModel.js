/**
 * The library does not know about the structure of Node.
 * All access and manipulate are done via TreeModel (including id, children).
 * The application who uses the TreeComponent and override method in TreeModel to have a customized node structure
 * WARN ! This is the only class who has direct access to Node object
 * */
class Node {
    // Only TreeModel can directly access and manipulate the attribute via method
    // Ex: access to id must be go through getId();
    constructor(id) {
        this.id = id;
        // a list of node ID (not node object)
        // there is a method TreeModel.findById() to find the node object
        this.children = null;
    }
}

/** Maintains the list of nodes, the map from id to Node object, the map to parent Id */
export default class TreeModel {
    constructor(nodes, rootId, listeners) {
        this.map = this._buildMap(nodes);
        // key: node Id, value: parent node Id
        this._parentMap = this._buildParentMap(nodes);
        this.root = this.findById(rootId);
        this.listeners = listeners || {};
    }

    delete(id) {
        let parentId = this.getParentId(id);
        let parent = this.findById(parentId);
        let index = parent.children.indexOf(id);
        if (index >= 0) {
            parent.children.splice(index, index + 1);
        }
    }

    _buildMap(nodes) {
        let map = {};
        for (let node of nodes) {
            map[node.id] = node;
        }
        return map;
    }

    _buildParentMap(nodes) {
        let map = {};
        for (let node of nodes) {
            if (node.children) {
                for (let childrenId of node.children) {
                    map[childrenId] = node.id;
                }
            }
        }
        return map;
    }

    getParentId(childId) {
        return this._parentMap[childId];
    }

    getParentNode(nodeId) {
        if (nodeId.id) throw 'Need id rather than node object';

        let parentId = this.getParentId(nodeId);
        if (!parentId) return null;
        return this.findById(parentId);
    }

    getChildPosition(parent, node) {
        if (!parent.children) return null;

        let id = node.id;
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i] === id) return i;
        }
        return null;
    }

    getChildrenIds(node) {
        return node.children;
    }

    addChild(parent, newNode, position) {
        let newNodeId = newNode.id;
        if (!parent.children) {
            parent.children = [newNodeId];
        } else {
            parent.children.splice(position, position, newNodeId);
        }
        this.map[newNodeId] = newNode;
        this._parentMap[newNodeId] = parent.id;
    }

    findById(id) {
        if (!id) {
            console.log('Undefined id');
            return null;
        }

        let node = this.map[id];
        // if (!node) {
        //     console.log('Node ', id, ' not found');
        // }
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

        let id = node.id;
        let open = localStorage.getItem(this._getLocalStorageKey(id));
        return open === "true";
    }

    setOpen(node, open) {
        if (this._isRoot(node)) return;
        localStorage.setItem(this._getLocalStorageKey(node.id), open);
    }

    _isRoot(node) {
        if (!node) return false;
        return node.id === this.root.id;
    }

    _getLocalStorageKey(nodeId) {
        return "node.open." + nodeId;
    }

    getId(node) {
        return node.id;
    }

    moveNode(node, newParent, newPosition) {
        let id = node.id;
        let curParent = this.getParentNode(id);
        if (curParent.id !== newParent.id) {
            this._changeParent(node, newParent, newPosition);
        } else {
            this._changePosition(node, curParent, newPosition);
        }

        if (this.listeners.onMoveNode) {
            this.listeners.onMoveNode(id, newParent.id, newPosition);
        }
    }

    _changeParent(node, newParent, newPosition) {
        if (this._isAncestor(node, newParent)) {
            throw 'Cannot set a node to be a child of its child node. This cause a loop';
        }

        let id = node.id;
        let curParent = this.getParentNode(id);

        // remove from current parent
        let arr = curParent.children;
        let index = arr.indexOf(id);
        arr.splice(index, 1);

        // add to new parent
        newParent.children = newParent.children || [];
        newParent.children.splice(newPosition, 0, id);

        // update index
        this._parentMap[id] = newParent.id;
    }

    _changePosition(node, parent, newIndex) {
        console.log("Change position to ", newIndex);
        // new index is the index without removing dragged node§
        let id = node.id;
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
        let id = node.id;
        while (id) {
            if (id === ancestor.id) {
                return true;
            }
            id = this.getParentId(id);
        }
        return false;
    }

    /** After create node, replace temporary nodeId by new one from server side */
    updateNodeId(node, parentNode, newId, newId62) {
        let oldId = node.id;
        let index = parentNode.children.indexOf(oldId);
        parentNode.children[index] = newId;
        node.id = newId;
        node.id62 = newId62;

        // update index
        this.map[newId] = node;
        delete this.map[oldId];
        this._parentMap[newId] = parentNode.id;
        delete this._parentMap[oldId];
    }
}
