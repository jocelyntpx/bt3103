<template>
    <!-- <h1> id is {{this.counsellor_ID}} </h1> -->
    <div v-if="user"> 
        <br><br>
        <NavBarCounsellor/>
        <div style="text-align:center;">
            <h1>Counsellor Profile</h1>

            <!-- Need a toggle button for currently_available -->
            <div class = "toggle">
                <button id = "toggleButton" @click="toggleCurrentlyAvailable">Click to toggle current availability on/off</button>
                <h3> You are 
                    <strong v-if="this.currentlyAvailable"> available to take a session immediately.</strong> 
                    <strong v-else> NOT available to take a spontaneous session. </strong> 
                </h3>
            </div>


            <div id="bgBlock"> 
                <div id="col-1">
                    <div id="counsellorDetails"> 

                     <div class="App container mt-5">
     
                    <div class="mb-3">
                    <label for="formFile" class="form-label">Upload Image:</label>
                    
                    <input class="form-control" ref="fileInput" type="file" @input="preview">
                    </div>
                    <div class="imagePreviewWrapper" :style="{ 'background-image': `url(${previewImage})` }" @click="selectImage"></div>
                    
                    <div class="text-center">
                        <button @click="uploadImage(this.user)">upload</button>
                    </div>
                    </div>

                    <!-- <div>
                        <div >
                            <button @click="selectImage">choose photo</button> 
                            <input type="file" ref="input1"
                                style="display: none"
                                @input="previewImage" accept="image/*" >                
                        </div>
                    
                        <div v-if="imageData!=null">       
                            <div class="preview" height="268" width="356" 
                            :style="{ 'background-image': `url(${previewImage})` }" @click="selectImage"></div>

                            <img class="preview" height="268" width="356" :src="img1">
                        <br>
                        </div>   
                        

                        <div class="text-center">
                            <button @click="create">upload</button>
                        </div>
                    </div> -->

                        <p> Name: <strong>{{this.name}}</strong><br>
                        Email: <strong>{{this.email}}</strong><br>
                        Gender: <strong>{{this.gender}}</strong><br>
                        Counsellor ID: <strong>{{user.uid}}</strong><br>
                        Specialisations: <strong>{{this.specialisations_formatted}}</strong><br>
                        Rating: <strong>{{this.avgRatings}}</strong><br></p>
                    </div>

                    <div id = "reviewsTab"> 
                        <router-link to="/CounsellorReviews">View Patients' Reviews</router-link>
                    </div>
                </div> 
                <div id="col-2">
                    <h3>Select date to view upcoming appointments</h3>
                    <CounsellorCalendar/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarCounsellor from "@/components/NavBarCounsellor.vue"
import CounsellorCalendar from "@/components/CounsellorCalendar.vue"

import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export default {
    components: {NavBarCounsellor, CounsellorCalendar},
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
            ratings:[],
            avgRatings:"",
            specialisations_formatted:"",
            previewImage: null,
            profile_pic: "",
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

        create() {
            const post = {
                photo: this.img1,
                caption: this.caption        
            }
            db.ref('counsellorProfilePic').push(post)
            .then((response) => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })
        },

        // selectImage() {
        //     console.log("select image")
        //     this.$refs.input1.click()   
        //     },

        // previewImage(event) {
        //     console.log("preview")
        //     this.uploadValue=0;
        //     this.img1=null;
        //     this.imageData = event.target.files[0];
        //     this.onUpload()
        //     console.log("test")
        // },


        selectImage() {
            this.$refs.fileInput.click()
        },

        preview() {
            let input = this.$refs.fileInput
            let file = input.files
            if (file && file[0]) {
            let reader = new FileReader
            reader.onload = e => {
                this.previewImage = e.target.result
            }
            reader.readAsDataURL(file[0])
            this.$emit('input', file[0])
            // this.onUpload()
            }
        },

        async uploadImage(user) {
            console.log("upload image")
            const picRef = ref(storage, 'counsellorProfilePic');
            const storageRef=ref(picRef, `${this.user.email}`);
            if (this.profile_pic) {
                console.log("delete")
                await deleteObject(storageRef);
            }
            await uploadBytes(storageRef, this.previewImage).then((snapshot) => {
                console.log("test3")
                this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            },
 
            await getDownloadURL(storageRef).then(async function(url) {
                console.log("test4")
                const docRef = doc(db, "Counsellors", user.email);
                console.log("test5") 
                await updateDoc(docRef, {
                    "profile_pic": url.toString()
                }).then (
                    alert("Profile picture uploaded successfully!"),
                    await new Promise((resolve) => setTimeout(resolve,1000)),
                    location.reload(),
                ).catch(e => {
                    console.log(e)
                })
            }))
            
        },

        // onUpload(){
        //     console.log("test2")
        //     this.img1=null;
        //     const picRef = ref(storage, 'counsellorProfilePic');
        //     // add indiv counsellor folder
        //     const storageRef=ref(picRef, `${this.user.email}`);
        //     uploadBytes(storageRef, this.previewImage).then((snapshot) => {
        //         console.log("test3")
        //         this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        //             }, error=>{console.log(error.message)},
        //         ()=>{this.uploadValue=100;
        //         storageRef.snapshot.ref.getDownloadURL().then((url)=>{
        //             this.img1 =url;
        //             console.log("test4")
        //             console.log(this.img1)
        //             });
        //     });
        

        // onUpload(){
        //     console.log("test2")
        //     this.img1=null;
        //     const picRef = ref(storage, 'counsellorProfilePic');
        //     // add indiv counsellor folder
        //     const storageRef=ref(picRef, `${this.imageData.name}`);
        //     uploadBytes(storageRef, this.imageData).then((snapshot) => {
        //         console.log("test3")
        //         this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        //             }, error=>{console.log(error.message)},
        //         ()=>{this.uploadValue=100;
        //         storageRef.snapshot.ref.getDownloadURL().then((url)=>{
        //             this.img1 =url;
        //             console.log("test4")
        //             console.log(this.img1)
        //             });
        //     });

            // const storageRef=ref(picRef, `${this.imageData.name}`).put(this.imageData);
            // storageRef.on(`state_changed`,snapshot=>{
            //     this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            //         }, error=>{console.log(error.message)},
            //     ()=>{this.uploadValue=100;
            //     storageRef.snapshot.ref.getDownloadURL().then((url)=>{
            //         this.img1 =url;
            //         console.log(this.img1)
            //         });
            //     }      
            // );
        // },
       
    }
}
</script>

<style scoped>
.imagePreviewWrapper {
  background-repeat: no-repeat;
    width: 250px;
    height: 250px;
    display: block;
    cursor: pointer;
    margin: 0 auto 30px;
    background-size: contain;
    background-position: center center;
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
    height: 500px;
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