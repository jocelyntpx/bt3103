<template>
  <p class="text-xl">Past Appointments</p>
  <br />
  <div>
    <table id="table3">
      <tr class="header">
        <th>Date</th>
        <th>Counsellor</th>
        <th>Notes</th>
      </tr>
    </table>
  </div>
</template>

<script>
import firebaseApp from "../../firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);

export default {
  name: "UserPreviousSessionsCounsellor",

  data() {
    return {
      user: false,
      user_ID: "",
      user_type: "counsellor",
      patient_id: this.$route.params.id,
    };
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
    this.user_ID = auth.currentUser.uid;
    this.displayPastSessions(this.patient_id);
  },

  methods: {
    async displayPastSessions(user) {
      let docRef = doc(db, "Patients", String(user));
      let patientDoc = await getDoc(docRef);
      let ind = 1;

      let session = patientDoc.data().past_user_sessions;

      for (const pastSession of session) {
        console.log(pastSession);
        let sessionDocRef = doc(db, "Sessions", pastSession);
        let sessionID = await getDoc(sessionDocRef);
        let counsellorDocRef = doc(
          db,
          "Counsellors",
          sessionID.data().counsellor_ID
        );
        let counsellor = await getDoc(counsellorDocRef);

        let sessionTime = sessionID.data().session_time.toDate();

        var table = document.getElementById("table3");
        var row = table.insertRow(ind);

        var date = sessionTime.toDateString();
        var counsellorName = counsellor.data().name;

        var cell1 = row.insertCell(0);
        var cell3 = row.insertCell(1);
        var cell4 = row.insertCell(2);
        var notes = sessionID.data().session_notes;

        cell1.innerHTML = date;
        cell3.innerHTML = counsellorName;
        cell4.className = "notesCell";

        if (patientDoc.data().share_info == false) {
          if (sessionID.data().counsellor_ID == this.user_ID) {
            cell4.innerHTML = notes;
          } else {
            cell4.innerHTML = "Confidential";
          }
        } else {
          cell4.innerHTML = notes;
        }
      }
    },
  },
};
</script>

<style scoped>
#table3 {
  /* width: 630px; */
  font-family: Arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  background-color: rgb(242, 242, 243);
}
th,
td {
  /* background-color: whitesmoke;  */
  border: 1px solid #dddddd;
  padding: 8px;
  text-align: center;
}

tr:nth-child(even) {
  background-color: #e3edee;
}

.header {
  background-color: black;
}

th {
  color: white;
}
</style>
