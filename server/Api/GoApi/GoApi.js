import axios from 'axios';
import Config from "../../config";

const goApiServiceHost = Config.goApiHost;

class GoApi {
    async login(username, password) {
        let url = goApiServiceHost + '/api/public/login';
        console.log('GoApi:Login. Url: ', url);
        return axios.post(url, {username:username, password});
    }

    async signup(username, password) {
        let url = goApiServiceHost + '/api/public/signup';
        console.log('GoApi:Signup. Url: ', url, 'Username:',username);
        return axios.post(url, {username:username, password});
    }
}

export default new GoApi();