<script setup lang="ts">
import { ColorPicker } from "vue-color-kit";
import "vue-color-kit/dist/vue-color-kit.css";

const fonts = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Times",
  "Courier New",
  "Courier",
  "Verdana",
  "Georgia",
  "Palatino",
  "Garamond",
  "Bookman",
  "Comic Sans MS",
  "Trebuchet MS",
  "Arial Black",
  "Impact",
];

defineProps(["canvas", "activeObject"]);

function transform({
  r,
  g,
  b,
  a,
}: {
  r: number;
  g: number;
  b: number;
  a: number;
}) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
</script>

<template>
  <div class="card bg-neutral w-72">
    <div class="card-body">
      <div class="grid grid-cols-2 gap-4">
        <label class="label cursor-pointer justify-start gap-4">
          <input
            class="checkbox checkbox-primary"
            type="checkbox"
            :value="activeObject.fontWeight === 'bold'"
            @change="
              {
                activeObject.set(
                  'fontWeight',
                  $event.target.checked ? 'bold' : 'normal',
                );
                canvas.renderAll();
              }
            "
          />
          <span class="label-text">Bold</span>
        </label>
        <label class="label cursor-pointer justify-start gap-4">
          <input
            class="checkbox checkbox-primary"
            type="checkbox"
            :value="activeObject.fontStyle === 'italic'"
            @change="
              {
                activeObject.set(
                  'fontStyle',
                  $event.target.checked ? 'italic' : 'normal',
                );
                canvas.renderAll();
              }
            "
          />
          <span class="label-text">Italic</span>
        </label>
      </div>

      <label class="label">
        <span class="label-text">Font</span>
      </label>
      <select
        class="select select-primary border-primary"
        v-model="activeObject.fontFamily"
        @change="canvas.renderAll()"
      >
        <option v-for="font in fonts" :key="font">{{ font }}</option>
      </select>
      <label class="label">
        <span class="label-text">Size</span>
      </label>
      <input
        class="range range-primary"
        type="range"
        min="0"
        max="100"
        v-model="activeObject.fontSize"
        @change="canvas.renderAll()"
      />

      <label class="label">
        <span class="label-text">Color</span>
      </label>
      <div class="flex w-full justify-center">
        <ColorPicker
          theme="dark"
          :sucker-hide="true"
          :color="activeObject.fill"
          @changeColor="
            {
              activeObject.set('fill', transform($event.rgba));
              canvas.renderAll();
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
