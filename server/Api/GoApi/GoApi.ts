import axios from 'axios';
import Config from "../../config";

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

    async querySpace(user, spaceId) {
        let url: string;
        if (user) {
            url = `/api/secure/pencil/query/space/${spaceId}`;
        } else {
            url = `/api/public/pencil/query/space/${spaceId}`;
        }
        return await this.call(url, user);
    }

    private async call(url: string, user) {
        console.log(`GoApi: Call ${url}, ${user}`);
        try {
            let response = await axios.get(goApiServiceHost + url, {
                headers: {
                    'user': user,
                    'content-type': 'application/json'
                }
            });
            return response.data
        } catch (err) {
            console.error('Fail to load', err);
        }
    }
}

export default new GoApi();