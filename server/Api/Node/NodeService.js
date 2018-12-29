import mongoose from "mongoose";
import GoApi from "../GoApi";

mongoose.Promise = Promise;

import NodeModel from "../../Models/NodeModel";

class NodeService {
    /** @mode - node.access : 0 private, 1 public */
    setAccess(userId, nodeId, access) {
        return NodeModel.update({user: userId, _id: nodeId}, {access: access}).then(o => {
            return "Updated " + nodeId + ":" + access;
        });
    }

    findAllPublicNodeId() {
        return GoApi.findNodeId62ForSiteMap();
    }

    findById(userId, nodeId62) {
        return GoApi.queryId62(userId, nodeId62, false);
    }

    /** @return List of node. The first element is the root node */
    findAllNodes(userId, rootId) {
        console.log('Find all nodes of user ', userId, ", rootId ", rootId);
        let startTime = new Date();
        return NodeModel.find({
            deleted: {
                $ne: true
            },
            user: userId
        }).then(list => {
            if (!rootId) {
                return list;
            }
            let {node, index} = this._searchNode(list, rootId);
            if (!node) {
                console.log("Cannot find root node ", rootId);
                return [];
            }
            list.splice(index, 1);
            list.unshift(node);
            //console.log('ROOT node:', node);
            return list;
        }).then(list => {
            console.log("Load all nodes in ", new Date() - startTime, "ms");
            return list;
        });
    }

    /**
     * @return {node, index} */
    _searchNode(nodes, id) {
        let index = 0;
        for (let node of nodes) {
            if (node._id.equals(id)) {
                return {node, index};
            }
            index++;
        }
        return null;
    }

    /**
     * Clone subtree (when user does not have any nodes)
     * @return list of node, first node is the root node
     * @type Promise
     * */
    cloneTree(rootId, userId) {
        console.log('CLONE ', rootId, ' to user ', userId);
        let t = process.hrtime();

        return NodeModel.findOne({_id: rootId}).then(rootNode => {
            if (!rootNode) {
                return new NodeModel({
                    html: 'PENCIL',
                    title: 'PENCIL',
                    name: 'PENCIL',
                    user: userId
                }).save().then(node => {
                    console.log('RSULE:', node);
                    return [node];
                });
            }
            return this.findAllNodes(rootNode.user)
                .then(allNodes => {
                    return this._cloneSubNodes(userId, allNodes, rootId)
                }).then(list => {
                    console.log("CLONE DONE in ", process.hrtime(t)[1] / 1000000, 'ms');
                    return list;
                });
        });
    }

    /**
     * Clone subtree
     * @param userId: cloned nodes are assigned to this user
     * @param allNodes: all nodes, it contains more than necessary nodes
     * @return list of nodes - root node is only the first node
     * */
    _cloneSubNodes(userId, allNodes, rootId) {
        let search = this._searchNode(allNodes, rootId);
        console.log('clone ', rootId, ' to user ', userId);
        let promise = Promise.resolve([]);
        if (!search) {
            return promise;
        }

        let rootNode = search.node;
        let newRootNode = new NodeModel({
            html: rootNode.html,
            title: rootNode.title,
            name: rootNode.name,
            user: userId,
            children: [],
            cloneFromSample: rootNode._id
        });

        // clone children
        if (rootNode.children) {
            for (let childId of rootNode.children) {
                promise = promise.then(all => {
                    return this._cloneSubNodes(userId, allNodes, childId).then(list => {
                        if (list.length > 0) {
                            all = all.concat(list);
                            newRootNode.children.push(list[0]._id);
                        }
                        return all;
                    });
                });
            }
        }

        return promise.then(all => {
            return newRootNode.save().then(saved => {
                return [saved, ...all];
            });
        });
    }
}

export default new NodeService();