<template>
<div class="available_counsellors" :key="componentKey">
  <ul>
    <!-- This temporarily prints as a list -->
      <a v-for="counsellorSlot in available" v-bind:key="counsellorSlot.index"> 
        <div id="available_counsellor_preview_box"> 
          <h4><router-link :to="{ name: 'CounsellorProfile', params: { id: counsellorSlot[0].data().email }}"> {{counsellorSlot[0].data().name}}</router-link></h4>
          {{avgRating(counsellorSlot[0].data().past_ratings)}}<br> 
          {{ formattedSpecialisations(counsellorSlot[0].data().counsellor_specialisations) }}<br><br>
          <button id = "consult_now" @click="createImmediateSession(counsellorSlot)"> Consult Now </button> 
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
import { collection, getDocs, Timestamp, updateDoc, doc, setDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
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
      componentKey: 0, // for purposes of rerendering component
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
    let counsellor_name = "Jane Tan"
    let counsellor_email = "janeTan@gmail.com"
    setDoc(doc(db, "Counsellors", counsellor_email), {
      email: counsellor_email,
      name: counsellor_name,
      available_slots: new Array(),
      counsellor_specialisations: new Array(),
      gender:"Female",
      currently_available:true,
      past_ratings:new Array(),
      upcoming_counsellor_sessions:new Array(),
      my_patients:new Array(),
    });
    console.log("CREATED COUNSELLOR");
  },

  async displayAvailableCounsellors() { // WORKS
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
          const diff = slot.toDate() - Timestamp.now().toDate()
          console.log("slot is ", slot.toDate(), "diff is ", diff)

          // remove an available slot from the backend if the slot time has passed.
          if (diff < 0) {  // WORKS.
            console.log("Deleting slot for " + counsellor.data().name + " slot time " + slot);
            this.removeSlot(counsellor, slot);
          }
            
          if (diff <= 10*60*1000 & diff > 0) { // Can only have at max one slot that meets criteria, since each slot is one hour long.
            console.log("Slot is within 10mins")
            this.available.push([counsellor, slot])
          }      
        })
      }
    })
    console.log("this.available is ", this.available);
  },

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

  async createImmediateSession(counsellorSlot) {
    console.log("In createImmediateSesssion()");
    const slot = counsellorSlot[1]

    const counsellorEmail = counsellorSlot[0].data().email;

    const counsellorDocRef = doc(db, "Counsellors", counsellorEmail)
    const patientDocRef = doc(db, "Patients", this.fbuser)

    const counsellor = await getDoc(counsellorDocRef); // because the backend might have changed - e.g. another user on platform booked an available slot while the focal user was navigating the Find Counsellor page.

    let sessionID = counsellorEmail + String(slot) // unique session ID
    
    var upcomingSessions = counsellor.data().upcoming_counsellor_sessions
    console.log("array for upcoming sessions is ", upcomingSessions)
    console.log("length of array for upcoming sessions is ", upcomingSessions.length)

    if (upcomingSessions.length > 0) {
      for (const upcomingSession of upcomingSessions) {
        const upcomingSessionDocRef = doc(db, "Sessions", upcomingSession)
        console.log("EAFAEF")
        const upcomingSessionDocSnap = await getDoc(upcomingSessionDocRef);
        const upcomingSessionTime = upcomingSessionDocSnap.data().session_time
        console.log("upcomingSessionTime is ", upcomingSessionTime);
        const diff = upcomingSessionTime.toDate() - Timestamp.now().toDate(); 

        // two cases for this if check:
        // (1) user on platform booked an available slot while the focal user was navigating the Find Counsellor page. 
        // (2) counsellor forgot to turn off their toggle, when they have an upcoming session in <= 1 hour. hence rightfully, counsellor is not
        // "currently available". we turn off the toggle here.
        if (diff <= 60 * 60 * 1000) {
          alert("Sorry! This counsellor is no longer available right now. You can try to book a future session, or consult a different counsellor.");

          if (counsellor.data().currently_available) { 
            console.log("toggle was incorrectly ON, turning it off now")
            await updateDoc(counsellorDocRef, {currently_available: false})
          }
          // re-rendering of component
          const newAvailableCounsellors = this.available.filter(x => (x != counsellorSlot));
          this.available = newAvailableCounsellors          
          return this.forceRerender(); // force the component to rerender.
        }
      }
    }
      
    // add to upcoming session of counsellor, remove from existing available slot  
    if (counsellor.data().currently_available) {
      // if there is an available slot starting within the next 1 hour, we remove this from available_slots. (Bc slot is no longer "available")
      var slots = counsellor.data().available_slots
      slots.forEach((x) => {
        const diff = x.toDate() - slot.toDate(); // would be > 0; need to use toDate() to take care of slot and x being on DIFF DAYS
        console.log("counsellor w toggle ON. difference between next avail slot and now was ", diff);
        console.log("slot removed: ", x.toDate());
        // if (diff < 60 * 60) { 
        if (diff <= 60 * 60 * 1000) { // with toDate(), need to deal in terms of milliseconds
          this.removeSlot(counsellor, x) 
        }
      })
    } else {
      await updateDoc(counsellorDocRef, {
        available_slots: arrayRemove(slot)
      })
      console.log("removed avail slot ", slot, " for " , counsellor.data().name);
    }

    // if patient does not exist in counsellor's my_patients field, we also want to add it in too.
    let counsellorPatients = counsellor.data().my_patients
    if (!counsellorPatients.includes(this.fbuser)) {
      await updateDoc(counsellorDocRef, {
        upcoming_counsellor_sessions: arrayUnion(sessionID),
        my_patients: arrayUnion(this.fbuser)
      })
    } else {
      await updateDoc(counsellorDocRef, {
        upcoming_counsellor_sessions: arrayUnion(sessionID)
      })
    }

    // create new doc in Sessions
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

    // user is redirected
    this.$router.push({ name: 'DailyUserView', params: { id: sessionID } }) // https://router.vuejs.org/guide/essentials/navigation.html 
  },

  forceRerender() {
    console.log("in forceRerender()")
    this.componentKey += 1; 
    console.log(this.componentKey) 
  },
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