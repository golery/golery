import fetch from "node-fetch";
import Config from "../config";

// To connect to GoApi run in host machine, use the following
const host = Config.goApiHost;
// To connect to local docker use the following
// const host = 'http://goapi:8100';

// TODO PERFORMANCE This proxy add 100ms (at dev local env)
/** Forward requests to API service */
function goApi(req, res) {
    let user = req.user && req.user.id;
    let headers = req.headers;
    let url = host + req.originalUrl;
    let contentType = headers['content-type'] || 'application/json';
    let method = req.method;
    let options = {
        method: method,
        headers: {
            "accept": headers.accept,
            "user": user,
            'content-type': contentType
        }
    };
    if (method !== 'GET') {
        // TODO PERFORMANCE expressjs convert to json then here we convert back to text. Double conversion for nothing
        // But it's for Post body only, so it does not cost much
        options.body = JSON.stringify(req.body);
    }
    console.log('=> Proxy to GoAPI: ', url, options);
    fetch(url, options)
        .then(apiRes => {
            let status = apiRes.status;
            let contentType = apiRes.headers.get('content-type');
            res.status(status).type(contentType);
            console.log('Response: ', status, '/', contentType);
            return apiRes.text();
        }).then(text => {
        res.send(text);
    }).catch(err => console.log(err));
}

class GoApi {
    /** Available at /api/pubic/... */
    static setupPublicRoute(route) {
        route.all('/pencil/*', (req, res) => goApi(req, res));
    }

    /** Available at /api/secure/... */
    static setupSecureRoute(route) {
        route.all('/pencil/*', (req, res) => goApi(req, res));
    }
}

export default GoApi;