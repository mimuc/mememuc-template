<script setup lang="ts">
import { fabric } from "fabric";
import { Ref, onMounted, ref } from "vue";
import {
  ChatBubbleBottomCenterTextIcon as TextIcon,
  PhotoIcon,
} from "@heroicons/vue/24/solid";
import runningAwayBalloon from "@/assets/templates/running_away_ballon.jpeg";
import TextControl from "@/components/TextControl.vue";
import Upload from "@/components/Upload.vue";

const can = ref(null);
const modal = ref<HTMLDialogElement | null>(null);

let canvas: fabric.Canvas;

const activeObject: Ref<fabric.IText | null> = ref(null);

onMounted(() => {
  canvas = new fabric.Canvas(can.value);
  fabric.Image.fromURL(runningAwayBalloon, (img) => {
    canvas.setWidth(img.width ?? 500);
    canvas.setHeight(img.height ?? 500);
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
  });

  canvas.on("selection:created", (e: any) => {
    activeObject.value = e.selected[0];
  });

  canvas.on("selection:updated", (e: any) => {
    activeObject.value = e.selected[0];
  });

  canvas.on("selection:cleared", () => {
    activeObject.value = null;
  });
});

function addText() {
  const text = new fabric.IText("hello world", {
    left: (activeObject.value?.left ?? 0) + 10,
    top: (activeObject.value?.top ?? 0) + 10,
  });
  canvas.add(text);
  canvas.setActiveObject(text);
}

async function setTemplate(id: string) {
  const img = new Image();
  img.src = `http://localhost:3000/template/${id}`;

  fabric.Image.fromURL(img.src, (img) => {
    canvas.setWidth(img.width ?? 500);
    canvas.setHeight(img.height ?? 500);
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
  });
}
</script>

<template>
  <div class="grid grid-cols-3 gap-8">
    <div class="flex flex-col items-end gap-4">
      <button class="btn btn-primary w-48" @click="addText">
        Add Text <TextIcon class="h-6 w-6" />
      </button>
      <button class="btn btn-primary w-48" @click="modal?.showModal()">
        Add Image <PhotoIcon class="h-6 w-6" />
      </button>
    </div>
    <dialog id="image-modal" class="modal" ref="modal">
      <div class="modal-box">
        <Upload :setTemplate="setTemplate" />
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <div class="flex justify-center">
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
