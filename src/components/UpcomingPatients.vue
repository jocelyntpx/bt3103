<template>
            <table class="table" id="table">
                <tr class=header>
                <th>Date</th> 
                <th>Time</th>
                <th>Patient</th>
                <th>Link</th>
                <th>X</th> 
                </tr>
            </table>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore"
import {  doc, deleteDoc, updateDoc, arrayRemove, getDoc  } from "firebase/firestore";
const db = getFirestore(firebaseApp);
// import NavBarCounsellor from "@/components/NavBarCounsellor.vue" since nvr use
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    // components: {NavBarCounsellor},    
    name:"UpcomingPatients",

    data(){
        return{
            // user:false,
            counsellorUser:"",
            count:"",
        }
    },

    mounted() {
        // console.log("UpcomingPatients.vue");
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        });
        this.counsellorUser = auth.currentUser.email;
        this.displayUpcomingPatients(this.counsellorUser);
    },

    methods: {
        async displayUpcomingPatients(user) {
            let docRef = doc(db, "Counsellors", String(user));
            let counsellorDoc = await getDoc(docRef);
            //let allCounsellors = await getDoc(collection(db,"Counsellors",String(user)))
            //let allSessions = await getDocs(collection(db,"Sessions"))
            //let allPatients = await getDocs(collection(db,"Patients"))
            let ind = 1

            let session = counsellorDoc.data().upcoming_counsellor_sessions
            //console.log(session)

            for ( const upcomingSession of session) {
                //console.log(upcomingSession);
                let sessionDocRef = doc(db, "Sessions", upcomingSession);
                let sessionID = await getDoc(sessionDocRef);
                let patientDocRef = doc(db, "Patients", sessionID.data().user_email);
                let patient = await getDoc(patientDocRef);

                var table = document.getElementById("table")
                var row = table.insertRow(ind)

                //console.log(sessionID.data())

                var date = sessionID.data().session_time.toDate().toDateString() 
                var time = sessionID.data().session_time.toDate().toLocaleTimeString()
                var patientName = patient.data().name;
                var link =  sessionID.room_ID 
                var cell1 = row.insertCell(0); 
                var cell2 = row.insertCell(1); 
                var cell3 = row.insertCell(2); 
                var cell4 = row.insertCell(3); 
                var cell5 = row.insertCell(4); 
                cell1.innerHTML = date; 
                cell2.innerHTML = time;
                cell3.innerHTML = patientName; 
                cell4.innerHTML = link; 
                cell5.innerHTML = "";


                var bu = document.createElement("button")
                bu.className = "bwt"
                bu.id = String(patientName)
                bu.innerHTML = "X"
                bu.onclick = ()=>{
                    this.cancelSession(sessionID.id,patient.id,user)
                    //sessionID = doc name of session eg SESSION123, patient.id = doc name of patient eg rose@gmail.com
                }
                cell5.appendChild(bu)
                
                                
            }
                        //})
                    
                                

        },
    

        async cancelSession(session, patient, user) {
            var confirmDelete = confirm("Press 'OK' to proceed to cancel this appointment with Session ID of " + session);
            //alert("You are going to cancel this appointment with Session ID of " + session)
            if (confirmDelete) { //pressed OK
                //remove session from patient's and counsellor's upcoming appointments array
                await updateDoc(doc(db,"Counsellors",user), {upcoming_counsellor_sessions: arrayRemove(session)});
                await updateDoc(doc(db,"Patients",patient), {upcoming_user_sessions: arrayRemove(session)});

                //delete session from sessions collection
                await deleteDoc(doc(db,"Sessions",session))
                console.log("Session successfully deleted!");
                let tb = document.getElementById("table")
                while (tb.rows.length > 1){
                    tb.deleteRow(1)
                }
                this.displayUpcomingPatients(this.counsellorUser); 
            }
            
        }
    }

    
}

</script>


<style>

.table{
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

.bwt{
    color:rgb(0, 0, 0);
    /* background-color: rgb(255, 94, 0); */
}

</style>