<template>
 <main class="wrapper">
   <div class="home" v-if="status === 'home'">
     <div class="start-call-container">
        <h4> some intro msg blah </h4>
       <button @click="submitJoinRoom">
         Click to join the session!
       </button>
     </div>
   </div>

   <div class="call-container" :class="{ hidden: status === 'home' }">
     <!-- The Daily Prebuilt iframe is embedded in the div below using the ref -->
     <div id="call" ref="callRef"></div>
     <!-- Only show the control panel if a call is live -->
     <!-- <controls
       v-if="status === 'call'"
       :roomUrl="roomUrl"
       :callFrame="callFrame"
     /> -->
   </div>
 </main>
</template>

<script>
import DailyIframe from "@daily-co/daily-js";
// import Controls from "@/components/Controls.vue";
// import api from "../api.js";

import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { updateDoc, doc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
// import {  doc,  getDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);


export default {
//  components: { Controls },
 name: "Home",
 data() {
   return {
     roomUrl: "",
     status: "home",
     callFrame: null,
     validRoomURL: false,
     roomError: false,
     runningLocally: false,
     sessionID: this.$route.params.id,
   };
 },
 created() {
   if (window?.location?.origin.includes("localhost")) {
     this.runningLocally = true;
   }
 },

 mounted() {
   this.updateRoomUrl();
 },

 methods: {
   async updateRoomUrl() {
    const sessionDocRef = doc(db, "Sessions", this.sessionID)
    const sessionDocSnap = await(getDoc(sessionDocRef))
    this.roomUrl = sessionDocSnap.data().room_ID
    console.log("successfully updated room url, " , this.roomUrl);
   },

   // Daily callframe created and joined below
   joinRoom(url) {
     if (this.callFrame) {
       this.callFrame.destroy();
     }

     // Daily event callbacks
     const logEvent = (ev) => console.log(ev);
     const goToLobby = () => (this.status = "lobby");
     const goToCall = () => (this.status = "call");
     const leaveCall = () => {
           if (this.callFrame) {
         this.status = "home";
         this.callFrame.destroy();
       }
       this.counsellorEndCall();
     };

     // DailyIframe container element
     const callWrapper = this.$refs.callRef;

     // Create Daily call
     const callFrame = DailyIframe.createFrame(callWrapper, {
       iframeStyle: {
         height: "auto",
         width: "100%",
         aspectRatio: 16 / 9,
         minWidth: "400px",
         maxWidth: "920px",
         border: "1px solid var(--grey)",
         borderRadius: "4px",
       },
       showLeaveButton: true,
     });
     this.callFrame = callFrame;

     // Add event listeners and join call
     callFrame
       .on("loaded", logEvent)
       .on("started-camera", logEvent)
       .on("camera-error", logEvent)
       .on("joining-meeting", goToLobby)
       .on("joined-meeting", goToCall)
       .on("left-meeting", leaveCall);

     callFrame.join({ url });
   },
   submitJoinRoom() {
     this.joinRoom(this.roomUrl);
   },

   async counsellorEndCall() {
    console.log("call counsellorEndCall() in DailyCounsellorView");

    // update backend for COUNSELLOR (backend for patient will be updated separately in DailyUserView.vue)
    const sessionDocRef = doc(db, "Sessions", this.sessionID)
    const sessionSnap = await getDoc(sessionDocRef);
    console.log("user of session : " , sessionSnap.data().counsellor_ID);

    const counsellorDocRef = doc(db, "Counsellors", sessionSnap.data().counsellor_ID)
    await updateDoc(counsellorDocRef, {
      upcoming_counsellor_sessions: arrayRemove(this.sessionID),
      past_counsellor_sessions: arrayUnion(this.sessionID)
    })

    // add to my_patients field of counsellor 
    const userID = sessionSnap.data().user_ID
    const counsellorSnap = await getDoc(counsellorDocRef)
    let counsellorPatients = counsellorSnap.data().my_patients
    if (!counsellorPatients.includes(userID)) {
      await updateDoc(counsellorDocRef, {
        my_patients: arrayUnion(userID)
      })
    }
    
    // route counsellor to the notes page.
    this.$router.push({ name: 'SessionNotes', params: { id: this.sessionID } } )
    console.log("bottom of counsellorEndCall()");
   }

 },
};
</script>



