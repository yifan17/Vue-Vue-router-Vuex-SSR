
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const config = {
    target: 'web',
    mode: 'production',
    entry: path.join(__dirname, '../client/index.js'),
    // 声明出口
    output: {
        // filename: 'bundle.js',
        filename:'bundle.[hash:8].js',
        path: path.join(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                // js编译要忽略掉node_modules里的js
                exclude: /node_modules/   
            },
            
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use:[
                    {
                        loader: 'url-loader',
                        options:{
                            limit: 1024,
                            name: 'resource/[path][name]-[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    // performance的内容是课程里没有的，有一些关于limit的警告，所以加了这一部分
    performance: {
        hints: "warning", // 枚举
        maxAssetSize: 30000000, // 整数类型（以字节为单位）
        maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
        assetFilter: function(assetFilename) {
        // 提供资源文件名的断言函数
        return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    }
}
module.exports = config