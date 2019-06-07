import fetch from "node-fetch";
import Config from "../config";

const goApiServiceHost = Config.goApiHost;

// // TODO PERFORMANCE This proxy add 100ms (at dev local env)
async function proxyToGoApi(req, res) {
    let {headers, method} = req;
    let user = req.user && req.user.id;
    let url = goApiServiceHost + req.originalUrl;
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

export default proxyToGoApi;
