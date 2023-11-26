<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { CameraIcon, CheckIcon, ArrowPathIcon } from "@heroicons/vue/24/solid";
import { uploadUserTemplate } from "@/utils/api";

interface Props {
  setTemplate: (id: string) => void;
}

const props = defineProps<Props>();

const isPhotoTaken = ref(false);
const camera = ref<HTMLVideoElement>();
const canvas = ref<HTMLCanvasElement>();

const dimensions = {
  width: 450,
  height: 337,
};

onMounted(() => {
  createCameraElement();
});

onBeforeUnmount(() => {
  console.log("Unmounting camera");
  stopCameraStream();
});

const createCameraElement = () => {
  const constraints = {
    audio: false,
    video: true,
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      if (camera.value) camera.value.srcObject = stream;
    })
    .catch((_error) => {
      alert("The browser may not support or there might be an error.");
    });
};

const stopCameraStream = () => {
  const tracks = camera.value.srcObject.getTracks();
  tracks.forEach((track: any) => {
    track.stop();
  });
};

const takePhoto = () => {
  if (!canvas.value || !camera.value) return;

  isPhotoTaken.value = true;

  const context = canvas.value.getContext("2d");
  context?.drawImage(camera.value, 0, 0, dimensions.width, dimensions.height);
};

const downloadImage = () => {
  if (!canvas.value) return;

  canvas.value.toBlob((blob) => {
    uploadUserTemplate("test-user", blob as File, "upload").then((data) => {
      props.setTemplate(`http://localhost:3001/users/img/test-user/${data.id}`);
    });
  });
};
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <video
      v-show="!isPhotoTaken"
      ref="camera"
      autoplay
      :width="dimensions.width"
      :height="dimensions.height"
    ></video>

    <canvas
      v-show="isPhotoTaken"
      ref="canvas"
      id="photoTaken"
      :width="dimensions.width"
      :height="dimensions.height"
    ></canvas>

    <div class="flex gap-4">
      <button
        v-show="!isPhotoTaken"
        class="btn btn-primary btn-circle btn-outline"
        @click="takePhoto"
      >
        <CameraIcon class="h-6 w-6" />
      </button>

      <button
        v-show="isPhotoTaken"
        class="btn btn-error btn-circle btn-outline"
        @click="isPhotoTaken = !isPhotoTaken"
      >
        <ArrowPathIcon class="h-6 w-6" />
      </button>

      <button
        v-show="isPhotoTaken"
        class="btn btn-success btn-circle btn-outline"
        @click="downloadImage"
      >
        <CheckIcon class="h-6 w-6" />
      </button>
    </div>
  </div>
</template>
