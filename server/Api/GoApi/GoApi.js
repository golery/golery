import axios from 'axios';

class GoApi {
    constructor() {
        this.endpoint = "http://localhost:8100";
    }
    async auth(username, password) {
        console.log('GoApi:Login');
        let url = this.endpoint + '/api/secure/auth';
        return axios.post(url, {username, password});
    }
}

export default new GoApi();