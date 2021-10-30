<template>
  <!-- <div id="ResetPassword">
    <h1>All About Sustainability</h1>
    <router-link to="/" exact><v-icon dark right>mdi-home</v-icon></router-link>
    <h2>Reset Password Page</h2>
    <br /><br />
    <div id="vcard">
      <v-card id="test" width="700">
        <div id="content">
          <v-card-title>Reset your password!</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field label="Email" v-model="email"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="#EF9A9A" class="mr-4" @click="reset">Reset</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </div>
  </div> -->

    <div class="modal-overlay" @click="$emit('close-modal')">
    <div class="modal" @click.stop>
      <h6>Reset Password</h6>
      <p>Note: Click anywhere outside this pop-up to exit.</p>

      <div>
        <label for="email"><strong>Email: </strong></label>
        <input type="text" id="email" required="" name="email" v-model="email">
        <!-- <input type="text" id="password" required="" name="login" placeholder="Enter password"> -->
      </div>

      <br>
      <button @click="reset()" >Reset</button>
    </div>
    <div class="close" @click="$emit('close-modal')">
    </div>
  </div>
</template>

<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default {
  data: function() {
    return {
      email: "",
    };
  },
  methods: {
    reset() {
      console.log(this.email)
      const auth = getAuth();
      if (this.email != "") {
        sendPasswordResetEmail(auth, this.email)
          .then(() => {
            console.log("email sent")
            alert("Check your email for further instructions to reset your password!")
          })
          .catch(function(error) {
            alert(error);
          });
      } else {
        alert("Please fill in your email.");
      }
    },
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
  z-index: 1;
}

.modal {
  text-align: center;
  background-color: white;
  height: 500px;
  width: 500px;
  margin-top: 10%;
  padding: 60px 0;
  border-radius: 20px;
}
.close {
  margin: 10% 0 0 16px;
  cursor: pointer;
}

.close-img {
  width: 25px;
}

.check {
  width: 150px;
}

h6 {
  font-weight: 500;
  font-size: 28px;
  margin: 20px 0;
}

p {
  font-size: 16px;
  margin: 20px 0;
}

button {
  background-color: #ac003e;
  width: 150px;
  height: 40px;
  color: white;
  font-size: 14px;
  border-radius: 16px;
}

</style>