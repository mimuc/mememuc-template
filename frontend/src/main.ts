import { createApp } from "vue";
import "@/style.css";
import App from "@/App.vue";
import router from "@/router";

// Add the following line to import the Axios library
import axios from "axios";

// Set the base URL for your API
axios.defaults.baseURL = "http://localhost:5173"; // Replace with your API server URL

// Enable CORS headers
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Access-Control-Allow-Methods"] =
  "GET, POST, PUT, DELETE";
axios.defaults.headers.common["Access-Control-Allow-Headers"] =
  "Origin, Accept, Content-Type, Authorization";

createApp(App).use(router).mount("#app");
