/** Static methods for manipulating DOM */
export default class DomUtils {
    static createDiv(id, className) {
        let elm = document.createElement('div');
        if (id) {
            elm.id = id;
        }
        if (className) {
            elm.className = className;
        }
        return elm;
    }

    static findById(root, id) {
        if (!root || !root.children || !id) return null;
        for (let child of root.children) {
            if (child.id === id) {
                return child;
            }
            let result = DomUtils.findById(child, id);
            if (result) return result;
        }
        return null;
    }
}
