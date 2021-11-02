<template>
  <!-- This component templates the user's previous sessions (seen in Patients records, User's profile page ) -->
   <h3>Past Appointments</h3>
    
      <div>
        <table id="table3">
          <!-- <div v-if = "user"> -->
      <!-- would ultimately have some kind of for loop to pull the appropriate fields from Firebase Sessions collection -->
            <tr class=header> 
            <th>Date</th> 
            <th>Time</th> 
            <th>Counsellor</th>
            <th>Rating</th>
            </tr>

      </table>
      </div>
</template>

<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);

export default {
    name: "UserPreviousSessions",

    data(){
        return{
            user:false,
            counsellor: false,
            user_ID:"",
            past_user_sessions: [],
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        })
        this.user_ID = auth.currentUser.uid;
        this.isCounsellor(this.user_ID);
        this.displayPastSessions(this.user_ID);
    },

    methods: {
        // actually this isCounsellor method not needed already because not using v-if v-else for tables now
        async isCounsellor(user) { // UID
            // const checkUser = db.collection('Counsellors').doc(user.email);
            // const doc = await checkUser.get();

            let docRef = doc(db, "Counsellors", String(user));
            let counsellorDoc = await getDoc(docRef);
                
            if (counsellorDoc.exists()) {
              console.log('Is counsellor!');
              this.counsellor = true;
            } else {
              console.log('No such counsellor!');
              this.counsellor = false;
            }

        },

        async displayPastSessions(user) {
            let docRef = doc(db, "Patients", String(user));
            let patientDoc = await getDoc(docRef);
            let ind = 1

            let session = patientDoc.data().past_user_sessions
            // console.log(session)

            for ( const pastSession of session) {
                // console.log(pastSession)
                let sessionDocRef = doc(db, "Sessions", pastSession);
                let sessionID = await getDoc(sessionDocRef);
                let counsellorDocRef = doc(db, "Counsellors", sessionID.data().counsellor_ID);
                let counsellor = await getDoc(counsellorDocRef);

                let sessionTime = sessionID.data().session_time.toDate()

                var table = document.getElementById("table3")
                var row = table.insertRow(ind)

                var date = sessionTime.toDateString() 
                var time = sessionID.data().session_time.toDate().toLocaleTimeString()
                var counsellorName = counsellor.data().name;
                var rating =  sessionID.data().rating

                var cell1 = row.insertCell(0); 
                var cell2 = row.insertCell(1); 
                var cell3 = row.insertCell(2); 
                var cell4 = row.insertCell(3); 
                if (rating != null) {
                    var stars = rating.shift()
                    if (stars == 5) {
                        rating = "★★★★★"
                    } else if (stars >= 4) {
                        rating = "★★★★☆"
                    } else if (stars >=3) {
                        rating = "★★★☆☆"
                    } else if (stars >=2) {
                        rating = "★★☆☆☆"
                    } else if (stars >=1) {
                        rating = "★☆☆☆☆"
                    } else {
                        rating = "☆☆☆☆☆" 
                    }
                    
                } else {
                    var rateSession = document.createElement("button")
                    rateSession.id = "rateSession"
                    rateSession.innerHTML = "<p class='underline'> Rate Session Now! </p>"
                    rateSession.onclick = () => {
                        this.$router.push({ name: 'RateCounsellor', params: { id: pastSession } }) 
                    }
                    cell4.appendChild(rateSession)
                }

                cell1.innerHTML = date; 
                cell2.innerHTML = time;
                cell3.innerHTML = counsellorName; 

                if (rating != null) {
                    // if (this.isCounsellor(user)) { //check the if else condition again
                        cell4.innerHTML = rating
                    // } else {
                    // cell4.innerHTML = notes
                    // }
                }

                                
            }                    

        }

    }
}
</script>

<style scoped>
#table3{
    /* width: 630px; */
    font-family: Arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    background-color:rgb(242, 242, 243);
}
th,td { 
    /* background-color: whitesmoke;  */
    border: 1px solid #dddddd;
    padding: 8px;
    text-align: center;
}

tr:nth-child(even){
    background-color: #e3edee;
}

.header {
    background-color: black;
}

th{
    color: white;
}
</style>