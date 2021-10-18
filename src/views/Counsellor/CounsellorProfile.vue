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
                    <strong v-else> not available to take a spontaneous session. </strong> 
                </h3>
            </div>


            <div id="bgBlock"> 
                <div id="col-1">
                    <div id="counsellorDetails"> 
                        <p> Name: <strong>{{user.name}}</strong><br>
                        Email: <strong>{{user.email}}</strong><br>
                        User ID: <strong>{{user.uid}}</strong></p>
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
import { doc, updateDoc } from "firebase/firestore";

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
            currentlyAvailable:null
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
                this.fbuser = user.email
                this.updateCurrentlyAvailable();
            }
        })
    },

    methods: {
        async updateCurrentlyAvailable() {
            const counsellorDoc = doc(db,"Counsellors",this.fbuser);
            this.currentlyAvailable = counsellorDoc.data().currentlyAvailable;
        },
        async toggleCurrentlyAvailable() {
            let counsellorDocRef = doc(db, "Counsellors", this.fbuser)
            await updateDoc(counsellorDocRef, {currently_available: !this.currentlyAvailable})
            this.currentlyAvailable = !this.currentlyAvailable;
        }
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