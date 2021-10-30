<template>
    <div v-if="user">
        <v-date-picker v-model="date" :attributes="attributes" @dayclick="onDayClick"/>
        <div v-if="patient_upcoming.length != 0">
            <h3>Upcoming Appointments</h3>
            <div v-for="u in patient_upcoming" :key="u">
                <p>{{ u.date }} {{ u.time }}</p>
            </div>
        </div>
        <div v-if="avail.length != 0">
            <h3>Available Sessions</h3>
            <div v-for="a in avail" :key="a">
                {{ a.date }} {{ a.time }}
                <button v-on:click="book(this.counsellor_ID, a)">Book</button>
            </div>
            <br>
        </div>
        <div v-if="patient_upcoming.length == 0 && avail.length == 0">
            <h4>No session for selected day</h4>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from '../../firebase.js';
import { getFirestore } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore';
const db = getFirestore(firebaseApp);
export default {
    name:"CounsellorCalendar",
    data() {
        return {
        user:false,
        fbuser:"", // user UID
        user_type:"patient",
        counsellor_ID: this.$route.params.id, // counsellor UID
        display_avail: [],
        display_patient_upcoming: [],
        avail: [],
        patient_upcoming: [],
        date: new Date(),
        attributes: [],
        createSession: false
        };
    },

    mounted() {
        const auth = getAuth()
        onAuthStateChanged(auth, user => {
            if (user) {
                this.user = user;
                if (user.user_type == "counsellor") {
                    this.user_type = "counsellor";
                }
                // this.fbuser = user.email;
                this.fbuser = user.uid;
                // this.updateCurrentlyAvailable();
                // this.avgRating(this.fbuser);
                // this.mountedCheckCurrentlyAvailable();
                console.log("bottom of mounted()");
                // console.log("time is ", Timestamp.valueOf(Timestamp.now()))
            }
        })
        this.getAttributes()
    },

    methods: {
        async getAttributes() {
            //counsellor available sessions
            const docRef = doc(db, "Counsellors", this.counsellor_ID)
            const docSnap = await getDoc(docRef)
            let z = docSnap.data()
            z.available_slots.forEach(a => {
                //hide available slots in the past
                if (a.toDate() > new Date()) {
                    this.display_avail.push(a.toDate())
                }
            })

            //sessions booked by patient
            const docRef2 = doc(db, "Patients", this.fbuser)
            const docSnap2 = await getDoc(docRef2)
            let y = docSnap2.data()
            y.upcoming_user_sessions.forEach(u => {
                this.display_patient_upcoming.push(new Date(u.substring(28)))

            })
            console.log(docRef2)

            //green bar for counsellor avail
            this.attributes = [
            {
                bar: "green",
                dates: this.display_avail
            },
            {
                bar: "red",
                dates: this.display_patient_upcoming
            }
            ]
        },

        async onDayClick(day) {
            const docRef = doc(db, "Counsellors", this.counsellor_ID)
            const docSnap = await getDoc(docRef);
            let z = docSnap.data()
            var avail = z.available_slots
            this.avail.splice(0, avail.length)

            const docRef2 = doc(db, "Patients", this.fbuser)
            const docSnap2 = await getDoc(docRef2)
            let y = docSnap2.data()
            var patient_upcoming = y.upcoming_user_sessions
            this.patient_upcoming.splice(0, avail.length)

            patient_upcoming.forEach(async (u) => {
                
                const slotRef = doc(db, "Sessions", u)
                const slotSnap = await getDoc(slotRef)
                let slot = slotSnap.data().session_time
                let curr = new Date()
                let s = slot.toDate()
                
                if (s > curr) {
                    let s_date = s.toDateString()
                    let s_time = s.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
                    let s_gmtDate = new Date(s.setHours(s.getHours() + 8))
                    if (s_gmtDate.toISOString().substr(0,10) == day.id) {
                        //let s_originalDate = new Date(s_gmtDate.setHours(s_gmtDate.getHours() - 8 ))
                        this.patient_upcoming.push({
                            date: s_date,
                            time: s_time,
                            session: s
                        })
                    }
                }
            })
    
            avail.forEach(async (a) => {
                
                const slotRef2 = doc(db, "Sessions", this.counsellor_ID+a.toDate())
                const slotSnap2 = await getDoc(slotRef2)
                let slot = slotSnap2.data().session_time
                let curr = new Date()
                let s = slot.toDate()
                
                if (s > curr) {
                    let s_date = s.toDateString()
                    let s_time = s.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
                    let s_gmtDate = new Date(s.setHours(s.getHours() + 8))
                    if (s_gmtDate.toISOString().substr(0,10) == day.id) {
                        //let s_originalDate = new Date(s_gmtDate.setHours(s_gmtDate.getHours() - 8 ))
                        this.avail.push({
                            date: s_date,
                            time: s_time,
                            session: a.toDate()
                        })
                    }
                }
            })
        }, 
        async book(counsellor, item){

            const patientRef = doc(db, "Patients", this.fbuser)
            const patientSnap = await getDoc(patientRef)
            let y = patientSnap.data()
            let patient_upcoming = y.upcoming_user_sessions
            let same_day_appointment = false

            //patients are not allowed to book more than 1 appointment a day
            patient_upcoming.forEach( u => {
                if (u.substring(28,43) == item.session.toDateString()) {
                    same_day_appointment = true
                }
            })
            if (same_day_appointment) {
                alert("You have booked another appointment on this date. Please cancel before booking a different time.")
            }
            //patient can have max. 5 upcoming appointments
            else if (patient_upcoming.length == 5) {
                alert('You have booked a maximum of 5 sessions!')
            }
            else {
                //edit counsellor > remove from available_slots and add to upcoming_counsellor_sessions
                const counsellorRef = doc(db, "Counsellors", this.counsellor_ID)
                const counsellorSnap = await getDoc(counsellorRef)
                let z = counsellorSnap.data()

                //convert timestamps to strings for easy comparison
                let avail = z.available_slots
                let avail_string = []
                avail.forEach(a=> {
                    avail_string.push(a.toDate().toISOString())
                })

                //remove from available slots
                let idx = avail_string.indexOf(item.session.toISOString())
                avail.splice(idx, 1)
                let upcoming = z.upcoming_counsellor_sessions

                upcoming.push(this.counsellor_ID+item.session)
                await setDoc(counsellorRef, {upcoming_counsellor_sessions: upcoming, available_slots: avail}, {merge: true})
            
                //edit session > set user_ID
                await setDoc(doc(db, "Sessions", this.counsellor_ID+item.session), {user_ID: this.fbuser}, {merge: true})
                
                //edit patient > add to upcoming_user_sessions
                patient_upcoming.push(this.counsellor_ID+item.session)
                await setDoc(doc(db, "Patients", this.fbuser), {upcoming_user_sessions: patient_upcoming}, {merge: true})
                alert("New appointment booked for " + item.time + " " + item.date + "!")
            }
            
            location.reload()
        },
    }
}
</script>