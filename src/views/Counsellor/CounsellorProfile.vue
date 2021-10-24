<template>
    <!-- <h1> id is {{this.counsellor_ID}} </h1> -->
    <div v-if="fbuser != ''">
        <AlertCounsellorSession :counsellorEmail=this.fbuser />
    </div>

    <div v-if="user"> 
        <br><br>
        <div v-if ="this.user_type == 'counsellor'">
            <NavBarCounsellor/>
        </div>
        <div v-else>
            <NavBarPatient/>
        </div>
        <div style="text-align:center;">
            <h1>Counsellor Profile</h1>
            <div v-if ="this.user_type =='counsellor'">
                <!-- Need a toggle button for currently_available -->
                <div class = "toggle">
                    <button id = "toggleButton" @click="toggleCurrentlyAvailable">Click to toggle current availability on/off</button>
                    <br><br>
                    <h3> You are 
                        <strong v-if="this.currentlyAvailable"> available to take a session immediately.</strong> 
                        <strong v-else> NOT available to take a spontaneous session. </strong> 
                    </h3>
                </div>
            </div>


                <div id="bgBlock"> 
                    <div id="col-1">
                        <div id="counsellorDetails"> 
                        
                        <div v-if="this.user_type=='counsellor'">
                            <label for="formFile">Upload Image:</label>
                            
                            <input class="form-control" ref="fileInput" type="file" @input="preview">
                            
                            <div class="imagePreviewWrapper" :style="{ 'background-image': `url(${previewImage})` }" @click="selectImage"></div>
                            
                            <div>
                                <button @click="uploadImage(this.user)">upload</button>
                            </div>
                        </div>

                        <!-- <div>
                            <div class="text-center">
                                <button @click="create">upload</button>
                            </div>
                        </div> -->
                            <div v-if="this.profile_pic">
                                <img id="profilepic" :src='this.profile_pic'>
                            </div>

                            <!-- <div class="container p-5">
                                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Edit Profile Picture
                                </button>

                                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title text-danger" id="exampleModalLabel">Edit Profile Picture</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>

                                            <div class="modal-body">
                                                <div class="mb-3">
                                                    <label for="exampleInputEmail1" class="form-label">Email address</label>
                                                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                                                    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="exampleInputPassword1" class="form-label">Password</label>
                                                    <input type="password" class="form-control" id="exampleInputPassword1">
                                                </div>
                                                <div class="mb-3">
                                                <label for="formFile">Upload Image:</label>
                                                <input class="form-control" ref="fileInput" type="file" @input="preview">
                                                <br>
                                                <button @click="uploadImage(this.user)" class="btn btn-primary">Upload</button>
                                                <div class="imagePreviewWrapper" :style="{ 'background-image': `url(${previewImage})` }" @click="selectImage"></div>
                                                </div>
                                            </div>

                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-warning" data-bs-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> -->

                            <p> Name: <strong>{{this.name}}</strong><br>
                            Email: <strong>{{this.email}}</strong><br>
                            Gender: <strong>{{this.gender}}</strong><br>
                            Specialisations: <strong>{{this.specialisations_formatted}}</strong><br>
                            Rating: <strong>{{this.avgRatings}}</strong><br></p>
                        </div>

                        <div id = "reviewsTab"> 
                            <router-link :to="{ name: 'CounsellorReviews', params: { id: this.counsellor_ID }}">View Patients' Reviews</router-link>
                        </div>
                    </div> 
                    <div id="col-2">
                        <br>
                        <h3>Select date to view upcoming appointments</h3>
                        <CounsellorCalendar/>
                    </div>
                </div>
        </div>
    </div>
</template>

<script scoped>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarCounsellor from "@/components/NavBarCounsellor.vue"
import NavBarPatient from '@/components/NavBarPatient.vue'
import CounsellorCalendar from "@/components/CounsellorCalendar.vue"
import AlertCounsellorSession from '@/components/AlertCounsellorSession.vue'

import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export default {
    components: {NavBarCounsellor, NavBarPatient, CounsellorCalendar,AlertCounsellorSession},
    name:"CounsellorProfile" ,

    data(){
        return{
            user:false,
            email:"",
            user_type:"patient",
            counsellor_ID: this.$route.params.id,
            fbuser:"",
            currentlyAvailable:null,
            name:"",
            gender:"",
            ratings:[],
            avgRatings:"",
            specialisations_formatted:"",
            previewImage: null,
            profile_pic: "",
            imageData:null,
        }
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

    methods: {
        async getDetails(user) {
            let docRef = doc(db, "Counsellors", String(user));
            let counsellorDoc = await getDoc(docRef);      
            this.name = counsellorDoc.data().name;
            this.gender = counsellorDoc.data().gender;
            this.specialisations = counsellorDoc.data().counsellor_specialisations;
            this.ratings = counsellorDoc.data().past_ratings;  
            this.profile_pic = counsellorDoc.data().profile_pic; 
            this.email = counsellorDoc.data().email; 
            
            this.currentlyAvailable = counsellorDoc.data().currently_available;
            this.updateCurrentlyAvailable();

            var avg = 0
            if (this.ratings.length>0) {
                var numRatings = this.ratings.length
                var sum = 0
                this.ratings.forEach(item => {
                sum = sum + item
                })
                avg = sum / numRatings
            }
            if (avg == 5) {
                this.avgRatings = "★★★★★"
            } else if (avg >= 4) {
                this.avgRatings = "★★★★☆"
            } else if (avg >= 3) {
                this.avgRatings = "★★★☆☆"
            } else if (avg >= 2) {
                this.avgRatings = "★★☆☆☆"
            } else if (avg >= 1) {
                this.avgRatings = "★☆☆☆☆"
            } else {
                this.avgRatings = "☆☆☆☆☆" 
            } 

            var stringOutput = ""
            if (this.specialisations.length > 0) {
                this.specialisations.forEach(item => {
                stringOutput = stringOutput + ", " + item
                })
            }
            this.specialisations_formatted = stringOutput.slice(2)
        },

        async updateCurrentlyAvailable() {
            const counsellorDocRef = doc(db,"Counsellors",this.fbuser);
            
            //  if counsellor is currently available, check if have upcoming session within <= 1hour, if so, toggle OFF.
            if (this.currentlyAvailable) {
                var upcomingSession = this.checkExistenceUpcomingSession();
                console.log("in updateCurrentlyAvailable, upcomingSession: ", upcomingSession)
                if (upcomingSession) {
                    alert("You have an upcoming session in less than an hour - Setting toggle for 'Currently Available' as Off");
                    this.currentlyAvailable = false;
                    await updateDoc(counsellorDocRef, {currently_available: false})
                }
            }
        },
        async toggleCurrentlyAvailable() {
            console.log("in toggleCurrentlyAvailable()")

            let counsellorDocRef = doc(db, "Counsellors", this.fbuser)
            console.log("current availability: " , this.currentlyAvailable)

            if (!this.currentlyAvailable) {
                // counsellor can only toggle it ON if he does not have an upcoming session < 1 hour from now.
                var upcomingSession = await this.checkExistenceUpcomingSession(); 
                console.log("in toggleCurrentlyAvailable, upcomingSession is ", upcomingSession)
                if (upcomingSession) {
                    alert("Unable to turn on toggle - you have an upcoming session in less than an hour.");
                } else {
                    this.currentlyAvailable = true;
                    await updateDoc(counsellorDocRef, {currently_available: true})
                }
            } else {
                this.currentlyAvailable = false;
                await updateDoc(counsellorDocRef, {currently_available: false})
            }
        },

        async checkExistenceUpcomingSession() { 
            console.log("in checkExistenceUpcomingSession()");
            const counsellorDocRef = doc(db, "Counsellors", this.fbuser)
            const counsellorDocSnap = await getDoc(counsellorDocRef)
            const upcomingSessions = counsellorDocSnap.data().upcoming_counsellor_sessions

            for (const session of upcomingSessions) {
                let sessionDocRef = doc(db, "Sessions",session)
                let sessionDocSnap = await getDoc(sessionDocRef)
                let sessionTime = sessionDocSnap.data().session_time.toDate()
                let timeNow = Timestamp.now().toDate()

                if (sessionTime - timeNow <= 60 * 60 * 1000 ) { // the difference is in terms of milliseconds.
                    console.log("existence of upcoming session");
                    console.log("SESSION : ", sessionTime , "NOW : ", timeNow)
                    return true;
                }
            }
            console.log("no upcoming session - returning false")
            return false;
        },

        selectImage() {
            this.$refs.fileInput.click()
        },

        preview() {
            console.log("preview")
            let input = this.$refs.fileInput
            let file = input.files
            this.imageData = event.target.files[0]
            console.log("preview3")
            if (file && file[0]) {
                console.log("preview4")
                let reader = new FileReader
                reader.onload = e => {
                    this.previewImage = e.target.result
                    console.log("preview5")
            }
            console.log("preview6")
            reader.readAsDataURL(file[0])
            console.log("preview7")
            this.$emit('input', file[0])
            console.log("preview done")
            }
        },

        async uploadImage(user) {
            console.log("upload image")
            const picRef = ref(storage, 'counsellorProfilePic');
            let storageRef=ref(picRef, `${this.user.email}`);

            if (this.imageData!=null) {
                let snapshot = await uploadBytes(storageRef, this.imageData)
                this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100
                
                let url = await getDownloadURL(storageRef)
                const docRef = doc(db, "Counsellors", user.email);
                updateDoc(docRef, {
                    "profile_pic": url.toString()
                }).then (
                    alert("Profile picture uploaded successfully! Please wait a few seconds for the page to reload."),
                    await new Promise((resolve) => setTimeout(resolve,800)),
                    location.reload(),
                ).catch(e => {
                    console.log(e)
                })
            } else {
                alert("Please select an image.")
            }
            
        },
    }
}
</script>

<style scoped>
.imagePreviewWrapper {
    background-repeat: no-repeat;
    width: 230px;
    height: 230px;
    display: block;
    cursor: pointer;
    margin: 0 auto 30px;
    background-size: contain;
    background-position: center center;
}
#profilepic {
    border-radius: 50%;
    margin-top: 10px;
    width: 230px;
    height: 230px;
    margin-bottom: -20px;
}
#bgBlock {
    display:flex;
    border-style:solid;
    border-color:#B9D9EB;
    border-width: 2px;
    background: transparent;
    border-radius: 20px;
    padding: 20px;
    width: 80%;
    height: auto;
    margin: auto;
}

#col-1 {
  background-color: transparent;
  flex: 1;
  text-align: left;
}
#col-2 {
  background-color:rgb(224, 236, 247);
  flex: 1;
}

</style>