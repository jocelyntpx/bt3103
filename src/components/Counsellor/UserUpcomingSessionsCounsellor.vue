<template>
  <div>
    <p class="text-xl">Upcoming Appointments</p>
    <br />
    <table id="table2">
      <tr id="header">
        <th>Date</th>
        <th>Time</th>
        <th>Counsellor</th>
      </tr>
    </table>
  </div>
</template>

<script>
import firebaseApp from "../../firebase.js";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  getDoc,
  arrayRemove,
  arrayUnion,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);

export default {
  name: "UserUpcomingSessionsCounsellor",

  data() {
    return {
      user_ID: "", // counsellor UID
      user_type: "counsellor",
      patient_id: this.$route.params.id,
      upcomingArr: [],
    };
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
    this.user_ID = auth.currentUser.uid;
    this.displayUpcomingSessions(this.patient_id);
  },

  methods: {
    async displayUpcomingSessions(user) {
      let docRef = doc(db, "Patients", String(user));
      let patientDoc = await getDoc(docRef);
      let ind = 1;

      let session = patientDoc.data().upcoming_user_sessions;
      console.log(session);

      for (const upcomingSession of session) {
        console.log(upcomingSession);
        let sessionDocRef = doc(db, "Sessions", upcomingSession);
        let sessionID = await getDoc(sessionDocRef);
        let counsellorDocRef = doc(
          db,
          "Counsellors",
          sessionID.data().counsellor_ID
        );
        let counsellor = await getDoc(counsellorDocRef);

        let sessionTime = sessionID.data().session_time.toDate();
        let timeNow = Timestamp.now().toDate();
        if (timeNow - sessionTime > 60 * 60 * 1000) {
          console.log("moved from upcoming to past", timeNow, sessionTime);
          await updateDoc(doc(db, "Counsellors", counsellor.id), {
            upcoming_counsellor_sessions: arrayRemove(sessionID.id),
          });
          await updateDoc(doc(db, "Patients", user), {
            upcoming_user_sessions: arrayRemove(sessionID.id),
          });

          if (sessionID.data().room_ID != "") {
            console.log(
              "patient has clicked start session, we assume session was held. moving session to past"
            );
            await updateDoc(doc(db, "Counsellors", counsellor.id), {
              past_counsellor_sessions: arrayUnion(sessionID.id),
            });
            await updateDoc(doc(db, "Patients", user), {
              past_user_sessions: arrayUnion(sessionID.id),
            });
          }
          continue;
        } else {
          this.upcomingArr.push(sessionID);
        }
      }

      this.upcomingArr.sort(
        (x, y) => y.data().session_time - x.data().session_time
      );

      for (const s of this.upcomingArr) {
        var table = document.getElementById("table2");
        var row = table.insertRow(ind);

        let counsellorDocRef = doc(db, "Counsellors", s.data().counsellor_ID);
        let counsellor = await getDoc(counsellorDocRef);

        let sessionTime = s.data().session_time.toDate();

        var date = sessionTime.toDateString();
        var time = s
          .data()
          .session_time.toDate()
          .toLocaleTimeString();
        var counsellorName = counsellor.data().name;

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        cell1.innerHTML = date;
        cell2.innerHTML = time;
        cell3.innerHTML = counsellorName;
      }
    },
  },
};
</script>

<style scoped>
#table2 {
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
