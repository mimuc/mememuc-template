<script setup lang="ts">
import { ref, watchEffect } from "vue";
import Gallery from "@/components/Gallery.vue";

interface Props {
  templates: {
    id: string;
    name: string;
    url: string;
  }[];
  setTemplate: (id: string) => void;
}

const props = defineProps<Props>();

const filteredTemplates = ref<{ id: string; name: string; url: string }[]>([]);
const searchFilter = ref("");

watchEffect(() => {
  filterTemplates(searchFilter.value);
});

function filterTemplates(filter: string) {
  filteredTemplates.value = props.templates.filter((template) =>
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
