<script setup>
import { fabric } from "fabric";
import { onMounted, ref } from "vue";

const can = ref(null);

onMounted(() => {
  const canvas = new fabric.Canvas(can.value);
  const rect = new fabric.Rect({
    fill: "red",
    width: 20,
    height: 20,
  });
  canvas.add(rect);
});
</script>

<template>
  <div class="border-primary w-fit border-spacing-1 border-2">
    <canvas ref="can" width="500" height="500"></canvas>
  </div>
</template>
