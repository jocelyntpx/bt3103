<template>
    <div v-if="user">
        <br><br>
        <NavBarPatient/>
        <br>
        <p class="text-4xl">My Profile</p><br>

        <!-- <div class = "grid place-items-center">
            <div class = "tabs tabs-boxed">
            <button id = "toggleButton" @click="toggleSharing">Click to toggle the sharing of your information amongst Counsellors.</button>
            <br><br>
            <h3> You have chosen 
                <strong v-if="this.shareInfo"> to share your information with all Counsellors.</strong> 
                <strong v-else> NOT to share your information with all Counsellors. </strong> 
            </h3>
            </div>
        </div> -->

        <!-- <div class="p-6 card bordered">
            <div class="form-control">
                <label class="cursor-pointer label">
                <span class="label-text">Share your session info with all counsellors?</span> 
                <input type="checkbox" checked="checked" class="toggle toggle-primary">
                </label>
            </div>
        </div> -->
        
        <div class="flex">
        <div class="alert alert-info w-1/2 ml-40" v-if = "userNotLeftReview">
        <div class="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#2196f3" class="flex-shrink-0 w-6 h-6 mx-2">     
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>                     
            </svg> 
            <label>
            <h4 class="text-left">Hey, {{user.displayName}}</h4> 
            <p class="text-sm text-base-content text-opacity-60 ">
            We noticed you have not left a review yet for a previous session. Leave a review now!</p>
            </label>
        </div>  
        </div>
            <div class="grid place-items-center ml-20" v-if = "userNotLeftReview">
                <p class="text-md">Allow your information to be shared with all counsellors?</p>
            <div class = "tabs tabs-boxed">
              <div><button @click="toggleSharing" :class="[ this.shareInfo? 'tab tab-sm tab-active ' : 'tab tab-sm']" data-tip="This would enable counsellors having first-time sessions with you to have a better understanding of your situation." 
              class="tooltip tooltip-bottom tooltip-primary"><strong>Share</strong></button></div>
              <div><button @click="toggleSharing" :class="[ !this.shareInfo? 'tab tab-sm tab-red tab-active' : 'tab tab-sm' ]" data-tip="This would make your session information only available to the particular counsellor you had the session with." 
              class="tooltip tooltip-bottom tooltip-primary"><strong>Don't Share</strong></button></div>
            </div>
          </div>
            <div class="flex-auto grid justify-items-center" v-else>
                <p class="text-md">Allow your information to be shared with all counsellors?</p>
            <div class = "tabs tabs-boxed">
              <div><button @click="toggleSharing" :class="[ this.shareInfo? 'tab tab-md tab-active ' : 'tab tab-md']" data-tip="This would enable counsellors having first-time sessions with you to have a better understanding of your situation." 
              class="tooltip tooltip-bottom tooltip-primary"><strong>Share</strong></button></div>
              <div><button @click="toggleSharing" :class="[ !this.shareInfo? 'tab tab-md tab-red tab-active' : 'tab tab-md' ]" data-tip="This would make your session information only available to the particular counsellor you had the session with." 
              class="tooltip tooltip-bottom tooltip-primary"><strong>Don't Share</strong></button></div>
            </div>
          </div>
        </div><br>

        <div class="bg-base-300 text-base-content">
        <div id="bgBlock">
            <div id="col-1">
                <div id="patientDetails"> 
                    <p> Alias: <strong>{{user.displayName}}</strong><br>
                    Email: <strong>{{user.email}}</strong><br></p>
                    <!-- User ID: <strong>{{user.uid}}</strong></p> -->
                    <!-- delete user ID and instead put joined_date? -->
                </div>
            </div><br>

            <UserUpcomingSessions/> 

            <br><br>

            <div style="text-align:center;" v-if="user">
            <UserPreviousSessions/> 

            </div>

            <br>

        </div>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarPatient from "@/components/Patient/NavBarPatient.vue"
import UserUpcomingSessions from "@/components/Patient/UserUpcomingSessions.vue"
import UserPreviousSessions from "@/components/Patient/UserPreviousSessions.vue"
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc, updateDoc} from "firebase/firestore";
const db = getFirestore(firebaseApp);


export default {
    components: {
        NavBarPatient,
        UserPreviousSessions,
        UserUpcomingSessions
    },
    name:"PatientProfile",

    data(){
        return{
            patient_ID: this.$route.params.id,
            userNotLeftReview: false,
            user:false,
            counsellorUser:"",
            count:"",
            fbuser:"", // user's UID
            past_user_sessions: [],
            shareInfo:null  //not sure if should be null or false, in counsellorProfile was null
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async user => {
            this.user = user;
            this.fbuser = user.uid;

            this.checkSharing(user);
            this.checkReviews(user);
        });

        // this.counsellorUser = auth.currentUser.email;
        // this.displayUpcomingAppointments(this.counsellorUser);
    },

    methods: {
        async isPatient(auth, user) {
            let docRef = doc(db, "Counsellors", String(user));
            let counsellorDoc = await getDoc(docRef);
                
            if (counsellorDoc.exists()) {
                console.log('Is counsellor!');
                this.counsellor = true;
                return false
            } else {
                console.log('Is patient!');
                this.counsellor = false;
                return true
            }
        },

        async checkReviews(user) {
            const patientDoc = await getDoc(doc(db, "Patients", user.uid));
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
        },

        async checkSharing(user) {
            const patientDoc = await getDoc(doc(db, "Patients", user.uid));
            this.shareInfo = patientDoc.data().share_info
        },

        async toggleSharing() {
            console.log("in toggleSharing()")

            let patientDocRef = doc(db, "Patients", this.fbuser)
            console.log("share info: " , this.shareInfo)

            if (this.shareInfo==false) { 
                this.shareInfo = true;
                await updateDoc(patientDocRef, {share_info: true})

            } else {
                this.shareInfo = false;
                await updateDoc(patientDocRef, {share_info: false})
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
    /* background: #B9D9EB; */
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