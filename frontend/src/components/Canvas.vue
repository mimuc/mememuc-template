<script setup lang="ts">
import { fabric } from "fabric";
import { onMounted, ref } from "vue";
import runningAwayBalloon from "../assets/templates/running_away_ballon.jpeg";
import TextControl from "./TextControl.vue";

const can = ref(null);
const texts: any = ref([]);
let canvas: fabric.Canvas;

const activeObject: any = ref(null);

onMounted(() => {
  canvas = new fabric.Canvas(can.value);
  new fabric.Image.fromURL(
    runningAwayBalloon,
    (img: { width: any; height: any }) => {
      canvas.setWidth(img.width);
      canvas.setHeight(img.height);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    },
  );
});

function addText() {
  const text = new fabric.IText("hello world", {
    left: 100,
    top: 100,
  });
  text.on("selected", () => {
    console.log("selected");
    activeObject.value = text;
  });

  canvas.add(text);
  texts.value.push(text);
}
</script>

<template>
  <div class="border-primary w-fit border-spacing-1 border-2">
    <canvas ref="can" width="500" height="500"></canvas>
  </div>
  <button class="btn btn-primary" @click="addText">Add Text</button>
  <text-control
    v-if="activeObject"
    :canvas="canvas"
    :activeObject="activeObject"
  />
</template>
