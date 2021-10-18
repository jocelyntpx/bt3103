<template>
  <div v-if="user">
      <br><br>
      <NavBarPatient/>
      <h1> Find a Counsellor </h1><br><br>
          
      <div class = "main">
        <div class = "buttons">
          <div><button @click="showCurrentlyAvailable = true" id = "counsellor_btn_avail">Currently Available</button></div>
          <div><button @click="showCurrentlyAvailable = false" id = "counsellor_btn_all">All Counsellors</button></div>
        </div>

        <div class = "search_bars">
          <div class = "top">
            <input type="text" class = "search_for_counsellor" v-model="search" placeholder="Search for a counsellor"/>
          </div><br>
          <div class = "bottom">
            <FilterByCounsellorCategory/>
          </div> 
        </div>

      </div><br><br>

      <div class = "bgBlock1"> 
        <!-- Currently available counsellors -->
        <div class = "available_counsellors_list" v-if = "showCurrentlyAvailable">  
          <h2> Showing Currently Available Counsellors </h2>
          <h5>These counsellors are available now to take on your choice of call, video call or chat session. <br>
          You can go to a counsellor's profile to schedule a future session or see more information. </h5> <br>
          
          <div> 
            <!-- Would need some kind of for loop -->
            <div class = "counsellors_box">
              <CounsellorsCurrentlyAvailable/>
            </div>
          </div>
        </div>

        <!-- All counsellors -->
        <div class = "all_counsellors_list" v-else> 
          <div id = "filter_by_date"> 
            <h3> Now showing counsellors available on {{filteringDays}}. </h3>
            <h4> Use the calendar to show counsellors with slots available on your selected day. </h4>
            <AllCounsellorsCalendarFilter @updateFilteredDays = "showFilteredDays" />
          </div>
          <NotAvailableCounsellors :key="refreshComponent" :filteredDays=this.filteringDays />
        </div> 
      </div>
  </div>

</template>


<script>
import CounsellorsCurrentlyAvailable from "@/components/CounsellorsCurrentlyAvailable.vue"
import FilterByCounsellorCategory from "@/components/FilterByCounsellorCategory.vue"
import NotAvailableCounsellors from "@/components/NotAvailableCounsellors.vue"
import NavBarPatient from "@/components/NavBarPatient.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AllCounsellorsCalendarFilter from '@/components/AllCounsellorsCalendarFilter.vue'


export default {
  components: {
    CounsellorsCurrentlyAvailable, FilterByCounsellorCategory, NotAvailableCounsellors, NavBarPatient,
    AllCounsellorsCalendarFilter
   },

  name: 'FindCounsellor', 

    data(){
        return{
            showCurrentlyAvailable: true,
            user:false, // firebase's "auth" user
            fbuser:"", // email of user on firebase firestore
            refreshComponent: 0,
            filteringDays: "any day",
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user; // for my reference: user is the user in firebase auth, NOT firestore. need to use this email to access patient/counsellor in firestore.
            this.fbuser = auth.currentUser.email
        })
    },

    methods: {
      showFilteredDays(event) {
        console.log("From FindCounsellor: ", event);
        this.filteringDays = event // prop passed to child "NotAvailableCounsellors"
        this.refreshComponent += 1
        console.log("From FindCounsellor, refreshComp: ",this.refreshComponent);
        console.log("this.fbuser ", this.fbuser);
      }
    }
}
</script>

<style scoped>
/* #reviews {
  border-radius: 35px;
  background: #B9D9EB;
  padding: 20px;
  width: 80%;
  height: 450px;
  margin:auto;
} */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.main {
  width: 80%;
  margin: auto;
  height: 150px;
}
.buttons {
  width: 80%; 
  height: 100%;
  float: left; 
  /* background: green; */
}
.search_bars {
  height: 100px;
  margin-left: 80%;
  align: left;
  /* font-size: 20px; */
  /* margin: 0 auto; */
  /* display: inline-block; */
}
#counsellor_btn_avail,#counsellor_btn_all {
  float: left;
  width: 45%;
  height: 100%;
  padding: 44px 28px;
  font-size: 30px;
  cursor: pointer;
  text-align: center;
}
/* #counsellor_btn_avail,#counsellor_btn_all:active {
  font-weight: bold;
  text-decoration: underline;
  background-color: #B9D9EB;
} */

.top {
  width: 100%;
  /* align: left; */
  /* align-content: stretch; */
}
.counsellors_box {
  background-color: #B9D9EB;
  width: 80%;
  margin: auto;
  padding: 20px;
}
.search_for_counsellor {
  width: 100%;
}

</style>
