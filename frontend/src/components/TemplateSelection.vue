<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  CloudArrowUpIcon as UpIcon,
  MagnifyingGlassIcon as SearchIcon,
  ChevronRightIcon as NextIcon,
  ChevronLeftIcon as PreviousIcon,
  ArrowPathIcon as RandomIcon,
} from "@heroicons/vue/24/solid";
import { getAllTemplates } from "@/utils/api";
import TemplateUpload from "@/components/TemplateUpload.vue";
import TemplateBrowse from "./TemplateBrowse.vue";

interface Props {
  setTemplate: (id: string) => void;
}

const browseModal = ref<HTMLDialogElement | null>(null);
const uploadModal = ref<HTMLDialogElement | null>(null);
const templates = ref<{ id: string; name: string; url: string }[]>([]);
const index = ref(0);

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
</script>

<template>
  <dialog id="browse-modal" class="modal" ref="browseModal">
    <div class="modal-box h-4/5 max-w-3xl">
      <TemplateBrowse
        :templates="templates"
        :setTemplate="
          (id: string) => {
            setTemplate(id);
            browseModal?.close();
          }
        "
      />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
  <dialog id="upload-modal" class="modal" ref="uploadModal">
    <div class="modal-box w-1/2 max-w-xl">
      <TemplateUpload
        :setTemplate="
          (id: string) => {
            setTemplate(id);
            uploadModal?.close();
          }
        "
      />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

  <div class="flex justify-center gap-4">
    <button class="btn btn-primary btn-outline" @click="goToPrevious">
      <PreviousIcon class="h-6 w-6" />
    </button>

    <button
      class="btn btn-primary btn-outline"
      @click="browseModal?.showModal()"
    >
      <SearchIcon class="h-6 w-6" />
    </button>
    <button
      class="btn btn-primary btn-outline"
      @click="uploadModal?.showModal()"
    >
      <UpIcon class="h-6 w-6" />
    </button>

    <button class="btn btn-primary btn-outline" @click="goToRandom">
      <RandomIcon class="h-6 w-6" />
    </button>

    <button class="btn btn-primary btn-outline" @click="goToNext">
      <NextIcon class="h-6 w-6" />
    </button>
  </div>
</template>
