<template>
    <div v-if="user">
        <br><br>
        <NavBarPatient/>
        <div style="text-align:center;">
            <br>
            <h1 class="text-4xl">Counsellor Profile</h1>
            <br>
                <div id="bgBlock"> 
                    <div id="col-1">
                        <div id="counsellorDetails"> 

                            <div v-if="this.profile_pic">
                                <img id="profilepic" :src='this.profile_pic'>
                            </div>

                            <p> Name: <strong>{{this.name}}</strong><br>
                            Email: <strong>{{this.email}}</strong><br>
                            Gender: <strong>{{this.gender}}</strong><br>
                            Specialisations: <strong>{{this.specialisations_formatted}}</strong><br>
                            Credentials: <strong>{{this.credentials}}</strong><br>
                            Rating: <strong>{{this.avgRatings}}</strong></p>
                            <p v-if="this.additional_details">Additional Details: <strong>{{this.additional_details}}</strong></p><br>
                        </div>

                        <div id = "reviewsTab"> 
                            <router-link class="btn btn-link" :to="{ name: 'CounsellorReviews', params: { id: this.counsellor_ID }}">View Patients' Reviews</router-link>
                        </div>

                        <label for="my-modal-2" class="btn btn-sm btn-error modal-button">Report</label> 
                        <input type="checkbox" id="my-modal-2" class="modal-toggle"> 
                        <div class="modal">
                        <div class="modal-box">
                          <form ref="form" @submit.prevent="sendEmail">
                        <input type="hidden" name="reporter" :value="this.patient_email">
                        <input type="hidden" name="reportee" :value="this.email">
                        <textarea  name="report_details" v-model="report_details" class="textarea h-24 textarea-bordered textarea-primary" cols="60" rows="40" required=""
                            placeholder="Report details"></textarea><br><br>
                    </form> 
                        <div class="modal-action">
                        <label for="my-modal-2" class="btn btn-error" @click="sendEmail()">Report</label> 
                        <label for="my-modal-2" type="submit" class="btn">Close</label>
                        </div>
                    </div>
                    </div>


                    </div> 
                    <div id="col-2">
                        <br>
                        <h3>Select date to view sessions available for booking</h3>
                        <CounsellorCalendarPatient/>
                    </div>
                </div>
        </div>
    </div>
</template>

<script scoped>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarPatient from '@/components/Patient/NavBarPatient.vue'
import CounsellorCalendarPatient from "@/components/Patient/CounsellorCalendarPatient.vue"
import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc} from "firebase/firestore";
import emailjs from 'emailjs-com';

const db = getFirestore(firebaseApp);

export default {
    components: {NavBarPatient,CounsellorCalendarPatient},
    name:"CounsellorProfile" ,

    data(){
        return{
            user:false,
            email:"",
            counsellor_ID: this.$route.params.id, // counsellor's UID
            // fbuser:"", // user's UID
            // currentlyAvailable:null,
            name:"",
            gender:"",
            ratings:[],
            avgRatings:"",
            specialisations:[],
            specialisations_formatted:"",
            profile_pic: "",
            credentials:"",
            additional_details:"",
            report_details: "",
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            if (user) {
                this.user = user;
                this.patient_email = this.user.email;
                // this.fbuser = user.uid;
                this.getCounsellorDetails(this.counsellor_ID);
                console.log("bottom of mounted()");
            }
        })
    },

    methods: {
        async getCounsellorDetails(user) {
            // console.log("user:",user)
            let docRef = doc(db, "Counsellors", user);
            let counsellorDoc = await getDoc(docRef);   
            this.name = counsellorDoc.data().name;
            this.email = counsellorDoc.data().email;
            this.gender = counsellorDoc.data().gender;
            this.specialisations = counsellorDoc.data().counsellor_specialisations;
            this.ratings = counsellorDoc.data().past_ratings;  
            this.profile_pic = counsellorDoc.data().profile_pic; 
            // this.email = counsellorDoc.data().email; 
            this.credentials = counsellorDoc.data().counsellor_credentials;
            this.additional_details = counsellorDoc.data().additional_details;            
            // this.currentlyAvailable = counsellorDoc.data().currently_available;

            var avg = 0
            if (this.ratings.length>0) {
                var numRatings = this.ratings.length
                var sum = 0
                this.ratings.forEach(item => {
                sum = sum + item
                })
                avg = sum / numRatings
            }
            if (avg == 5) {
                this.avgRatings = "★★★★★"
            } else if (avg >= 4) {
                this.avgRatings = "★★★★☆"
            } else if (avg >= 3) {
                this.avgRatings = "★★★☆☆"
            } else if (avg >= 2) {
                this.avgRatings = "★★☆☆☆"
            } else if (avg >= 1) {
                this.avgRatings = "★☆☆☆☆"
            } else {
                this.avgRatings = "☆☆☆☆☆" 
            } 

            var stringOutput = ""
            if (this.specialisations.length > 0) {
                this.specialisations.forEach(item => {
                stringOutput = stringOutput + ", " + item
                })
            }
            this.specialisations_formatted = stringOutput.slice(2)
        },

        async sendEmail() {
            if (this.report_details==""){
                alert("You have to fill in the report details to make a report.")
            } else {
                await emailjs.sendForm('service_mhmbt3103', 'report', this.$refs.form, 'user_vWHnt7ugddg9JbFay7C0Z')
                    .then((result) => {
                        console.log('SUCCESS!', result.text);
                        alert("Counsellor Report Successfully Submitted!");
                        this.$emit('close-modal')
                    }, (error) => {
                        console.log('FAILED...', error.text);
                        alert("Counsellor Report Submission Failed!");
                        this.$emit('close-modal')
                    });
            }
        }


    }
}
</script>

<style scoped>
#profilepic {
    border-radius: 50%;
    margin-top: 10px;
    width: 230px;
    height: 230px;
}
#bgBlock {
    display:flex;
    border-style:solid;
    border-color:#B9D9EB;
    border-width: 2px;
    background: transparent;
    border-radius: 20px;
    padding: 20px;
    width: 80%;
    height: auto;
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

</style>