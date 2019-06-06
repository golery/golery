import fetch from "node-fetch";
import Config from "../config";

const goApiServiceHost = Config.goApiHost;

// // TODO PERFORMANCE This proxy add 100ms (at dev local env)
async function doProxyToGoApi(req, res, user, url) {
    let {headers, method} = req;
    let contentType = headers['content-type'] || 'application/json';
    let options = {
        method,
        headers: {
            accept: headers.accept,
            'content-type': contentType
        }
    };
    if (user) {
        options.headers.user = user;
    }
    if (method !== 'GET') {
        // TODO PERFORMANCE expressjs convert to json then here we convert back to text. Double conversion for nothing
        // But it's for Post body only, so it does not cost much
        if (contentType === 'application/octet-stream') {
            // ex: post image
            options.body = req.body;
        } else {
            options.body = JSON.stringify(req.body);
        }
    }
    console.log('=> Proxy to GoAPI: ', url, options);
    try {
        let hrstart = process.hrtime();
        let apiRes = await fetch(url, options);
        let hrend = process.hrtime(hrstart);
        console.info('GoAPI roundtrip time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

        let {status} = apiRes;
        let responseContentType = apiRes.headers.get('content-type');
        res.status(status).type(responseContentType);
        console.log('Response: ', status, '/', responseContentType);
        let text = await apiRes.text();
        // console.log('Response body: ', text);
        res.send(text);
    } catch (err) {
        console.log(err);
    }
}

/**
 * Forward requests to API service.
 * Url is mapped from /api/bla to /api/secure/bla or /api/public/bla depending authentication
 * */
function smartProxyToGoApi(req, res) {
    let user = req.user && req.user.id;
    let url;
    if (user) {
        url = goApiServiceHost + req.originalUrl.replace("/api/", "/api/secure/");
    } else {
        url = goApiServiceHost + req.originalUrl.replace("/api/", "/api/public/");
    }
    doProxyToGoApi(req, res, user, url);
}

/**
 * Forward requests to API service  as it is.
 * @Deprecated */
function proxyToGoApi(req, res) {
    let user = req.user && req.user.id;
    let url = goApiServiceHost + req.originalUrl;
    doProxyToGoApi(req, res, user, url);
}

class GoApiProxy {
    setupAutoRoute(route) {
         route.all('/pencil/*', (req, res) => smartProxyToGoApi(req, res));
         return route;
    }

    /** Available at /api/pubic/... */
    setupPublicRoute(route) {
        route.all('/login', (req, res) => proxyToGoApi(req, res));
        route.all('/signup', (req, res) => proxyToGoApi(req, res));
    }

    constructor(userId) {
        this._user = userId;
    }

    /** @return promise of array of nodes */
    query(user, rootId62, tree) {
        if (rootId62 === 'pub') {
            // query space, rootId62 is space code
            return this._call(user, `/api/secure/pencil/query/${rootId62}`).then(o => o.nodes);
        }
        return this._call(user, `/api/pencil/query?rootId=${rootId62}&tree=${tree}`);
    }

    findNodeId62ForSiteMap() {
        return this._call(null, "/api/public/pencil/sitemap/nodeId62");
    }

    _call(user, url, opts) {
        let options = {
            method: (opts && opts.method) || "GET",
            headers: Object.assign({
                accept: "application/json",
                'content-type': "application/json"
            }, opts && opts.headers)
        };
        if (user) {
            options.headers.user = user;
        }
        console.log("Call API ", url, options);
        // don't use fetch, use axios better to handle exception
        return fetch(goApiServiceHost + url, options).then(res => res.json()).catch((err) => {
            console.log(err);
            throw err;
        });
    }
}


export default new GoApiProxy();
