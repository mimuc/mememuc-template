<script setup lang="ts">
import { onMounted, ref } from "vue";
import Gallery from "@/components/Gallery.vue";
import {
  getUserTemplates,
  uploadUserTemplate,
  deleteUserTemplate,
} from "@/utils/api";

const username = "test-user"; // TODO: get username from login

interface Props {
  setTemplate: (id: string) => void;
}

const props = defineProps<Props>();

const file = ref();
const userTemplates = ref<{ id: string; name: string; src: string }[]>([]);

onMounted(async () => {
  getUserTemplates(username, "upload").then((data) => {
    userTemplates.value = data.map((template) => ({
      id: template.id,
      name: template.name,
      src: template.base64,
    }));
  });
});

async function handleFileUpload(event: Event) {
  event.preventDefault();

  if (!file.value) {
    alert("Please select an image.");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const base64String = reader.result as string;

    console.log(base64String);

    uploadUserTemplate(username, file.value.name, base64String, "upload").then(
      () => {
        props.setTemplate(base64String);
        userTemplates.value.push({
          id: file.value.name,
          name: file.value.name,
          src: base64String,
        });
      },
    );
  };

  reader.onerror = (error) => {
    console.error("Error occurred while reading the file:", error);
  };

  // Convert the file to Base64
  reader.readAsDataURL(file.value);
}

async function handleFileDelete(id: string) {
  deleteUserTemplate(username, id).then(() => {
    userTemplates.value = userTemplates.value.filter(
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
  <div v-if="userTemplates.length > 0" class="divider divider-neutral" />
  <Gallery
    v-if="userTemplates.length > 0"
    :templates="userTemplates"
    :onClick="
      (id: string) =>
        setTemplate(`http://localhost:3001/users/img/${username}/${id}`)
    "
    :onDelete="handleFileDelete"
  />
</template>
@/utils/api
