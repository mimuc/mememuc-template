<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/solid";

interface Props {
  templates: {
    id: string;
    name: string;
    src: string;
  }[];
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-wrap justify-center gap-4">
    <div
      v-for="template in templates"
      :key="template.id"
      class="group relative h-32 w-32"
    >
      <img
        :src="template.src"
        class="h-full w-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
        loading="lazy"
      />
      <p
        class="hover:text-primary absolute left-1/2 top-1/2 hidden w-full -translate-x-1/2 -translate-y-1/2 cursor-pointer text-ellipsis text-center group-hover:block"
        @click="onClick && onClick(template.id)"
      >
        {{ template.name }}
      </p>
      <XMarkIcon
        v-if="onDelete"
        class="hover:text-error absolute right-0 top-0 m-1 hidden h-4 w-4 cursor-pointer group-hover:block"
        @click="onDelete && onDelete(template.id)"
      />
    </div>
  </div>
</template>
