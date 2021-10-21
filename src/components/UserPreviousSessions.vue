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
            <!-- <th>Link</th> -->
            <th v-if=(counsellor)>Notes</th> 
            <th v-else>Rating</th>
            </tr>
             <!-- <tr>
                <td>10/10/21</td>
                <td></td>
                <td>Mdm Lim</td> -->
                <!-- <td>Link expired</td> -->
                <!-- <td v-if=(counsellor)>Having problems with...</td>
                <td v-else><router-link to="/rateCounsellor">Rate Session</router-link></td>
            </tr>
            <tr>
                <td>11/10/21</td>
                <td></td>
                <td>Mr Tan</td> -->
                <!-- <td>Link expired</td> -->
                <!-- <td v-if=(counsellor)>Rose was angry because...</td>
                <td v-else>★★★☆☆</td>
            </tr> -->
      </table>
      </div>
</template>

<script>
import firebaseApp from '../firebase.js';
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
            user_email:"",
            user_type: "patient",
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
            // if (user.user_type == "counsellor") {
            //   this.counsellor = true;
            // }
        })
        this.user_email = auth.currentUser.email;
        this.isCounsellor(this.user_email);
        this.displayPastSessions(this.user_email);
    },

    methods: {
        async isCounsellor(user) {
            // const checkUser = db.collection('Counsellors').doc(user.email);
            // const doc = await checkUser.get();

            let docRef = doc(db, "Counsellors", String(user));
            let counsellorDoc = await getDoc(docRef);
                
            if (counsellorDoc.data().user_type == "counsellor") {
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
            //console.log(session)

            for ( const pastSession of session) {
                let sessionDocRef = doc(db, "Sessions", pastSession);
                let sessionID = await getDoc(sessionDocRef);
                let counsellorDocRef = doc(db, "Counsellors", sessionID.data().counsellor_email);
                let counsellor = await getDoc(counsellorDocRef);

                let sessionTime = sessionID.data().session_time.toDate()

                var table = document.getElementById("table3")
                var row = table.insertRow(ind)

                var date = sessionTime.toDateString() 
                var time = sessionID.data().session_time.toDate().toLocaleTimeString()
                var counsellorName = counsellor.data().name;
                var rating =  sessionID.data().rating[0]
                var notes = sessionID.data().session_notes

                var cell1 = row.insertCell(0); 
                var cell2 = row.insertCell(1); 
                var cell3 = row.insertCell(2); 
                var cell4 = row.insertCell(3); 
                cell1.innerHTML = date; 
                cell2.innerHTML = time;
                cell3.innerHTML = counsellorName; 
                if (this.isCounsellor(user)) {
                    cell4.innerHTML = notes
                } else {
                    cell4.innerHTML = rating
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