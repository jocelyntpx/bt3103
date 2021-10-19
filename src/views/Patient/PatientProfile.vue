<template>
    <div v-if="user">
        <br><br>
        <NavBarPatient/>
        <h1>My Profile</h1>

        <!-- <div id = "leaveReview" v-if = "userNotLeftReview">
            We notice you have not yet left a review for your previous session with Mr John Tan. 
            Leave a review now!
            <router-link to="/rateCounsellor">Rate Counsellor!</router-link>
        </div><br> -->

        <div id="bgBlock">
            <div id="col-1">
                <div id="patientDetails"> 
                    <p> Name: <strong>{{user.displayName}}</strong><br>
                    Email: <strong>{{user.email}}</strong><br>
                    User ID: <strong>{{user.uid}}</strong></p>
                </div>
            </div> 
            <!-- <div id="col-2">
                <h3>Select date to view upcoming appointments</h3>
                <PatientCalendar/>
            </div> -->

<!-- this entire chunk for upcoming appointment to be replaced to UserUpcomingSessions component. 
do v-if v-else to show links and X -->
            <h3>Upcoming Appointments</h3>
            <table class="table" id="table">
                <tr id=header>
                <th>Date</th> 
                <th>Time</th> 
                <th>Counsellor</th>
                <th>Link</th>
                <th>X</th> 
                </tr>
            </table>

            <br><br>

            <div style="text-align:center;" v-if="user">
            <UserPreviousSessions/> 
            <!-- ^ not copying over the correct information from the v-if=user from UserPreviousSessions, brings else info here instead -->
            <!-- <div><h3><strong>This is the appointment page</strong></h3></div> -->
            </div>

            <br>

        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarPatient from "@/components/NavBarPatient.vue"
import UserPreviousSessions from "@/components/UserPreviousSessions.vue"
import firebaseApp from '../../firebase.js';
import { collection, getFirestore } from "firebase/firestore"
import {  doc, getDoc, setDoc} from "firebase/firestore";
// import {  doc, deleteDoc, updateDoc, arrayRemove, getDoc  } from "firebase/firestore";
const db = getFirestore(firebaseApp);
// import PatientCalendar from '@/components/PatientCalendar.vue'


export default {
    components: {
        NavBarPatient,
        UserPreviousSessions,
        // PatientCalendar
    },
    name:"PatientProfile",

    data(){
        return{
            userNotLeftReview: true,
            user:false,
            counsellorUser:"",
            count:"",
        }
    },

    mounted() {
        // console.log("UpcomingPatients.vue");
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
            this.fbuser = user.email;
            this.updateFirebase(user);
        });
        // this.counsellorUser = auth.currentUser.email;
        // this.displayUpcomingAppointments(this.counsellorUser);
    },

    methods: {
        async updateFirebase(user) {
            const patientDoc = await getDoc(doc(db, "Patients", String(user)));

            if (!patientDoc.exists()) {
                console.log("update patient into firebase")
                const patientRef = collection(db,"Patients");
                await setDoc(doc(patientRef,String(user.email)), {
                    name: user.displayName,
                    email: user.email,
                    userID: user.uid,
                })
            } else {
                console.log("exists")
                console.log(this.fbuser)
            }

        }
    //     async displayUpcomingAppointments(user) {
    //         let docRef = doc(db, "Counsellors", String(user));
    //         let counsellorDoc = await getDoc(docRef);
    //         //let allCounsellors = await getDoc(collection(db,"Counsellors",String(user)))
    //         //let allSessions = await getDocs(collection(db,"Sessions"))
    //         //let allPatients = await getDocs(collection(db,"Patients"))
    //         let ind = 1

    //         let session = counsellorDoc.data().upcoming_counsellor_sessions
    //         //console.log(session)

    //         for ( const upcomingSession of session) {
    //             //console.log(upcomingSession);
    //             let sessionDocRef = doc(db, "Sessions", upcomingSession);
    //             let sessionID = await getDoc(sessionDocRef);
    //             let patientDocRef = doc(db, "Patients", sessionID.data().user_email);
    //             let patient = await getDoc(patientDocRef);

    //             var table = document.getElementById("table")
    //             var row = table.insertRow(ind)

    //             //console.log(sessionID.data())

    //             var date = sessionID.data().session_time.toDate().toDateString() 
    //             var time = sessionID.data().session_time.toDate().toLocaleTimeString()
    //             var patientName = patient.data().name;
    //             var link =  sessionID.room_ID 
    //             var cell1 = row.insertCell(0); 
    //             var cell2 = row.insertCell(1); 
    //             var cell3 = row.insertCell(2); 
    //             var cell4 = row.insertCell(3); 
    //             var cell5 = row.insertCell(4); 
    //             cell1.innerHTML = date; 
    //             cell2.innerHTML = time;
    //             cell3.innerHTML = patientName; 
    //             cell4.innerHTML = link; 
    //             cell5.innerHTML = "";

    //             var bu = document.createElement("button")
    //             bu.className = "bwt"
    //             bu.id = String(patientName)
    //             bu.innerHTML = "X"
    //             bu.onclick = ()=>{
    //                 this.cancelSession(sessionID.id,patient.id,user)
    //                 //sessionID = doc name of session eg SESSION123, patient.id = doc name of patient eg rose@gmail.com
    //             }
    //             cell5.appendChild(bu)             
    //         }      
    //     },
    

    //     async cancelSession(session, patient, user) {
    //         var confirmDelete = confirm("Press 'OK' to proceed to cancel this appointment with Session ID of " + session);
    //         //alert("You are going to cancel this appointment with Session ID of " + session)
    //         if (confirmDelete) { //pressed OK
    //             //remove session from patient's and counsellor's upcoming appointments array
    //             await updateDoc(doc(db,"Counsellors",user), {upcoming_counsellor_sessions: arrayRemove(session)});
    //             await updateDoc(doc(db,"Patients",patient), {upcoming_user_sessions: arrayRemove(session)});

    //             //delete session from sessions collection
    //             await deleteDoc(doc(db,"Sessions",session))
    //             console.log("Session successfully deleted!");
    //             let tb = document.getElementById("table")
    //             while (tb.rows.length > 1){
    //                 tb.deleteRow(1)
    //             }
    //             this.displayUpcomingPatients(this.counsellorUser); 
    //         }
            
    //     }
    }
}
</script>

<style scoped>
#bgBlock {
    /* display:flex;
    border-style:solid;
    border-color:#B9D9EB;
    border-width: 2px;
    background: transparent;
    border-radius: 20px;
    padding: 20px;
    width: 80%;
    height: 500px;
    margin: auto; */

    border-radius: 35px;
    background: #B9D9EB;
    padding: 20px;
    width: 80%;
    height: 100%;
    margin:auto;
} 


#col-1 {
  background-color: transparent;
  flex: 1;
  text-align: left;
}
#col-2 {
  background-color:rgb(224, 236, 247);
  flex: 1;
}

#leaveReview {
    border-radius: 35px;
    width: 50%;
    background-color:azure;
    margin-left:10%;
    padding:20px;
}

#backBtn{
  text-align: left;
  margin-left: 250px; 
}

#table1{
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