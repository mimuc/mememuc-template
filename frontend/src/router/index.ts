import Home from "@/views/Home.vue";
import Editor from "@/views/Editor.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: Home },
  { path: "/editor", component: Editor },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
