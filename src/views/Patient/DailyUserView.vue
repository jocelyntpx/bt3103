<template>
 <main class="wrapper">
   <div class="home" v-if="status === 'home'">

      <div class="hero min-h-screen py-8">
        <div class="text-center hero-content">
          <!-- <div class="max-w-md"> -->
          <div class="w-2/3">
            <h1 class="mb-5 text-5xl font-bold">
                  Welcome! Before you start...
            </h1> 
            <p class="mb-5 text-lg">
                  We want to remind you that this is a <strong> safe space, </strong>and all our counsellors are certified.  <br>
                  When you are ready, click the button below and your counsellor will join the room shortly.
            </p> 

            <div class="card shadow-lg">
              <div class="card-body object-center">

                <h2 class="card-title">Few pointers to take note of...</h2> 
                  <p> 1. You can choose to communicate with your counsellor via video call (require webcam permission), voice call (require microphone permission), or via the chat box.</p><br>
                  <p> 2. Please do not feel pressured to disclose any information you are not comfortable with.</p><br>
                  <p> 3. Information shared during the session remains confidential, however they can be shared with your future counsellors
                  on this platform if you have chosen to share information with all counsellors. (This option can be changed at any 
                  point of time in your profile). </p>
              </div>
            </div> <br><br>

            <div>
              <!-- <p class="text-lg font-semibold"> When you are ready, click the button below and the counsellor will counsellor will join the room shortly.</p> -->
              <button class="btn btn-primary w-1/3" @click="createAndJoinRoom">Start Session Now</button>
              <p v-if="roomError" class="error">Session could not be started, please try again later.</p>
            </div>
          </div>
        </div>
      </div>

   </div>

  <!-- <div class="bg-base-200"> -->
   <div class="call-container" :class="{ hidden: status === 'home' }">
     <!-- The Daily Prebuilt iframe is embedded in the div below using the ref -->
     <div id="call" ref="callRef"></div>
     <!-- Only show the control panel if a call is live -->
     <!-- <Controls
       v-if="status === 'call'"
       :roomUrl="roomUrl"
       :callFrame="callFrame"
     /> -->
   <!-- </div> -->
  </div>
 </main>
</template>

<script>
import DailyIframe from "@daily-co/daily-js";
// import Controls from "@/components/General/Controls.vue";
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
        width: '100%',
        position: "fixed",
        margin: "auto",
        maxHeight:"100%",
        maxWidth:"100%",
        enable_screenshare: false, // disables screenshare 
         aspectRatio: 16 / 9,
         border: "1px solid var(--grey)",
         borderRadius: "4px",
       },
       showLeaveButton: true,
       showFullscreenButton: true,
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
    console.log("sessionID: " , this.sessionID);

    const patientDocRef = doc(db, "Patients", sessionSnap.data().user_ID)
    await updateDoc(patientDocRef, {
      upcoming_user_sessions: arrayRemove(this.sessionID),
      past_user_sessions: arrayUnion(this.sessionID)
    })
    console.log("right before router push")
    
    // route user to the review page.
    this.$router.push({ name: 'RateCounsellor', params: { id: this.sessionID } } )
    console.log("bottom of patientEndCall()");
   }
 },
};
</script>
