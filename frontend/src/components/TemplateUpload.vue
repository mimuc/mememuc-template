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
const url = ref();
const userTemplate = ref<{ id: string; name: string; url: string }[]>([]);

onMounted(async () => {
  getUserTemplates(username).then((data) => {
    userTemplate.value = data.map((template) => ({
      id: template.id,
      name: template.name,
      url: `http://localhost:3001/users/img/${username}/${template.id}`,
    }));
  });
});

async function handleFileUpload(event: Event) {
  event.preventDefault();
  uploadUserTemplate(username, file.value).then((data) => {
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

async function handleUrlUpload(event: Event) {
  event.preventDefault();
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto(url.value);
  // const screenshot = await page.screenshot({ fullPage: true });
  // console.log(screenshot);
  // await browser.close();
}
</script>

<template>
  <label class="label">
    <span class="label-text">Paste a Url</span>
  </label>
  <form
    @submit="handleUrlUpload"
    enctype="multipart/form-data"
    class="flex gap-4"
  >
    <input
      type="text"
      placeholder="https://example.com/image.png"
      class="input input-bordered input-primary w-full"
      v-model="url"
    />
    <button class="btn btn-primary w-32" type="submit">Add Image</button>
  </form>
  <div class="divider divider-neutral">or</div>
  <label class="label">
    <span class="label-text">Upload a file</span>
  </label>
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
  <div class="divider divider-neutral">or</div>
  <Gallery
    :templates="userTemplate"
    :onClick="
      (id: string) =>
        setTemplate(`http://localhost:3001/users/img/${username}/${id}`)
    "
    :onDelete="handleFileDelete"
  />
</template>
