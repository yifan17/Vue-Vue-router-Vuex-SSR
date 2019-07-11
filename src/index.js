// 因为vue是组件所以不能直接挂载到html里，所以要在这里面进行挂载
import vue from 'vue'
import App from './app.vue'
import './assets/styles/global.styl'

const root = document.createElement('div')
document.body.appendChild(root)
new vue({
    // 渲染app的内容
    render: (h) => h(App)
    //渲染后挂载到一个html节点上
}).$mount(root)