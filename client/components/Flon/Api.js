const ROOT_PATH = "http://localhost:8100"
let Api = {
    path: ROOT_PATH,
    fetch: function (path, options) {
        return fetch(path, options).then(r => r.json());
    },
    put: function (path, body, options) {
        let putOptions = Object.assign({}, options,
            {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Accept": "application/json; charset=utf-8"
                },
                body: body
            });
        return fetch(ROOT_PATH + path, putOptions).then(r => r.json());

    }
};
export default Api;