// webpack是用来打包前端资源的,把不同的静态资源的类型打包成一个js,
//然后在html里面引用这个js的时候，html就能正常运行，
//把零碎的js打包在一起可以减少http请求
// 为了防止出错，所以这里要用绝对路径
//path是nodejs里的一个基本包用来处理路径的
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// 现在项目想运行起来还需要一个html，所以要安装一个html-webpack-plugin
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
// 安装extract-text-webpack-plugin把非javascript的东西单独打包
// 配置完成以后这里出现了错误Error: Chunk.entrypoints: Use Chunks.groupsIterable and filter by instanceof Entrypoint instead
// 因为extract-text-webpack-plugin还不能支持webpack4.0.0以上的版本。
// 执行npm install --save-dev extract-webpack-plugin@next就能解决
const ExtractPlugin = require('extract-text-webpack-plugin')
// 判断变量是不是ture,在启动脚本的时候，
// 设置的环境变量全部是存在于process.env这个里面的，所以里面（package.json）可以设置变量名
const isDev = process.env.NODE_ENV === 'development'
const config = {
    // 因为是前端项目所以编译目标应该是web平台
    target: 'web',
    mode: 'production',
    // 声明入口，index.js是入口文件
    // __dirname代表文件所在目录的根目录地址，join是把两个路径拼在一起
    entry: path.join(__dirname, 'src/index.js'),
    // 声明出口
    output: {
        // filename: 'bundle.js',
        filename:'bundle.[hash:8].js',
        path: path.join(__dirname, 'dist')
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
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use:[
                    {
                        //这里的的loader要配置一些选项，所以这里的use里用了对象的形式
                        loader: 'url-loader',
                        // url-loader可以帮我们把图片转换为base64代码，依赖于file-loader
                        //直接写在js内容里不用生成新的图片，对于小的图片这样就可以减少http请求
                        // limit设置值表示当文件小于1024的时候就转译成base64代码
                        // name是设置输出文件的名字，[ext]，是文件扩展名[name]-aaa
                        options:{
                            limit: 1024,
                            name: '[name]-aaa.[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        //在使用vue或者react这样的框架一定要用DefinePlugin
        new webpack.DefinePlugin({
            'process.env': {
                // 记得加""
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin(),
        new VueLoaderPlugin()
    ],
    // plugins: [new VueLoaderPlugin()]
    // 一直到这里第一次运行npm run build才能成功
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
// 安装cross-env，在不同平台上设置环境变量不同，安装了这个包就可以执行同一个命令了
if(isDev) {
    config.module.rules.push({
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
    })
    // 帮助我们调试代码,es6没法直接调试，所以要加这个工具帮助我们在浏览器里调试es6代码
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        // 因为webpack-dev-server启动以后是一个服务，所以要监听一个端口
        port: 8000,
        // 这样设置可以通过localhost://127.0.0.1访问，
        // 同时也可以通过本机的内网IP进行访问,这样可以在别人的电脑上也访问这台电脑，
        host: '0.0.0.0',
        // 出现错误都在网页上显示出来
        overlay:{
            errors: true
        },
        // 当改变页面的一个组件的时候，保存以后会刷新，这个配置是保存以后只刷新当前这个组件
        hot: true
    }
    config.plugins.push(
        //启动webpack的HotModuleReplacement这个功能热加载
        new webpack.HotModuleReplacementPlugin(),
        // 减少不需要的信息展示问题
        new webpack.NoEmitOnErrorsPlugin()
    )
}else {
    config.entry = {
        app: path.join(__dirname,'src/index'),
        vendor: ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push({
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
    })
    config.plugins.push(
        new ExtractPlugin('style.[chunkHash:8].css'),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: [vendor]
        // })
    )
    // 
    config.optimization = {
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
}
// 为了改配置所以写成这种形式
module.exports = config