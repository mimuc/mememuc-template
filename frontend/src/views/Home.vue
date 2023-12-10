<template>
  <div class="flex w-full flex-col items-center gap-4 p-16">
    <div class="prose">
      <h1>Meme Muc</h1>
      <p>
        This is a meme generator for the Online Multimedia lecture at LMU
        Munich.
      </p>
    </div>
    <router-link to="editor" class="btn btn-primary">Generate Meme</router-link>
    <router-link to="register" class="btn btn-primary"
      >Register new Account</router-link
    >
  </div>
</template>
