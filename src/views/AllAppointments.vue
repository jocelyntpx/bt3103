
<template>
<br><br><br><br>
    <div id="bgBlock">
        <h3>Upcoming Appointments</h3>
        <table id="table1">
            <tr id=header>
            <th>Date</th> 
            <th>Counsellor</th>
            <th>Link</th>
            <th></th> 
            </tr>
             <tr>
                <td>10/10/21</td>
                <td>Mdm Lim</td>
                <td>Time for your session. Create your link now!</td>
                <td>X</td>
            </tr>
            <tr>
                <td>11/10/21</td>
                <td>Mr Tan</td>
                <td>Session link can be created when it is time for your session.</td>
                <td>X</td>
            </tr>
        </table>
        <br><br><br>
        <h3>Past Appointments</h3>
        <table id="table2">
            <tr id=header>
            <th>Date</th> 
            <th>Counsellor</th>
            <th>Link</th>
            <th>Rating</th> 
            </tr>
             <tr>
                <td>10/10/21</td>
                <td>Mdm Lim</td>
                <td>Link expired</td>
                <td>Rate session</td>
            </tr>
            <tr>
                <td>11/10/21</td>
                <td>Mr Tan</td>
                <td>Link expired</td>
                <td>★★★☆☆</td>
            </tr>
        </table>
        <div style="text-align:center;" v-if="user">
            <div><h3><strong>This is the appointment page</strong></h3></div>
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
    name:"MyPatients",
}
//havent changed this yet to fit Users
// export default {
//     mounted(){
//         async function display() {
//             let z = await getDocs(collection(db,"User_Email"))
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
#bgBlock {
  border-radius: 35px;
  background: #B9D9EB;
  padding: 20px;
  width: 80%;
  height: 450px;
  margin:auto;
}


#table1, #table2{
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
