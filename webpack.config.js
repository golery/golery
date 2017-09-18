function buildConfig(env) {
    if (!env) {
        env = 'dev';
    }
    return require('./devtools/webpack/webpack.config.js')({env: env})
}

module.exports = buildConfig;
