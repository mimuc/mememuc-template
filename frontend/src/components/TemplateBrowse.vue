<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getAllTemplates } from "@/utils/api";
import Gallery from "@/components/Gallery.vue";

interface Props {
  setTemplate: (id: string) => void;
}

defineProps<Props>();

const templates = ref<{ id: string; name: string; url: string }[]>([]);
const filteredTemplates = ref<{ id: string; name: string; url: string }[]>([]);
const searchFilter = ref("");

onMounted(async () => {
  // const data = await fetch("https://api.imgflip.com/get_memes")
  //   .then((res) => res.json())
  //   .then((data) => data);
  // templates.value = data.data.memes;
  getAllTemplates().then((data) => {
    templates.value = data.map((template) => ({
      id: template.id,
      name: template.name,
      url: `http://localhost:3001/template/img/${template.id}`,
    }));
  });

  searchFilter.value = "";
  filteredTemplates.value = templates.value;
});

function filterTemplates(filter: string) {
  filteredTemplates.value = templates.value.filter((template) =>
    template.name.toLowerCase().includes(filter.toLowerCase()),
  );
}
</script>

<template>
  <div class="flex gap-4">
    <input
      class="input input-bordered input-primary w-full"
      type="text"
      placeholder="Search"
      v-model="searchFilter"
      @input="filterTemplates(searchFilter)"
    />
  </div>
  <div class="divider divider-neutral"></div>
  <Gallery
    :templates="filteredTemplates"
    :onClick="
      (id: string) => setTemplate(`http://localhost:3001/template/img/${id}`)
    "
  />
</template>
