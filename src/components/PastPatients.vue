<template>
        <div id="patientNames">
            <h3 id=name1> Benjamin Soh </h3>
            <h3 id=name2><router-link to="/patientRecords">Rose Lee</router-link></h3> 
            <!-- <h3 id=name2> Rose Lee </h3> -->
            <h3 id=name3> Eunice Tan Bla Bla </h3>
        </div>
</template>

<script>
// import firebaseApp from '../firebase.js';
// import { getFirestore } from "firebase/firestore"
// import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
// const db = getFirestore(firebaseApp);
// import NavBarCounsellor from "@/components/NavBarCounsellor.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    // components: {NavBarCounsellor},   
    name:"PastPatients",

    data(){
        return{
            user:false,
        }
    },

    mounted() {
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

//                 var date = yy.getCounsellorPastSessions.getSessionTime
//                 var patient  = yy.getCounsellorPastSessions.getUserEmail.getUserFirstName + " " + yy.getCounsellorUpcomingSessions.getUserEmail.getUserLastName
//                 var notes = yy.getCounsellorPastSessions.getSessionNotes
            
//                 var cell1 = row.insertCell(0); var cell2 = row.insertCell(1); var cell3 = row.insertCell(2); 
                
//                 cell1.innerHTML = date; cell2.innerHTML = patient; cell3.innerHTML = notes; 

//             })
//         }
//         display()

//     }
// }

</script>

<style>
#name1, #name2, #name3{
    display: inline-block;
    margin: 10px;
    height: 30px;
    width: 18%;
    background-color: rgb(224, 236, 247);
    border-radius: 35px;
    border: 30px solid rgb(224, 236, 247) ;

}


</style>