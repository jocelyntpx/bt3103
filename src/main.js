import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
// import vuetify from './plugins/vuetify'
import myButton from './components/myButton.vue'
// import firebase from 'firebase';
import VCalendar from 'v-calendar';

const app = createApp(App)
app.component('myButton',myButton)
app.use(router).use(VCalendar).mount('#app')

// firebase.auth().onAuthStateChanged(user => {
//     console.log(user)
//     if(!app){
//       app = new Vue({
//         router: router,
//         render: h => h(App),
//       }).$mount('#app')
//     }
//   });

