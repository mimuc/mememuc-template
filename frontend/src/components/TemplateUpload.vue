<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getUserTemplates, postUserTemplate } from "@/utils/api";
import Gallery from "@/components/Gallery.vue";

const username = "test-user"; // TODO: get username from login

interface Props {
  setTemplate: (id: string) => void;
}

const props = defineProps<Props>();

const file = ref();
const userTemplate = ref<{ id: string; name: string; url: string }[]>([]);

onMounted(async () => {
  getUserTemplates(username).then((data) => {
    console.log(data);
    userTemplate.value = data.map((template) => ({
      id: template.id,
      name: template.name,
      url: `http://localhost:3001/users/img/${username}/${template.id}`,
    }));
  });
});

async function handleFileUpload(event: Event) {
  event.preventDefault();
  postUserTemplate(username, file.value).then((data) => {
    props.setTemplate(`http://localhost:3001/users/img/${username}/${data.id}`);
  });
}
</script>

<template>
  <Gallery
    :templates="userTemplate"
    :onClick="
      (id: string) =>
        setTemplate(`http://localhost:3001/users/img/${username}/${id}`)
    "
  />
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
