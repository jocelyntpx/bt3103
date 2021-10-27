<template>
    <div v-if="user">
        <br><br>
        <NavBarPatient/>
        <div style="text-align:center;">
            <h1>Counsellor Profile</h1>
                <div id="bgBlock"> 
                    <div id="col-1">
                        <div id="counsellorDetails"> 

                            <div v-if="this.profile_pic">
                                <img id="profilepic" :src='this.profile_pic'>
                            </div>

                            <p> Name: <strong>{{this.name}}</strong><br>
                            <!-- Email: <strong>{{this.email}}</strong><br> -->
                            Gender: <strong>{{this.gender}}</strong><br>
                            Specialisations: <strong>{{this.specialisations_formatted}}</strong><br>
                            Credentials: <strong>{{this.credentials}}</strong><br>
                            Additional Details: <strong>{{this.additional_details}}</strong><br>
                            Rating: <strong>{{this.avgRatings}}</strong><br></p>
                        </div>

                        <div id = "reviewsTab"> 
                            <router-link :to="{ name: 'CounsellorReviews', params: { id: this.counsellor_ID }}">View Patients' Reviews</router-link>
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
import NavBarPatient from '@/components/NavBarPatient.vue'
import CounsellorCalendarPatient from "@/components/CounsellorCalendarPatient.vue"

import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc} from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
    components: {NavBarPatient,CounsellorCalendarPatient},
    name:"CounsellorProfile" ,

    data(){
        return{
            user:false,
            // email:"",
            user_type:"counsellor",
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
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            if (user) {
                this.user = user;
                if (user.user_type == "counsellor") {
                    this.user_type = "counsellor";
                }
                // this.fbuser = user.uid;
                this.getDetails(this.counsellor_ID);
                console.log("bottom of mounted()");
            }
        })
    },

    methods: {
        async getDetails(user) {
            // console.log("user:",user)
            let docRef = doc(db, "Counsellors", user);
            let counsellorDoc = await getDoc(docRef);   
            this.name = counsellorDoc.data().name;
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