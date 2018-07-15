const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = function (prod, outputRelativePath) {
    // useHash=true: Output file with hash
    // If we set useHash=true, the server needs to be manually restart each time
    let useHash = prod;

    let output = process.cwd() + outputRelativePath;

    // in dev-mode: use random number
    /* [hash]: hash for all module. [chunkhash]: hash for each module */
    let outputFilename = useHash ? '[name].[chunkhash].js' : '[name].js';
    let cssFilename = useHash ? '[name].[contenthash].css' : '[name].css';

    let cleanWebpackPlugin = new CleanWebpackPlugin([output + '/client'], {
        root: '/work/golery',
        verbose: true
    });

    let miniCssExtractPlugin = new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: cssFilename,
        chunkFilename: "[id].css"
    });

    /* Output hash of js and css to file webpack.manifest.json which is used by server to generate html file */
    let manifestPlugin = new ManifestPlugin({
        fileName: output + '/server/Pages/Generated/webpack.manifest.json'
    });

    let plugins = [
        cleanWebpackPlugin,
        miniCssExtractPlugin,
        manifestPlugin];

    let ruleJs = {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
    };

    let ruleCss = {
        test: /\.css|\.scss$/,
        exclude: /node_modules/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: true,
                    /* class name in css are transformed to this pattern */
                    localIdentName: '[name]__[local]___[hash:base64:5]',
                    importLoaders: 1
                }
            },
            {
                /* Using a list of plugins (config in postcss.config.js) to post process scss file */
                loader: 'postcss-loader'
            }
        ]
    };
    let ruleCssNodeModules = {
        test: /\.css|\.scss$/,
        include: /node_modules/,
        use: [
            /* style-loader: For code "import from 'mycss.css'"
             * - style-loader bundles css to js file directly. the javascript code will insert tag <style> to DOM tree during runtime.
             * - style-loader does not bundle mycss.css to output folder */
            {loader: 'style-loader'},
            {loader: 'css-loader'}
        ]
    };
    let ruleAssetFiles = {
        /* "import from 'file.svg'" will copy file.svg in output folder and rename it to [hash].svg*/
        test: /\.(jpe?g|png|gif|svg|otf)$/i,
        use: [
            {loader: 'file-loader'}
        ]
    };
    let config = {
        name: "***CLIENT SIDE WEBPACK***",
        devtool: 'cheap-source-map',
        output: {
            path: output + '/client',
            filename: outputFilename,
        },
        entry: {
            app: './client/app'
        },
        module: {
            rules: [
                ruleJs,
                ruleCss,
                ruleCssNodeModules,
                ruleAssetFiles,
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        plugins: plugins,
        optimization: {
            /* js in node_modules are packaged into vendors~app.js
            * Ref. https://wanago.io/2018/06/04/code-splitting-with-splitchunksplugin-in-webpack-4/ */
            splitChunks: {
                chunks: 'all'
            },
            noEmitOnErrors: true
        }
    };

    return config;
};
