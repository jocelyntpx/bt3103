<template>
<div class="available_counsellors">
  <ul>
    <!-- This temporarily prints as a list -->
      <a v-for="counsellorSlot in available" v-bind:key="counsellorSlot.index"> 
        <div id="available_counsellor_preview_box"> 
          <h4><router-link :to="{ name: 'CounsellorProfile', params: { id: counsellorSlot[0].data().email }}"> {{counsellorSlot[0].data().name}}</router-link></h4>
          {{avgRating(counsellorSlot[0].data().past_ratings)}}<br> 
          {{ formattedSpecialisations(counsellorSlot[0].data().counsellor_specialisations) }}<br><br>
          <button id = "consult_now" @click="createImmediateSession(counsellorSlot[0],counsellorSlot[1])"> Consult Now </button> 
        </div>
      </a>
  </ul>
</div>


  <!-- TEMPORARY BUTTON TO PROPAGATE COUNSELLOR INTO FIREBASE -->
  <button @click="newCounsellor()">Temporary helper button: click to create new counsellor</button>



</template>

<script>
import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { collection, getDocs, Timestamp, updateDoc, doc, setDoc, arrayUnion, arrayRemove,  } from "firebase/firestore";
import { getAuth, onAuthStateChanged} from "firebase/auth";


const db = getFirestore(firebaseApp);


export default {
  name: "CounsellorsCurrentlyAvailable",

  data() {
    return {
      user: false,
      fbuser: "",
      user_type: "patient",
      available:[],
    }
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
    if (user) {
      this.user = user;
      this.fbuser = auth.currentUser.email;  
    }
  })
  this.displayAvailableCounsellors();
  },

  methods: {
  // TEMP METHOD
  async newCounsellor() {
    let counsellor_name = "Bruce Tan"
    let counsellor_email = "bruce@gmail.com"
    setDoc(doc(db, "Counsellors", counsellor_email), {
      email: counsellor_email,
      name: counsellor_name,
      available_slots: new Array(),
      counsellor_specialisations: new Array(),
      gender:"Female",
      currently_available:true,
      past_ratings:new Array(),
      upcoming_counsellor_sessions:new Array()
    });
    console.log("CREATED COUNSELLOR");
  },


  async displayAvailableCounsellors() { // WORKS
    // await this.updateCounsellorAvailability();    

    let allCounsellors = await getDocs(collection(db,"Counsellors"))

    allCounsellors.forEach((counsellor) => {
      console.log(counsellor.data().name)
      // check if counsellor is currently available i.e. available slot <= 10 minutes from current time

      // if the currently_available toggle is on, that takes precedence over a specified available_slot. Slot created is for timestamp NOW.
      if (counsellor.data().currently_available) {
        console.log(counsellor.data().name + " has toggle currently_available on");
        this.available.push([counsellor, Timestamp.now()]);
      } else {
        var slots = counsellor.data().available_slots // array of timestamp

        slots.forEach((slot) => {
          const diff = slot - Timestamp.now()
          console.log("diff is : " , slot-Timestamp.now());

          // remove an available slot from the backend if the slot time has passed.
          if (diff < 0) {  // WORKS.
            console.log("Deleting slot for " + counsellor.data().name + " slot time " + slot);
            this.removeSlot(counsellor, slot);
          }
            
          if (diff <= 10*60 & diff > 0) { // Can only have at max one slot that meets criteria, since each slot is one hour long.
            console.log("Slot is within 10mins")
            this.available.push([counsellor, slot])
          }      
        })
      }
    })
    console.log("this.available is ", this.available);
  },

  // async updateCounsellorAvailability() {
  //   console.log("inside updateCounsellorAvailability")
  //   // check if the toggle is incorrectly on (ie. counsellor has upcoming session in <= 1 hour. Then, the toggle should be turned off.)
  //   let allCounsellors = await getDocs(collection(db,"Counsellors"))
  //   allCounsellors.forEach((counsellor) => {
  //     if (counsellor.data().currently_available) {
  //       console.log("currently available counsellor: ", counsellor.data().name)
  //       var upcomingSession = this.checkExistenceUpcomingSession(counsellor);
  //           if (upcomingSession) {
  //             const counsellorDocRef = doc(db,"Counsellors",counsellor.data().email);
  //             console.log("toggle for ", counsellor.data().name, "is incorrectly turned on - turning it off now");
  //             // this.updateCounsellorAvailability(counsellorDocRef, false);
  //             updateDoc(counsellorDocRef, {currently_available: false});
  //           }
  //         }
  //       })
  //   },


    // var results = []
    // allCounsellors.forEach((counsellor) => results.push(counsellor.data()))
    // const arrayCounsellors = await Promise.all(results);

    // for (const counsellor in arrayCounsellors) {
    //   console.log("counsellor is", counsellor.email)
    //   console.log("currently avialabel counsellor: ", counsellor.data().name)

    //   if (counsellor.data().currently_available) {
  
    //     var upcomingSession = this.checkExistenceUpcomingSession(counsellor);
    //     if (upcomingSession) {
    //       const counsellorDocRef = doc(db,"Counsellors",counsellor.data().email);
    //       console.log("toggle for ", counsellor.data().name, "is incorrectly turned on - turning it off now");
    //       // this.updateCounsellorAvailability(counsellorDocRef, false);
    //       await updateDoc(counsellorDocRef, {currently_available: false});
    //     }
    //   }
    // }
    // },

  async removeSlot(counsellor, slotToRemove) { 
    const counsellorDoc = doc(db,"Counsellors",counsellor.data().email);
    await updateDoc(counsellorDoc, {
      available_slots: arrayRemove(slotToRemove)
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

  async createImmediateSession(counsellor, slot) {
    const counsellorEmail = counsellor.data().email;
    const patientDocRef = doc(db, "Patients", this.fbuser)

    const counsellorDocRef = doc(db, "Counsellors", counsellorEmail)

    let sessionID = counsellorEmail + String(slot) // unique session ID
    
    // set doc into Sessions
    setDoc(doc(db,"Sessions",sessionID), {
      user_email: this.fbuser,
      counsellor_email: counsellorEmail,
      room_ID: "",
      session_notes: "",
      rating: null,
      session_time: slot // a timestamp
    })

    // add to upcoming session of patient
    await updateDoc(patientDocRef, {
      upcoming_user_sessions: arrayUnion(sessionID)
      });

    // add to upcoming session of counsellor, remove from existing available slot 
    if (counsellor.data().currently_available) { // toggle was ON
      await updateDoc(counsellorDocRef, {currently_available: false})
      
      // if there is a session starting within the next 1 hour, we remove this from available_slots. (Bc slot is no longer "available")
      var slots = counsellor.data().available_slots
      slots.forEach((x) => {
        const diff = x - slot; // would be > 0
        console.log("counsellor w toggle ON. difference between next avail slot and now was ", diff);
        if (diff < 60 * 60) { 
          this.removeSlot(counsellor, x)
        }
      })
    } else {
      await updateDoc(counsellorDocRef, {
        available_slots: arrayRemove(slot)
      })
      console.log("removed avail slot ", slot, " for " , counsellor.data().name);
    }
    await updateDoc(counsellorDocRef, {
      upcoming_counsellor_sessions: arrayUnion(sessionID)
    });

    // user is redirected
    this.$router.push({ name: 'DailyUserView', params: { id: sessionID } }) // https://router.vuejs.org/guide/essentials/navigation.html 
  },

//   async checkExistenceUpcomingSession(counsellor) { 
//     console.log("in checkExistenceUpcomingSession");
//     // const counsellorDocRef = doc(db, "Counsellors", this.fbuser)
//     const counsellorDocSnap = await getDoc(counsellor)
//     console.log("this is " , counsellorDocSnap.data().name)
//     const upcomingSessions = counsellorDocSnap.data().upcoming_counsellor_sessions
//     console.log("upcomingsessions: ", upcomingSessions)

//     if (upcomingSessions.length > 0) {
//       console.log("whats in upcomingSessions: ", upcomingSessions, counsellorDocSnap.data().name)
//       for (const session of upcomingSessions) {
//         let sessionDocRef = doc(db, "Sessions",session)
//         let sessionDocSnap = await getDoc(sessionDocRef)
//         let sessionTime = sessionDocSnap.data().session_time.toDate()
//         let timeNow = Timestamp.now().toDate()
        
//         // console.log("SESSION : ", sessionTime.toDate() , "NOW : ", Timestamp.now().toDate())
//         // console.log("diff is in MILLISECONDS: " , sessionTime.toDate() - Timestamp.now().toDate()) // this gives you difference in MILLISECONDS.

//         if (sessionTime - timeNow <= 60 * 60 * 1000 ) {
//             console.log("existence of upcoming session");
//             console.log("SESSION : ", sessionTime , "NOW : ", timeNow)
//             return true;
//         }
//     }
//     }
    
//     console.log("no upcoming session - returning false")
//     return false;
// },

  }
}



</script>

<style scoped>
#available_counsellor_preview_box {
    display: inline-block;
    margin: 20px;
    height: 80px;
    width: 20%;
    background-color: rgb(224, 236, 247);
    border-radius: 35px;
    border: 30px solid rgb(224, 236, 247);
}
#consult_now {
  background-color: yellow;
}
h4{
  margin-top: 5px;
}
</style>