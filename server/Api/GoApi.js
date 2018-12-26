import fetch from "node-fetch";

const host = 'http://172.17.0.1:8100';

// TODO PERFORMANCE This proxy add 100ms (at dev local env)
/** Forward requests to API service */
function goApi(req, res) {
    let user = req.user && req.user.id;
    let headers = req.headers;
    let url = host + req.originalUrl;

    let options = {
        method: req.method,
        headers: {
            "accept": headers.accept,
            "content-type": headers['content-type'],
            "user": user,
        }
    };

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

export {goApi};