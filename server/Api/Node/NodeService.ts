import GoApi from '../GoApi/GoApi';
import {QueryResposne} from '../../Models/GoApi';

class NodeService {
    findAllPublicNodeId() {
        return GoApi.findNodeId62ForSiteMap();
    }

    findById(userId, nodeId62) {
        return GoApi.findNode(userId, nodeId62, false);
    }

    async querySpace(userId: string, spaceCode: string): Promise<QueryResposne> {
        return GoApi.querySpace(userId, spaceCode, false);
    }
}
export default new NodeService();