<template>
 <main class="wrapper">
   <div class="home" v-if="status === 'home'">
     <!-- <div id ="notice_for_early_enter" v-if="this.userEarly">
       <h4> You have entered before the allocated session slot time. Your counsellor has been notified, 
         however, please understand if your counsellor is only able to join at the allocated slot time.
         Thank you! 
        </h4>
     </div> -->

     <h2>Before you start...</h2>
     <p>This is a safe space. All our counsellors are certified by ..... blah blah <br>
     When you are ready, click the button below and the counsellor will counsellor will join the room shortly.</p>
     <div class="start-call-container">
       <button @click="createAndJoinRoom">
         Start Session
       </button>
       <p v-if="roomError" class="error">Session could not be started, please try again later.</p>
       
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
import api from "../../api.js";

import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { updateDoc, doc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
//  components: { Controls },
 name: "DailyUserView",
 data() {
   return {
     roomUrl: "",
     status: "home",
     callFrame: null,
     validRoomURL: false,
     roomError: false,
     runningLocally: false,
     sessionID: this.$route.params.id,
     userEarly: false,
   };
 },
 created() {
   if (window?.location?.origin.includes("localhost")) {
     this.runningLocally = true;
   }
 }, 

 methods: {
   async createAndJoinRoom() {
    const sessionDocRef = doc(db, "Sessions", this.sessionID)
    const sessionSnap = await getDoc(sessionDocRef);
    let roomID = sessionSnap.data().room_ID
    if (roomID == "") { // ie first time user is joining this session
      console.log("roomID == ''");
      api
       .createRoom()
       .then((room) => {
         this.roomUrl = room.url;
         this.updateSessionFirebase(); // update backend here.
         console.log("DailyUserView - The room url is ", room.url);
         this.joinRoom(room.url);
       })
       .catch((e) => {
         console.log(e);
         this.roomError = true;
       });

    } else { // ie repeated time joining this session - the room_ID of the session should not change.
      console.log("room_ID is not empty string. Join back existing room");
      this.roomUrl = roomID
      this.submitJoinRoom();

    }


     
   },
    
  async updateSessionFirebase() { // this method updates the room_ID in firebase.
    const sessionDocRef = doc(db, "Sessions", this.sessionID);
    await updateDoc(sessionDocRef, {room_ID: this.roomUrl});
    
    // ALERT COUNSELLOR OF THIS SESSION
    let sessionSnap = await getDoc(sessionDocRef)
    let counsellorDocRef = doc(db, "Counsellors", sessionSnap.data().counsellor_ID)
    await updateDoc(counsellorDocRef, {alert_counsellor: true});
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
      this.patientEndCall();
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
   validateInput(e) {
     this.validRoomURL = !!this.roomUrl && e.target.checkValidity();
   },

   async patientEndCall() {
    console.log("call patientEndCall() in DailyUserView");

    // update backend for PATIENT (backend for counsellor will be updated separately in DailyCounsellorView.vue)
    const sessionDocRef = doc(db, "Sessions", this.sessionID)
    const sessionSnap = await getDoc(sessionDocRef);
    console.log("user of session : " , sessionSnap.data().user_ID);

    const patientDocRef = doc(db, "Patients", sessionSnap.data().user_ID)
    await updateDoc(patientDocRef, {
      upcoming_user_sessions: arrayRemove(this.sessionID),
      past_user_sessions: arrayUnion(this.sessionID)
    })
    
    // route user to the review page.
    this.$router.push({ name: 'RateCounsellor', params: { id: this.sessionID } } )
    console.log("bottom of patientEndCall()");
   }
 },
};
</script>
