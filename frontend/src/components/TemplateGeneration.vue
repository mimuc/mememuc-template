<script setup lang="ts">
import { ref } from "vue";
import { fabric } from "fabric";

const props = defineProps(["canvas" as const]); // Assuming canvas is of type fabric.Canvas

function downloadImage() {
  console.log("I am in 0");
  console.log(props);
  if (props.canvas) {
    console.log("I am in 1");
    // Check if there is a background image and it is not tainted
    if (
      props.canvas.backgroundImage &&
      !(props.canvas.backgroundImage as fabric.Image).crossOrigin
    ) {
      console.log("I am in 2");
      // Create a data URL for the canvas
      const dataUrl = props.canvas.toDataURL({ format: "png", quality: 1 });

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
}
</script>

<template>
  <div class="flex justify-center gap-4">
    <button class="btn btn-primary w-48" @click="downloadImage">
      Download Image
    </button>
  </div>
</template>

<style></style>
