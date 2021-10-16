<template>
    <v-calendar :attributes="attributes" @dayclick="onDayClick"/>
    <div v-if="upcoming.length != 0">
        <h3>Upcoming Sessions</h3>
        <div v-for="item in upcoming" :key="item">
            {{ item.date }} {{ item.time }}
        </div>
    </div>
    <div v-if="upcoming.length == 0 && days.length!=0">
        <h4>No upcoming session for selected day(s)</h4>
        <button><router-link to="/findCounsellor">Book appointment</router-link></button>
    </div>
</template>

<script>
import firebaseApp from '../firebase.js'
import { getFirestore } from 'firebase/firestore'
import { doc, getDoc } from 'firebase/firestore'
const db = getFirestore(firebaseApp)

export default {
    name:"PatientCalendar",
    data() {
        return {
        days: [],
        upcoming: []
        };
    },
    computed: {
        dates() {
        return this.days.map(day => day.date);
        },
        attributes() {
        return this.dates.map(date => ({
            highlight: true,
            dates: date,
        }));
        },
    },
    methods: {
        async onDayClick(day) {
        const idx = this.days.findIndex(d => d.id === day.id)
        
        const docRef = doc(db, "Patients", "Rose")
        const docSnap = await getDoc(docRef);
        let z = docSnap.data()
        var upcoming = z.upcoming_user_sessions

        if (idx >= 0) {
            this.days.splice(idx, 1)
            this.upcoming.splice(idx, upcoming.length)
        } else {
            this.days.push({
            id: day.id,
            date: day.date,
            })

            upcoming.forEach((appointment) => {
                let a = appointment.toDate()
                let a_date = a.toDateString()
                let a_time = a.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
                let a_gmtDate = new Date(a.setHours(a.getHours() + 8))

                if (a_gmtDate.toISOString().substr(0,10) == day.id) {
                    this.upcoming.push({
                        date: a_date,
                        time: a_time
                    })
                }
            })            
        }
        }
    }
}
</script>