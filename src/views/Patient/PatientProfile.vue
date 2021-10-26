<template>
    <div v-if="user">
        <br><br>
        <!-- if user is patient -->
        <NavBarPatient/>
        <h1>My Profile</h1>
        <div id = "leaveReview" v-if = "userNotLeftReview">
            We notice you have not yet left a review for a previous session. 
            Leave a review now!
        </div><br>

        <!-- else (user is counsellor from MyPatients) -->
        <!-- <NavBarCounsellor/> -->
        <!-- <div id = "backBtn">
            <router-link to="/myPatients"> ← Back to My Patients page</router-link>
        </div> -->
        <div id="bgBlock">
            <div id="col-1">
                <div id="patientDetails"> 
                    <p> Name: <strong>{{user.displayName}}</strong><br>
                    Email: <strong>{{user.email}}</strong><br>
                    User ID: <strong>{{user.uid}}</strong></p>
                    <!-- delete user ID and instead put joined_date? -->
                </div>
            </div> 

            <UserUpcomingSessions/> 

            <br><br>

            <div style="text-align:center;" v-if="user">
            <UserPreviousSessions/> 

            </div>

            <br>

        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarPatient from "@/components/NavBarPatient.vue"
import UserUpcomingSessions from "@/components/UserUpcomingSessions.vue"
import UserPreviousSessions from "@/components/UserPreviousSessions.vue"
import firebaseApp from '../../firebase.js';
import { collection, getFirestore } from "firebase/firestore"
import {  doc, getDoc, setDoc} from "firebase/firestore";
// import {  doc, deleteDoc, updateDoc, arrayRemove, getDoc  } from "firebase/firestore";
const db = getFirestore(firebaseApp);
// import PatientCalendar from '@/components/PatientCalendar.vue'


export default {
    components: {
        NavBarPatient,
        UserPreviousSessions,
        UserUpcomingSessions
        // PatientCalendar
    },
    name:"PatientProfile",

    data(){
        return{
            patient_ID: this.$route.params.id,
            userNotLeftReview: false,
            user:false,
            counsellorUser:"",
            count:"",
        }
    },

    mounted() {
        // console.log("UpcomingPatients.vue");
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
            this.fbuser = user.email;
            this.updateFirebase(user);
            this.checkReviews(user)
        });

        // this.counsellorUser = auth.currentUser.email;
        // this.displayUpcomingAppointments(this.counsellorUser);
    },

    methods: {
        async updateFirebase(user) {
            const patientDoc = await getDoc(doc(db, "Patients", user.email));

            if (!patientDoc.exists()) {
                console.log("update patient into firebase")
                const patientRef = collection(db,"Patients");
                await setDoc(doc(patientRef,String(user.email)), {
                    name: user.displayName,
                    email: user.email,
                    userID: user.uid,
                    upcoming_user_sessions: [],
                    past_user_sessions: [],
                })
            } else {
                console.log("exists")
                console.log(this.fbuser)
            }

        },

        async checkReviews(user) {
            const patientDoc = await getDoc(doc(db, "Patients", user.email));
            let session = patientDoc.data().past_user_sessions

            for ( const pastSession of session) {
                let sessionDocRef = doc(db, "Sessions", pastSession);
                let sessionID = await getDoc(sessionDocRef);
                if (sessionID.data().rating == null) {
                    
                    // means have a review not left yet
                    this.userNotLeftReview = true
                    break
                } 
                // if all reviews have been left, will not go into if condition and will remain false by default
            }
        }
   
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