<template>
    <div v-if="user">
        <v-calendar :attributes="attributes" @dayclick="onDayClick"/>
        <div v-if="avail.length != 0">
            <h3>Available Sessions</h3>
            <div v-for="item in avail" :key="item">
                {{ item.date }} {{ item.time }}
                <button v-on:click="book(this.counsellor_ID, item)">Book</button>
            </div>
        </div>
        <div v-else>
            <h4>No session for selected day(s)</h4>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from '../firebase.js';
import { getFirestore } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore';
const db = getFirestore(firebaseApp);

export default {
    name:"CounsellorCalendar",
    data() {
        return {
        user:false,
        fbuser:"",
        user_type:"patient",
        counsellor_ID: this.$route.params.id,
        days: [],
        upcoming: [],
        avail: [],
        booked: [],
        createSession: false,
        date: new Date()
        };
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            if (user) {
                this.user = user;
                if (user.user_type == "counsellor") {
                    this.user_type = "counsellor";
                }
                this.fbuser = user.email;
                this.getDetails(this.fbuser);
                // this.updateCurrentlyAvailable();
                // this.avgRating(this.fbuser);
                // this.mountedCheckCurrentlyAvailable();
                console.log("bottom of mounted()");
                // console.log("time is ", Timestamp.valueOf(Timestamp.now()))
            }
        })
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
            const docRef = doc(db, "Counsellors", this.counsellor_ID)
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
                            time: a_time,
                        })
                    }
                })

                avail.forEach(async (x) => {
                    const slotRef = doc(db, "Sessions", x)
                    const slotSnap = await getDoc(slotRef)
                    let slot = slotSnap.data().session_time
                    
                    let s = slot.toDate()
                    let s_date = s.toDateString()
                    let s_time = s.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
                    let s_gmtDate = new Date(s.setHours(s.getHours() + 8))

                    if (s_gmtDate.toISOString().substr(0,10) == day.id) {
                        let s_originalDate = new Date(s_gmtDate.setHours(s_gmtDate.getHours() - 8 ))
                        this.avail.push({
                            date: s_date,
                            time: s_time,
                            session: this.counsellor_ID+s_originalDate
                        })
                    }
                })


            }
        },

        async book(counsellor, item){
           //edit counsellor > remove from available_slots and add to upcoming_counsellor_sessions
            const counsellorRef = doc(db, "Counsellors", this.counsellor_ID)
            const counsellorSnap = await getDoc(counsellorRef)
            let z = counsellorSnap.data()

            var avail = z.available_slots
            var idx = avail.indexOf(item.session)
            avail.splice(idx, 1)
            var upcoming = z.upcoming_counsellor_sessions
            if (upcoming.length == 5) {
                alert('You have booked a maximum of 5 sessions!')
            }
            else {
                upcoming.push(item.session)
                await setDoc(counsellorRef, {upcoming_counsellor_sessions: upcoming, available_slots: avail}, {merge: true})
            
                //edit session > set user_email
                await setDoc(doc(db, "Sessions", item.session), {user_email: this.fbuser}, {merge: true})
                
                //edit patient > add to upcoming_user_sessions
                const patientRef = doc(db, "Patients", this.fbuser)
                const patientSnap = await getDoc(patientRef)
                let y = patientSnap.data()
                var patient_upcoming = y.upcoming_user_sessions
                patient_upcoming.push(item.session)
                await setDoc(doc(db, "Patients", this.fbuser), {upcoming_user_sessions: patient_upcoming}, {merge: true})

                alert("New appointment booked for " + item.time + " " + item.date + "!")
            }
            
            location.reload()
        },
    }
}
</script>