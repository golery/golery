module.exports = function (env) {
    let minify = null;
    let output = null;

    if (env === 'prod') {
        minify = true;
        output = "/build/release";
    } else {
        minify = false;
        output = "/build/dev";
    }
    console.log("WEBPACK with env=", env, "minify=", minify, "output=", output);

    let clientConfig = require('./webpack.config.client.client-render')(minify, output);
    let serverConfig = require('./webpack.config.client.server-render')(minify, output);
    return [clientConfig, serverConfig];
    // return [serverConfig];
}
