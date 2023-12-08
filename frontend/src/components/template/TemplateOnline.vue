<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import Gallery from "@/components/Gallery.vue";

interface Props {
  setTemplate: (id: string) => void;
}

defineProps<Props>();

const templates = ref<{ id: string; name: string; src: string }[]>([]);
const filteredTemplates = ref<{ id: string; name: string; src: string }[]>([]);
const searchFilter = ref("");

onMounted(async () => {
  const data = await fetch("https://api.imgflip.com/get_memes")
    .then((res) => res.json())
    .then((data) => data);
  templates.value = data.data.memes;
});

watchEffect(() => {
  filterTemplates(searchFilter.value);
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
      (id: string) =>
        setTemplate(templates.find((template) => template.id === id)?.src || '')
    "
  />
</template>
