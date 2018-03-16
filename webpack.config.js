var path = require('path');

module.exports = {
    entry: './src/Micro.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.(tsx|js)?$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|build)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            'react', 'es2015'
                        ],
                        plugins: ['transform-class-properties']
                    }
                }, {
                    loader: 'ts-loader'
                }]
            }
        ]
    },
    externals: {
        'react': 'commonjs react'
    }
};