<script setup lang="ts">
const generateMeme = () => {
  const canvas1 = document.querySelector(
    ".lower-canvas",
  ) as HTMLCanvasElement | null;
  const canvas2 = document.querySelector(
    ".upper-canvas",
  ) as HTMLCanvasElement | null;
  const newTab = window.open("", "_blank");

  if (canvas1 && canvas2 && newTab) {
    // Create a new canvas
    const newCanvas = document.createElement("canvas") as HTMLCanvasElement;
    const context = newCanvas.getContext("2d");

    if (context) {
      newCanvas.width = canvas1.width + canvas2.width;
      newCanvas.height = Math.max(canvas1.height, canvas2.height);

      // Draw the content of canvas1 onto the new canvas
      context.drawImage(canvas1, 0, 0, canvas1.width, canvas1.height);

      // Draw the content of canvas2 next to canvas1 on the new canvas
      context.drawImage(
        canvas2,
        canvas1.width,
        0,
        canvas2.width,
        canvas2.height,
      );

      // Convert the canvas to a data URL (PNG format)
      const dataURL = newCanvas.toDataURL("image/png");

      // Open a new tab and display the generated meme
      newTab.document.write(`<img src="${dataURL}" alt="Generated Meme"/>`);

      // Optional: Convert data URL to Blob (helper function)
      const blob = dataURLToBlob(dataURL);
      console.log(blob);
    }
  }
};

// Helper function to convert data URL to blob
const dataURLToBlob = (dataURL: string) => {
  const parts = dataURL.split(",");
  const contentType = parts[0].split(":")[1].split(";")[0];
  const byteString = atob(parts[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: contentType });
};
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
</template>

<style></style>
