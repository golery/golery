import mongoose from "mongoose";
import sanitizeHtml from 'sanitize-html';

mongoose.Promise = Promise;

import NodeModel from "../Models/NodeModel";
import PencilModel from "../Models/PencilModel";
import UserModel from "../user/user.model";
import Rest from "./Rest";
import NodeService from "./Node/NodeService";


// FIXME: limit and allow only admin user to access stats
class ApiMisc {
    setupRoute(route) {
        route.get('/stats/user', (req, res) => this._statsGetAllUsers(req, res));
        route.get('/stats/user/:id', (req, res) => this._getStatsOfUserRest(req, res, req.params.id));
    }

    _statsGetAllUsers(req, res) {
        let promise = UserModel.find({}, 'username email created').then(users => {
            let loopPromise = Promise.resolve([]);
            for (let user of users) {
                loopPromise = loopPromise.then((result) => {
                    return this._getStatsOfUser(user).then(stats => {
                        result.push(stats);
                        return result;
                    });
                });
            }
            return loopPromise;
        });

        Rest.json(req, res, promise);
    }

    _getStatsOfUser(user) {
        return NodeModel.count({user: user._id}).then(c => {
            let stats = {user: user, detail: {nodeCount: c}};
            console.log(stats);
            return stats;
        });
    }

    _getStatsOfUserRest(req, res, _id) {
        let promise = UserModel.findById(_id, 'username email created').then(user => {
            return NodeModel.count({user: _id}).then(c => {
                return {user: user, nodeCount: c};
            });
        });
        Rest.json(req, res, promise);
    }
}

export default new ApiMisc();
