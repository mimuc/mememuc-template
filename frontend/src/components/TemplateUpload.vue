<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  deleteUserTemplate,
  getUserTemplates,
  uploadUserTemplate,
} from "@/utils/api";
import Gallery from "@/components/Gallery.vue";

const username = "test-user"; // TODO: get username from login

interface Props {
  setTemplate: (id: string) => void;
}

const props = defineProps<Props>();

const file = ref();
const userTemplate = ref<{ id: string; name: string; url: string }[]>([]);

onMounted(async () => {
  getUserTemplates(username, "upload").then((data) => {
    userTemplate.value = data.map((template) => ({
      id: template.id,
      name: template.name,
      url: `http://localhost:3001/users/img/${username}/${template.id}`,
    }));
  });
});

async function handleFileUpload(event: Event) {
  event.preventDefault();
  uploadUserTemplate(username, file.value, "upload").then((data) => {
    props.setTemplate(`http://localhost:3001/users/img/${username}/${data.id}`);
  });
  getUserTemplates(username).then((data) => {
    userTemplate.value = data.map((template) => ({
      id: template.id,
      name: template.name,
      url: `http://localhost:3001/users/img/${username}/${template.id}`,
    }));
  });
}

async function handleFileDelete(id: string) {
  deleteUserTemplate(username, id).then(() => {
    userTemplate.value = userTemplate.value.filter(
      (template) => template.id !== id,
    );
  });
}
</script>

<template>
  <form
    @submit="handleFileUpload"
    enctype="multipart/form-data"
    class="flex gap-4"
  >
    <input
      class="file-input file-input-bordered file-input-primary w-full"
      type="file"
      ref="file"
      @change="file = $event.target.files[0]"
    />
    <button class="btn btn-primary w-32" type="submit">Add Image</button>
  </form>
  <div class="divider divider-neutral" />
  <Gallery
    :templates="userTemplate"
    :onClick="
      (id: string) =>
        setTemplate(`http://localhost:3001/users/img/${username}/${id}`)
    "
    :onDelete="handleFileDelete"
  />
</template>
