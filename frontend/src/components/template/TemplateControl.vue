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
  GlobeAltIcon as GlobeIcon,
  PlusIcon,
} from "@heroicons/vue/24/solid";
import TemplateUpload from "./TemplateUpload.vue";
import TemplateBrowse from "./TemplateBrowse.vue";
import TemplateCamera from "./TemplateCamera.vue";
import TemplateOnline from "./TemplateOnline.vue";
import { getAllTemplates, getTemplateImage } from "@/utils/api";

interface Props {
  setTemplate: (id: string) => void;
  setDrawingMode: (value: boolean) => void;
}

const browseModalOpen = ref(false);
const onlineModalOpen = ref(false);
const uploadModalOpen = ref(false);
const cameraModalOpen = ref(false);
const pasteModalOpen = ref(false);

const templates = ref<{ id: string; name: string }[]>([]);
const index = ref(0);
const pasteUrl = ref("");

const props = defineProps<Props>();

onMounted(async () => {
  await getAllTemplates().then((data) => {
    templates.value = data.map((template) => ({
      id: template.id,
      name: template.name,
    }));
  });

  index.value = Math.floor(Math.random() * templates.value.length);

  const src = await getTemplateImage(templates.value[index.value].id);

  props.setTemplate(src);
});

async function goToPrevious() {
  index.value--;
  if (index.value < 0) {
    index.value = templates.value.length - 1;
  }
  props.setTemplate(await getTemplateImage(templates.value[index.value].id));
}

async function goToNext() {
  index.value++;
  if (index.value >= templates.value.length) {
    index.value = 0;
  }
  props.setTemplate(await getTemplateImage(templates.value[index.value].id));
}

async function goToRandom() {
  index.value = Math.floor(Math.random() * templates.value.length);
  props.setTemplate(await getTemplateImage(templates.value[index.value].id));
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

  <div class="modal" :class="{ 'modal-open': onlineModalOpen }" role="dialog">
    <div class="modal-box h-4/5 max-w-3xl">
      <TemplateOnline
        v-if="onlineModalOpen"
        :setTemplate="
          (id: string) => {
            setTemplate(id);
            onlineModalOpen = false;
          }
        "
      />
    </div>
    <div class="modal-backdrop" @click="onlineModalOpen = false" />
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

    <button class="btn btn-primary btn-outline" @click="goToRandom">
      <RandomIcon class="h-6 w-6" />
    </button>

    <div class="dropdown dropdown-hover">
      <div role="button" class="btn btn-primary btn-outline">
        <PlusIcon class="h-6 w-6" />
      </div>
      <ul
        class="menu dropdown-content bg-base-100 rounded-box z-[1] w-48 p-2 shadow"
      >
        <li>
          <button @click="onlineModalOpen = true">
            <GlobeIcon class="h-6 w-6" /> Search Online
          </button>
        </li>
        <li>
          <button @click="uploadModalOpen = true">
            <UpIcon class="h-6 w-6" /> Upload
          </button>
        </li>
        <li>
          <button data-tip="Camera" @click="cameraModalOpen = true">
            <CameraIcon class="h-6 w-6" /> Camera
          </button>
        </li>
        <li>
          <button @click="pasteModalOpen = true">
            <PasteIcon class="h-6 w-6" /> Paste URL
          </button>
        </li>
        <li>
          <button @click="drawTemplate">
            <BrushIcon class="h-6 w-6" /> Draw
          </button>
        </li>
      </ul>
    </div>

    <button class="btn btn-primary btn-outline" @click="goToNext">
      <NextIcon class="h-6 w-6" />
    </button>
  </div>
</template>
@/utils/api
