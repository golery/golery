import fetch from "node-fetch";
import Config from "../config";

const goApiServiceHost = Config.goApiHost;

// TODO PERFORMANCE This proxy add 100ms (at dev local env)
/** Forward requests to API service */
function proxyToGoApi(req, res) {
    let user = req.user && req.user.id;
    let headers = req.headers;
    let url = goApiServiceHost + req.originalUrl;
    let contentType = headers['content-type'] || 'application/json';
    let method = req.method;
    let options = {
        method: method,
        headers: {
            "accept": headers.accept,
            'content-type': contentType
        }
    };
    if (user) {
        options.headers.user = user;
    }
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

class GoApiProxy {
    /** Available at /api/pubic/... */
    setupPublicRoute(route) {
        route.all('/pencil/*', (req, res) => proxyToGoApi(req, res));
        route.all('/login', (req, res) => proxyToGoApi(req, res));
        route.all('/signup', (req, res) => proxyToGoApi(req, res));
    }

    /** Available at /api/secure/... */
    setupSecureRoute(route) {
        route.all('/pencil/*', (req, res) => proxyToGoApi(req, res));
    }

    constructor(userId) {
        this._user = userId;
    }

    /** @return promise of array of nodes */
    query(user, rootId62, tree) {
            return this._call(user, "/api/public/pencil/query?rootId=" + rootId62 + "&tree=" + tree);
    }

    findNodeId62ForSiteMap() {
        return this._call(null, "/api/public/pencil/sitemap/nodeId62");
    }

    _call(user, url, opts) {
        let options = {
            method: (opts && opts.method) || "GET",
            headers: Object.assign({
                "accept": "application/json",
                'content-type': "application/json"
            }, opts && opts.headers)
        };
        if (user) {
            options.headers.user = user;
        }
        console.log("Call API ", url, options);
        return fetch(goApiServiceHost + url, options).then(res => res.json()).catch(err => {
            console.log(err);
            throw err;
        });
    }
}


export default new GoApiProxy();