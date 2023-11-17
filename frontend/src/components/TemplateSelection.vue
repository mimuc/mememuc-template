<script setup lang="ts">
import { onMounted, ref } from "vue";

interface Template {
  id: string;
  name: string;
  url: string;
}

const templates = ref<Template[]>([]);

onMounted(async () => {
  const data = await fetch("https://api.imgflip.com/get_memes")
    .then((res) => res.json())
    .then((data) => data);
  templates.value = data.data.memes;
});
</script>

<template>
  <div>
    <h1>Template Selection</h1>
    <div class="template-selection">
      <div v-for="template in templates" :key="template.id">
        <h2>{{ template.name }}</h2>
        <img :src="template.url" />
      </div>
    </div>
  </div>
</template>
