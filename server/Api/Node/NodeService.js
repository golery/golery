import GoApiProxy from '../GoApiProxy';
import GoApi from '../GoApi/GoApi';

class NodeService {
    /** @mode - node.access : 0 private, 1 public */
    setAccess(userId, nodeId, access) {
        return NodeModel.update({user: userId, _id: nodeId}, {access: access}).then(o => {
            return "Updated " + nodeId + ":" + access;
        });
    }

    findAllPublicNodeId() {
        return GoApiProxy.findNodeId62ForSiteMap();
    }

    findById(userId, nodeId62) {
        return GoApiProxy.query(userId, nodeId62, false);
    }

    querySpace(userId, code) {
        console.log(GoApi);
        return GoApi.querySpace(userId, code);
    }
}
export default new NodeService();