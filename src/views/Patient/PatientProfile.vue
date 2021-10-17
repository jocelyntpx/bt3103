<template>
    <div v-if="user">
        <br><br>
        <NavBarPatient/>
        <h1>My Profile</h1>

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
            </div> 
            <!-- <div id="col-2">
                <h3>Select date to view upcoming appointments</h3>
                <PatientCalendar/>
            </div> -->

            <h3>Upcoming Appointments</h3>
            <table id="table1">
                <tr id=header>
                <th>Date</th> 
                <th>Counsellor</th>
                <th>Link</th>
                <th></th> 
                </tr>
                <tr>
                    <td>10/10/21</td>
                    <td>Mdm Lim</td>
                    <td>Time for your session. Create your link now!</td>
                    <td>X</td>
                </tr>
                <tr>
                    <td>11/10/21</td>
                    <td>Mr Tan</td>
                    <td>Session link can be created when it is time for your session.</td>
                    <td>X</td>
                </tr>
            </table>

            <br><br>

            <div style="text-align:center;" v-if="user">
            <UserPreviousSessions/> 
            <!-- ^ not copying over the correct information from the v-if=user from UserPreviousSessions, brings else info here instead -->
            <!-- <div><h3><strong>This is the appointment page</strong></h3></div> -->
            </div>

            <br>

        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarPatient from "@/components/NavBarPatient.vue"
import UserPreviousSessions from "@/components/UserPreviousSessions.vue"
// import PatientCalendar from '@/components/PatientCalendar.vue'


export default {
    components: {
        NavBarPatient,
        UserPreviousSessions,
        // PatientCalendar
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
    /* display:flex;
    border-style:solid;
    border-color:#B9D9EB;
    border-width: 2px;
    background: transparent;
    border-radius: 20px;
    padding: 20px;
    width: 80%;
    height: 500px;
    margin: auto; */

    border-radius: 35px;
    background: #B9D9EB;
    padding: 20px;
    width: 80%;
    height: 100%;
    margin:auto;
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

#backBtn{
  text-align: left;
  margin-left: 250px; 
}

#table1{
    /* width: 630px; */
    font-family: Arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    background-color:rgb(242, 242, 243);
}
th,td { 
    /* background-color: whitesmoke;  */
    border: 1px solid #dddddd;
    padding: 8px;
    text-align: center;
}

tr:nth-child(even){
    background-color: #e3edee;
}

#header {
    background-color: black;
}

th{
    color: white;
}

</style>