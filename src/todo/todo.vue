<template>
    <section class="real-app">
        <input
            type="text"
            class="add-input"
            autofocus="autofocus"
            placeholder="计划要做什么呢？"
            @keyup.enter="addTodo"/>
            <!-- 输入敲回车键以后才会执行addTodo -->
            <Item 
                :todo="todo"
                v-for="todo in filteredTodo"
                :key="todo.id" 
                @del="deleteTodo"
                />
            <Tabs 
                :filter="filter" 
                :todos="todos"
                @toggle="toggleFilter"
                @clearAllCompleted="clearAllCompleted"
            />
    </section>
</template>

<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
let id = 0
export default {
    data(){
        // 数据尽量都放在一个地方便于管理,在哪个地方声明，就要在哪个地方操作
        return {
            todos: [],
            filter: 'all'
        }
    },
    components:{
        Item,
        Tabs
    },
    computed: {
        filteredTodo(){
            if(this.filter === 'all'){
                return this.todos
            }
            // 这里以这种形式赋值true或者false
            const completed = this.filter === 'completed'
            return this.todos.filter(todo => completed === todo.completed)
        }
    },
    // methods里面一般都放上面绑定的要操作的函数
    methods: {
        addTodo(e){
            // unshift在数组里插入放在第一项
            this.todos.unshift({
                id : id++,
                content: e.target.value.trim(),
                completed: false
            })
            e.target.value = ''
        },
        deleteTodo(id) {
            this.todos.splice(this.todos.findIndex(todo => todo.id === id),1)
        },
        toggleFilter(state) {
            this.filter = state
        },
        clearAllCompleted(){
            this.todos = this.todos.filter(todo => !todo.completed)
        }
    }
}
</script>

<style lang="stylus" scoped>
.real-app
    width 600px
    margin 0 auto
    box-shadow 0 0 5px #666

.add-input
    position relative
    margin 0
    width 100%
    font-size 24px
    font-family inherit
    font-weight inherit 
    line-height 1.4em
    border none
    outline none 
    color inherit 
    box-sizing border-box
    font-smoothing antialiased
    padding 16px 16px 16px 36px
    border none
    box-shadow inset 0 -2px 1px rgba(0, 0, 0, 0.03)
    
</style>
