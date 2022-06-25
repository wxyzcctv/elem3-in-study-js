<template>
    <div>
        <input type="text" v-model="title" @keyup.enter="addTodo" />
        <button v-if="active < all" @click="clear">清理</button>
        <ul v-if="todos.length">
            <transition-group name="flip-list" tag="ul">
                <li v-for="(todo, i) in todos" :key="todo.title">
                    <input type="checkbox" v-model="todo.done" />
                    <span :class="{ done: todo.done }">{{ todo.title }}</span>
                    <span class="remove-btn" @click="removeTodo($event, i)">❌</span>
                </li>
            </transition-group>
        </ul>
        <div v-else>暂无数据</div>
        <div>
            全选<input type="checkbox" v-model="allDone" />
            <span>{{ active }} / {{ all }}</span>
        </div>
    </div>
    <transition name="model">
        <div class="info-wrapper" v-if="showModal">
            <div class="info">
                老板，需要我做啥！
            </div>
        </div>
    </transition>
    <span class="dustbin">
        🗑
    </span>
    <div class="animate-wrap">
        <transition @before-enter="beforEnter" @enter="enter" @after-enter="afterEnter">
            <div v-show="animate.show" class="animate">
                📋
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, nextTick, reactive, Ref } from "vue";
interface Todo{
    title: string,
    done: boolean
}
let todos1:Ref<Todo[]> = ref([{title:'学习vue', done: false}])
function useTodos() {
    let title = ref("");
    // let todos = ref([{ title: "学习", done: false }]);
    let todos = useStorage('todos', []);
    let showModal = ref(false)
    let animate = reactive({
        show: false,
        el: null
    })

    function addTodo() {
        if (!title.value) {
            showModal.value = true;
            setTimeout(() => {
                showModal.value = false
            }, 1500);
            return
        }
        todos.value.push({
            title: title.value,
            done: false,
        });
        title.value = "";
    }
    function clear() {
        todos.value = todos.value.filter((v) => !v.done);
    }
    let active = computed(() => {
        return todos.value.filter((v) => !v.done).length;
    });
    let all = computed(() => {
        return todos.value.length;
    });
    let allDone = computed({
        get: function () {
            return active.value === 0;
        },
        set: function (value) {
            todos.value.forEach((todo) => {
                todo.done = value;
            });
        },
    });
    function removeTodo(e, i) {
        animate.el = e.target;
        animate.show = true;
        nextTick(()=>{
            todos.value.splice(i, 1)
        })
    }
    function beforEnter(el) {
        let dom = animate.el;
        // @ts-ignore
        let rect = dom.getBoundingClientRect();
        let x = window.innerWidth - rect.left - 60
        let y = rect.top - 10;
        el.style.transform = `translate(-${x}px, ${y}px)`
    }
    function enter(el, done) {
        document.body.offsetHeight
        el.style.transform = `translate(0,0)`
        el.addEventListener('transitionend', done)
    }
    function afterEnter(el) {
        animate.show = false
        el.style.display = 'none'
    }
    return { title, todos, addTodo, clear, removeTodo, active, all, animate, allDone, showModal, beforEnter, enter, afterEnter };
}
function useStorage(name, value = []) {
    let data = ref(JSON.parse(localStorage.getItem(name) || '' + value));
    watchEffect(() => {
        localStorage.setItem(name, JSON.stringify(data.value))
    })
    return data
}

let { title, todos, addTodo, clear, removeTodo, active, all, allDone, animate, showModal, beforEnter, enter, afterEnter } = useTodos();
</script>

<style scoped lang="scss">
$padding: 10px;
$white: #fff;
ul{
    width: 500px;
    margin: 0 auto;
    padding: 0;
    li{
        &:hover{
            cursor: pointer;
        }
        list-style-type: none;
        margin-bottom: $padding;
        padding: $padding;
        background-color: $white;
        box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
    }
}
.info-wrapper {
    position: fixed;
    top: 20px;
    width: 200px;
}

.info {
    padding: 20px;
    color: white;
    background: #d88986;
}

.model-enter-from {
    opacity: 0;
    transform: translateY(-60px);
}

.model-enter-active {
    transition: all 0.3s ease;
}

.model-leave-to {
    opacity: 0;
    transform: translateY(-60px);
}

.model-leave-active {
    transition: all 0.3s ease;
}

.flip-list-move {
    transition: transform 0.8s ease;
}

.flip-list-enter-active,
.flip-list-leave-active {
    transition: all 1s ease;
}

.flip-list-enter-from,
.flip-list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.remove-btn {
    cursor: pointer;
}

.animate-wrap .animate {
    position: fixed;
    right: 10px;
    top: 10px;
    z-index: 100;
    transition: all .8s linear;
}
.dustbin{
    position: fixed;
    font-size: 48px;
    right: 10px;
    top: 10px;
}
</style>