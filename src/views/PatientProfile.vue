<template>
    <h3>Patient Profile</h3>

    <div id = "leaveReview" v-if = "userNotLeftReview">
        We notice you have not yet left a review for your previous session with Mr John Tan. 
        Leave a review now!
        <router-link to="/rateCounsellor">Rate Counsellor!</router-link>
    </div><br>

    <div id="bgBlock">
        <div id="col-1">
            <div id="counsellor">
                <div id="col-1-1">
                    <img id="profilePic" alt="Vue logo" src="https://icon-library.com/images/user-icon-jpg/user-icon-jpg-28.jpg">
                </div>
                <div id="col-1-2">
                    <div id="PatientDetails" v-if="user">
                        <UserInfo/>
                        <br>
                        <router-link to="/allAppointments">view all appointments</router-link>
                    </div>
                </div>
            </div>
            <ul id="counsellorInfo">
                <li>Blahblahblah</li>
            </ul>

        </div>
        <div id="col-2">
            <h3>Select date to view upcoming appointments</h3>
            <PatientCalendar/>
        </div>
    </div>
    <Logout/>
</template>

<script>
import UserInfo from "@/components/UserInfo.vue";
import PatientCalendar from "@/components/PatientCalendar.vue"

export default {
    components: {UserInfo, PatientCalendar},
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

#col-1-1, #col-1-2 {
    align-self: center;
    padding: 20px;
}

#counsellor {
    display: flex;
}

#counsellorInfo {
    text-align: left;
    line-height: 2em;
}

#profilePic {
    height: 120px;
    border-radius: 50%;
    border-color: black;
    border-width: 2px;
    border-style: solid;
}

#leaveReview {
    border-radius: 35px;
    width: 50%;
    background-color:azure;
    margin-left:10%;
    padding:20px;
}

</style>