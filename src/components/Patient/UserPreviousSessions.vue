<template>
  <p class="text-xl">Past Appointments</p>
  <br />
  <div>
    <table id="table3">
      <tr class="header">
        <th>Date</th>
        <th>Counsellor</th>
        <th>Rating</th>
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
  name: "UserPreviousSessions",

  data() {
    return {
      user: false,
      user_ID: "",
      past_user_sessions: [],
    };
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
    this.user_ID = auth.currentUser.uid;
    this.displayPastSessions(this.user_ID);
  },

  methods: {
    async displayPastSessions(user) {
      let docRef = doc(db, "Patients", String(user));
      let patientDoc = await getDoc(docRef);
      let ind = 1;

      let session = patientDoc.data().past_user_sessions;
      for (const pastSession of session) {
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
        var rating = sessionID.data().rating;

        var cell1 = row.insertCell(0);
        var cell3 = row.insertCell(1);
        var cell4 = row.insertCell(2);
        if (rating != null) {
          var stars = rating.shift();
          if (stars == 5) {
            rating = "★★★★★";
          } else if (stars >= 4) {
            rating = "★★★★☆";
          } else if (stars >= 3) {
            rating = "★★★☆☆";
          } else if (stars >= 2) {
            rating = "★★☆☆☆";
          } else if (stars >= 1) {
            rating = "★☆☆☆☆";
          } else {
            rating = "☆☆☆☆☆";
          }
        } else {
          var rateSession = document.createElement("button");
          rateSession.id = "rateSession";

          rateSession.innerHTML =
            "<button class='btn btn-link btn-sm text-info'>Rate Session Now!";

          rateSession.onclick = () => {
            this.$router.push({
              name: "RateCounsellor",
              params: { id: pastSession },
            });
          };
          cell4.appendChild(rateSession);
        }

        cell1.innerHTML = date;

        cell3.className = "nameToProfile";
        var nameButton = document.createElement("button");
        nameButton.innerHTML =
          "<button class='btn btn-link btn-sm text-black'>" + counsellorName;
        nameButton.onclick = () => {
          this.$router.push({
            name: "CounsellorProfilePatient",
            params: { id: counsellor.id },
          });
        };
        cell3.appendChild(nameButton);

        if (rating != null) {
          cell4.innerHTML = rating;
        }
      }
    },
  },
};
</script>

<style scoped>
#table3 {
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

.header {
  background-color: black;
}

th {
  color: white;
}
</style>
