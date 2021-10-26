<template>
<!-- <div v-if="user">  -->
    <br><br>
    <div id = "backBtn">
        <router-link :to="{ name: 'CounsellorProfile', params: { id: this.$route.params.id }}" v-if=(counsellor)> ← Back to My Profile page</router-link>
        <router-link :to="{ name: 'CounsellorProfilePatient', params: { id: this.$route.params.id }}" v-else> ← Back to Counsellor's Profile page</router-link>
    </div>

    <h1> Reviews for {{this.counsellorName}}</h1><br><br>

    <div id = "bgBlock">
        <h3> All Reviews (Total: {{this.numberReviews}} Reviews) </h3>
        <table class="table" id="tableReview">
            <tr class="header"> 
                <th>Review Date</th> 
                <th>Rating</th>
                <th>Review</th>
            </tr>
        </table>
    <!-- </div> -->
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
            user_email:"",
            fbuser:"",
            counsellorName:"",
            numberReviews:0, //increment by one each time successfully get a review OR just get length of past_rating
     
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
        this.displayReviews();
        this.user_email = auth.currentUser.email;
        this.isCounsellor(this.user_email);
    },
    methods: {
            async isCounsellor(user) {
            // const checkUser = db.collection('Counsellors').doc(user.email);
            // const doc = await checkUser.get();
            console.log(user)
            let docRef = doc(db, "Counsellors", String(user));
            let counsellorDoc = await getDoc(docRef);
                
            if (counsellorDoc.data().user_type == "counsellor") {
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

                let ind = 1

                let session = counsellorDoc.data().past_counsellor_sessions
                //console.log(session)

                for ( const pastSession of session) {
                    //console.log(upcomingSession);
                    let sessionDocRef = doc(db, "Sessions", pastSession);
                    let sessionID = await getDoc(sessionDocRef);


                    var table = document.getElementById("tableReview")
                    var row = table.insertRow(ind)

                    var date = sessionID.data().session_time.toDate().toLocaleTimeString()
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
                    var review = rateReviewArr.pop() //or try without pop()


                    var cell1 = row.insertCell(0); 
                    var cell2 = row.insertCell(1); 
                    var cell3 = row.insertCell(2); 

                    cell1.innerHTML = date; 
                    cell2.innerHTML = rating;
                    cell3.innerHTML = review; 
                    this.numberReviews = this.numberReviews + 1
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
    height: 100%;
    margin:auto;
} 
#backBtn{
  text-align: left;
  margin-left: 250px; 
}

</style>