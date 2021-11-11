<template>
  <div v-if="user">
    <br /><br />
    <NavBarPatient />
    <br />
    <p class="text-4xl">My Profile</p>
    <br />

    <div class="flex-auto grid justify-items-center">
      <p class="text-md">
        Allow your session notes left by counsellors to be shared with all
        counsellors?
      </p>
      <br />
      <div class="tabs tabs-boxed mb-2 mt-1">
        <div>
          <button
            :key="refreshComponent"
            @click="toggleSharing"
            :class="[this.shareInfo ? 'tab tab-md tab-active ' : 'tab tab-md']"
            data-tip="We encourage this option as it will smoothen the transition with new counsellors that you have sessions with, allowing you to reap greater benefits from the session."
            class="tooltip tooltip-left tooltip-success"
          >
            <strong>Share</strong>
          </button>
        </div>
        <div>
          <button
            :key="refreshComponent"
            @click="toggleSharing"
            :class="[
              !this.shareInfo ? 'tab tab-md tab-red tab-active' : 'tab tab-md',
            ]"
            data-tip="We discourage this option as it may affect the efficiency and break the continuity of sessions when you switch counsellors."
            class="tooltip tooltip-right tooltip-error"
          >
            <strong>Don't Share</strong>
          </button>
        </div>
      </div>
    </div>
    <br />
    <div class="flex-auto">
      <div class="alert alert-info ml-40 w-1/2" v-if="userNotLeftReview">
        <div class="flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#2196f3"
            class="flex-shrink-0 w-6 h-6 mx-2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            ></path>
          </svg>
          <label>
            <h4 class="text-left">Hey, {{ user.displayName }}</h4>
            <p class="text-sm text-base-content text-opacity-60 ">
              We noticed you have not left a review yet for a previous session.
              Leave a review now!
            </p>
          </label>
        </div>
      </div>
    </div>
    <br />

    <div class="bg-base-300 text-base-content">
      <div id="bgBlock">
        <div id="col-1">
          <div id="patientDetails">
            <p>
              Alias: <strong>{{ user.displayName }}</strong
              ><br />
              Email: <strong>{{ user.email }}</strong
              ><br />
            </p>
          </div>
        </div>
        <br />

        <UserUpcomingSessions />

        <br /><br />

        <div style="text-align:center;" v-if="user">
          <UserPreviousSessions />
        </div>

        <br />
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarPatient from "@/components/Patient/NavBarPatient.vue";
import UserUpcomingSessions from "@/components/Patient/UserUpcomingSessions.vue";
import UserPreviousSessions from "@/components/Patient/UserPreviousSessions.vue";
import firebaseApp from "../../firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
  components: {
    NavBarPatient,
    UserPreviousSessions,
    UserUpcomingSessions,
  },
  name: "PatientProfile",

  data() {
    return {
      patient_ID: this.$route.params.id,
      userNotLeftReview: false,
      user: false,
      counsellorUser: "",
      count: "",
      fbuser: "", // user's UID
      past_user_sessions: [],
      refreshComponent: 0,
      shareInfo: null, //not sure if should be null or false, in counsellorProfile was null
    };
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      this.fbuser = user.uid;
      if (localStorage.getItem("reloaded")) {
        // The page was just reloaded. Clear the value from local storage so that it will reload the next time this page is visited.
        localStorage.removeItem("reloaded");
      } else {
        // Set a flag so that we know not to reload the page twice.
        localStorage.setItem("reloaded", "1");
        location.reload();
      }

      this.checkSharing(user);
      this.checkReviews(user);
    });
  },

  methods: {
    async checkReviews(user) {
      const patientDoc = await getDoc(doc(db, "Patients", user.uid));
      let session = patientDoc.data().past_user_sessions;

      for (const pastSession of session) {
        let sessionDocRef = doc(db, "Sessions", pastSession);
        let sessionID = await getDoc(sessionDocRef);
        if (sessionID.data().rating == null) {
          // means have a review not left yet
          this.userNotLeftReview = true;
          break;
        }
        // if all reviews have been left, will not go into if condition and will remain false by default
      }
    },

    async checkSharing(user) {
      const patientDoc = await getDoc(doc(db, "Patients", user.uid));
      this.shareInfo = patientDoc.data().share_info;
    },

    async toggleSharing() {
      console.log("in toggleSharing()");

      let patientDocRef = doc(db, "Patients", this.fbuser);
      console.log("share info: ", this.shareInfo);

      if (this.shareInfo == false) {
        this.shareInfo = true;
        await updateDoc(patientDocRef, { share_info: true });
        this.refreshComponent += 1;
      } else {
        this.shareInfo = false;
        await updateDoc(patientDocRef, { share_info: false });
        this.refreshComponent += 1;
      }
    },
  },
};
</script>

<style scoped>
#bgBlock {
  border-radius: 35px;
  padding: 20px;
  width: 80%;
  height: 100%;
  margin: auto;
}

#col-1 {
  background-color: transparent;
  flex: 1;
  text-align: left;
}
#col-2 {
  background-color: rgb(224, 236, 247);
  flex: 1;
}

#leaveReview {
  border-radius: 35px;
  width: 50%;
  background-color: azure;
  margin-left: 10%;
  padding: 20px;
}

#backBtn {
  text-align: left;
  margin-left: 250px;
}

#table1 {
  font-family: Arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  background-color: rgb(242, 242, 243);
}
th,
td {
  border: 1px solid #dddddd;
  padding: 8px;
  text-align: center;
}

tr:nth-child(even) {
  background-color: #e3edee;
}

#header {
  background-color: black;
}

th {
  color: white;
}
</style>
