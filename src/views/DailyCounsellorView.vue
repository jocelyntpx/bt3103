<template>
 <main class="wrapper">
   <div class="home" v-if="status === 'home'">
     <!-- <h2>Daily Demo</h2>
     <p>Start demo with a new unique room or paste in your own room URL</p> -->
     <div class="start-call-container">
       <!-- <button @click="createAndJoinRoom">
         Create room and start
       </button>
       <p v-if="roomError" class="error">Room could not be created</p>
       <p class="subtext">or</p> -->
       <!-- <input
         type="text"
         :placeholder= this.sesionID
         v-model="roomUrl"
         pattern="^(https:\/\/)?[\w.-]+(\.(daily\.(co)))+[\/\/]+[\w.-]+$"
         @input="validateInput"
       /> -->
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
// import api from "../api.js";

export default {
 components: { Controls },
 name: "DailyCounsellorView",
 data() {
   return {
    //  roomUrl: "",
     status: "home",
     callFrame: null,
    //  validRoomURL: false,
     roomError: false,
     runningLocally: false,
    roomUrl: this.$route.params.id,
   };
 },
 created() {
   if (window?.location?.origin.includes("localhost")) {
     this.runningLocally = true;
   }
  //  this.submitJoinRoom(this.sessionID)
 },
// mounted() {
//   this.joinRoom(this.sessionID);
// },
 methods: {
  // async joinUserSession() {
  //   this.joinRoom(this.sessionID);
  // },


  //  createAndJoinRoom() {
  //    api
  //      .createRoom()
  //      .then((room) => {
  //        this.roomUrl = room.url;
  //        this.joinRoom(room.url);
  //       //  console.log("Room url is: " + room.url);
  //      })
  //      .catch((e) => {
  //        console.log(e);
  //        this.roomError = true;
  //      });
  //  },
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
  //  validateInput(e) {
  //    this.validRoomURL = !!this.roomUrl && e.target.checkValidity();
  //  },
 },
};
</script>
