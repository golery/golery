import styles from './Tree.css';

import DomUtils from './DomUtils';

/**
 *
 * This class is a react-like component for one node.
 * This class encapsulates the render logic of a node. It's the only class who knows about the DOM structure of a node.
 * It does not have reference to Node object. It does not know the structureo of Node object. This class is just a set
 * of methods for manipulate DOM structure
 *
 * NOTE:
 * 1)  This object keeps reference to element. Thus do not create node view for all node object.
 * 2) Do no manually create a new object of this class. Use TreeNodeView.findByNodeId or TreeNodeView.create()
 */
/*
 1) DOM Structure:
 NodeTree
 --#nodeHolder
 ----Vertical line
 ----Connector holder
 ----Text holder (wide and receive event handler)
 ------Text (auto width, for display the cursor)
 --#childrenList
 -----NodeTree
 -----NodeTree
 2) Map from node to element
 The NodeTree has a special id: "node-<node_id>". This class use method document.getElementId to find element quickly
 */

const ELM_ATTR_NODE_ID = 'nodeid';
const ELM_ID_CHILDREN_LIST = 'childrenList';

export default class TreeNodeView {
    /** This constructor is for internal used only. To create new object, use findByNodeId() or create()*/
    constructor(elm) {
        this._element = elm;
    }

    /** Given a node ID, search for the element and return a TreeNodeView wrapper of that element */
    static findByNodeId(nodeId) {
        let elmId = this._getElementId(nodeId);
        let elm = document.getElementById(elmId);
        if (!elm) return null;
        return new TreeNodeView(elm);
    }

    static create(nodeId, onMouseDownConnector, onClickTextHolder, onMouseDownTextHolder, onMouseEnterTextHolder,
                  onMouseLeaveTextHolder, onMouseMoveOverNode, onMouseLeaveNode) {
        // Small line that connect the node to vertical line
        let elmConnectorHorz = DomUtils.createDiv(null, styles.connectorHorz);

        let elmConnectorHolder = DomUtils.createDiv('connectorHolder', styles.connectorHolder);
        elmConnectorHolder.appendChild(elmConnectorHorz);

        let elmVerticalLine = DomUtils.createDiv('verticalLine', styles.verticalLine);

        // Text is put in a separate element to capture "click" event
        let elmText = DomUtils.createDiv('text', styles.text);

        let elmTextHolder = DomUtils.createDiv(null, styles.textHolder);
        elmTextHolder.appendChild(elmText);

        let elmNodeHolder = DomUtils.createDiv('nodeHolder', styles.nodeHolder);
        elmNodeHolder.appendChild(elmVerticalLine);
        elmNodeHolder.appendChild(elmConnectorHolder);
        elmNodeHolder.appendChild(elmTextHolder);

        let elmNodeTree = DomUtils.createDiv(TreeNodeView._getElementId(nodeId), styles.nodeTree);
        elmNodeTree.setAttribute(ELM_ATTR_NODE_ID, nodeId);
        elmNodeTree.appendChild(elmNodeHolder);

        let nodeView = new TreeNodeView(elmNodeTree);
        // add event listener
        if (onMouseLeaveTextHolder) {
            elmTextHolder.addEventListener('mouseenter', (e) => onMouseEnterTextHolder(e));
            elmTextHolder.addEventListener('mouseleave', (e) => onMouseLeaveTextHolder(e));
            elmTextHolder.addEventListener('mousedown', (e) => onMouseDownTextHolder(e));
            elmTextHolder.addEventListener('click', (e) => onClickTextHolder(e));
            elmConnectorHolder.addEventListener('mousedown', (e) => onMouseDownConnector(e));
            elmTextHolder.addEventListener('mousemove', (e) => onMouseMoveOverNode(e, nodeView));
            elmTextHolder.addEventListener('mouseleave', (e) => onMouseLeaveNode(e, nodeView));
        }
        return nodeView;
    }


    /** Replace current nodeId by new nodeId (ex: when create node, we use temporary Id and then replace it */
    changeNodeId(newId) {
        let elm = this._element;
        elm.setAttribute("id", TreeNodeView._getElementId(newId));
        elm.setAttribute(ELM_ATTR_NODE_ID, newId);
    }

    getElement() {
        throw "Never implement this method. It's forbidden to get the element from NodeView";
    }

    getTextBoundingClientRect() {
        let elmText = DomUtils.findById(this._element, 'text');
        return elmText.getBoundingClientRect();
    }

    addFirstChild(childNodeView) {
        let elmChildrenList = this._getChildrenListElement();
        let elmChild = childNodeView._element;
        if (elmChildrenList.children.length === 0) {
            elmChildrenList.appendChild(elmChild);
        } else {
            elmChildrenList.insertBefore(elmChild, elmChildrenList.childNodes[0]);
        }
    }

    appendChild(childNodeView) {
        let elmChildrenList = this._getChildrenListElement();
        let elmChild = childNodeView._element;
        elmChildrenList.appendChild(elmChild);
    }

    deleteElement() {
        let elmParent = this._element.parentElement;
        if (elmParent.id !== ELM_ID_CHILDREN_LIST) {
            console.error('Parent is not children list');
            return;
        }

        elmParent.removeChild(this._element);
    }

    setElementAsSelected() {
        let elmText = DomUtils.findById(this._element, 'text');
        if (!elmText) return;

        let current = elmText.className;
        if (!current) current = '';
        if (current.indexOf(styles.selected) < 0) {
            elmText.className = current + ' ' + styles.selected;
        }
    }

    setElementAsUnselected() {
        let elmText = DomUtils.findById(this._element, 'text');
        if (!elmText) return;

        let current = elmText.className;
        if (!current) return;
        elmText.className = current.replace(styles.selected, '');
    }

    removeChildrenElements() {
        let elm = this._element;
        let elmNodeList = DomUtils.findById(this._element, 'childrenList');
        if (!elmNodeList) return;

        // remove all nodes in nodeList elm
        while (elmNodeList.firstChild) {
            elmNodeList.removeChild(elmNodeList.lastChild);
        }
        // remove the nodeList elm itself
        elm.removeChild(elmNodeList);
    }

    setConnectorBox(open) {
        let elm = this._element;
        let elmConnectorHolder = DomUtils.findById(elm, 'connectorHolder');
        if (!elmConnectorHolder) return;

        let elmConnectorBox = DomUtils.findById(elmConnectorHolder, 'connectorBox');

        if (open === null) {
            if (elmConnectorBox) {
                elmConnectorHolder.removeChild(elmConnectorBox);
            }
        } else {
            if (!elmConnectorBox) {
                elmConnectorBox = DomUtils.createDiv('connectorBox', null);
                elmConnectorHolder.appendChild(elmConnectorBox);
            }

            let className = open ? styles.connectorOpen : styles.connectorClose;
            elmConnectorBox.className = className;
        }
    }

    setText(text) {
        let elmText = DomUtils.findById(this._element, 'text');
        if (!elmText) {
            console.log('No element text');
            return;
        }
        elmText.innerHTML = text;
    }

    setAsLastChild() {
        this._element.classList.add(styles.lastChild);
    }

    decorateDropAsChildren() {
        // draw rectangle around title to indicate that the drop will be as children
        this._element.classList.add(styles.dropAsChildren);
    }

    decorateDropBefore() {
        // draw a short line to indicate that the node will be dropped before the drop target
        this._element.classList.add(styles.dropBefore);
    }

    decorateDropAfter() {
        // draw a short line to indicate that the node will be dropped after the drop target
        this._element.classList.add(styles.dropAfter);
    }

    removeDropDecorators() {
        // draw rectangle around title to indicate that the drop will be as children
        this._element.classList.remove(styles.dropAsChildren);
        this._element.classList.remove(styles.dropBefore);
        this._element.classList.remove(styles.dropAfter);
    }

    _getChildrenListElement() {
        let elmChildrenList = this._findChildrenListElement();
        if (!elmChildrenList) {
            elmChildrenList = this._createChildrenListElement();
        }
        return elmChildrenList;
    }

    _findChildrenListElement() {
        return DomUtils.findById(this._element, ELM_ID_CHILDREN_LIST);
    }

    _createChildrenListElement() {
        let elmList = DomUtils.createDiv(ELM_ID_CHILDREN_LIST, styles.childrenList);
        this._element.appendChild(elmList);
        return elmList;
    }

    static _getElementId(nodeId) {
        return 'node-' + nodeId;
    }

    /** Replace the current render element by the element in newNodeView
     * @param newNodeView - a node view which render subtree  */
    replaceRender(newNodeView) {
        this._element.parentNode.replaceChild(newNodeView._element, this._element);
    }

    /** Given an element (ex: the one received from mouse event), bubble up until find out nodeTree element
    static _findElementNodeTree(elmTarget) {
        let iter = elmTarget;
        // Bubble up to find element node tree
        // elmTarget can be textHolder or text (depends on where user clicks)
        while (iter === null || iter.className === null || iter.className.indexOf(styles.nodeTree) < 0) {
            if (iter === null || elmTarget.parentNode === null) {
                console.log('Not found Node tree element. Something is wrong');
                return;
            }
            iter = iter.parentNode;
        }
        return iter;
    }*/
}
