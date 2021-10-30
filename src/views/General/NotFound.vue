<template>
    <br><br>
    <div v-if="user">
        <div v-if = (this.counsellor)>
            <NavBarCounsellor/>
        </div>
        <div v-else>
            <NavBarPatient/>
        </div>
    </div>
    <div v-else>
        <NavBarGeneral/>
    </div>
    <br>

    <div style="text-align:center;">
        <h3>Page Not Found!!</h3>
        <h4>Please click on the above available options in the navigation bar.</h4>
        <br> 
    </div>
</template>

<script>
import NavBarPatient from '@/components/Patient/NavBarPatient.vue'
import NavBarCounsellor from '@/components/Counsellor/NavBarCounsellor.vue'
import NavBarGeneral from '@/components/General/NavBarGeneral.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";


import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
    name:"NotFound",

    components:{
        NavBarPatient,
        NavBarCounsellor,
        NavBarGeneral,
    },

    data() {
        return {
            user:false,
            counsellor: false,
        }     
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, async user => {
            if (user) {
                this.user = user;
                this.fbuser = user.uid;

            this.check = await this.isPatient(auth, this.fbuser);
            }
        })
    },

    methods: {
        async isPatient(auth, user) {
            let docRef = doc(db, "Counsellors", String(user));
            let counsellorDoc = await getDoc(docRef);
                
            if (counsellorDoc.exists()) {
                console.log('Is counsellor!');
                this.counsellor = true;
                return false
            } else {
                console.log('Is patient!');
                this.counsellor = false;
                return true
            }
        },
    }    
}
</script>
