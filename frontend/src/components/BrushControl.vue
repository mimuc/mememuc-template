<script setup lang="ts">
import { ColorPicker } from "vue-color-kit";
import { fabric } from "fabric";
import "vue-color-kit/dist/vue-color-kit.css";
import { transformRgba } from "@/utils/helper";

interface Props {
  canvas: fabric.Canvas;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="card bg-neutral w-72">
    <div class="card-body">
      <label class="label">
        <span class="label-text">Size</span>
      </label>
      <input
        class="range range-primary"
        type="range"
        min="0"
        max="100"
        v-model="canvas.freeDrawingBrush.width"
      />
      <label class="label">
        <span class="label-text">Color</span>
      </label>
      <div class="flex w-full justify-center">
        <ColorPicker
          theme="dark"
          :sucker-hide="true"
          :color="props.canvas.freeDrawingBrush.color"
          @changeColor="
            {
              props.canvas.freeDrawingBrush.color = transformRgba($event.rgba);
            }
          "
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.hu-color-picker {
  width: 218px !important;
}
</style>
