import fetch from "node-fetch";

const host = 'http://172.17.0.1:8100';

// TODO PERFORMANCE This proxy add 100ms (at dev local env)
/** Forward requests to API service */
function goApi(req, res) {
    let user = req.user && req.user.id;
    let headers = req.headers;
    let url = host + req.originalUrl;
    let contentType = headers['content-type'];
    let method = req.method;
    let options = {
        method: method,
        headers: {
            "accept": headers.accept,
            "user": user,
        }
    };
    if (method !== 'GET') {
        // TODO PERFORMANCE expressjs conver to json then here we convert back to text
        options.body = JSON.stringify(req.body);
    }
    if (contentType) {
        options.headers['content-type'] = contentType;
    }
    console.log("===", headers, contentType);
    console.log('Proxy to GoAPI: ', url, options);
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