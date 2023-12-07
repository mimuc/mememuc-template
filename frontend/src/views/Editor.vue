<script setup lang="ts">
import Canvas from "@/components/Canvas.vue";
import trpc from "@/utils/trpc";
const user = await trpc.userById.query("1");

console.log(user);
</script>

<template>
  <div class="p-16">
    <Canvas />
  </div>
</template>
