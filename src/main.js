import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import myButton from './components/myButton.vue'
import VCalendar from 'v-calendar';

const app = createApp(App)
app.component('myButton',myButton)
app.use(router).use(VCalendar).mount('#app')


