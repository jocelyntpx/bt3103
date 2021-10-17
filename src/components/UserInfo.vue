<template>

  <!-- This component templates the user info (seen in Patients records, User's profile page ) -->
  <!-- <div><h3 id = "profile_page"><strong>This is the User Info</strong></h3></div> -->

  <div id = "user_info"> 
    <strong>Name:</strong> Rose Lee<br>
    <strong>Email:</strong> roseLee@gmail.com<br>
  </div> 


  <!-- <div>
      <p> Name: <strong>{{user.displayName}}</strong><br>
      Email: <strong>{{user.displayName}}</strong><br>
      Uid: <strong>{{user.displayName}}</strong><br>
      Provider: <strong>{{user.displayName}}</strong> </p>
  </div> -->
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    name: "UserInfo",

    data(){
        return{
            user:false,
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        })
    },
}
</script>

<style scoped>
#user_info {
  align-content: left;
  text-align:left;
  margin-left: 20px;
  font-size: 19px;
}

</style>