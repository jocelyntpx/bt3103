<template>
    <div v-if="user">
        <br><br>
        <!-- if user is patient -->
        <NavBarCounsellor/> 

        <!-- <button id = "back" @click="goBack()"> Back to Past Patients </button> <br> -->
        <br>
        <p class="text-4xl">Patient: {{this.patient_name}}</p>
        <br>


        <div class="bg-base-300 text-base-content">
        <div id="bgBlock">

            <UserUpcomingSessionsCounsellor/> 

            <br><br>

            <div style="text-align:center;" v-if="user">
            <UserPreviousSessionsCounsellor/> 
            <br>
  
            </div>

            <div class="align-center">
                <br>
                    <label for="my-modal-2" class="btn btn-sm btn-error modal-button">Report Patient</label> 
                        <input type="checkbox" id="my-modal-2" class="modal-toggle"> 
                        <div class="modal">
                        <div class="modal-box">
                          <form ref="form" @submit.prevent="sendEmail">
                        <input type="hidden" name="reporter" :value="this.counsellor_email">
                        <input type="hidden" name="reportee" :value="this.patient_email">
                        <textarea name="report_details" v-model="report_details" class="textarea h-24 textarea-bordered textarea-primary" cols="60" rows="40" required=""
                            placeholder="Report details"></textarea><br><br>
                    </form> 
                        <div class="modal-action">
                        <label for="my-modal-2" class="btn btn-error" @click="sendEmail()">Report</label> 
                        <label for="my-modal-2" type="submit" class="btn">Close</label>
                        </div>
                    </div>
                    </div>
            </div> 
            <br>

        </div>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarCounsellor from "@/components/Counsellor/NavBarCounsellor.vue"
import UserUpcomingSessionsCounsellor from "@/components/Counsellor/UserUpcomingSessionsCounsellor.vue"
import UserPreviousSessionsCounsellor from "@/components/Counsellor/UserPreviousSessionsCounsellor.vue"
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore"
import {  doc, getDoc } from "firebase/firestore";
import emailjs from 'emailjs-com';
const db = getFirestore(firebaseApp);


export default {
    components: {
        NavBarCounsellor,
        UserPreviousSessionsCounsellor,
        UserUpcomingSessionsCounsellor,
    },
    name:"PatientProfileCounsellor",

    data(){
        return{
            patient_ID: this.$route.params.id, // patient UID
            userNotLeftReview: true,
            user:false,
            count:"",
            patient_name: "",
            patient_email: "",
            counsellor_email: "",
            report_details: "",
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
            this.counsellor_email = user.email;
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

        async sendEmail() {
            if (this.report_details==""){
                alert("You have to fill in the report details to make a report.")
            } else {
                await emailjs.sendForm('service_mhmbt3103', 'report', this.$refs.form, 'user_vWHnt7ugddg9JbFay7C0Z')
                    .then((result) => {
                        console.log('SUCCESS!', result.text);
                        alert("Patient Report Successfully Submitted!");
                        this.$emit('close-modal')
                    }, (error) => {
                        console.log('FAILED...', error.text);
                        alert("Patient Report Submission Failed!");
                        this.$emit('close-modal')
                    });
            }
        }


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
    /* background: #B9D9EB; */
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