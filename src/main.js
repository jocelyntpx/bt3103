import { createApp } from 'vue'
import App from './App.vue'

import myButton from './components/myButton.vue'

const app = createApp(App)
app.component('myButton',myButton)
app.mount('#app')