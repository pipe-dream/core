const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/standalone.ts",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'pipe-dream.js',
        library: 'PipeDreamCore',
        libraryTarget: 'umd',
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js", ".vue", ".webpack.js"]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            }, {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {test: /\.tsx?$/, loader: "ts-loader"}
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'pipe-dream.css'
        }),
    ]
};
