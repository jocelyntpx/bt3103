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
            <div class="grid place-items-center">
            <div class = "tabs tabs-boxed">
              <div><button @click="toggleSharing" :class="[ this.shareInfo? 'tab tab-lg tab-active h-10 min-w-full' : 'tab tab-lg h-10 min-w-full' ]" >Share info with ALL counsellors</button></div>
              <div><button @click="toggleSharing" :class="[ !this.shareInfo? 'tab tab-lg tab-active h-10 min-w-full' : 'tab tab-lg h-10 min-w-full' ]">DO NOT share info with ALL counsellors</button></div>
            </div>
          </div> <br>

        <!-- <div class="p-6 card bordered">
            <div class="form-control">
                <label class="cursor-pointer label">
                <span class="label-text">Share your session info with all counsellors?</span> 
                <input type="checkbox" checked="checked" class="toggle toggle-primary">
                </label>
            </div>
        </div> -->
        

        <div id = "leaveReview" v-if = "userNotLeftReview">
            We notice you have not yet left a review for a previous session. 
            Leave a review now!
        </div><br>

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
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import NavBarPatient from "@/components/Patient/NavBarPatient.vue"
import UserUpcomingSessions from "@/components/Patient/UserUpcomingSessions.vue"
import UserPreviousSessions from "@/components/Patient/UserPreviousSessions.vue"
import firebaseApp from '../../firebase.js';
import { collection, getFirestore } from "firebase/firestore"
import { doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
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

            this.check = await this.isPatient(auth, this.fbuser);
            if (this.counsellor == false) {
                console.log("here1")
                this.updateFirebase(user);
                this.checkSharing(user);
                this.checkReviews(user);
            } else {
                console.log("here2")
                signOut(auth, this.user)
                alert("Counsellor, please use the counsellor's login instead.")
                this.$router.push({ path: '/counsellorLogin' })
            }
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

        async updateFirebase(user) {
            const uid = user.uid
            const patientDoc = await getDoc(doc(db, "Patients", uid));

            if (!patientDoc.exists()) {
                console.log("update patient into firebase")
                const patientRef = collection(db,"Patients");
                await setDoc(doc(patientRef,uid), {
                    name: user.displayName,
                    email: user.email,
                    // userID: user.uid, // NO LONGER HAVE THIS 
                    upcoming_user_sessions: [],
                    past_user_sessions: [],
                    user_type: "patient",
                    share_info: false //by default set it to false
                })
            } else {
                console.log("exists")
                console.log(this.fbuser)
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