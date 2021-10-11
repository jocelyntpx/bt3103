<template>
    <h3>Patient Profile</h3>

    <div id = "leaveReview" v-if = "userNotLeftReview">
        We notice you have not yet left a review for your previous session with Mr John Tan. 
        Leave a review now!
        <router-link to="/rateCounsellor">Rate Counsellor!</router-link>
    </div><br>

    <div id="bgBlock">
        <div id="patientDetails" v-if="user"> 
            <h3>Name: James Tan</h3>
            <h3>blahblahblah</h3>
                <p> Name: <strong>Rose Lee</strong><br>
                Email: <strong>rose@abc.com</strong><br>
                Uid: <strong>123</strong><br>
                Provider: <strong>??</strong> </p>
        </div>
        <router-link to="/allAppointments">view all appointments</router-link>
    </div>

    <div style="text-align:center;" v-if=false>
        <div>
            <div>
                <!-- <p> Name: <strong>{{user.displayName}}</strong><br>
                Email: <strong>{{user.displayName}}</strong><br>
                Uid: <strong>{{user.displayName}}</strong><br>
                Provider: <strong>{{user.displayName}}</strong> </p> -->
            </div>
            <UserInfo/>
        </div>
        <Logout/>
    </div>
</template>

<script>
import UserInfo from "@/components/UserInfo.vue";

export default {
    components: {UserInfo},
    name:"PatientProfile",

    data(){
        return{
            userNotLeftReview: true, // Ultimately i think this argument wld be passed as a prop or something??
            user: true
        }
    }
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