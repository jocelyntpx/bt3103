<template>
    <br><br>
    <div v-if="user">

    <div class="flex flex-row gap-x-24 mb-8">

        <div id = "backBtn">
            <button class="btn btn-link text-lg" @click="this.$router.push({name: 'PatientProfile', params: { id: this.fbuser }})">← Submit Later</button>
        </div>

<!-- <div class="justify-end"> -->
        <div class="alert w-1/2 float-right">
            <div class="flex-1 w-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#2196f3" class="w-6 h-6 mx-2">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>                          
                </svg> 
                <label>Report the counsellor via their profile if you feel they have violated website guidelines.</label>
            </div>
        </div>
        <!-- </div> -->
    </div>

        <!-- <button class="btn btn-link" @click="this.$router.push({name: 'PatientProfile', params: { id: this.fbuser }})">← Submit Later</button> -->
        <p class="text-4xl"> Rate Counsellor!</p>
        <p> Kindly leave a rating/review for your counsellor. </p><br>
        <div class="bg-base-300 text-base-content">
        <div id="bgBlock">
            <p class="text-2xl">{{this.counsellorName}}</p>
            <!-- <div id = "stars"> -->
                <vue3starRatings v-model="rating" starSize=50  />
            <!-- </div> -->
   
            <div id="innerBlock">
                <textarea class="textarea h-24 textarea-bordered textarea-primary" v-model= "review" id="reviewText" placeholder="You can review about the counsellor's friendlliness, whether or not you enjoyed this session, whether it helped resolved an issue, or even areas you would like your counsellor to work on. It's up to you!"></textarea>
            </div><br>
            <button v-on:click = "sendReviewRating()" id="submit" class="btn btn-primary">Submit</button>
            <!-- for me to check if the review and rating are working under v-model! -->
            <!-- <h2>{{review}}</h2>
            <h2>{{rating}}</h2> -->

            
        </div>
        </div>
        


    </div>
</template>


<script>
import firebaseApp from '@/firebase.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc,updateDoc, arrayUnion,Timestamp} from "firebase/firestore";
const db = getFirestore(firebaseApp);
import vue3starRatings from "vue3-star-ratings";

export default {
    name:"RateCounsellor",
    components:{vue3starRatings},


    data() {
        return {
            user:false,
            fbuser:"", // user's UID
            counsellorName: "",
            counsellorID:"", // counsellor's UID
            review:"",
            rating:""
     
        }     
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                // this.fbuser = user.uid;
            }
        })
        this.fbuser = auth.currentUser.uid;
        console.log(this.fbuser)
        this.findCounsellorName();
    },

    methods: {
        async findCounsellorName() {
            let sessionDocRef = doc(db, "Sessions", this.$route.params.id);
            let sessionID = await getDoc(sessionDocRef);
            let docRef = doc(db, "Counsellors", sessionID.data().counsellor_ID);
            let counsellorDoc = await getDoc(docRef);
            this.counsellorID = counsellorDoc.id;
            this.counsellorName = counsellorDoc.data().name;

        },

        async sendReviewRating() {
            if (this.rating == '' || this.review == '' ) {
                alert("You have to complete all fields to submit.")
                // alert("You have to at least select a rating to proceed.")
            } else {
                if (confirm("Submit your review?")) {
                    //add in to counsellors past ratings
                    await updateDoc(doc(db, "Counsellors", this.counsellorID), {past_ratings: arrayUnion(this.rating)});

                    //change session ratingsfrom null to an array of rating,review
                    await updateDoc(doc(db, "Sessions", this.$route.params.id), {rating: [this.rating,this.review,Timestamp.now().toDate().toLocaleDateString()]})
                    
                    //route back to MyProfile page
                    this.$router.push({ name: 'PatientProfile', params: { id: this.fbuser } })

                    // console.log(this.rating)
                    // console.log(this.review)

                }

            }
        }

    }
}
</script>


<style scoped>
#bgBlock {
  border-radius: 35px;
  /* background: #B9D9EB; */
  padding: 20px;
  width: 80%;
  height: auto;
  margin:auto;
}
#reviewText {
  border-radius: 35px;
  /* background: azure;; */
  padding: 20px;
  width: 60%;
  height: 250px;
  margin:auto;
  font-family:'Roboto',sans-serif;
  font-size: 17px;
}
/* #submit{
    display:inline-block;
    padding:0.3em 1.2em;
    margin:0 0.3em 0.3em 0;
    border-radius:2em;
    box-sizing: border-box;
    text-decoration:none;
    font-family:'Roboto',sans-serif;
    font-weight:300;
    color:#FFFFFF;
    background-color:#4eb5f1;
    text-align:center;
    transition: all 0.2s;
}
#submit:hover{
    background-color:#4095c6;
} */
#backBtn{
  text-align: left;
  margin-left: 250px; 
}



</style>