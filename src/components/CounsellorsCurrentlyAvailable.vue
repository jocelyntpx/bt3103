<template>
<div class="available_counsellors">
  <ul>
    <!-- This temporarily prints as a list -->
      <li v-for="counsellorSlot in available" v-bind:key="counsellorSlot.index"> 
        <div id="available_counsellor_preview_box"> 
          <h5><router-link to="/counsellorProfile/:{{counsellorSlot[0].data().uid}}">{{counsellorSlot[0].data().name}}</router-link></h5>
          {{counsellorSlot[0].data().past_ratings}}<br> 
          {{ formattedSpecialisations(counsellorSlot[0].data().counsellor_specialisations) }}<br><br>
          <button id = "consult_now" @click="createImmediateSessionSlot(counsellorSlot[0],counsellorSlot[1])"> Consult Now </button> 
        </div>
      </li>
  </ul>
</div>







</template>

<script>
import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { collection, getDocs, Timestamp, updateDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged} from "firebase/auth";
// import router from './router/index.js'

const db = getFirestore(firebaseApp);


export default {
  name: "CounsellorsCurrentlyAvailable",
  // components: {router},
  data() {
    return {
      user: false,
      user_type: "patient",
      available:[],
    }
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
    if (user) {
      this.user = user;      
    }
  })
  this.displayAvailableCounsellors();
  },

  methods: {

  async displayAvailableCounsellors() { // WORKS
    let allCounsellors = await getDocs(collection(db,"Counsellors"))

    allCounsellors.forEach((counsellor) => {
        console.log(counsellor.data().name)
      // check if counsellor is currently available i.e. available slot <= 10 minutes from current time
      var slots = counsellor.data().available_slots // array of timestamp

      slots.forEach((slot) => {
        const diff = slot - Timestamp.now()
        console.log("diff is : " , slot-Timestamp.now());

        // remove an available slot from the backend if the slot time has passed.
        if (diff < 0) {  // WORKS.
          console.log("Deleting slot for " + counsellor.data().name + " slot time " + slot);
          var updated = [];
          // console.log(slots);
          slots.forEach((x) => {
            if (x != slot) {
              updated.push(x);
            }
          })
          this.removeSlot(counsellor,updated)
        }
          
        if (diff <= 10*60 & diff > 0) { // Can only have at max one slot that meets criteria, since each slot is one hour long.
          console.log("Slot is within 10mins")
          this.available.push([counsellor, slot])
        }
      })
    })
    console.log(this.available)
  },
  async removeSlot(counsellor, updated) { // WORKS.
    const counsellorDoc = doc(db,"Counsellors",counsellor.data().email);
    console.log("DOC IS ",counsellorDoc);
    await updateDoc(counsellorDoc, { 
      available_slots: updated 
      })
    console.log("Successfully removed slot from Firebase.");
  },
  formattedSpecialisations(specialisations) { // WORKS.
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


  
//   createImmediateSessionSlot(counsellor,slot) { // "Consult Now" on Find a Counsellor page. Booking of an available slot that counsellor has marked as available.
//       const auth = getAuth();
//       this.user = auth.currentUser;

//       const sessionKey = () => {
//        return new Date().getTime().toString() + "_" + String(this.user.email)
//       }

//       try{
//         const docRef = await setDoc(doc(db, "Sessions", sessionKey),{
//           user_email: this.user.email,
//           counsellor_email: ,
//           room_ID: ,
//           session_notes: "",
//           rating: null,
//           session_time: null
//         })
//       }
//       catch(error) {
//           console.error("Error creating immediate session slot: ", error);
//       }
//     }
//   }
// }

// <button id = "consult_now"><router-link to="/dailyUserView">Consult Now</router-link></button>

</script>

<style scoped>
#available_counsellor_preview_box {
  padding: 5px;
  width: 35%;
  height: 180px;
  background-color: white;
}
#consult_now {
  background-color: yellow;
}
</style>