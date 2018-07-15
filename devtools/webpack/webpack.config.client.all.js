/** This is the entrypoint webpack configure. */
module.exports = function (env, argv) {
    console.log('MODE: ', argv.mode);
    let prod = argv.mode === 'production';
    let output = null;

    if (prod) {
        minify = true;
        output = "/build/release";
    } else {
        minify = false;
        output = "/build/dev";
    }

    let clientConfig = require('./webpack.config.client.client-render')(prod, output);
    let serverConfig = require('./webpack.config.client.server-render')(prod, output);
    return [clientConfig, serverConfig];
    // return [serverConfig];
}
