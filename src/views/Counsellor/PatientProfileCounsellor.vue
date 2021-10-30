<template>
    <div v-if="user">
        <br><br>
        <!-- if user is patient -->
        <NavBarCounsellor/> 

        <!-- <button id = "back" @click="goBack()"> Back to Past Patients </button> <br> -->

        <h1>Patient's Profile</h1>

        <!-- else (user is counsellor from MyPatients) -->
        <!-- <NavBarCounsellor/> -->
        <!-- <div id = "backBtn">
            <router-link to="/myPatients"> ← Back to My Patients page</router-link>
        </div> -->
        <div id="bgBlock">
            <div id="col-1">
                <div id="patientDetails"> 
                    <p> Alias: <strong>{{this.patient_name}}</strong><br>
                    Email: <strong>{{this.patient_email}}</strong><br></p>
                </div>

                <div class="save-btn">
                    <button @click="showModal = true">Report</button>
                </div>
            </div> 
            <!-- <div id="col-2">
                <h3>Select date to view upcoming appointments</h3>
                <PatientCalendar/>
            </div> -->

<!-- this entire chunk for upcoming appointment to be replaced to UserUpcomingSessions component. 
do v-if v-else to show links and X -->
            <UserUpcomingSessionsCounsellor/> 

            <br><br>

            <div style="text-align:center;" v-if="user">
            <UserPreviousSessionsCounsellor/> 
            <!-- ^ not copying over the correct information from the v-if=user from UserPreviousSessions, brings else info here instead -->
            <!-- <div><h3><strong>This is the appointment page</strong></h3></div> -->
            </div>

            <br>

        </div>
    </div>
    <ReportPatientModal v-show="showModal" @close-modal="showModal = false" v-bind:patient_email="this.patient_email"/>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarCounsellor from "@/components/NavBarCounsellor.vue"
import UserUpcomingSessionsCounsellor from "@/components/UserUpcomingSessionsCounsellor.vue"
import UserPreviousSessionsCounsellor from "@/components/UserPreviousSessionsCounsellor.vue"
import ReportPatientModal from "@/components/ReportPatientModal.vue"
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore"
import {  doc, getDoc } from "firebase/firestore";
const db = getFirestore(firebaseApp);


export default {
    components: {
        NavBarCounsellor,
        UserPreviousSessionsCounsellor,
        UserUpcomingSessionsCounsellor,
        ReportPatientModal,
    },
    name:"PatientProfile",

    data(){
        return{
            patient_ID: this.$route.params.id, // patient UID
            userNotLeftReview: true,
            user:false,
            count:"",
            patient_name: "",
            patient_email: "",
            showModal: false,
        }
    },

    mounted() {
        // console.log("UpcomingPatients.vue");
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
            // this.fbuser = user.email;
            this.getDetails(this.patient_ID);
        });
        // this.counsellorUser = auth.currentUser.email;
        // this.displayUpcomingAppointments(this.counsellorUser);
    },

    methods: {
        async getDetails(user) {
            let docRef = doc(db, "Patients", String(user));
            let patientDoc = await getDoc(docRef);      
            this.patient_name = patientDoc.data().name;
            this.patient_email = patientDoc.data().email;
            // this.patient_uid = patientDoc.data().userID;
        },


        // goBack() {
        //     this.$router.push({ name: 'MyPatients', params: { showUpcoming:false } }) 
        // }
   
    }
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

#back {
    float:left;
    margin-left: 10%;
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