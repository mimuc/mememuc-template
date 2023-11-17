<script setup lang="ts">
import { ref } from "vue";

interface Props {
  setTemplate: (id: string) => void;
}

const props = defineProps<Props>();

const file = ref();
// const inputName = ref();

async function handleFileUpload(event: Event) {
  event.preventDefault();
  const formData = new FormData();
  formData.append("file", file.value);

  await fetch("http://localhost:3000/template/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => props.setTemplate(data));
}
</script>

<template>
  <h3 class="text-lg font-bold">Hello!</h3>
  <p class="py-4">Press ESC key or click outside to close</p>
  <form @submit="handleFileUpload" enctype="multipart/form-data">
    <input
      class="file-input file-input-bordered file-input-primary w-full max-w-xs"
      type="file"
      ref="file"
      @change="file = $event.target.files[0]"
    />
    <button class="btn btn-primary" type="submit">Add Image</button>
  </form>
</template>
