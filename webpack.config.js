var path = require('path');

module.exports = {
    entry: './src/Micro.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|build)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            'react', 'es2015'
                        ],
                        plugins: ['transform-class-properties']
                    }
                }
            }
        ]
    },
    externals: {
        'react': 'commonjs react'
    }
};