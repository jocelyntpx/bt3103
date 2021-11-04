<template>
<!-- <div v-if="user">  -->
    <br><br>
    <div id = "backBtn">
        <button v-if=(counsellor) class="btn btn-link" @click="this.$router.push({name: 'CounsellorProfile', params: { id: this.$route.params.id }})">← Back to My Profile</button>
        <button v-else class="btn btn-link" @click="this.$router.push({name: 'CounsellorProfilePatient', params: { id: this.$route.params.id }})">← Back to Counsellor's Profile</button>
        <!-- <router-link :to="{ name: 'CounsellorProfile', params: { id: this.$route.params.id }}" v-if=(counsellor)> ← Back to My Profile page</router-link> -->
        <!-- <router-link :to="{ name: 'CounsellorProfilePatient', params: { id: this.$route.params.id }}" v-else> ← Back to Counsellor's Profile page</router-link> -->
    </div>
    <p class="text-4xl">Reviews for {{this.counsellorName}}</p><br>
    <!-- <h1> Reviews for {{this.counsellorName}}</h1><br><br> -->
    <div class="bg-base-300 text-base-content">
    <div id = "bgBlock">
        <p class="text-lg"> All Reviews (Total: {{this.numberReviews}} Reviews) </p><br>

      <div class="grid grid-flow-row gap-y-4">

        <a v-for="arr in toShow" v-bind:key="arr.index"> 
            <div class="card text-center shadow-2xl lg:card-side bg-blue-50 text-black-content">

                <div class="card-body">
                <div class="grid grid-flow-row place-items-center -mt-4 -mb-4">
                    <p>{{arr[1]}} </p>
                    <p class="font-semibold"> Session on {{arr[0]}}</p>
                    <p> "{{arr[2]}}" </p>
                </div>
                </div>
            </div>


        </a>
    </div>
              <!-- <div class="grid grid-flow-row place-items-center"> -->





        <!-- <table class="table" id="tableReview">
            <tr class="header"> 
                <th>Review Date</th> 
                <th>Rating</th>
                <th>Review</th>
            </tr>
        </table>
        <br> -->
    <!-- </div> -->
    </div><br><br><br><br><br><br>
    </div>

</template>

<script>
import firebaseApp from '@/firebase.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc} from "firebase/firestore";
const db = getFirestore(firebaseApp);


export default {
    name:"CounsellorReviews",
    components:{},

    data() {
        return {
            user:false,
            counsellor: false,
            // user_email:"",
            fbuser:"", // user's uid 
            counsellorName:"",
            numberReviews:0, //increment by one each time successfully get a review OR just get length of past_rating,
            toShow: []
     
        }     
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
            // this.fbuser = user.uid;
        })
        this.fbuser = auth.currentUser.uid;
        console.log(this.fbuser)
        this.findCounsellorName();
        this.displayReviews();
        // this.user_email = auth.currentUser.email;
        this.isCounsellor(this.fbuser);
    },
    methods: {
        async isCounsellor(user) {
            // const checkUser = db.collection('Counsellors').doc(user.email);
            // const doc = await checkUser.get();
            let docRef = doc(db, "Counsellors", user);
            let counsellorDoc = await getDoc(docRef);
                
            if (counsellorDoc.exists()) {
              console.log('Is counsellor!');
              this.counsellor = true;
            } else {
              console.log('No such counsellor!');
              this.counsellor = false;
            }

        },
        async findCounsellorName() {
            // let sessionDocRef = doc(db, "Sessions", this.$route.params.id);
            // let sessionID = await getDoc(sessionDocRef);
            let docRef = doc(db, "Counsellors", this.$route.params.id);
            let counsellorDoc = await getDoc(docRef);
            this.counsellorName = counsellorDoc.data().name;

        },

        async displayReviews() {
            let docRef = doc(db, "Counsellors", this.$route.params.id);
            let counsellorDoc = await getDoc(docRef);

            // let ind = 1

            let session = counsellorDoc.data().past_counsellor_sessions
            //console.log(session)

            for ( const pastSession of session) {
                //console.log(upcomingSession);
                let sessionDocRef = doc(db, "Sessions", pastSession);
                let sessionID = await getDoc(sessionDocRef);


                // var table = document.getElementById("tableReview")
                // var row = table.insertRow(ind)

                // var date = sessionID.data().session_time.toDate().toLocaleTimeString()
                var rateReviewArr = sessionID.data().rating
                if (rateReviewArr == null) {
                    continue;
                }
                var stars = rateReviewArr.shift()
                let rating = ""
                if (stars == 5) {
                    rating = "★★★★★"
                } else if (stars >= 4) {
                    rating = "★★★★☆"
                } else if (stars >=3) {
                    rating = "★★★☆☆"
                } else if (stars >=2) {
                    rating = "★★☆☆☆"
                } else if (stars >=1) {
                    rating = "★☆☆☆☆"
                } else {
                    rating = "☆☆☆☆☆" 
                }
                var review = rateReviewArr.shift() //or try without pop()
                var date = rateReviewArr.pop()

                // var cell1 = row.insertCell(0); 
                // var cell2 = row.insertCell(1); 
                // var cell3 = row.insertCell(2); 

                // cell1.innerHTML = date; 
                // cell2.innerHTML = rating;
                // cell3.innerHTML = review;
                console.log("awd")
                this.toShow.push([date,rating,review])

                this.toShow.sort((x,y)=> { // "04/11/2021" format 
                    var xParts = x[0].split('/')
                    var yParts = y[0].split('/')
                    var xDate = new Date(xParts[2], xParts[1]-1, xParts[0])
                    var yDate = new Date(yParts[2], yParts[1]-1, yParts[0])
                    return yDate - xDate
                })


                console.log("this.toShow, " , this.toShow)

                this.numberReviews = this.numberReviews + 1
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
    height: 100%;
    margin:auto;
} 
#backBtn{
  text-align: left;
  margin-left: 250px; 
}


</style>