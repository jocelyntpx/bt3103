<template>
    <br><br>
    <!-- I removed this so that they will only be able to proceed by pressing submit, cannot go elsewhere -->
    <!-- <NavBarCounsellor/>  -->  
    <!-- remain as this or change to backBtn? not sure -->
    <br><br>

    <h1>Session Notes</h1>
    <p>Leave a session note for future reference.</p>
    <div id="bgBlock">
        <h2>{{this.patientName}}</h2>

        <div id="innerBlock">
            <textarea v-model= "sessionNotes" id="notesText" placeholder="Enter your session notes here"></textarea>
        </div>
        <button v-on:click = "sendSessionNotes()" id="submit">Submit</button>

    </div>
<!-- 
  This is session notes page. Session id is {{this.sessionID}} -->
</template>

<script>
// import NavBarCounsellor from "@/components/NavBarCounsellor.vue"
import firebaseApp from '@/firebase.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc,updateDoc, } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
    name: "SessionNotes",
    // components: {NavBarCounsellor},
    data() {
        return {
            user:false,
            patientName: "",
            sessionID: this.$route.params.id,
            sessionNotes: ""
        }
    }, 
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.fbuser = user.email;
            }
        })

        this.findPatientName();
    },

    methods: {
        async findPatientName() {
            let sessionDocRef = doc(db, "Sessions", this.$route.params.id);
            let sessionID = await getDoc(sessionDocRef);
            let docRef = doc(db, "Patients", sessionID.data().user_email);
            let patientDoc = await getDoc(docRef);
            // this.patientEmail = patientDoc.id;
            this.patientName = patientDoc.data().name;

        },

        async sendSessionNotes() {
            if (this.sessionNotes == '') {
                alert("You have to fill up session notes to submit.")
            } else {
                if (confirm("Confirm to submit?")) {

                    //update session notes
                    await updateDoc(doc(db, "Sessions", this.$route.params.id), {session_notes: this.sessionNotes})

                    // route back to MyPatients page
                    this.$router.push({ name: 'MyPatients'})
                }

            }
        }

    }


}
</script>

<style scoped>
#bgBlock {
  border-radius: 35px;
  background: #B9D9EB;
  padding: 20px;
  width: 80%;
  height: auto;
  margin:auto;
}
#notesText {
  border-radius: 35px;
  background: azure;;
  padding: 20px;
  width: 60%;
  height: 250px;
  font-family:'Roboto',sans-serif;
  margin:auto;
}
#submit{
    display:inline-block;
    padding:0.3em 1.2em;
    margin:0 0.3em 0.3em 0;
    border-radius:2em;
    box-sizing: border-box;
    text-decoration:none;
    font-family:'Roboto',sans-serif;
    font-weight:300;
    color:#FFFFFF;
    background-color:#4eb5f1;
    text-align:center;
    transition: all 0.2s;
}
#submit:hover{
    background-color:#4095c6;
}


</style>