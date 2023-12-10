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
      <div class="form-group">
        <label>Password Confirmation</label>
        <input
          v-model="passwordConfirmation"
          type="password"
          id="passwordConfirmation"
        />
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="passwordError" style="color: red">{{ passwordError }}</p>
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
const passwordConfirmation = ref("");
const errorMessage = ref("");
const passwordError = ref("");

const submitForm = async (event) => {
  event.preventDefault();
  try {
    if (password.value !== passwordConfirmation.value) {
      passwordError.value = "Passwords do not match.";
      return;
    }
    const newUser = {
      username: username.value,
      email: email.value,
      password: password.value,
    };
    const response = await axios.post(
      "http://localhost:3001/register",
      newUser,
    );

    console.log("Antwort Backend: ", response);
    errorMessage.value = "";

    if (response.data.success) {
      window.location.href = "http://localhost:5173";
    }
  } catch (error) {
    console.log("Fehlermeldung: ", error);

    if (error.response && error.response.status === 400) {
      console.log("Ist schon vorhanden");
      errorMessage.value =
        "An account with the username or e-mail is already registered. Please use a different username or e-mail.";
      console.log(errorMessage.value);
    }
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>
