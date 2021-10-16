<template>
    <div>
        <v-date-picker v-model="date" mode="dateTime"/>
        <br><br>
        <button v-on:click="create()">Create Session</button>
        <button><router-link to="/counsellorProfile">Back to appointments calendar</router-link></button>
    </div>
</template>

<script>
import firebaseApp from '../firebase.js'
import { getFirestore } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore'
const db = getFirestore(firebaseApp)

export default {
    name:"CreateSession",
    data() {
    return {
        date: new Date(),
        timezone: '',
    }
    },
    methods: {
        async create(){
            let docRef = doc(db, 'Counsellors', 'john@gmail.com')
            let docSnap = await getDoc(docRef)
            let slots = docSnap.data().available_slots
            slots.push(this.date)
            setDoc(docRef, {available_slots: slots}, {merge: true})
            alert("New session created for " + this.date + " !")
        }
    }
}
</script>
