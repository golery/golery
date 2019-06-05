import GoApiProxy from '../GoApiProxy';
import GoApi from '../GoApi/GoApi';
import {QueryResposne} from '../../Models/GoApi';

class NodeService {
    /** @mode - node.access : 0 private, 1 public */
    setAccess(userId, nodeId, access) {
        // return NodeModel.update({user: userId, _id: nodeId}, {access: access}).then(o => {
        //     return "Updated " + nodeId + ":" + access;
        // });
    }

    findAllPublicNodeId() {
        return GoApiProxy.findNodeId62ForSiteMap();
    }

    findById(userId, nodeId62) {
        return GoApiProxy.query(userId, nodeId62, false);
    }

    async querySpace(userId: string, spaceCode: string): Promise<QueryResposne> {
        return GoApi.querySpace(userId, spaceCode, false);
    }
}
export default new NodeService();