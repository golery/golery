const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AssetManifestPlugin = require('webpack-assets-manifest');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function minChunk(module) {
    // this assumes your vendor imports exist in the node_modules directory
    return module.context && module.context.indexOf('node_modules') !== -1;
}

module.exports = function (minify, output) {
    // in dev-mode: use random number
    let outputFilename = minify ? '[name].[chunkhash].js' : '[name].js';
    let cssFilename = minify ? '[name].[contenthash].css' : '[name].css';

    let localIdentName = '[name]__[local]___[hash:base64:5]';

    let corePlugins = [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: minChunk
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // output manifest to separate file, so that hash is not changed
            // when your code "require" a new js file
            names: ['manifest']
        }),
        new ExtractTextPlugin({filename: cssFilename, allChunks: true}),
    ];

    let pluginList = minify ? [new CleanWebpackPlugin(['.'], {
        root: process.cwd() + output,
        verbose: true
    })] : [];

    let plugins = pluginList.concat(
            corePlugins,
            [new AssetManifestPlugin({output: '../../../server/Pages/Generated/webpack.manifest.json'}), new webpack.NoEmitOnErrorsPlugin()]);

    let config = {
        name: "***CLIENT SIDE WEBPACK***",
        output: {
            path: process.cwd() + output,
            /* [hash]: hash for all module. [chunkhash]: hash for each module */
            filename: outputFilename,
        },
        entry: {
            app: './client/app'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        //resolve-url-loader may be chained before sass-loader if necessary
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    modules: true,
                                    localIdentName: localIdentName,
                                    importLoaders: 1
                                }
                            },
                            {
                                loader: 'postcss-loader'
                                /* configuration (ex: list of plugins) is in file postcss.config.js */
                            }
                        ]
                    })
                },
                {
                    test: /\.css$/,
                    include: /node_modules/,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'}
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif|svg|otf)$/i,
                    use: [
                        {loader: 'file-loader'}
                    ]
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        plugins: plugins
    };

    if (!minify) {
        Object.assign(config, {
            /* https://webpack.js.org/configuration/devtool/*/
            // 'eval-source-map': fast but does not have source in stack trace (eval)
            // 'cheap-source-map': has source map but transformed code
            // 'source-map': slowest but has original source
            devtool: 'cheap-source-map',
            watch: true,
            watchOptions: {
                ignored: /node_modules/
            }
        });
    }
    return config;
};
