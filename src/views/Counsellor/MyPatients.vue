<template>
  <div v-if="user">
      <br><br>
      <NavBarCounsellor/>
      <br><br>
          
      <div class = "main">
        <div class = "allPatients">
          <div><a @click="showUpcoming = true" id = "counsellorUpcomingPatient">Upcoming Patients</a></div> 
          <div><a @click="showUpcoming = false" id = "counsellorPastPatient">Past Patients</a></div>
        </div>

      </div>

      <div class = "bigContainer">
        <br><br>
        <!-- Upcoming patients -->
        <div class = "upcoming_patients_list" v-if = "showUpcoming">  
          <h4> Upcoming patients are patients you have an upcoming appointment with. </h4>
            <div class = "bgBlock1">
              <UpcomingPatients/>
              <br><br><br><br><br><br><br><br>
            </div>
        </div>

        <!-- Past patients -->
        <div class = "past_patients_list" v-else> 
            <h4>Past patients are patients you have already had an appointment with. </h4>
            <div class = "bgBlock2">
                <input id=searchPatient type="text"  v-model="search" placeholder="Search for a patient"/>
                <PastPatients/>
                <br><br><br><br><br><br><br><br>
            </div>
        </div> 
      </div>
  </div>

</template>

<script>
// import firebaseApp from '../firebase.js';
// import { getFirestore } from "firebase/firestore"
// import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
// const db = getFirestore(firebaseApp);
import NavBarCounsellor from "@/components/NavBarCounsellor.vue"
import UpcomingPatients from "@/components/UpcomingPatients.vue"
import PastPatients from "@/components/PastPatients.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    components: {NavBarCounsellor, UpcomingPatients, PastPatients},    
    name:"MyPatients",

    data(){
        return{
            showUpcoming: true,
            user:false,
        }
    },

    mounted() {
        // console.log("MyPatients.vue");

        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        })
    },
}

</script>

<style> 
/* FYI: i'm using this .bgBlock, and table styling for other FindCounsellor.vue, CounsellorReviews.vue as well */
 .bgBlock1, .bgBlock2 {
  border-radius: 35px;
  background: #B9D9EB;
  padding: 20px;
  width: 80%;
  height: auto;
  margin:auto;
}

h4{
    color: grey;
}

.allPatients {
    display: inline;
    font-size: 25px;
    font-weight: bold;
}

#counsellorUpcomingPatient {
    float:left;
    margin-left: 550px;
}

#counsellorPastPatient {
    float:left;
    margin-left: 50px;
    color:lightslategray;
}

#counsellorUpcomingPatient:hover, #counsellorPastPatient:hover  {
     box-shadow: 3px 3px #B9D9EB;
     border-radius: 1px; 
     outline: #B9D9EB;
     color:#a4c8dd;
 } 

#searchPatient {
    float: right;
}

</style>