<template>
  <!-- This component templates the user's upcoming sessions (seen in Patients records, User's profile page ) -->    
      <div>
        <h3>Upcoming Appointments</h3>
        <table id="table2">
            <tr id="header">
            <th>Date</th> 
            <th>Time</th>
            <th>Counsellor</th>
            <th>Link</th>
            <th>X</th> 
            </tr>
        </table>
      </div>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc, arrayRemove, arrayUnion, Timestamp, updateDoc,deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const db = getFirestore(firebaseApp);

export default {
    name: "UserUpcomingSessions",

    data(){
        return{
            counsellor: false,
            user_ID:"", // patient's UID
            upcoming_user_sessions: [],

        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        })
        this.user_ID = auth.currentUser.uid;
        this.isCounsellor(this.user_ID);
        this.displayUpcomingSessions(this.user_ID)
    },

    methods: {
        async isCounsellor(user) {
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

        async displayUpcomingSessions(user) {
            let docRef = doc(db, "Patients", String(user));
            let patientDoc = await getDoc(docRef);
            let ind = 1

            let session = patientDoc.data().upcoming_user_sessions
            //console.log(session)

            for ( const upcomingSession of session) {
                // console.log(upcomingSession);
                let sessionDocRef = doc(db, "Sessions", upcomingSession);
                let sessionID = await getDoc(sessionDocRef);
                let counsellorDocRef = doc(db, "Counsellors", sessionID.data().counsellor_ID);
                let counsellor = await getDoc(counsellorDocRef);

                let sessionTime = sessionID.data().session_time.toDate()
                let timeNow = Timestamp.now().toDate()
                if (timeNow - sessionTime > 60*60*1000) {
                    console.log("moved from upcoming to past", timeNow, sessionTime)
                // if (sessionTime - timeNow <= 60*60*1000) {
                    await updateDoc(doc(db,"Counsellors",counsellor.id), {upcoming_counsellor_sessions: arrayRemove(sessionID.id)});
                    await updateDoc(doc(db,"Patients",user), {upcoming_user_sessions: arrayRemove(sessionID.id)});
                    await updateDoc(doc(db,"Counsellors",counsellor.id), {past_counsellor_sessions: arrayUnion(sessionID.id)});
                    await updateDoc(doc(db,"Patients",user), {past_user_sessions: arrayUnion(sessionID.id)});
                    // console.log("moved from upcoming to past")
                    continue
                }

                var table = document.getElementById("table2")
                var row = table.insertRow(ind)

                var date = sessionTime.toDateString() 
                var time = sessionID.data().session_time.toDate().toLocaleTimeString()
                var counsellorName = counsellor.data().name;
                // var link =  sessionID.data().room_ID 

                var cell1 = row.insertCell(0); 
                var cell2 = row.insertCell(1); 
                var cell3 = row.insertCell(2); 
                var cell4 = row.insertCell(3); 
                var cell5 = row.insertCell(4); 
                cell1.innerHTML = date; 
                cell2.innerHTML = time;
                cell3.innerHTML = counsellorName; 
                
                console.log("diff is ", sessionTime - timeNow)
                // if (link == "" && !(sessionTime - timeNow <= 10*60*1000)) { // no room link yet. 
                if (10*60*1000 < sessionTime - timeNow) { // it is OVER 10 mins till the start of the session time 
                    console.log("No link yet, and DOES NOT meet criteria to create  a room now. Session: ", sessionTime, ", timeNow: " , timeNow);
                    cell4.innerHTML = "You can enter your session room up to 10 minutes before the slot timing.";
                } else {
                    // (1) within 10 minutes from session start, or (2) session slot already begun, or (3) link already exists.
                    console.log("No link yet, but meets criteria to create a room now. Session: ", sessionTime, ", timeNow: " , timeNow);
                    var linkSession = document.createElement("button")
                    linkSession.id = "linkSession"
                    linkSession.innerHTML = "Enter Session Room Now!"
                    
                    linkSession.onclick = () => {
                        this.$router.push({ name: 'DailyUserView', params: { id: upcomingSession } }) 
                    }
                    // if (sessionTime - timeNow <= 10*60*1000) { 
                    //     console.log("sessionTime - timeNow <= 10*60*1000");
                    //     linkSession.onclick = () => {
                    //         this.$router.push({ name: 'DailyUserView', params: { id: upcomingSession } }) 
                    //     }
                    // } else {
                    //     linkSession.onclick = () => {
                    //         this.$router.push({ name: 'DailyUserView', params: { id: upcomingSession } }) 
                    //     }
                    // }
                    cell4.appendChild(linkSession)
                }
                
                cell5.innerHTML = "";

                var bu = document.createElement("button")
                bu.className = "bwt"
                bu.id = String(counsellorName)
                bu.innerHTML = "X"
                bu.onclick = ()=>{
                    this.cancelSession(sessionID.id,counsellor.id,user)
                    //sessionID = doc name of session eg SESSION123, patient.id = doc name of patient eg rose@gmail.com
                }
                cell5.appendChild(bu)                        
            }                   
        },
    

        async cancelSession(session, counsellor, user) {
            var confirmDelete = confirm("Press 'OK' to proceed to cancel this appointment with Session ID of " + session);
            //alert("You are going to cancel this appointment with Session ID of " + session)
            if (confirmDelete) { //pressed OK
                //remove session from patient's and counsellor's upcoming appointments array
                await updateDoc(doc(db,"Counsellors",counsellor), {upcoming_counsellor_sessions: arrayRemove(session)});
                await updateDoc(doc(db,"Patients",user), {upcoming_user_sessions: arrayRemove(session)});

                //delete session from sessions collection
                await deleteDoc(doc(db,"Sessions",session))
                console.log("Session successfully deleted!");
                let tb = document.getElementById("table")
                while (tb.rows.length > 1){
                    tb.deleteRow(1)
                }
                this.displayUpcomingSessions(this.user_ID); 
            }
            
        }

    }
}
</script>

<style scoped>
#table2{
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

#header {
    background-color: black;
}

th{
    color: white;
}
</style>