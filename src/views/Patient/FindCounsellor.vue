<template data-theme="emerald">
  <div v-if="user">
      <br><br>
      <NavBarPatient/>

      <div class = "main">
      <h1> Find a Counsellor </h1><br><br>
      
      <div class = "top">
        <div class = "tabs tabs-boxed">
          <div><button @click="showCurrentlyAvailable = true" class="tab">Currently Available</button></div>
          <div><button @click="showCurrentlyAvailable = false" class="tab">All Counsellors</button></div>
        </div>

        <div class = "search_bars">
          <div class = "left"> 
            <!-- <p style="font-weight:bold"> Search for a counsellor: </p> -->
            <label for="search_bar">Search for a counsellor:</label>
            <input type="text" class = "search_for_counsellor" v-model="search" placeholder="Type the Counsellor's Name"/>
          </div>

          <div class="right">
            <!-- <p style="font-weight:bold"> Filter by counsellor's specialisations: </p> -->
            <label for="counsellor_category">Filter by counsellor's specialisations: </label>
            <div class="filters">
              <span class="filter" v-bind:class="{ active: selectedCategory === 'All Categories' }" v-on:click="setCategory('All Categories')">All Categories</span>
              <span class="filter" v-bind:class="{ active: selectedCategory === 'General' }" v-on:click="setCategory('General')">General</span>
              <span class="filter" v-bind:class="{ active: selectedCategory === 'Career' }" v-on:click="setCategory('Career')">Career</span>
              <span class="filter" v-bind:class="{ active: selectedCategory === 'Relationships' }" v-on:click="setCategory('Relationships')">Relationships</span>
            </div>
          </div>

          <div class="sort">
            <!-- <p style="font-weight:bold"> Filter by counsellor's specialisations: </p> -->
            <label for="sort_counsellor">Sort counsellor by: </label>
            <div class="filters">
              <span class="filter" v-bind:class="{ active: sortCounsellor === 'Alphabetical' }" v-on:click="setSort('Alphabetical')">Alphabetical</span>
              <span class="filter" v-bind:class="{ active: sortCounsellor === 'Highest Rating' }" v-on:click="setSort('Highest Rating')">Highest Rating</span>
            </div>
          </div>

        </div>

      </div><br><br><br><br><br><br><br><br><br><br><br><br>
      <!-- <div class="clearfix"></div> -->


      <div class = "bgBlock1"> 
        <!-- Currently available counsellors -->
        <div class = "available_counsellors_list" v-if = "showCurrentlyAvailable">  
          <h2> Showing Currently Available Counsellors </h2>
          <h5>These counsellors are available now to take on your choice of call, video call or chat session. <br>
          You can go to a counsellor's profile to schedule a future session or see more information. </h5> <br>
          
          <div> 
            <!-- Would need some kind of for loop -->
            <div class = "counsellors_box">
              <CounsellorsCurrentlyAvailable :key="refreshComponent" :selectedCategory=this.selectedCategory :search=this.search :sortCounsellor=this.sortCounsellor  />
            </div>
          </div>
        </div>

        <!-- All counsellors -->
        <div class = "all_counsellors_list" v-else> 
          <div id = "filter_by_date"> 
            <h3> Now showing counsellors available on {{filteringDays}}. </h3>

            <div v-if="this.filteringDays != 'any day'">
              <button id = "reset_filter" @click = "resetCalendarFilter"> Show All Days </button>
            </div>

            <h4> Use the calendar to show counsellors with slots available on your selected day. </h4>
            <AllCounsellorsCalendarFilter @updateFilteredDays = "showFilteredDays" />
          </div>
          <!-- <AllCounsellors :key="refreshComponent" v-bind="groupedProps" /> -->
          <AllCounsellors :key="refreshComponent" :filteredDays=this.filteringDays :selectedCategory=this.selectedCategory :search=this.search :sortCounsellor=this.sortCounsellor  />
        </div> 
      </div>

      </div>
  </div>

</template>


<script>
import CounsellorsCurrentlyAvailable from "@/components/Patient/CounsellorsCurrentlyAvailable.vue"
import AllCounsellors from "@/components/Patient/AllCounsellors.vue"
import NavBarPatient from "@/components/Patient/NavBarPatient.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AllCounsellorsCalendarFilter from '@/components/Patient/AllCounsellorsCalendarFilter.vue'


export default {
  components: {
    CounsellorsCurrentlyAvailable, AllCounsellors, NavBarPatient,
    AllCounsellorsCalendarFilter
   },

  name: 'FindCounsellor', 

    data(){
        return{
            showCurrentlyAvailable: this.$route.params.showCurrentlyAvailable,
            user:false, // firebase's "auth" user
            // fbuser:"", // user's uid
            refreshComponent: 0,
            filteringDays: "any day",
            selectedCategory: 'All Categories',
            search: "",
            sortCounsellor: "Alphabetical",
        }
    },

    // computed() {
    //   return {
    //     groupedProps:{
    //       filteredDays: this.filteringDays,
    //       selectedCategory: this.selectedCategory 
    //     },


    //   }
    // },

    watch: {
      search() {
        this.refreshComponent += 1
        console.log("this.refreshComp += 1")
      }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user; // for my reference: user is the user in firebase auth, NOT firestore. need to use this email to access patient/counsellor in firestore.
            // this.fbuser = auth.currentUser.uid
        })
    },

    methods: {
      setCategory(category) {
        this.selectedCategory = category; // prop 
        this.refreshComponent += 1
      },
      setSort(sort) {
        this.sortCounsellor = sort; // prop
        this.refreshComponent += 1
      },
      showFilteredDays(event) {
        console.log("From FindCounsellor: ", event);
        this.filteringDays = event // prop passed to child "NotAvailableCounsellors"
        this.refreshComponent += 1
        console.log("From FindCounsellor, refreshComp: ",this.refreshComponent);
        // console.log("this.fbuser ", this.fbuser);
      },
      resetCalendarFilter() {
        this.filteringDays = "any day"
        this.refreshComponent += 1
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
/* .clearfix{
    clear:both
} */

.main {

}

.top {
  /* display: block; */
  margin-left: auto;
  margin-right: auto;
  float: right;
  display:block;
  /* width:300px; */

  width: 80%;
  /* margin: auto; */
  height: 250px;
  /* border-radius: 35px; */
  /* background: #B9D9EB; */
  padding: 20px;
}

/* .top::after {
  content: "";
  clear: both;
  display: table;
} */

.buttons {
  width: 80%; 
  height: 60%;
  float: center; 
  /* background: green; */
}
/* .search_bars {
  height: 100px;
  margin-left: 80%;
  align: center; */
  /* font-size: 20px; */
  /* margin: 0 auto; */
  /* display: inline-block; */
/* } */
.search_bars {
	/* display:flex; */
	flex-direction:column;
	justify-content:center;
	align-items:center;
  width:60%;
  margin:auto;
}

#counsellor_btn_avail,#counsellor_btn_all {
  float: left;
  width: 50%;
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

.left {
  width: 20%;
  float: left;
  /* align: left; */
  /* align-content: stretch; */
}
.right {
  width: 50%;
  float: left;
}
.sort {
  width: 30%;
  float: left;
}

label {
  /* display: flex; */
  flex-direction: row;
  /* justify-content: flex-end; */
  text-align: right;
  /* width: 400px; */
  line-height: 26px;
  margin-bottom: 10px;
}

/* search bar */
.search_for_counsellor {
  width: 100%;
}

/* category filters */
.filter {
	font-family:arial;
	padding: 2px 6px;
  margin:2px;
	cursor:pointer;
	border-radius: 6px;
	transition: all 0.35s;
}

.filter.active {
	box-shadow:0px 1px 3px 1px #00000026;
}

.filter:hover {
	background:lightgray;
} 

/*  main box */
.counsellors_box {
  background-color: #B9D9EB;
  width: 80%;
  margin: auto;
  padding: 20px;
}


</style>
