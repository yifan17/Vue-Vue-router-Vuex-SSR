const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
// merge能很好的帮助我们合并webpack.config
const merge = require('webpack-merge')
const ExtractPlugin = require('extract-text-webpack-plugin')
const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development'

const defaultPluins = [
    new webpack.DefinePlugin({
        'process.env': {
            // 记得加""
            NODE_ENV: isDev ? '"development"' : '"production"'
        }
    }),
    new HTMLPlugin(),
    new VueLoaderPlugin()
]
const devServer = {
    port: 8000,
    host: '0.0.0.0',
    overlay:{
        errors: true
    },
    hot: true
}
let config
if(isDev) {
    config = merge(baseConfig,{
        devtool : '#cheap-module-eval-source-map',
        module:{
            rules:[{
                test: /\.styl/,
                use:[
                    'style-loader',
                    'css-loader',
                    // 因为使用stylus-loader会自动生成sourceMap,postcss自己也可以生成sourceMap
                    // 当前面生成过sourceMap，postcss可以直接使用，这样提高了css的编译效率
                    {
                        loader:'postcss-loader',
                        options:{
                            sourceMap: true,
                        }
                    },
                    'stylus-loader'
                ],
            }]
        },
        devServer,
        plugins:defaultPluins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ])
    })
}else {
    config = merge(baseConfig,{
        entry:{
            app: path.join(__dirname,'../client/index'),
            vendor: ['vue']
        },
        output:{
            filename:'[name].[chunkhash:8].js',
        },
        module:{
            rules:[{
                test: /\.styl/,
                use:ExtractPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader:'postcss-loader',
                            options:{
                                sourceMap: true,
                            }
                        },
                        'stylus-loader'
                    ]
                })
            }]
        },
        plugins:defaultPluins.concat([
            new ExtractPlugin('style.[chunkHash:8].css'),
        ]),
        optimization:{
            splitChunks: {
                cacheGroups: {
                  commons: {
                    chunks: 'initial',
                    minChunks: 2, maxInitialRequests: 5,
                    minSize: 0
                  },
                  vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                  }
                }
              },
              runtimeChunk: true
        }
    })
}
module.exports = config