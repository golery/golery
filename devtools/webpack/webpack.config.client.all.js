module.exports = function (env) {
    let minify = true;
    let output = "/build/release/client";

    if (env !== 'prod') {
        minify = false;
        output = "/build/dev/client";
    }
    console.log("WEBPACK with env=", env, "minify=", minify);

    let serverConfig = require('./webpack.config.client.server-render');
    let clientConfig = require('./webpack.config.client.client-render')(minify, output);
    return [clientConfig, serverConfig];
}
