<template>
  <div class="all_counsellors">
  <ul>
    <!-- This temporarily prints as a list -->
      <li v-for="counsellor in all_counsellors" v-bind:key="counsellor.index">
        <div id="counsellor_preview_box"> 
          <h5><router-link to="/counsellorProfile/:{{counsellor.data().uid}}">{{counsellor.data().name}}</router-link></h5>
          {{counsellor.data().past_ratings}}<br> 
          {{ formattedSpecialisations(counsellor.data().counsellor_specialisations) }}<br><br>
        </div>
      </li>
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
      let allCounsellors = await getDocs(collection(db,"Counsellors"));
      allCounsellors.forEach((counsellor) => {
        // console.log(counsellor.data().name)
        this.all_counsellors.push(counsellor)
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
    }
  }
}
</script>

<style scoped>
#counsellor_preview_box {
  padding: 5px;
  width: 35%;
  height: 140px;
  background-color: white;
}
#consult_now {
  background-color: blueviolet;
  color: white;
}
</style>