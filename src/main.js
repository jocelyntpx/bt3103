import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import VCalendar from "v-calendar";
import "./assets/tailwind.css";

const app = createApp(App);
app
  .use(router)
  .use(VCalendar)
  .mount("#app");
