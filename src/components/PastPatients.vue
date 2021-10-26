<template>
    <div class = "my_patients">
            <a v-for= "patient in AllMyPatients" v-bind:key="patient.index">
                <div id="patient_box">
                    <!-- <h3>{{patient.data().name}}</h3> -->
                    <h3><router-link :to="{ name: 'PatientProfileCounsellor', params: { id: patient.id }}">{{patient.data().name}}</router-link></h3>
                </div>
            </a>
    </div>


</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore"
import { getDoc, doc} from "firebase/firestore";
const db = getFirestore(firebaseApp);
//import NavBarCounsellor from "@/components/NavBarCounsellor.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    // components: {NavBarCounsellor},   
    name:"PastPatients",

    data(){
        return{
            user:false,
            AllMyPatients:[],
            counsellorUser:"",
            count:"",
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        })
        this.counsellorUser = auth.currentUser.email;
        this.displayMyPatients(this.counsellorUser);
    },

    methods: {
        async displayMyPatients(user) {
            let docRef = doc(db, "Counsellors", String(user));
            let counsellorDoc = await getDoc(docRef);
            let myPatients = counsellorDoc.data().my_patients

           //console.log(counsellorDoc.data());
            myPatients.forEach(async (patient_email)=> {
                let patientDocRef = doc(db, "Patients", patient_email);
                let patient = await getDoc(patientDocRef);
                //console.log(patient);
                
                this.AllMyPatients.push(patient)
            })

        }
    }
}


</script>

<style>
#patient_box{
    display: inline-block;
    margin: 10px;
    height: 20px;
    width: 15%;
    background-color: rgb(224, 236, 247);
    border-radius: 35px;
    border: 30px solid rgb(224, 236, 247);
}
#patientName{
    color: black;
}



</style>