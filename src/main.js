import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { setupElementPlus } from './plugins/element-plus';
// normalize.css
import 'normalize.css'
import 'assets/css/common.scss'

const app = createApp(App)

setupElementPlus(app)

app.use(createPinia()).use(router).mount('#app')
