<template>
    <table class="table" id="table">
        <tr class=header>
        <th>Date</th> 
        <th>Time</th>
        <th>Patient</th>
        <th>Link</th>
        <th></th> 
        </tr>
    </table>
</template>

<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore"
import {  doc, deleteDoc, updateDoc, arrayRemove, getDoc, arrayUnion, Timestamp  } from "firebase/firestore";
const db = getFirestore(firebaseApp);
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default { 
    name:"UpcomingPatients",

    data(){
        return{
            //user:false,
            counsellorUser:"", // uid of counsellor
            count:"",
        }
    },

    mounted() {
        // console.log("UpcomingPatients.vue");
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        });
        this.counsellorUser = auth.currentUser.uid;
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
                let patientDocRef = doc(db, "Patients", sessionID.data().user_ID);
                let patient = await getDoc(patientDocRef);

                let sessionTime = sessionID.data().session_time.toDate()
                let timeNow = Timestamp.now().toDate()
                // if (sessionTime - timeNow <= 60*60*1000) {
                if (timeNow - sessionTime > 60*60*1000) {
                    console.log(patient.data().name);
                    console.log("moved from upcoming to past", timeNow, sessionTime)
                    await updateDoc(doc(db,"Counsellors",user), {upcoming_counsellor_sessions: arrayRemove(sessionID.id)});
                    await updateDoc(doc(db,"Patients",patient.id), {upcoming_user_sessions: arrayRemove(sessionID.id)});
                    await updateDoc(doc(db,"Counsellors",user), {past_counsellor_sessions: arrayUnion(sessionID.id)});
                    await updateDoc(doc(db,"Patients",patient.id), {past_user_sessions: arrayUnion(sessionID.id)});
                    continue
                }

                var table = document.getElementById("table")
                var row = table.insertRow(ind)

                //console.log(sessionID.data())

                var date = sessionTime.toDateString() 
                var time = sessionID.data().session_time.toDate().toLocaleTimeString()
                var patientName = patient.data().name;
                var link =  sessionID.data().room_ID 

                var cell1 = row.insertCell(0); 
                var cell2 = row.insertCell(1); 
                var cell3 = row.insertCell(2); 
                var cell4 = row.insertCell(3); 
                var cell5 = row.insertCell(4); 
                cell1.innerHTML = date; 
                cell2.innerHTML = time;

                cell3.className = "nameToProfile"
                var nameButton = document.createElement("button")
                nameButton.innerHTML = "<button class='btn btn-sm btn-ghost'>" +patientName; 
                nameButton.onclick = () => {
                    this.$router.push({ name: 'PatientProfileCounsellor', params: { id: patient.id } }) 
                }
                cell3.appendChild(nameButton)

                console.log("room link is ", link);

                if (link == "") {
                    console.log("NO LINK FOR session with patient name: ", patientName);
                    cell4.innerHTML = "Link will be displayed when user starts the session.";
                } else {
                    console.log("has a room link, upcomingSession is " , upcomingSession);
                    var linkSession = document.createElement("button")
                    linkSession.id = "linkSession"
                    linkSession.innerHTML = "<button class='btn btn-link btn-sm'>Join Session Now!"
                    linkSession.onclick = () => {
                        this.$router.push({ name: 'DailyCounsellorView', params: { id: upcomingSession } }) 
                        // NOTE: This router link works, commented out bc DailyCounsellorView.vue not working properly yet
                    }
                    cell4.appendChild(linkSession)
                }

                cell5.innerHTML = "";


                var bu = document.createElement("button")
                bu.className = "bwt"
                bu.id = String(patientName)
                bu.innerHTML = "<button class='btn btn-xs btn-error'>Cancel<button>"
                bu.onclick = ()=>{
                    this.cancelSession(sessionID.id,patient.id,user)
                    //sessionID = doc name of session, patient.id = doc name of patient 
                }
                cell5.appendChild(bu)
                
                                
            }
                        //})
                    
                                

        },
    

        async cancelSession(session, patient, user) { // all uid
            var confirmDelete = confirm("Press 'OK' to proceed to cancel this appointment with Session ID of " + session);
            //alert("You are going to cancel this appointment with Session ID of " + session)
            if (confirmDelete) { //pressed OK
                //remove session from patient's and counsellor's upcoming appointments array
                await updateDoc(doc(db,"Counsellors",user), {upcoming_counsellor_sessions: arrayRemove(session)});
                await updateDoc(doc(db,"Patients",patient), {upcoming_user_sessions: arrayRemove(session)});
                // NO NEED TO add session back to available slot because if counsellor cancel it, prolly not free!
                // await updateDoc(doc(db,"Counsellors",user), {available_slots: arrayUnion(session)});

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

/* .nameToProfile {
    color:rgb(25, 69, 104);
    text-decoration: underline;
} */

</style>