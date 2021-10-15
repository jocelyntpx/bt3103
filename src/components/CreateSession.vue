<template>
    <v-date-picker v-model="date" mode="dateTime"/>
    <br><br>
    <button v-on:click="create()">Create Session</button>
    <button><router-link to="/counsellorProfile">Back to appointments calendar</router-link></button>
</template>

<script>
import firebaseApp from '../firebase.js'
import { getFirestore } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore'
const db = getFirestore(firebaseApp)

export default {
    name:"AddNewSession",
    data() {
    return {
        date: new Date(),
        timezone: '',
    }
    },
    methods: {
        async create(){
            //replace 'stgoR2Rpq16f4KH0uOk2' with counsellor id
            let docRef = doc(db, 'Counsellors', 'john@gmail.com')
            let docSnap = await getDoc(docRef)
            let sessions = docSnap.data().upcoming_counsellor_sessions
            sessions.push(this.date)
            setDoc(docRef, {upcoming_counsellor_sessions: sessions}, {merge: true})
            alert("New session created for " + this.date + " !")
        }
    }
}
</script>
