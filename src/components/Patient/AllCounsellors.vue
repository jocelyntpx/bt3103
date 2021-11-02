<template>


<div class="flex space-x-4 space-y-4">
  <!-- <div class="flex flex-row w-full"> -->
  <ul>
      <div class="grid grid-flow-row grid-cols-3 gap-4">
        <a v-for="counsellor in all_counsellors" v-bind:key="counsellor.index">
          <div class="card text-center shadow-2xl lg:card-side bg-accent text-accent-content">
            <!-- Note: h-auto makes boxes diff sizes when resize browser.. -->
            <div class="card-body">

              <div class="grid grid-flow-row place-items-center">
              
                <div v-if="counsellor.data().profile_pic" class="avatar grid place-items-center">
                  <div class="mb-8 rounded-full w-16 h-16 ring ring-primary ring-offset-base-100 ring-offset-2 -mt-2">
                    <img id="profilepic" :src="counsellor.data().profile_pic">
                  </div>
                </div> 

                <div><h2 class="card-title -mt-4"> {{counsellor.data().name}} </h2></div>
              </div>

              <p> {{avgRating(counsellor.data().past_ratings)}} <br> 
              {{ formattedSpecialisations(counsellor.data().counsellor_specialisations) }} </p>

              <div class="justify-center card-actions">
                <div v-if="checkAvailability(counsellor.data().available_slots)">
                  <div data-tip="Slots available" class="tooltip tooltip-secondary tooltip-bottom">
                    <button class="btn btn-accent" @click="this.$router.push({ name: 'CounsellorProfilePatient', params: { id: counsellor.id } })">View Profile</button>
                  </div>
                </div>
                <div v-else>
                  <div data-tip="No slots available" class="tooltip tooltip-neutral tooltip-bottom">
                    <button class="btn btn-accent" @click="this.$router.push({ name: 'CounsellorProfilePatient', params: { id: counsellor.id } })">View Profile</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </a>
      </div>
  </ul>
</div>


  <!-- <div class="all_counsellors">
    <ul>
        <a v-for="counsellor in all_counsellors" v-bind:key="counsellor.index">
          <div id="counsellor_preview_box"> 
            <h4><router-link :to="{ name: 'CounsellorProfilePatient', params: { id: counsellor.id }}"> {{counsellor.data().name}}</router-link></h4>
            {{avgRating(counsellor.data().past_ratings)}}<br> 
            <strong>{{ formattedSpecialisations(counsellor.data().counsellor_specialisations) }}</strong><br><br>
            <span v-if="getEarliestSlot(counsellor.data().available_slots)">Earliest slot: {{getEarliestSlot(counsellor.data().available_slots)}} </span>
            <span v-else>No slots at the moment</span><br><br>
          </div>
        </a>
    </ul>
</div> -->

</template>

<script>

import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged} from "firebase/auth";
// import router from './router/index.js'

const db = getFirestore(firebaseApp);

export default {
  name: "AllCounsellors",
  props: {
    filteredDays:String,
    selectedCategory:String,
    search:String,
    sortCounsellor:String
  },

  data() {
    return {
      user: false,
      user_type: "patient",
      all_counsellors:[],
      // sortCounsellor:"Alphabetical",
    }
  },

  // watch: {
  //   sortCounsellor() {
  //     this.updateSort();
  //   }
  // },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
    if (user) {
      this.user = user;      
    }
    })
    this.displayAllCounsellors();
  },

methods: {
    async displayAllCounsellors() {
      console.log("In NotAvailableCounsellors, filteredDays: ", this.filteredDays);
      let allCounsellors = await getDocs(collection(db,"Counsellors"));
      console.log("this.selectedCategory: ",this.selectedCategory)
      console.log("this.search: ",this.search)
      console.log("this.filteredDays: ",this.filteredDays)

      allCounsellors.forEach((counsellor) => {

      if(this.selectedCategory === 'All Categories' || counsellor.data().counsellor_specialisations.includes(this.selectedCategory)) {

        if (this.filteredDays != "any day") { // user has filtered on a day - counsellor will be shown if at least one avail slot is on the filtered day
          var slots = counsellor.data().available_slots 
          for (let i  = 0; i < slots.length; i++) {
            let slot = slots[i]
            let a = slot.toDate()
            let a_gmtDate = new Date(a.setHours(a.getHours() + 8))
            if (a_gmtDate.toISOString().substr(0,10) == this.filteredDays) {
              this.all_counsellors.push(counsellor)
              break;
            }
          }
        } else {
          this.all_counsellors.push(counsellor)
        }

      }

      })
      // search functionality 
      this.all_counsellors = this.all_counsellors.filter(counsellor => {
        return counsellor.data().name.toLowerCase().includes(this.search.toLowerCase())
      })

      // sort functionality 
      this.updateSort();
    },

    updateSort() {

      this.all_counsellors.forEach(counsellor => { console.log("BEF FIRST SORT ", counsellor.data().name)})
      // sort functionality
      let sortBy = this.sortCounsellor

      let updated = this.all_counsellors.sort( // ties are broken by alphabetical order.
        function(a, b){
          console.log(a.data().name - b.data().name)
          if (a.data().name < b.data().name) { return -1 }
          else if (a.data().name > b.data().name) { return 1 }
          return 0;
          // return a.data().name.toLowercase() - b.data().name.toLowercase()
        }
      )
      // console.log(this.all_counsellors[2].data().name)
      // console.log(updated[2].data().name)
      this.all_counsellors = updated

      this.all_counsellors.forEach(counsellor => { console.log("AFT FIRST SORT ", counsellor.data().name)})
      console.log("legnth",this.all_counsellors.length)

      if (sortBy == "Highest Rating") { // Highest Rating to Lowest Rating (Descending)
        let updated = this.all_counsellors.sort(
          function(a, b){

            let aRating = 0
            var sumA = 0
            if (a.data().past_ratings.length > 0) { 
              a.data().past_ratings.forEach(item => { sumA += item })
              aRating = sumA / a.data().past_ratings.length
            }

            let bRating = 0
            var sumB = 0
            if (b.data().past_ratings.length > 0) {
              b.data().past_ratings.forEach(item => { sumB += item })
              bRating = sumB / b.data().past_ratings.length
            }
            console.log("aRating", aRating, "bRating", bRating)
            return bRating - aRating
          })
        this.all_counsellors = updated

        console.log("legnth",this.all_counsellors.length)
        this.all_counsellors.forEach(counsellor => { console.log("AFT SECOND SORT ", counsellor.data().name)})

    
      } 
      },

  formattedSpecialisations(specialisations) { 
  var stringOutput = ""
  if (specialisations.length > 0) {
    
    let updated = specialisations.sort( // arrange in alphabetical order.
    function(a, b){
      if (a < b) { return -1 }
      else if (a > b) { return 1 }
      return 0;
    }
    )

    updated.forEach(item => {
      stringOutput = stringOutput + ", " + item
    })
  }
  return stringOutput.slice(2)
  },

    avgRating(ratings) {
      // Create a reference for a new rating, for use inside the transaction
      var avg = 0

      if (ratings.length>0) {
        var numRatings = ratings.length
        var sum = 0
        ratings.forEach(item => {
          sum = sum + item
        })
        avg = sum / numRatings
      }
      if (avg == 5) {
        return "★★★★★"
      } else if (avg >= 4) {
        return "★★★★☆"
      } else if (avg >= 3) {
        return "★★★☆☆"
      } else if (avg >= 2) {
        return "★★☆☆☆"
      } else if (avg >= 1) {
        return "★☆☆☆☆"
      }
      return "☆☆☆☆☆"
    },

    checkAvailability(slots) {
      if (slots.length == 0) {
        return false
      } else {
        return true
      }
    },

    // getEarliestSlot(slots) {
    //   if (slots.length == 0) {
    //     return;
    //   }
    //   let updated = slots.sort( function(timestampA, timestampB) {
    //     return timestampA.toDate() - timestampB.toDate()
    //   } ) 
    //   if (this.filteredDays == "any day") {
    //     return updated[0].toDate()
    //   } else {
    //     for (let i = 0; i < slots.length; i++) {
    //       let slot = slots[i]
    //       let a = slot.toDate()
    //       let a_gmtDate = new Date(a.setHours(a.getHours() + 8))
    //       if (a_gmtDate.toISOString().substr(0,10) == this.filteredDays) {
    //         return (slot.toDate())
    //       }
    //     }
    //   }
    // }
}
}
</script>

<style scoped>

#counsellor_preview_box {
    display: inline-block;
    margin: 20px;
    height: 150px;
    width: 25%;
    background-color: rgb(224, 236, 247);
    border-radius: 35px;
    border: 30px solid rgb(224, 236, 247);
}
#consult_now {
  background-color: blueviolet;
  color: white;
}
h4{
  margin-top: 5px;
}
</style>