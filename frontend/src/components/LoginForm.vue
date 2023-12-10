<template>
  <div>
    <form>
      <div class="form-group">
        <label>Username</label>
        <input v-model="username" type="text" id="username" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" id="password" />
      </div>

      <button @click="login" class="btn btn-dark btn-lg btn-block">
        Login
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const username = ref("");
const password = ref("");

const login = async (event) => {
  event.preventDefault();

  try {
    const response = await axios.post("http://localhost:3001/login", {
      username: username.value,
      password: password.value,
    });

    console.log("Login successful");
    console.log(response);

    // Hier können Sie den Benutzer nach dem erfolgreichen Login weiterleiten
    // (z.B., indem Sie Vue Router verwenden).
  } catch (error) {
    console.log("Login failed");
    console.log(error);

    // Hier können Sie eine Fehlermeldung für den Benutzer anzeigen.
  }
};
</script>
