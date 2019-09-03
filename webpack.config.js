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
        library: 'PipeDream',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".vue"]
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
