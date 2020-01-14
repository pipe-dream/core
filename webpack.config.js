const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'pipe-dream.js',
        library: 'PipeDream',
        libraryTarget: 'commonjs2',
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
