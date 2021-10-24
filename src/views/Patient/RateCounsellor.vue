<template>
    <br><br>
    <div v-if="user">
        <div id = "backBtn">
            <router-link :to="{ name: 'PatientProfile', params: { id: this.fbuser }}"> ← Back to My Profile page</router-link>
        </div>
        <h1>Rate Counsellor!</h1>
        <p> Kindly leave a rating/review for your counsellor. </p>
        <div id="bgBlock">
            <h2>{{this.counsellorName}}</h2>
            <!-- <div id = "stars"> -->
                <vue3starRatings v-model="rating" starSize=50  />
            <!-- </div> -->
   
            <div id="innerBlock">
                <textarea v-model= "review" id="reviewText" placeholder="Enter your review here (Optional)"></textarea>
            </div>
            <button v-on:click = "sendReviewRating()" id="submit">Submit</button>
            <!-- for me to check if the review and rating are working under v-model! -->
            <!-- <h2>{{review}}</h2>
            <h2>{{rating}}</h2> -->
        </div>
    </div>
</template>


<script>
import firebaseApp from '@/firebase.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc,updateDoc, arrayUnion,} from "firebase/firestore";
const db = getFirestore(firebaseApp);
import vue3starRatings from "vue3-star-ratings";

export default {
    name:"RateCounsellor",
    components:{vue3starRatings},


    data() {
        return {
            user:false,
            fbuser:"",
            counsellorName: "",
            counsellorEmail:"",
            review:"",
            rating:""
     
        }     
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.fbuser = user.email;
            }
        })

        this.findCounsellorName();
    },

    methods: {
        async findCounsellorName() {
            let sessionDocRef = doc(db, "Sessions", this.$route.params.id);
            let sessionID = await getDoc(sessionDocRef);
            let docRef = doc(db, "Counsellors", sessionID.data().counsellor_email);
            let counsellorDoc = await getDoc(docRef);
            this.counsellorEmail = counsellorDoc.id;
            this.counsellorName = counsellorDoc.data().name;

        },

        async sendReviewRating() {
            if (this.rating == '' || this.review == '' ) {
                alert("You have to complete all fields to proceed.")
                // alert("You have to at least select a rating to proceed.")
            } else {
                if (confirm("Confirm to proceed?")) {
                    //add in to counsellors past ratings
                    await updateDoc(doc(db, "Counsellors", this.counsellorEmail), {past_ratings: arrayUnion(this.rating)});

                    //change session ratingsfrom null to an array of rating,review
                    await updateDoc(doc(db, "Sessions", this.$route.params.id), {rating: [this.rating,this.review]})

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
  background: #B9D9EB;
  padding: 20px;
  width: 80%;
  height: auto;
  margin:auto;
}
#reviewText {
  border-radius: 35px;
  background: azure;;
  padding: 20px;
  width: 60%;
  height: 250px;
  margin:auto;
}
#submit{
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
}
#backBtn{
  text-align: left;
  margin-left: 250px; 
}



</style>