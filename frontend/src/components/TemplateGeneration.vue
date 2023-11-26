<script setup lang="ts">
import { fabric } from "fabric";

const generateMeme = () => {
  const lowerCanvas = document.querySelector(
    ".lower-canvas",
  ) as HTMLCanvasElement | null;
  const upperCanvas = document.querySelector(
    ".upper-canvas",
  ) as HTMLCanvasElement | null;

  // Create a new Fabric.js canvas
  const newCanvas = new fabric.Canvas("c");

  if (lowerCanvas && upperCanvas) {
    // Create Fabric.js images from the existing lower and upper canvas elements
    const lowerImage = new fabric.Image(lowerCanvas, { left: 0, top: 0 });
    const upperImage = new fabric.Image(upperCanvas, {
      left: lowerCanvas.width,
      top: 0,
    });

    // Calculate the size of the new canvas based on the size of lower and upper canvases
    const newCanvasWidth = lowerCanvas.width + upperCanvas.width;
    const newCanvasHeight = Math.max(lowerCanvas.height, upperCanvas.height);

    // Set the size of the new canvas
    newCanvas.setDimensions({ width: newCanvasWidth, height: newCanvasHeight });

    // Add Fabric.js images to the new canvas
    newCanvas.add(lowerImage, upperImage);
  }

  // Convert the canvas to a data URL (PNG format)
  var dataURL = newCanvas.toDataURL({ format: "png" });

  // Optional: Open a new tab and display the generated meme
  const newTab = window.open("", "_blank");
  if (newTab) {
    newTab.document.write(`<img src="${dataURL}" alt="Generated Meme"/>`);
  }
};

// Optional: Convert data URL to Blob (helper function)
// const dataURLToBlob = (dataURL: string) => {
//   const parts = dataURL.split(",");
//   const contentType = parts[0].split(":")[1].split(";")[0];
//   const byteString = atob(parts[1]);
//   const arrayBuffer = new ArrayBuffer(byteString.length);
//   const uint8Array = new Uint8Array(arrayBuffer);

//   for (let i = 0; i < byteString.length; i++) {
//     uint8Array[i] = byteString.charCodeAt(i);
//   }

//   return new Blob([arrayBuffer], { type: contentType });
// };
</script>

<template>
  <div class="flex justify-center gap-4">
    <button
      @click="generateMeme"
      id="generate-meme"
      class="btn btn-primary btn-outline"
    >
      Generate Meme
    </button>
  </div>
  <div
    ref="testCanvasContainer"
    id="test-canvas-container"
    style="width: 500px"
  >
    <canvas id="c"></canvas>
  </div>
</template>

<style></style>
