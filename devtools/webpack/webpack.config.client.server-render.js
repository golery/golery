/** Generate ONLY react server-side rendering (ie. ./server/Pages/Components.js)
 * This webpack does not generate server-side code. These codes are generated directly by babel (ref. server.watch in package.json) */
module.exports = function (prod, outputRelativePath) {
    let output = process.cwd() + outputRelativePath;

    let localIdentName = '[name]__[local]___[hash:base64:5]';
    let ruleCssNodeModules = {
        test: /\.css|\.scss$/,
        include: /node_modules/,
        use: [
            {loader: 'css-loader'}
        ]
    };
    let serverConfig = {
        name: "***SERVER SIDE WEBPACK***",
        output: {
            path: output,
            filename: './server/Pages/Generated/Components.generated.js',
            // Library export module compatible with server nodejs
            libraryTarget: 'commonjs2'
        },
        entry: {
            app: './server/Pages/Components.js'
        },
        module: {
            rules: [
                {
                    test: /\.js|\.jsx|\.ts|\.tsx$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.css|\.scss$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            // /locals is for server-side (https://github.com/dferber90/fake-style-loader/issues/3)
                            loader: 'css-loader/locals',
                            options: {
                                modules: true,
                                localIdentName: localIdentName,
                                importLoaders: 1
                            }
                        }
                    ]
                },
                ruleCssNodeModules,
                {
                    /* Do not copy resource file for server rendering */
                    test: /\.(jpe?g|png|gif|svg|otf)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                emitFile: false
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
    };

    return serverConfig;
};
