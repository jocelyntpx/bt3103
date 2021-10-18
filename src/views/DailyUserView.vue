<template>
  <h1> the route id is {{ $route.params.id }} </h1>


 <main class="wrapper">
   <div class="home" v-if="status === 'home'">
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
     <controls
       v-if="status === 'call'"
       :roomUrl="roomUrl"
       :callFrame="callFrame"
     />
   </div>
 </main>
</template>

<script>
import DailyIframe from "@daily-co/daily-js";
import Controls from "@/components/Controls.vue";
import api from "../api.js";

import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { updateDoc, doc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
 components: { Controls },
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
   };
 },
 created() {
   if (window?.location?.origin.includes("localhost")) {
     this.runningLocally = true;
   }
 },
 methods: {
   createAndJoinRoom() {
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
   },
    
  async updateSessionFirebase() {
    const sessionDocRef = doc(db, "Sessions", this.sessionID);
    await updateDoc(sessionDocRef, {room_ID: this.roomUrl});
    // NOTE: IS IT POSSIBLE TO ALERT COUNSELLOR OF THIS SESSION?
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
 },
};
</script>
