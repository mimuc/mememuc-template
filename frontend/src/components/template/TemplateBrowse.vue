<script setup lang="ts">
import { ref, watchEffect, onMounted } from "vue";
import Gallery from "@/components/Gallery.vue";
import { getTemplateImage } from "@/utils/api";

interface Props {
  templates: {
    id: string;
    name: string;
  }[];
  setTemplate: (id: string) => void;
}

const props = defineProps<Props>();

const templates = ref<{ id: string; name: string; src: string }[]>([]);
const filteredTemplates = ref<{ id: string; name: string; src: string }[]>([]);
const searchFilter = ref("");

onMounted(() => getSrc());

watchEffect(() => {
  filterTemplates(searchFilter.value);
});

async function getSrc() {
  templates.value = await Promise.all(
    props.templates.map(async (template) => ({
      id: template.id,
      name: template.name,
      src: await getTemplateImage(template.id),
    })),
  );
}

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
        setTemplate(
          filteredTemplates.find((template) => template.id === id)!.src,
        )
    "
  />
</template>
@/utils/api
