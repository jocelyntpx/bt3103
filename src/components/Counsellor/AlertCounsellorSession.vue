<template>
  <div></div>
</template>

<script>
import firebaseApp from "@/firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
  name: "AlertCounsellorSession",
  props: {
    counsellorID: String,
  },
  data() {
    return {};
  },
  mounted() {
    console.log("counsellorID is ", this.counsellorID);
    this.pollData();
  },
  beforeUnmount() {
    clearInterval(this.polling);
  },
  methods: {
    pollData() {
      console.log("in pollData()");
      const counsellorDoc = doc(db, "Counsellors", this.counsellorID);
      setInterval(async () => {
        console.log("in setInterval");
        console.log(this.counsellorID);
        let counsellorSnap = await getDoc(counsellorDoc);
        let alertCounsellor = counsellorSnap.data().alert_counsellor;
        if (alertCounsellor) {
          alert(
            "A user has started a session with you! Please check your Upcoming Patients page for the link."
          );
          await updateDoc(counsellorDoc, { alert_counsellor: false });
          console.log("bottom of if (alertCounsellor)");
        }
      }, 10 * 1000); // updates every 10 seconds
    },
  },
};
</script>

<style></style>
