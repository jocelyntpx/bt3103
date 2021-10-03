import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
// import vuetify from '@/plugins/vuetify'
import myButton from './components/myButton.vue'

const app = createApp(App)
app.component('myButton',myButton)
app.use(router).mount('#app')