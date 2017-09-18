const root = process.cwd();

let localIdentName = '[name]__[local]___[hash:base64:5]';
let serverConfig = {
    name: "***SERVER SIDE WEBPACK***",
    output: {
        path: root,
        filename: './server/Pages/Components.generated.js',
        // Library export module compatible with server nodejs
        libraryTarget: 'commonjs2'
    },
    entry: {
        app: './server/Pages/Components.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
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
                    },
                    {
                        loader: 'postcss-loader'
                        /* configuration (ex: list of plugins) is in file postcss.config.js */
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
};

module.exports = serverConfig;
