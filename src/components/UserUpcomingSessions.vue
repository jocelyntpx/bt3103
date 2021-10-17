<template>
  <!-- This component templates the user's upcoming sessions (seen in Patients records, User's profile page ) -->    
      <div>
        <h3>Upcoming Appointments</h3>
        <table id="table2">
            <tr id="header">
            <th>Date</th> 
            <th>Counsellor</th>
            <th>Link</th>
            <th></th> 
            </tr>
            <tr>
                <td>10/10/21</td>
                <td>John Tan</td>
                <td>Link not yet created.</td>
                <td>X</td>
            </tr>
            <tr>
                <td>11/10/21</td>
                <td>Mr Tan</td>
                <td>NA</td>
                <td></td>
            </tr>
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