<template>
  <main class="wrapper">
    <div class="home" v-if="status === 'home'">
      <div class="hero min-h-screen py-8">
        <div class="text-center hero-content">
          <div class="w-2/3">
            <h1 class="mb-5 text-5xl font-bold">
              Welcome!
            </h1>

            <div class="card shadow-lg">
              <div class="card-body object-center">
                <h2 class="card-title">Few pointers to take note of...</h2>
                <p>
                  1. Patient can communicate via video call, voice call or via
                  the chat box.
                </p>
                <br />
                <p>
                  2. Please fill in the Session Notes at the end of the session.
                </p>
                <br />
              </div>
            </div>
            <br /><br />

            <div>
              <button class="btn btn-primary w-1/2" @click="submitJoinRoom">
                Join Session Now
              </button>
              <p v-if="roomError" class="error">
                Session could not be started, please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="call-container" :class="{ hidden: status === 'home' }">
      <div id="call" ref="callRef"></div>
    </div>
  </main>
</template>

<script>
import DailyIframe from "@daily-co/daily-js";

import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import {
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
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
      const sessionDocRef = doc(db, "Sessions", this.sessionID);
      const sessionDocSnap = await getDoc(sessionDocRef);
      this.roomUrl = sessionDocSnap.data().room_ID;
      console.log("successfully updated room url, ", this.roomUrl);
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
          width: "100%",
          position: "fixed",
          margin: "auto",
          maxHeight: "100%",
          maxWidth: "100%",
          enable_screenshare: false, // disables screenshare
          aspectRatio: 16 / 9,
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
      // update backend for COUNSELLOR
      const sessionDocRef = doc(db, "Sessions", this.sessionID);
      const sessionSnap = await getDoc(sessionDocRef);

      const counsellorDocRef = doc(
        db,
        "Counsellors",
        sessionSnap.data().counsellor_ID
      );
      await updateDoc(counsellorDocRef, {
        upcoming_counsellor_sessions: arrayRemove(this.sessionID),
        past_counsellor_sessions: arrayUnion(this.sessionID),
      });

      // add to my_patients field of counsellor
      const userID = sessionSnap.data().user_ID;
      const counsellorSnap = await getDoc(counsellorDocRef);
      let counsellorPatients = counsellorSnap.data().my_patients;
      if (!counsellorPatients.includes(userID)) {
        await updateDoc(counsellorDocRef, {
          my_patients: arrayUnion(userID),
        });
      }

      // route counsellor to the notes page.
      this.$router.push({
        name: "SessionNotes",
        params: { id: this.sessionID },
      });
      console.log("bottom of counsellorEndCall()");
    },
  },
};
</script>
