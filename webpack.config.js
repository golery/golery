"use strict"

/** Intellij read this file, but our build script does not */
function buildConfig(env) {
    if (typeof env === 'undefined') {
        env = 'dev';
    }
    return require('./devtools/webpack/webpack.config.client.all.js')({env: env});
}

module.exports = buildConfig;
