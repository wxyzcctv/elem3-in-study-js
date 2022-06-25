import { createApp } from 'vue'
import Element3 from "element3"
import 'element3/lib/theme-chalk/index.css'
import router from './router/index'
import store from './store/index'
import App from './App.vue'

const app = createApp(App)
app.use(store)
    .use(router)
    .use(Element3)
    .mount('#app')
