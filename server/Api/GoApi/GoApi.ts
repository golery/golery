import axios from 'axios';
import Config from "../../config";
import {QueryResposne} from '../../Models/GoApi';
const goApiServiceHost = Config.goApiHost;

class GoApi {
    async login(username, password) {
        let url = goApiServiceHost + '/api/public/login';
        console.log('GoApi:Login. Url: ', url);
        return axios.post(url, {username: username, password});
    }

    async signup(username, password) {
        let url = goApiServiceHost + '/api/public/signup';
        console.log('GoApi:Signup. Url: ', url, 'Username:', username);
        return axios.post(url, {username: username, password});
    }

    async querySpace(user: string, spaceId: string, allNodes:boolean): Promise<QueryResposne> {
        let url = `/api/pencil/query/space/${spaceId}?allNodes=${allNodes}`;
        return await this.call(url, user);
    }

    private handlingErrors(error): void {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Axios error:', error.message);
        }
        console.log(error.config);
    }

    private async call(url: string, user: string) {
        console.log(`(ServerSide)GoApi: Call ${url}, ${user}`);
        let config = user ? {
            headers: {
                'user': user,
            }
        } : {};
        try {
            let response = await axios.get(goApiServiceHost + url, config);
            // console.log('GoApi Response:', response.data);
            return response.data
        } catch (err) {
            this.handlingErrors(err);
            throw err;
        }
    }
}

export default new GoApi();