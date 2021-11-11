<template>
  <div class="flex space-x-4 space-y-4" :key="componentKey">
    <ul>
      <div class="grid grid-flow-row grid-cols-3 gap-4">
        <a v-for="counsellorSlot in available" v-bind:key="counsellorSlot.index"> 
          <div class="card text-center shadow-2xl lg:card-side bg-accent text-accent-content">
            <div class="card-body">
              <div class="grid grid-flow-row place-items-center">
              
                <div v-if="counsellorSlot[0].data().profile_pic" class="avatar grid place-items-center">
                  <div class="mb-8 rounded-full w-16 h-16 ring ring-primary ring-offset-base-100 ring-offset-2 -mt-2">
                    <img :src="counsellorSlot[0].data().profile_pic">
                  </div>
                </div> 

                <div>
                  <h2 class="card-title -mt-4"> {{counsellorSlot[0].data().name}} </h2>
                </div>

              </div>

              <p> {{avgRating(counsellorSlot[0].data().past_ratings)}}<br> 
              {{ formattedSpecialisations(counsellorSlot[0].data().counsellor_specialisations) }} </p>

              <div class="justify-center card-actions">
                <button class="btn btn-accent" @click="createImmediateSession(counsellorSlot)">Consult Now</button> 
                <button class="btn btn-accent" @click="this.$router.push({ name: 'CounsellorProfilePatient', params: { id: counsellorSlot[0].id } })">View Profile</button>
              </div>
            </div>
          </div>
        </a>
      </div>
    </ul>
  </div>
</template>

<script>
import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { collection, getDocs, Timestamp, updateDoc, doc, setDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged} from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
  name: "CounsellorsCurrentlyAvailable",

  props: {
    selectedCategory:String,
    search:String,
    sortCounsellor:String
  },

  data() {
    return {
      user: false,
      fbuser: "", // user UID
      user_type: "patient",
      available:[],
      componentKey: 0, 
    }
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
    if (user) {
      this.user = user;
      this.fbuser = auth.currentUser.uid;  
    }
  })
  this.displayAvailableCounsellors();
  },

  methods: {
    async displayAvailableCounsellors() { 
      let allCounsellors = await getDocs(collection(db,"Counsellors"))

      allCounsellors.forEach((counsellor) => {
        if(this.selectedCategory === 'All Categories' || counsellor.data().counsellor_specialisations.includes(this.selectedCategory)) {

          // check if counsellor is currently available i.e. available slot <= 10 minutes from current time
          if (counsellor.data().currently_available) {
            console.log(counsellor.data().name + " has toggle currently_available on");
            this.available.push([counsellor, Timestamp.now()]);
          } else {
            var slots = counsellor.data().available_slots 

            slots.forEach((slot) => {
              const diff = slot.toDate() - Timestamp.now().toDate()

              // remove an available slot from the backend if the slot time has passed.
              if (diff < 0) { 
                console.log("Deleting slot for " + counsellor.data().name + " slot time " + slot);
                this.removeSlot(counsellor, slot);
              }
                
              if (diff <= 10*60*1000 & diff > 0) { 
                this.available.push([counsellor, slot])
              }      
            })
          }
        }
      })

      // search functionality
      this.available = this.available.filter(counsellor => {
        return counsellor[0].data().name.toLowerCase().includes(this.search.toLowerCase())
      })

      // sort functionality 
      this.updateSort();
    },

    updateSort() {
      this.available.forEach(counsellor => { console.log("BEF FIRST SORT ", counsellor[0].data().name)})
      // sort functionality
      let sortBy = this.sortCounsellor

      let updated = this.available.sort( // ties are broken by alphabetical order.
        function(a, b){
          console.log(a[0].data().name - b[0].data().name)
          if (a[0].data().name < b[0].data().name) { return -1 }
          else if (a[0].data().name > b[0].data().name) { return 1 }
          return 0;
        }
      )
      this.available = updated

      if (sortBy == "Highest Rating") { // Highest Rating to Lowest Rating (Descending)
        let updated = this.available.sort(
          function(a, b){
            let aRating = 0
            var sumA = 0
            if (a[0].data().past_ratings.length > 0) { 
              a[0].data().past_ratings.forEach(item => { sumA += item })
              aRating = sumA / a[0].data().past_ratings.length
            }

            let bRating = 0
            var sumB = 0
            if (b[0].data().past_ratings.length > 0) {
              b[0].data().past_ratings.forEach(item => { sumB += item })
              bRating = sumB / b[0].data().past_ratings.length
            }
            return bRating - aRating
          }
        )
        this.available = updated
      } 
    },

    async removeSlot(counsellor, slotToRemove) { 
      const counsellorDoc = doc(db,"Counsellors",counsellor.id);
      await updateDoc(counsellorDoc, {
        available_slots: arrayRemove(slotToRemove)
      })
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
      const slot = counsellorSlot[1]

      const counsellorID = counsellorSlot[0].id;

      const counsellorDocRef = doc(db, "Counsellors", counsellorID)
      const patientDocRef = doc(db, "Patients", this.fbuser)

      const counsellor = await getDoc(counsellorDocRef); // because the backend might have changed - e.g. another user on platform booked an available slot while the focal user was navigating the Find Counsellor page.

      let sessionID = counsellorID + String(slot.toDate()) // unique session ID
      
      var upcomingSessions = counsellor.data().upcoming_counsellor_sessions

      if (upcomingSessions.length > 0) {
        for (const upcomingSession of upcomingSessions) {
          const upcomingSessionDocRef = doc(db, "Sessions", upcomingSession)
          const upcomingSessionDocSnap = await getDoc(upcomingSessionDocRef);
          const upcomingSessionTime = upcomingSessionDocSnap.data().session_time
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
          if (diff <= 60 * 60 * 1000) { // with toDate(), need to deal in terms of milliseconds
            this.removeSlot(counsellor, x) 
            console.log("slot removed: ", x.toDate());
          }
        })
      } else {
        await updateDoc(counsellorDocRef, {
          available_slots: arrayRemove(slot)
        })
        console.log("removed avail slot ", slot, " for " , counsellor.data().name);
      }

      await updateDoc(counsellorDocRef, {
        upcoming_counsellor_sessions: arrayUnion(sessionID),
        currently_available: false,
      })

      // create new doc in Sessions
      setDoc(doc(db,"Sessions",sessionID), {
        user_ID: this.fbuser,
        counsellor_ID: counsellorID,
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
      this.$router.push({ name: 'DailyUserView', params: { id: sessionID } }) 
    },

    forceRerender() {
      this.componentKey += 1; 
    },
  }
}

</script>

<style scoped>

</style>