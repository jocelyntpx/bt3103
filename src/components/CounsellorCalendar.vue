<template>
    <div>
        <v-calendar :attributes="attributes" @dayclick="onDayClick"/>
        <div v-if="upcoming.length != 0">
            <h3>Upcoming Sessions</h3>
            <div v-for="item in upcoming" :key="item">
                {{ item.date }} {{ item.time }}
            </div>
        </div>
        <div v-if="avail.length != 0">
            <h3>Available Sessions</h3>
            <div v-for="item in avail" :key="item">
                {{ item.date }} {{ item.time }}
            </div>
        </div>
        <div v-if="upcoming.length == 0 && avail.length == 0 && days.length!=0">
            <h4>No session for selected day(s)</h4>
        </div>
        <br><br>
        <button><router-link to="/addNewSession">Add New Session</router-link></button>
    </div>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from 'firebase/firestore'
import { doc, getDoc } from 'firebase/firestore';
const db = getFirestore(firebaseApp);

export default {
    name:"CounsellorCalendar",
    data() {
        return {
        days: [],
        upcoming: [],
        avail: []
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
        const docRef = doc(db, "Counsellors", "john@gmail.com")
        const docSnap = await getDoc(docRef);

        let z = docSnap.data()
        var avail = z.available_slots
        var upcoming = z.upcoming_counsellor_sessions

        if (idx >= 0) {
            this.days.splice(idx, 1)
            this.upcoming.splice(idx, upcoming.length)
            this.avail.splice(idx, avail.length)
        } else {
            this.days.push({
            id: day.id,
            date: day.date,
            })

            upcoming.forEach(async (s) => {
                const sessionRef = doc(db, "Sessions", s)
                const sessionSnap = await getDoc(sessionRef)
                let session = sessionSnap.data().session_time

                let a = session.toDate()
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

            avail.forEach((slot) => {
                let s = slot.toDate()
                let s_date = s.toDateString()
                let s_time = s.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
                let s_gmtDate = new Date(s.setHours(s.getHours() + 8))

                if (s_gmtDate.toISOString().substr(0,10) == day.id) {
                    this.avail.push({
                        date: s_date,
                        time: s_time
                    })
                }
            })
        }
        }
    }
}
</script>