export default class Rest {
    /**
     * Return json object or handle error
     * @param promise return object which is then serialized as json */
    static json(req, res, promise) {
        return Rest._tryCatch(req, res, promise.then(function (result) {
            res.json(result);
        }));
    }

    /**
     * Return binary object or handle error
     * @param promise - return binary
     * */
    static binary(req, res, promise, headMap) {
        return Rest._tryCatch(req, res, promise.then(function (binary) {
            res.writeHead(200, headMap);
            res.end(binary, 'binary');
        }));
    }

    /**
     * Try catch errors
     * */
    static _tryCatch(req, res, promise) {
        return promise.catch(function (err) {
            console.log(err, err.stack);
            res.status(400).json(err);
        });
    }
}
