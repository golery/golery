import GoApi from '../GoApiProxy';

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
        return GoApi.query(userId, nodeId62, false);
    }

    querySpace(userId, code) {
        return GoApi.querySpace(userId, code);
    }
}
export default new NodeService();