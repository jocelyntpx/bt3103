import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
// import vuetify from './plugins/vuetify'
import myButton from './components/myButton.vue'
// import firebase from 'firebase';

const app = createApp(App)
app.component('myButton',myButton)
app.use(router).mount('#app')

// firebase.auth().onAuthStateChanged(user => {
//     console.log(user)
//     if(!app){
//       app = new Vue({
//         router: router,
//         render: h => h(App),
//       }).$mount('#app')
//     }
//   });