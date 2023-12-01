<script setup lang="ts">
import { fabric } from "fabric";
import { Ref, onMounted, ref } from "vue";
import {
  ChatBubbleBottomCenterTextIcon as TextIcon,
  PaintBrushIcon as BrushIcon,
} from "@heroicons/vue/24/solid";
import TextControl from "@/components/TextControl.vue";
//import TemplateSelection from "@/components/TemplateSelection.vue";
import TemplateGeneration from "@/components/TemplateGeneration.vue";
import BrushControl from "./BrushControl.vue";
import TemplateControl from "@/components/template/TemplateControl.vue";

const can = ref(null);

let canvas: fabric.Canvas;

const activeObject: Ref<fabric.IText | fabric.BaseBrush | null> = ref(null);
const drawingMode = ref(false);

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
  if (url === "") {
    canvas.clear();
    canvas.setBackgroundColor("white", () => {
      canvas.setDimensions({ width: 500, height: 500 });
      canvas.renderAll();
    });
    return;
  }

  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = function () {
    const width = img.width ?? 500;
    const height = img.height ?? 500;

    const scale = 500 / width;

    const fabricImg = new fabric.Image(img, {
      scaleX: scale,
      scaleY: scale,
    });

    canvas.setWidth(width * scale);
    canvas.setHeight(height * scale);

    canvas.setBackgroundImage(fabricImg, canvas.renderAll.bind(canvas));
    canvas.setWidth(width * scale);
    canvas.setHeight(height * scale);

    canvas.setBackgroundImage(fabricImg, canvas.renderAll.bind(canvas));
  };

  img.onerror = function (error) {
    console.error("Error loading image:", error);
  };

  img.src = url;
}

function setDrawingMode(value: boolean) {
  drawingMode.value = value;
  canvas.isDrawingMode = value;
}

function downloadImage() {
  // Check if there is a background image and it is not tainted
  if (
    canvas.backgroundImage &&
    !(canvas.backgroundImage as fabric.Image).crossOrigin
  ) {
    // Create a data URL for the canvas
    const dataUrl = canvas.toDataURL({ format: "png", quality: 1 });

    // Create a link element and trigger a click to download the image
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "my_meme.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    console.error(
      "Background image is tainted. Ensure that it is hosted on the same domain or has proper CORS headers.",
    );
  }
}
</script>

<template>
  <div class="flex items-start gap-8">
    <div class="flex flex-col gap-4">
      <button class="btn btn-primary w-48" @click="addText">
        Add Text
        <TextIcon class="h-6 w-6" />
      </button>
      <button
        class="btn btn-primary w-48"
        :class="{ 'btn-outline': !drawingMode }"
        @click="setDrawingMode(!drawingMode)"
      >
        Add Brush
        <BrushIcon class="h-6 w-6" />
      </button>
    </div>

    <div class="flex w-fit flex-col justify-center gap-4">
      <TemplateControl
        :setTemplate="setTemplate"
        :setDrawingMode="setDrawingMode"
      />
      <div class="card bg-neutral h-fit w-fit">
        <div class="card-body">
          <canvas ref="can" width="500" height="500"></canvas>
        </div>
      </div>
      <TemplateGeneration />
    </div>
    <div>
      <TextControl
        v-if="activeObject"
        :canvas="canvas"
        :activeObject="activeObject"
      />
      <BrushControl v-if="drawingMode" :canvas="canvas" />

      <button class="btn btn-primary w-48" @click="downloadImage">
        Download Image
      </button>
    </div>
  </div>
</template>
