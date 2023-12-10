import Home from "@/views/Home.vue";
import Editor from "@/views/Editor.vue";
import Register from "@/views/Register.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/editor", component: Editor },
  { path: "/register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
