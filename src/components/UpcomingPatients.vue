<template>
            <table class="table">
                <tr class=header>
                <th>Date</th> 
                <th>Patient</th>
                <th>Link</th>
                <th></th> 
                </tr>
                <tr>
                    <td>10/10/21</td>
                    <td>Benjamin Soh</td>
                    <td>Displayed when user starts session</td>
                    <td>X</td>
                </tr>
                <tr>
                    <td>10/10/21</td>
                    <td><router-link to="/patientRecords">Rose Lee</router-link></td> 
                    <!-- Later on would have to pass props via router?? not too sure -->
                    <td>Displayed when user starts session</td>
                    <td>X</td>
                </tr>
                <tr>
                    <td>10/10/21</td>
                    <td>Eunice Tan</td>
                    <td>Displayed when user starts session</td>
                    <td>X</td>
                </tr>
            </table>
</template>

<script>
// import firebaseApp from '../firebase.js';
// import { getFirestore } from "firebase/firestore"
// import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
// const db = getFirestore(firebaseApp);
// import NavBarCounsellor from "@/components/NavBarCounsellor.vue" since nvr use
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    // components: {NavBarCounsellor},    
    name:"UpcomingPatients",

    data(){
        return{
            user:false,
        }
    },

    mounted() {
        // console.log("UpcomingPatients.vue");
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        })
    },
}
// export default {
//     mounted(){
//         async function display() {
//             let z = await getDocs(collection(db,"Counsellor_Email"))
//             let ind = 1
//             var tp = 0

//             z.forEach((docs) => {
//                 let yy = docs.data()
//                 var table = document.getElementById("table")
//                 var row = table.insertRow(ind)

//                 var date = yy.getCounsellorUpcomingSessions.getSessionTime
//                 var patient  = yy.getCounsellorUpcomingSessions.getUserEmail.getUserFirstName + " " + yy.getCounsellorUpcomingSessions.getUserEmail.getUserLastName
//                 //var link = yy.getCounsellorUpcomingSessions.getLink only if user starts, else "Displayed when user starts session"
            
//                 var cell1 = row.insertCell(0); var cell2 = row.insertCell(1); var cell3 = row.insertCell(2); 
//                 var cell4 = row.insertCell(3); 
                

//                 cell1.innerHTML = date; cell2.innerHTML = patient; cell3.innerHTML = "Displayed when user starts session"; cell4.innerHTML = 0;

//                 var bu = document.createElement("button")
//                 bu.className = "bwt"
//                 bu.id = String(coin)
//                 bu.innerHTML = "X"
//                 bu.onclick = function(){
//                     cancelSession(yy.getCounsellorUpcomingSessions, False)
//                 }
//                 cell4.appendChild(bu)

//             })
//         }
//         display()

//         async function cancelSession(Session_ID, Boolean) {
//             var x = yy.getCounsellorUpcomingSessions
//             alert("You are going to cancel this appointment." + x)
//             await deleteDoc(doc(db,"Counsellor_Email",x))
//             console.log("Document successfully deleted!", x);
//             let tb = document.getElementById("table")
//             while (tb.rows.length > 1){
//                 tb.deleteRow(1)
//             }
//             display()
//         }

//     }
// }

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

</style>