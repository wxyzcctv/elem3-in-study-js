import { createStore } from "vuex"
const store = createStore({
    state() {
        return {
            conunt: 0
        }
    },
    getters: {
        double(state) {
            return state.conunt * 2
        }
    },
    mutations: {
        add(state) {
            state.conunt++
        }
    },
    actions: {
        asyncAdd({commit}){
            setTimeout(() => {
                commit('add')
            }, 1000)
        }
    }
})
export default store