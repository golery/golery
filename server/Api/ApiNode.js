import NodeModel from "../Models/NodeModel";
import PencilModel from "../Models/PencilModel";
import Rest from "./Rest";
import mongoose from "mongoose";

mongoose.Promise = Promise;

function findNode(allNodes, nodeId) {
    for (let i = 0; i < allNodes.length; i++) {
        console.log("Compare", allNodes[i]._id, nodeId, allNodes[i]._id === nodeId);
        if (allNodes[i]._id.equals(nodeId)) {
            return allNodes[i];
        }
    }
    console.log("Node not found ", nodeId, allNodes);
}

function findDescendants(nodeId, allNodes) {
    console.log("Find descedant ", nodeId);
    let node = findNode(allNodes, nodeId);
    if (!node) return [];

    let list = [node._id];
    let children = node.children || [];
    for (let i = 0; i < children.length; i++) {
        let desc = findDescendants(children[i], allNodes);
        console.log("desc of", nodeId, " is ", desc);
        list = list.concat(desc);
    }
    console.log("Return dsec", nodeId, list);
    return list;
}

class ApiNode {
    setupRoute(route) {
        route.put('/node/move/:nodeId/:parentId/:position',
            (req, res) => this._moveNode(req, res, req.user.id, req.params.nodeId, req.params.parentId, req.params.position));
        route.post('/node/:parentId', this._createNode.bind(this));
        route.get('/node', this._findNodes.bind(this));
        route.delete('/node/:nodeId', this._deleteNode.bind(this));
        route.put('/node', this._updateNode.bind(this));
    }

    _createNode(req, res) {
        let userId = req.user._id;
        let parentId = req.params.parentId;
        let parent = null;
        let result = null;
        let promise = NodeModel.findById(parentId).then(function (o) {
            if (!o) {
                throw "Parent not found";
            }
            if (o.user !== userId) {
                throw "Parent belong to another user";
            }
            parent = o;
            return new NodeModel({user: userId, html: ''}).save();
        }).then(function (newNode) {
            console.log("CREATED node", newNode);
            result = newNode;
            parent.children.unshift(newNode._id);
            return parent.save();
        }).then(function (o) {
            console.log("UPDATED children list", o);
            console.log("DONE.");
            return result;
        });

        return Rest.json(req, res, promise);
    }


    _deleteNode(req, res) {
        const nodeId = req.params.nodeId;
        console.log('\n********DELETE node ' + nodeId);

        let allDeleted = null;
        let parent = null;
        let promise = NodeModel.find({
            user: req.user.id
        }).select("children").then(function (allNodes) {
            // Find all descedant nodes. They have to be deleted also
            allDeleted = findDescendants(nodeId, allNodes);
            return NodeModel.find({
                _id: {
                    $in: allDeleted
                }
            }).remove();
        }).then(function (o) {
            console.log("DELETE descedants ", allDeleted);
            // find parent node to update children list
            return NodeModel.findOne({
                user: req.user.id,
                children: nodeId
            });
        }).then(function (o) {
            parent = o;
            let index = o.children.indexOf(nodeId);
            if (index >= 0) {
                o.children.splice(index, 1);
                return o.save();
            }
        }).then(function (o) {
            console.log("UPDATE children list ", o);
            res.jsonp({
                deleted: allDeleted,
                parent: parent
            });
            console.log("DONE");
        });

        return Rest.json(req, res, promise);
    };

    /** body: {_id, name, html, updateDate} */
    _updateNode(req, res) {
        //FIXME: authentication
        let body = req.body;

        // clone content to be sure that only contents are updated
        let update = {
            name: body.name,
            html: body.html,
            updateDate: Date.now()
        };
        let nodeId = body._id;
        console.log('UPDATE node ' + nodeId, update);
        let promise = NodeModel.findByIdAndUpdate(nodeId, {
            $set: update
        }, {
            new: true
        });

        return Rest.json(req, res, promise);
    }

    _findNodes(req, res) {
        console.log('Get list of nodes');

        function setup() {
            console.log('Setup pencil');
            return createRootNode(req.user).then(function (root) {
                rootNode = root._id;
                let pencil = new PencilModel();
                pencil._id = req.user.id;
                pencil.rootNode = rootNode;
                return pencil.save();
            });
        }

        let userId = req.user._id;
        let rootNode;

        // find pencil
        let promise = PencilModel.findOne({
            _id: userId
        }).then(function (foundPencil) {
            if (!foundPencil) {
                return setup();
            }
            return foundPencil;
        }).then(function (foundPencil) {
            rootNode = foundPencil.rootNode;
        }).then(function () {
            console.log('Find node for user ', userId);
            return NodeModel.find({
                deleted: {
                    $ne: true
                },
                user: userId
            });
        }).then(function (list) {
            return {root: rootNode, nodes: list};
        });

        return Rest.json(req, res, promise);
    }

    /** Move node to another place (new parent + new position) */
    _moveNode(req, res, userId, nodeId, newParentId, newPosition) {
        console.log("START move node ", nodeId, "to new parent ", newParentId, " new position ", newPosition);
        let promise = NodeModel.findOne({
            // find parent
            user: userId,
            children: nodeId
        }).then(parent => {
            if (parent._id === newParentId) return parent;

            // update current parent
            let index = parent.children.indexOf(nodeId);
            if (index < 0) {
                throw "Parent of node " + nodeId + " is not found";
            }
            parent.children.splice(index, 1);
            console.log("Remove node ", nodeId, " from node ", parent._id);
            return parent.save();
        }).then(() => {
            return NodeModel.findOne({
                user: userId,
                _id: newParentId
            });
        }).then(p => {
            console.log("Add ", nodeId, " to new parent node ", p._id);
            p.children = p.children || [];
            p.children.splice(newPosition, 0, nodeId);
            return p.save();
        }).then(() => {
            console.log("DONE");
            return "OK";
        });

        return Rest.json(req, res, promise);
    }
}

export default new ApiNode();