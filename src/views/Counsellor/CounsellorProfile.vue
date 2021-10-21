<template>
    <!-- <h1> id is {{this.counsellor_ID}} </h1> -->
    <div v-if="user"> 
        <br><br>
        <NavBarCounsellor/>
        <div style="text-align:center;">
            <h1>Counsellor Profile</h1>

            <!-- Need a toggle button for currently_available -->
            <div class = "toggle">
                <button id = "toggleButton" @click="toggleCurrentlyAvailable">Click to toggle current availability on/off</button>
                <h3> You are 
                    <strong v-if="this.currentlyAvailable"> available to take a session immediately.</strong> 
                    <strong v-else> NOT available to take a spontaneous session. </strong> 
                </h3>
            </div>


            <div id="bgBlock"> 
                <div id="col-1">
                    <div id="counsellorDetails"> 
                        <p> Name: <strong>{{this.name}}</strong><br>
                        Email: <strong>{{user.email}}</strong><br>
                        Gender: <strong>{{this.gender}}</strong><br>
                        Counsellor ID: <strong>{{user.uid}}</strong><br>
                        Specialisations: <strong>{{this.specialisations_formatted}}</strong><br>
                        Rating: <strong>{{this.avgRatings}}</strong><br></p>
                    </div>

                    <div id = "reviewsTab"> 
                        <router-link to="/CounsellorReviews">View Patients' Reviews</router-link>
                    </div>
                </div> 
                <div id="col-2">
                    <h3>Select date to view upcoming appointments</h3>
                    <CounsellorCalendar/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarCounsellor from "@/components/NavBarCounsellor.vue"
import CounsellorCalendar from "@/components/CounsellorCalendar.vue"

import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
    components: {NavBarCounsellor, CounsellorCalendar},
    name:"CounsellorProfile" ,

    data(){
        return{
            user:false,
            user_type:"patient",
            counsellor_ID: this.$route.params.id,
            fbuser:"",
            currentlyAvailable:null,
            name:"",
            ratings:[],
            avgRatings:"",
            specialisations_formatted:"",
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
                this.fbuser = user.email;
                this.getDetails(this.fbuser);
                // this.updateCurrentlyAvailable();
                // this.avgRating(this.fbuser);
                // this.mountedCheckCurrentlyAvailable();
                console.log("bottom of mounted()");
                // console.log("time is ", Timestamp.valueOf(Timestamp.now()))
            }
        })
    },

    methods: {
        async getDetails(user) {
            let docRef = doc(db, "Counsellors", String(user));
            let counsellorDoc = await getDoc(docRef);      
            this.name = counsellorDoc.data().name;
            this.gender = counsellorDoc.data().gender;
            this.specialisations = counsellorDoc.data().counsellor_specialisations;
            this.ratings = counsellorDoc.data().past_ratings;  
            
            this.currentlyAvailable = counsellorDoc.data().currently_available;
            this.updateCurrentlyAvailable();

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

        async updateCurrentlyAvailable() {
            const counsellorDocRef = doc(db,"Counsellors",this.fbuser);
            
            //  if counsellor is currently available, check if have upcoming session within <= 1hour, if so, toggle OFF.
            if (this.currentlyAvailable) {
                var upcomingSession = this.checkExistenceUpcomingSession();
                console.log("in updateCurrentlyAvailable, upcomingSession: ", upcomingSession)
                if (upcomingSession) {
                    alert("You have an upcoming session in less than an hour - Setting toggle for 'Currently Available' as Off");
                    this.currentlyAvailable = false;
                    await updateDoc(counsellorDocRef, {currently_available: false})
                }
            }
        },
        async toggleCurrentlyAvailable() {
            console.log("in toggleCurrentlyAvailable()")

            let counsellorDocRef = doc(db, "Counsellors", this.fbuser)
            console.log("current availability: " , this.currentlyAvailable)

            if (!this.currentlyAvailable) {
                // counsellor can only toggle it ON if he does not have an upcoming session < 1 hour from now.
                var upcomingSession = await this.checkExistenceUpcomingSession(); 
                console.log("in toggleCurrentlyAvailable, upcomingSession is ", upcomingSession)
                if (upcomingSession) {
                    alert("Unable to turn on toggle - you have an upcoming session in less than an hour.");
                } else {
                    this.currentlyAvailable = true;
                    await updateDoc(counsellorDocRef, {currently_available: true})
                }
            } else {
                this.currentlyAvailable = false;
                await updateDoc(counsellorDocRef, {currently_available: false})
            }
        },

        async checkExistenceUpcomingSession() { 
            console.log("in checkExistenceUpcomingSession()");
            const counsellorDocRef = doc(db, "Counsellors", this.fbuser)
            const counsellorDocSnap = await getDoc(counsellorDocRef)
            const upcomingSessions = counsellorDocSnap.data().upcoming_counsellor_sessions

            for (const session of upcomingSessions) {
                let sessionDocRef = doc(db, "Sessions",session)
                let sessionDocSnap = await getDoc(sessionDocRef)
                let sessionTime = sessionDocSnap.data().session_time.toDate()
                let timeNow = Timestamp.now().toDate()

                if (sessionTime - timeNow <= 60 * 60 * 1000 ) { // the difference is in terms of milliseconds.
                    console.log("existence of upcoming session");
                    console.log("SESSION : ", sessionTime , "NOW : ", timeNow)
                    return true;
                }
            }
            console.log("no upcoming session - returning false")
            return false;
        },
       
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

</style>