<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getAllTemplates } from "@/utils/api";
import Gallery from "@/components/Gallery.vue";

interface Props {
  setTemplate: (id: string) => void;
}

defineProps<Props>();

const templates = ref<{ id: string; name: string; url: string }[]>([]);

onMounted(async () => {
  // const data = await fetch("https://api.imgflip.com/get_memes")
  //   .then((res) => res.json())
  //   .then((data) => data);
  // templates.value = data.data.memes;
  getAllTemplates().then((data) => {
    console.log(data);
    templates.value = data.map((template) => ({
      id: template.id,
      name: template.name,
      url: `http://localhost:3001/template/img/${template.id}`,
    }));
  });
});
</script>

<template>
  <Gallery
    :templates="templates"
    :onClick="
      (id: string) => setTemplate(`http://localhost:3001/template/img/${id}`)
    "
  />
</template>
