<script setup lang="ts">
interface Props {
  templates: {
    id: string;
    name: string;
    url: string;
  }[];
  onClick?: (id: string) => void;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-wrap justify-center gap-4">
    <div
      v-for="template in templates"
      :key="template.id"
      class="group relative h-32 w-32 cursor-pointer"
      @click="onClick && onClick(template.id)"
    >
      <img
        :src="template.url"
        class="h-full w-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
        loading="lazy"
      />
      <p
        class="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 group-hover:block"
      >
        {{ template.name }}
      </p>
    </div>
  </div>
</template>
