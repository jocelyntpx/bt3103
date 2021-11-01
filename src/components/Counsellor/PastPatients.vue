<template>
<div class="flex space-x-4 space-y-4">
    <div class = "my_patients">
        <div class="grid grid-flow-row grid-cols-3 gap-4">
            <a v-for= "patient in allMyPatients" v-bind:key="patient.index">
                <div class="card text-center shadow-2xl lg:card-side bg-accent text-accent-content">
                <div class="card-body">
                    <p class="text-xl font-semibold">{{patient.data().name}}</p> 
                    <div class="justify-end card-actions">
                    <button class="btn btn-accent" @click="this.$router.push({name: 'PatientProfileCounsellor', params: { id: patient.id }})">
                            View Profile                         
                    </button>
                    </div>
                </div>
                </div> 

                <!-- <div id="patient_box">
                    <h3><router-link :to="{ name: 'PatientProfileCounsellor', params: { id: patient.id }}">{{patient.data().name}}</router-link></h3>
                </div> -->
            </a>
        </div>
    </div>

</div>
</template>

<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore"
import { getDoc, doc} from "firebase/firestore";
const db = getFirestore(firebaseApp);
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {  
    name:"PastPatients",
    props: {
        search:String
    },

    data(){
        return{
            user:false,
            allMyPatients:[],
            counsellorUser:"", // counsellor's UID
            count:"",
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        })
        this.counsellorUser = auth.currentUser.uid;
        this.displayMyPatients(this.counsellorUser);
    },

    methods: {
        async displayMyPatients(user) {
            console.log("this.search: ",this.search)
            let docRef = doc(db, "Counsellors", String(user));
            let counsellorDoc = await getDoc(docRef);
            let myPatients = counsellorDoc.data().my_patients // array of uid

           //console.log(counsellorDoc.data());

            for (const patient_ID of myPatients) {
                let patientDocRef = doc(db, "Patients", patient_ID);
                let patient = await getDoc(patientDocRef);
                //console.log(patient);
                
                this.allMyPatients.push(patient)
            }

            // i rly dk why this code doesnt work when i implement search... replaced it w the above
            // myPatients.forEach(async (patient_ID)=> {
            //     let patientDocRef = doc(db, "Patients", patient_ID);
            //     let patient = await getDoc(patientDocRef);
            //     //console.log(patient);
                
            //     this.allMyPatients.push(patient)
            // })
            console.log(this.allMyPatients[0].data().name)
            // search functionality 
            this.allMyPatients = this.allMyPatients.filter(patient => {
                return patient.data().name.toLowerCase().includes(this.search.toLowerCase())
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