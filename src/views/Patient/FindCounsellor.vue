<template data-theme="emerald">
  <div v-if="user">
      <br><br>
      <NavBarPatient/> <br>

      <!-- <div class = "main"> -->
      <p class="text-4xl"> Find a Counsellor </p><br>


        <div class="grid place-items-center">
          <div class = "tabs tabs-boxed">
            <div><button @click="showCurrentlyAvailable = true" :class="[ showCurrentlyAvailable? 'tab tab-lg tab-active h-16 min-w-full' : 'tab tab-lg h-16 min-w-full' ]" >Currently Available</button></div>
            <div><button @click="showCurrentlyAvailable = false" :class="[ !showCurrentlyAvailable? 'tab tab-lg tab-active h-16 min-w-full' : 'tab tab-lg h-16 min-w-full' ]">All Counsellors</button></div>
          </div>
        </div> <br>

        <div class="grid place-items-center">
          <div class="grid grid-flow-col auto-cols-max gap-6 m-2">

            <!-- <div class="flex-auto"> -->
            <div class="flex-grow">
              <div class="m-auto">
                <label for="counsellor_category">Filter by Counsellor Specialisation </label>
                <div class="btn-group">
                  <span class="btn btn-sm btn-outline" v-bind:class="{ 'btn-active': selectedCategory === 'All Categories' }" v-on:click="setCategory('All Categories')">All Categories</span>
                  <span class="btn btn-sm btn-outline" v-bind:class="{ 'btn-active': selectedCategory === 'General' }" v-on:click="setCategory('General')">General</span>
                  <span class="btn btn-sm btn-outline" v-bind:class="{ 'btn-active': selectedCategory === 'Career' }" v-on:click="setCategory('Career')">Career</span>
                  <span class="btn btn-sm btn-outline" v-bind:class="{ 'btn-active': selectedCategory === 'Relationships' }" v-on:click="setCategory('Relationships')">Relationships</span>
            <!-- </div> -->
                </div>
              </div>
            </div>
            <!-- <div> -->

          <div class="flex">
            <div class="m-auto">
              <label for="sort_counsellor" class="text-center">Sort Counsellor </label>

              <div class="btn-group">
                <span class="btn btn-sm btn-outline" v-bind:class="{ 'btn-active': sortCounsellor === 'Alphabetical'}" v-on:click="setSort('Alphabetical')">Alphabetical</span>
                <span class="btn btn-sm btn-outline" v-bind:class="{ 'btn-active':  sortCounsellor === 'Highest Rating' }" v-on:click="setSort('Highest Rating')">Highest Rating</span>
              </div>
            </div>
          </div>

          <div class="flex">
            <div class="m-auto">
              <label for="search_bar" class="place-self-center"> Search Counsellor </label><br>
              <input type="text" class="input input-sm input-primary input-bordered -mt-2 h-7 w-42" v-model="search" placeholder="Name"/>
            </div> 

          </div>
        </div>
        </div>


      <div class="flex flex-col w-full">
        <div class="grid h-auto card bg-base-300 rounded-box place-items-center p-10">
          <div class = "available_counsellors_list" v-if = "showCurrentlyAvailable">  
            <h5>These counsellors are available now to take on your choice of call, video call or chat session. <br>
            You can go to a counsellor's profile to schedule a future session or see more information. </h5> <br>
            
            <div> 
              <!-- <div class = "counsellors_box"> -->
                <CounsellorsCurrentlyAvailable :key="refreshComponent" :selectedCategory=this.selectedCategory :search=this.search :sortCounsellor=this.sortCounsellor  />
              <!-- </div> -->
            </div> 
          </div>


          <div class = "all_counsellors_list" v-else> 
            <h5>These counsellors are currently not available. You can go to their profile to schedule a future session. <br>
            You can also use the calendar to show counsellors available on a day of your choice. </h5> <br>

              <!-- idk why this keeps shrinking when u put a calendar filter -->
                <div class="collapse w-full border rounded-box border-base-300 collapse-arrow"> 
                  <input type="checkbox"> 
                  <div class="collapse-title text-lg font-normal">
                    <p class="text-xl font-bold">Filter Counsellors by Day:</p>
                    <span class="italic"> Currently showing counsellors available on </span> <span class="font-medium italic">{{filteringDays}}</span>                    
                  </div> 

                  <div class="collapse-content w-full"> 
                    
                    <AllCounsellorsCalendarFilter @updateFilteredDays = "showFilteredDays" />

                      <button v-if="this.filteringDays != 'any day'" class="btn btn-accent btn-active" role="button" aria-pressed="true" @click="resetCalendarFilter">Reset Filter</button> 
                      <button v-else class="btn btn-link" disabled="disabled">Reset Filter</button> 

                  </div>
            
            </div>

            <div class="flex flex-row w-full items-center">
              <AllCounsellors :key="refreshComponent" :filteredDays=this.filteringDays :selectedCategory=this.selectedCategory :search=this.search :sortCounsellor=this.sortCounsellor  />
            </div>

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
      },
      // selectedCategory(){
      //   this.refreshComponent += 1
      // }
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
        console.log("in setCategory()")
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
