import { createApp } from 'vue'
import App from '@/test.vue'
import Loading from './components/Loading.vue'
import Button from './components/Button.vue'

const app = createApp(App)
app.component('Loading', Loading)
app.component('Button', Button)
app.mount('#app')