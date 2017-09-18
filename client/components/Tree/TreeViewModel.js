export default class TreeViewModel {
    constructor() {
        this.selectedNodeView = null;
        this.selectedNode = null;

        // node on which mouse is hover on
        // this information is used for drag and drop
        this.hover = {node: null, nodeView: null};
    }
}
