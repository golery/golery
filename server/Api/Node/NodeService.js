import mongoose from "mongoose";
mongoose.Promise = Promise;

import NodeModel from "../../Models/NodeModel";

class NodeService {
    findOneNode(userId, nodeId) {
        return NodeModel.find({
            _id: nodeId,
            deleted: {
                $ne: true
            }
        });
    }
}

let nodeService = new NodeService();
export default nodeService;