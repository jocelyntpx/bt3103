<template>
    <div v-if="user">
        <div v-if="createSession == true">
            <v-date-picker v-model="date" mode="dateTime"/>
            <br><br>
            <button v-on:click="create()">Create Session</button>
            <button v-on:click="back()">Back to appointments calendar</button>
        </div>
        <div v-else>
            <v-date-picker v-model="date" :attributes="attributes" @dayclick="onDayClick"/>
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
            <div v-if="upcoming.length == 0 && avail.length == 0">
                <h4>No session for selected day(s)</h4>
            </div>
            <br><br>
            <button v-on:click="createSession = true">Add New Session</button>
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
        // fbuser:"",
        user_type:"patient",
        counsellor_ID: this.$route.params.id, // UID
        display_avail: [],
        display_upcoming: [],
        upcoming: [],
        avail: [],
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
                // this.getDetails(this.fbuser);
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
            const docRef = doc(db, "Counsellors", this.counsellor_ID)
            const docSnap = await getDoc(docRef)
            let z = docSnap.data()
            //counsellor available sessions
            z.available_slots.forEach(a => {
                this.display_avail.push(a.toDate())
            })
            //counsellor upcoming sessions
            z.upcoming_counsellor_sessions.forEach(u => {
                this.display_upcoming.push(new Date(u.substring(28)))
            })
            //green bar for avail, red bar for upcoming
            this.attributes = [
            {
                bar: "green",
                dates: this.display_avail
            },
            {
                bar:"red",
                dates: this.display_upcoming
            }
            ]
        },
        async onDayClick(day) {
            const docRef = doc(db, "Counsellors", this.counsellor_ID)
            const docSnap = await getDoc(docRef);
            let z = docSnap.data()
            let avail = z.available_slots
            let upcoming = z.upcoming_counsellor_sessions

            this.avail.splice(0, avail.length)
            this.upcoming.splice(0, upcoming.length)

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
                const slotRef = doc(db, "Sessions", this.counsellor_ID+x.toDate())
                const slotSnap = await getDoc(slotRef)
                console.log(slotSnap)
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
        },
        async create(){
           
            //edit counsellor > add to available_slots
            const docRef = doc(db, "Counsellors", this.counsellor_ID)
            const docSnap = await getDoc(docRef)
            let z = docSnap.data()
            var avail = z.available_slots
            if (this.date < new Date()) {
                alert("Session cannot be created in the past")
            } else {
                avail.push(this.date)
                await setDoc(docRef, {available_slots: avail}, {merge: true})

                //create new session
                await setDoc(doc(db, "Sessions", this.counsellor_ID+this.date), {
                    counsellor_ID: this.counsellor_ID,
                    rating: null,
                    room_ID: "",
                    session_notes: "",
                    session_time: this.date,
                    user_ID: ""
                });
                alert("New session created for " + this.date + " !")
            }
        },
        async back() {
            this.createSession = false
            location.reload()
        }
    }
}
</script>