<template>
  <div v-if="user">
      <br><br>
      <NavBarCounsellor/>
      <br>
           
      <p class="text-4xl"> My Patients </p><br>
      <div class = "main">
          <div class="grid place-items-center">
            <div class = "tabs tabs-boxed">
              <div><button @click="showUpcoming = true" :class="[ showUpcoming? 'tab tab-lg tab-active h-12 min-w-full' : 'tab tab-lg h-10 min-w-full' ]" >Upcoming Patients</button></div>
              <div><button @click="showUpcoming = false" :class="[ !showUpcoming? 'tab tab-lg tab-active h-12 min-w-full' : 'tab tab-lg h-10 min-w-full' ]">Past Patients</button></div>
            </div>
          </div> 
        <!-- <div class = "allPatients">
          <div><a @click="showUpcoming = true" id = "counsellorUpcomingPatient">Upcoming Patients</a></div> 
          <div><a @click="showUpcoming = false" id = "counsellorPastPatient">Past Patients</a></div>
        </div><br> -->

      </div>
  
      <div class = "bigContainer">
        <br><br>
        <!-- Upcoming patients -->
        <div class = "upcoming_patients_list" v-if = "showUpcoming">  
          <h4> Upcoming patients are patients you have an upcoming appointment with. </h4><br>
          <div class="bg-base-300 text-base-content">
            <div class = "bgBlock1">
              <UpcomingPatients/>
              <br><br><br><br><br><br><br><br><br><br><br><br>
            </div>
          </div>
        </div>

        <!-- Past patients -->
        <div class = "past_patients_list" v-else> 
            <h4>Past patients are patients you have already had an appointment with. </h4><br>
            <div class="bg-base-300 text-base-content">
            <div class = "bgBlock2">
                <div class="form-control flex-auto w-1/3 ">
                  <!-- <label for="search_bar">Search for a Patient </label> -->
                  <input type="text" class="input input-sm input-primary input-bordered " v-model="search" placeholder="Search for a patient"/>
                </div> 

                <!-- <div class = "search_bar"> 
                    <input type="text" class = "search_for_patient" v-model="search" placeholder="Search for a patient"/>
                </div> -->
                <br>
                <PastPatients :key="refreshComponent"  :search=this.search  />
                <br><br><br><br><br><br><br><br>
            </div>
            </div>
        </div> 
      </div>
  </div>

</template>

<script>
import NavBarCounsellor from "@/components/Counsellor/NavBarCounsellor.vue"
import UpcomingPatients from "@/components/Counsellor/UpcomingPatients.vue"
import PastPatients from "@/components/Counsellor/PastPatients.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    components: {NavBarCounsellor, UpcomingPatients, PastPatients},    
    name:"MyPatients",

    data(){
        return{
            // showUpcoming: true,
            showUpcoming: this.$route.params.showUpcoming,
            user:false,
            refreshComponent:0,
            search: "",
        }
    },

    mounted() {
        // console.log("MyPatients.vue");

        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        })
    },

    watch: {
      search() {
        this.refreshComponent += 1
        console.log("refreshcomponent" , this.refreshComponent)
      }
    },
}

</script>

<style> 
/* FYI: i'm using this .bgBlock, and table styling for other FindCounsellor.vue, CounsellorReviews.vue as well */
 .bgBlock1, .bgBlock2 {
  border-radius: 35px;
  /* background: #B9D9EB; */
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

/* #counsellorUpcomingPatient:active, #counsellorPastPatient:active {
     color:#dda4c7;
 }  */

#counsellorUpcomingPatient:hover, #counsellorPastPatient:hover  {
     /* box-shadow: 3px 3px #B9D9EB;
     border-radius: 1px; 
     outline: #B9D9EB; */
     color:#a4c8dd;
 } 

.search_for_patient {
    float: right;
    margin-right: 100px;
}

</style>