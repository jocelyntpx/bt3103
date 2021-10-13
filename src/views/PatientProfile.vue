<template>
    <h3>Patient Profile</h3>

    <div id = "leaveReview" v-if = "userNotLeftReview">
        We notice you have not yet left a review for your previous session with Mr John Tan. 
        Leave a review now!
        <router-link to="/rateCounsellor">Rate Counsellor!</router-link>
    </div><br>

    <div id="bgBlock">
        <div id="patientDetails" v-if="user"> 
            <p> Name: <strong>{{user.displayName}}</strong><br>
            Email: <strong>{{user.email}}</strong><br>
            User ID: <strong>{{user.uid}}</strong></p>
        </div>
        <router-link to="/allAppointments">view all appointments</router-link>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    name:"PatientProfile",

    data(){
        return{
            userNotLeftReview: true,
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
#bgBlock {
  border-radius: 35px;
  background: #B9D9EB;
  padding: 20px;
  width: 80%;
  height: 450px;
  margin:auto;
}

#patientDetails{
    float:left;
    margin-left: 20px;
}

#leaveReview {
    border-radius: 35px;
    width: 50%;
    background-color:azure;
    margin-left:10%;
    padding:20px;
}

</style>