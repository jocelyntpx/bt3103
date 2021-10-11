<template>
    <div id=upcoming>
        <router-link to="/myPatients">Upcoming Patients</router-link> | 
        <router-link to="/myPastPatients">Past Patients</router-link>
    </div>
    <!-- <SearchBar hint="Search hint" :text="searchPhrase" @textChange="onTextChanged" @submit="onSubmit" /> -->
    <!-- <SearchBar v-model="searchQuery" /> -->
    <h4>Past patients are patients you have already had an appointment with. </h4>

    <div id="bgBlock">
        <input id=searchPatient type="text"  v-model="search" placeholder="Search for a patient"/>
        <br><br><br><br>

        <div id="patientNames">
            <h3 id=name1> Benjamin Soh </h3>
            <h3 id=name2> Rose Lee </h3>
            <h3 id=name3> Eunice Tan Bla Bla </h3>
            <!-- will be able to click onto name and get redirected to the profile -->
        </div>
        <!-- <table id="table">
            <tr id=header>
            <th>Date</th> 
            <th>Patient</th>
            <th>My Notes</th>
            </tr>
             <tr>
                <td>9/10/21</td>
                <td>Benjamin Soh</td>
                <td>He faced difficulty with...</td>
            </tr>
            <tr>
                <td>9/10/21</td>
                <td>Rose Lee</td>
                <td>Rose was angry because...</td>
            </tr>
            <tr>
                <td>9/10/21</td>
                <td>Eunice Tan</td>
                <td>Eunice told her that...</td>
            </tr>
        </table> -->
        <div style="text-align:center;" v-if="user">
            <div><h3><strong>This is the my patients page</strong></h3></div>
            <Logout/>
        </div>
    </div>
</template>

<script>
// import firebaseApp from '../firebase.js';
// import { getFirestore } from "firebase/firestore"
// import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
// const db = getFirestore(firebaseApp);

export default {
    name:"MyPastPatients",
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
#bgBlock {
  border-radius: 35px;
  background: #B9D9EB;
  padding: 20px;
  width: 80%;
  height: 450px;
  margin:auto;
}

h4{
    color: grey;
}

#table{
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

#upcoming {
    font-size:25px ;
}

#upcoming a{
  font-weight: bold;
  color:lightslategray;
}

#upcoming a.router-link-exact-active {
  color:black;
}

#searchPatient {
    float: right;
}


  /* button.bwt{
     color:white;
     background-color: rgb(255, 94, 0);
 }

 .bwt:hover{
     box-shadow: 3px 3px purple;
     border-radius: 1px;
     outline: purple;
 }  */

</style>