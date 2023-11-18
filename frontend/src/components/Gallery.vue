<script setup lang="ts">
interface Props {
  templates: {
    id: string;
    name: string;
    url: string;
  }[];
}

defineProps<Props>();
</script>

<template>
  <div
    v-for="template in templates"
    :key="template.id"
    class="group relative h-32 w-32"
  >
    <img
      :src="template.url"
      class="h-full w-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
    />
    <p
      class="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 group-hover:block"
    >
      {{ template.name }}
    </p>
  </div>
</template>
