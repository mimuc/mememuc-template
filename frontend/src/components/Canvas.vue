<script setup lang="ts">
import { fabric } from "fabric";
import { Ref, onMounted, ref } from "vue";
import {
  ChatBubbleBottomCenterTextIcon as TextIcon,
  PhotoIcon,
  ArrowPathIcon,
} from "@heroicons/vue/24/solid";
import TextControl from "@/components/TextControl.vue";
import Upload from "@/components/Upload.vue";
import { getRandomTemplate } from "@/utils/api";

const can = ref(null);
const modal = ref<HTMLDialogElement | null>(null);

let canvas: fabric.Canvas;

const activeObject: Ref<fabric.IText | null> = ref(null);

onMounted(async () => {
  canvas = new fabric.Canvas(can.value);

  canvas.on("selection:created", (e: any) => {
    activeObject.value = e.selected[0];
  });

  canvas.on("selection:updated", (e: any) => {
    activeObject.value = e.selected[0];
  });

  canvas.on("selection:cleared", () => {
    activeObject.value = null;
  });

  shuffleTemplate();
});

function addText() {
  const text = new fabric.IText("hello world", {
    left: (activeObject.value?.left ?? 0) + 10,
    top: (activeObject.value?.top ?? 0) + 10,
  });
  canvas.add(text);
  canvas.setActiveObject(text);
}

async function setTemplate(url: string) {
  const img = new Image();
  img.src = url;

  fabric.Image.fromURL(img.src, (img) => {
    const width = img.width ?? 500;
    const height = img.height ?? 500;

    const scale = 500 / width;

    img.scale(scale);
    canvas.setWidth(width * scale);
    canvas.setHeight(height * scale);

    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
  });
}

async function shuffleTemplate() {
  const template = await getRandomTemplate();
  setTemplate(`http://localhost:3001/template/img/${template.id}`);
}
</script>

<template>
  <dialog id="image-modal" class="modal" ref="modal">
    <div class="modal-box w-full">
      <Upload :setTemplate="setTemplate" />
    </div>
  </dialog>
  <div class="flex gap-8">
    <div class="flex flex-col items-end gap-4">
      <button class="btn btn-primary w-48" @click="addText">
        Add Text <TextIcon class="h-6 w-6" />
      </button>
      <button class="btn btn-primary w-48" @click="modal?.showModal()">
        Add Image <PhotoIcon class="h-6 w-6" />
      </button>
      <button class="btn btn-primary w-48" @click="shuffleTemplate">
        Shuffle Template <ArrowPathIcon class="h-6 w-6" />
      </button>
    </div>

    <div class="flex w-fit justify-center">
      <div class="card bg-neutral h-fit w-fit">
        <div class="card-body">
          <canvas ref="can" width="500" height="500"></canvas>
        </div>
      </div>
    </div>
    <div>
      <text-control
        v-if="activeObject"
        :canvas="canvas"
        :activeObject="activeObject"
      />
    </div>
  </div>
</template>
