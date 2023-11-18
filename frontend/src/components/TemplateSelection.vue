<script setup lang="ts">
import { ref } from "vue";
import {
  CloudArrowUpIcon as UpIcon,
  MagnifyingGlassIcon as SearchIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/solid";
import { getRandomTemplate } from "@/utils/api";
import TemplateUpload from "@/components/TemplateUpload.vue";
import TemplateBrowse from "./TemplateBrowse.vue";

interface Props {
  setTemplate: (id: string) => void;
}

const browseModal = ref<HTMLDialogElement | null>(null);
const uploadModal = ref<HTMLDialogElement | null>(null);

const props = defineProps<Props>();

async function shuffleTemplate() {
  const template = await getRandomTemplate();
  props.setTemplate(`http://localhost:3001/template/img/${template.id}`);
}
</script>

<template>
  <dialog id="browse-modal" class="modal" ref="browseModal">
    <div class="modal-box max-w-4xl">
      <TemplateBrowse
        :setTemplate="
          (id: string) => {
            setTemplate(id);
            browseModal?.close();
          }
        "
      />
    </div>
  </dialog>
  <dialog id="upload-modal" class="modal" ref="uploadModal">
    <div class="modal-box max-w-4xl">
      <TemplateUpload
        :setTemplate="
          (id: string) => {
            setTemplate(id);
            uploadModal?.close();
          }
        "
      />
    </div>
  </dialog>

  <button class="btn btn-primary w-48" @click="browseModal?.showModal()">
    Find Template <SearchIcon class="h-6 w-6" />
  </button>
  <button class="btn btn-primary w-48" @click="uploadModal?.showModal()">
    Add Image <UpIcon class="h-6 w-6" />
  </button>
  <button class="btn btn-primary w-48" @click="shuffleTemplate">
    Shuffle Template <ArrowPathIcon class="h-6 w-6" />
  </button>
</template>
