<template>
    <button id="btn" @click="signOut()" v-if="user">Logout</button>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc, updateDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
    name:"Logout",

    data() {
        return{
            user:false,
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            }
        })
    },

    methods: {
        async signOut() {
            const auth = getAuth();
            const user = auth.currentUser;

            let id = user.uid
            const docRef = doc(db, "Counsellors", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) { // Turns off Availability toggle of counsellor
                if (docSnap.data().currently_available) { 
                    await updateDoc(docRef, {currently_available: false})
                }
            } 

            signOut(auth, user)
            this.$router.push({name:'Home'})
        }
    }
}
</script>

<style scoped>
#btn{
    text-aligned: center;
    margin: auto;
    font-weight: bold;
    color: lightslategray;
}

</style>