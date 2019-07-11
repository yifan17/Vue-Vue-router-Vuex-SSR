// 这个文件是css编译完成以后用来优化css代码的
// autoprefixer是用来省略css兼容浏览器的前缀
const autoprefixer = require('autoprefixer')

module.exports = {
    plugins: [
        autoprefixer()
    ]
}