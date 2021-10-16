<template>
    <div v-if="user">
        <br><br>
        <NavBarPatient/>
        <h1>Patient Profile</h1>

        <div id = "leaveReview" v-if = "userNotLeftReview">
            We notice you have not yet left a review for your previous session with Mr John Tan. 
            Leave a review now!
            <router-link to="/rateCounsellor">Rate Counsellor!</router-link>
        </div><br>

        <div id="bgBlock">
            <div id="col-1">
                <div id="patientDetails"> 
                    <p> Name: <strong>{{user.displayName}}</strong><br>
                    Email: <strong>{{user.email}}</strong><br>
                    User ID: <strong>{{user.uid}}</strong></p>
                </div>
                <router-link to="/allAppointments">View All Appointments</router-link>
            </div> 
            <div id="col-2">
                <h3>Select date to view upcoming appointments</h3>
                <PatientCalendar/>
            </div>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarPatient from "@/components/NavBarPatient.vue"
import PatientCalendar from '@/components/PatientCalendar.vue'


export default {
    components: {
        NavBarPatient,
        PatientCalendar
    },
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
    display:flex;
    border-style:solid;
    border-color:#B9D9EB;
    border-width: 2px;
    background: transparent;
    border-radius: 20px;
    padding: 20px;
    width: 80%;
    height: 500px;
    margin: auto;
}

#col-1 {
  background-color: transparent;
  flex: 1;
  text-align: left;
}
#col-2 {
  background-color:rgb(224, 236, 247);
  flex: 1;
}

#leaveReview {
    border-radius: 35px;
    width: 50%;
    background-color:azure;
    margin-left:10%;
    padding:20px;
}

</style>