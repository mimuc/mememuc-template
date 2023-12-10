<template>
  <div>
    <form>
      <div class="form-group">
        <label>Username</label>
        <input v-model="username" type="text" id="username" />
      </div>

      <div class="form-group">
        <label>E-mail</label>
        <input v-model="email" type="email" id="email" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" id="password" />
      </div>

      <button @click="submitForm" class="btn btn-dark btn-lg btn-block">
        Sign Up
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const username = ref("");
const email = ref("");
const password = ref("");

const submitForm = () => {
  console.log("Username: ", username.value);
  console.log("E-mail: ", email.value);
  console.log("Password: ", password.value);

  let newUser = {
    username: username.value,
    email: email.value,
    password: password.value,
  };
  console.log("Info: ", newUser);
  axios
    .post("http://localhost:3001/register", newUser)
    .then((response) => {
      console.log("Sende newUser");
      console.log(response);
    })
    .catch((error) => {
      console.log("Da ist ein Fehler");
      console.log(error);
    });
};
</script>
