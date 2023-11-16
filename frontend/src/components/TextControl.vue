<script setup lang="ts">
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
</script>

<template>
  <div class="card bg-neutral w-96">
    <div class="card-body">
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

      <label class="label cursor-pointer">
        <span class="label-text">Bold</span>
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
      </label>
    </div>
  </div>
</template>
