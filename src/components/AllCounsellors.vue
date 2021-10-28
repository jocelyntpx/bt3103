<template>
  <div class="all_counsellors">
    <ul>
        <a v-for="counsellor in all_counsellors" v-bind:key="counsellor.index">
          <div id="counsellor_preview_box"> 
            <h4><router-link :to="{ name: 'CounsellorProfilePatient', params: { id: counsellor.id }}"> {{counsellor.data().name}}</router-link></h4>
            {{avgRating(counsellor.data().past_ratings)}}<br> 
            {{ formattedSpecialisations(counsellor.data().counsellor_specialisations) }}<br><br>
          </div>
        </a>
    </ul>
</div>

</template>

<script>

import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged} from "firebase/auth";
// import router from './router/index.js'

const db = getFirestore(firebaseApp);

export default {
  name: "NotAvailableCounsellors",
  props: {
    filteredDays:String,
    selectedCategory:String,
    search:String
  },

  data() {
    return {
      user: false,
      user_type: "patient",
      all_counsellors:[],
    }
  },
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

    },

    

    formattedSpecialisations(specialisations) {
      var stringOutput = ""
      if (specialisations.length > 0) {
        specialisations.forEach(item => {
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
  }
}
</script>

<style scoped>
#counsellor_preview_box {
    display: inline-block;
    margin: 20px;
    height: 80px;
    width: 15%;
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