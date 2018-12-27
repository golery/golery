// Axios is a replacement of Fetch with ES6 promise
import Axios from "axios";

class NodeRepo {
    constructor() {
        this.nodes = null;
        this.rootNode = null;
    }

    _findNode(nodes, id) {
        for (let node of nodes) {
            if (node.id === id) {
                return node;
            }
        }
        return null;
    }

    _filter(nodes, rootNode) {
        if (!rootNode) {
            return [];
        }

        let filter = [rootNode];
        if (!rootNode.children) {
            return filter;
        }

        for (let childId of rootNode.children) {
            let childNode = this._findNode(nodes, childId);
            if (childNode) {
                filter.push(childNode);
                filter = filter.concat(this._filter(nodes, childNode));
            }
        }
        return filter;
    }

    // example rootId. 57550b912c8eede6f1fc5fce
    load(rootId) {
        if (this.rootNode && (!rootId || this.rootNode.id === rootId)) {
            console.log('Reuse node repo. Do not fetch');
            return Promise.resolve({nodes: this.nodes, rootNode: this.rootNode});
        }

        let opts = {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            responseType: 'application/json'
        };
        return Axios.get('/api/secure/pencil/query', opts).then(response => {
            let nodes = response.data;
            if (!rootId) {
                rootId = response.data[0].id;
            }

            let rootNode = this._findNode(nodes, rootId);
            this.rootNode = rootNode;
            this.nodes = nodes = this._filter(nodes, rootNode);
            console.log(`Load ${nodes.length} nodes from subtree ${rootId}`);
            return {nodes: this.nodes, rootNode: this.rootNode};
        });
    }

    /**
     * @return promise resolve to node or null if not found
     * */
    find(nodeId) {
        if (!this.nodes) {
            return this.load(nodeId).then(() => {
                return this.rootNode;
            });
        }

        for (let node of this.nodes) {
            if (node.id === nodeId) {
                return Promise.resolve(node);
            }
        }
        return Promise.resolve(null);
    }

    save(node) {
        console.log('Start save node....');
        let opts = {
            url: '/api/secure/pencil/update',
            method: 'PUT',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            data: {
                id: node.id,
                name: node.name,
                html: node.html,
                title: node.title
            }
        };
        return Axios(opts).then(result => {
            console.log('DONE save.', result);
        });
    }

    create(parentId, position) {
        return Axios.post("/api/secure/node/" + parentId + "?position=" + position).then(o => {
            let node = o.data;
            console.log("Created node ", node);
            if (!node.id) {
                throw "Fail to create node";
            }
            return node;
        });
    }

    delete(nodeId) {
        return Axios.delete("/api/secure/node/" + nodeId).then(o => {
            let body = o.data;
            console.log("Deleted node ", o.data.deleted);
            if (!body.parent.id) {
                throw "Fail to delete node";
            }
        });
    }

    moveNode(nodeId, newParentId, newPosition) {
        return Axios.put("/api/secure/node/move/" + nodeId + '/' + newParentId + '/' + newPosition).then(o => {
            console.log("Move node", o.data);
        });
    }

    /**
     * @param access - 0: private 1: public  */
    setAccess(nodeId, access) {
        return Axios.put("/api/secure/node/access/" + nodeId + "/" + access).then(o => {
            console.log("Set acess", o.data);
            return o.data;
        });
    }
}

export default new NodeRepo();
