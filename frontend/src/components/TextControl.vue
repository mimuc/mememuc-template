<script setup lang="ts">
import { ColorPicker } from "vue-color-kit";
import { fabric } from "fabric";
import "vue-color-kit/dist/vue-color-kit.css";
import { TrashIcon, DocumentDuplicateIcon } from "@heroicons/vue/24/solid";
import { transformRgba } from "@/utils/helper";

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

interface Props {
  canvas: fabric.Canvas;
  activeObject: fabric.IText | fabric.BaseBrush;
}

defineProps<Props>();

function duplicate(obj: any, canvas: any) {
  const newObject = new fabric.IText(obj.text, {
    fontFamily: obj.fontFamily,
    fontSize: obj.fontSize,
    fontWeight: obj.fontWeight,
    fontStyle: obj.fontStyle,
    fill: obj.fill,
    left: obj.left + 10,
    top: obj.top + 10,
  });
  canvas.add(newObject);
  canvas.setActiveObject(newObject);
  canvas.renderAll();
}
</script>

<template>
  <div class="card bg-neutral w-72">
    <div v-if="!activeObject.fontFamily" class="card-body">
      <button
        class="btn btn-error btn-outline"
        @click="
          {
            const obj = canvas.getActiveObject();
            obj ? canvas.remove(obj) : null;
            canvas.setActiveObject(canvas.getObjects()[0]);
          }
        "
      >
        <TrashIcon class="h-6 w-6" />
      </button>
    </div>
    <div class="card-body" v-if="activeObject.fontFamily">
      <div class="grid grid-cols-2 gap-4">
        <button
          class="btn btn-info btn-outline"
          @click="duplicate(activeObject, canvas)"
        >
          <DocumentDuplicateIcon class="h-6 w-6" />
        </button>
        <button
          class="btn btn-error btn-outline"
          @click="
            {
              const obj = canvas.getActiveObject();
              obj ? canvas.remove(obj) : null;
              canvas.setActiveObject(canvas.getObjects()[0]);
            }
          "
        >
          <TrashIcon class="h-6 w-6" />
        </button>
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

      <!-- <label class="label">
        <span class="label-text">Size</span>
      </label>
      <input
        class="range range-primary"
        type="range"
        min="0"
        max="100"
        v-model="activeObject.fontSize"
        @change="canvas.renderAll()"
      /> -->

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
                  $event.target?.checked ? 'bold' : 'normal',
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
                  $event.target?.checked ? 'italic' : 'normal',
                );
                canvas.renderAll();
              }
            "
          />
          <span class="label-text">Italic</span>
        </label>
      </div>

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
              activeObject.set('fill', transformRgba($event.rgba));
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
