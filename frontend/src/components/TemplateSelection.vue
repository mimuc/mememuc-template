<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  CloudArrowUpIcon as UpIcon,
  MagnifyingGlassIcon as SearchIcon,
  ChevronRightIcon as NextIcon,
  ChevronLeftIcon as PreviousIcon,
  ArrowPathIcon as RandomIcon,
  ClipboardDocumentIcon as PasteIcon,
  CameraIcon,
  PaintBrushIcon as BrushIcon,
} from "@heroicons/vue/24/solid";
import { getAllTemplates } from "@/utils/api";
import TemplateUpload from "@/components/TemplateUpload.vue";
import TemplateBrowse from "./TemplateBrowse.vue";
import TemplateCamera from "./TemplateCamera.vue";

interface Props {
  setTemplate: (id: string) => void;
  setDrawingMode: (value: boolean) => void;
}

const browseModalOpen = ref(false);
const uploadModalOpen = ref(false);
const cameraModalOpen = ref(false);
const pasteModalOpen = ref(false);

const templates = ref<{ id: string; name: string; url: string }[]>([]);
const index = ref(0);
const pasteUrl = ref("");

const props = defineProps<Props>();

onMounted(async () => {
  await getAllTemplates().then((data) => {
    templates.value = data.map((template) => ({
      id: template.id,
      name: template.name,
      url: `http://localhost:3001/template/img/${template.id}`,
    }));
  });

  index.value = Math.floor(Math.random() * templates.value.length);
  props.setTemplate(templates.value[index.value].url);
});

function goToPrevious() {
  index.value--;
  if (index.value < 0) {
    index.value = templates.value.length - 1;
  }
  props.setTemplate(templates.value[index.value].url);
}

async function goToNext() {
  index.value++;
  if (index.value >= templates.value.length) {
    index.value = 0;
  }
  props.setTemplate(templates.value[index.value].url);
}

async function goToRandom() {
  index.value = Math.floor(Math.random() * templates.value.length);
  props.setTemplate(templates.value[index.value].url);
}

async function drawTemplate() {
  props.setTemplate("");
  props.setDrawingMode(true);
}
</script>

<template>
  <div class="modal" :class="{ 'modal-open': browseModalOpen }" role="dialog">
    <div class="modal-box h-4/5 max-w-3xl">
      <TemplateBrowse
        v-if="browseModalOpen"
        :templates="templates"
        :setTemplate="
          (id: string) => {
            setTemplate(id);
            browseModalOpen = false;
          }
        "
      />
    </div>
    <div class="modal-backdrop" @click="browseModalOpen = false" />
  </div>

  <div class="modal" :class="{ 'modal-open': uploadModalOpen }" role="dialog">
    <div class="modal-box w-1/2 max-w-xl">
      <TemplateUpload
        v-if="uploadModalOpen"
        :setTemplate="
          (id: string) => {
            setTemplate(id);
            uploadModalOpen = false;
          }
        "
      />
    </div>
    <div class="modal-backdrop" @click="uploadModalOpen = false" />
  </div>

  <div class="modal" :class="{ 'modal-open': cameraModalOpen }" role="dialog">
    <div class="modal-box w-1/2 max-w-xl">
      <TemplateCamera
        v-if="cameraModalOpen"
        :setTemplate="
          (id: string) => {
            setTemplate(id);
            cameraModalOpen = false;
          }
        "
      />
    </div>
    <div class="modal-backdrop" @click="cameraModalOpen = false" />
  </div>

  <div class="modal" :class="{ 'modal-open': pasteModalOpen }" role="dialog">
    <div class="modal-box w-3/2 max-w-xl">
      <form
        @submit.prevent="
          setTemplate(pasteUrl);
          pasteModalOpen = false;
        "
        enctype="multipart/form-data"
        class="flex gap-4"
      >
        <input
          type="text"
          placeholder="https://example.com/image.png"
          class="input input-bordered input-primary w-full"
          v-model="pasteUrl"
        />
        <button class="btn btn-primary w-32" type="submit">Add Image</button>
      </form>
    </div>
    <div class="modal-backdrop" @click="pasteModalOpen = false" />
  </div>

  <div class="flex justify-center gap-4">
    <button class="btn btn-primary btn-outline" @click="goToPrevious">
      <PreviousIcon class="h-6 w-6" />
    </button>

    <button class="btn btn-primary btn-outline" @click="browseModalOpen = true">
      <SearchIcon class="h-6 w-6" />
    </button>

    <button class="btn btn-primary btn-outline" @click="uploadModalOpen = true">
      <UpIcon class="h-6 w-6" />
    </button>

    <button class="btn btn-primary btn-outline" @click="cameraModalOpen = true">
      <CameraIcon class="h-6 w-6" />
    </button>

    <button class="btn btn-primary btn-outline" @click="pasteModalOpen = true">
      <PasteIcon class="h-6 w-6" />
    </button>

    <button class="btn btn-primary btn-outline" @click="drawTemplate">
      <BrushIcon class="h-6 w-6" />
    </button>

    <button class="btn btn-primary btn-outline" @click="goToRandom">
      <RandomIcon class="h-6 w-6" />
    </button>

    <button class="btn btn-primary btn-outline" @click="goToNext">
      <NextIcon class="h-6 w-6" />
    </button>
  </div>
</template>
