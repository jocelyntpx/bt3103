<template>
  <div class="modal-overlay" @click="$emit('close-modal')">
    <div class="modal" @click.stop>
      <h6>Edit Profile Details</h6>
      <p>Note: Click anywhere outside this pop-up to exit.</p>

    <form>
      <div id="v-model-multiple-checkboxes">
        <label for="specialisations"><strong>Specialisations: </strong></label><br>
        <input type="checkbox" id="all_categories" value="All Categories" v-model="this.checkedNames" />
        <label for="all_categories">All Categories</label>
        <input type="checkbox" id="general" value="General" v-model="this.checkedNames" />
        <label for="general">General</label>
        <input type="checkbox" id="career" value="Career" v-model="this.checkedNames" />
        <label for="career">Career</label>
        <input type="checkbox" id="relationships" value="Relationships" v-model="this.checkedNames" />
        <label for="relationships">Relationships</label>
        <br>
        <span>Specialisations: {{ this.checkedNames }}</span>
      </div>

      <br><br>
      <label for="credentials"><strong>Credentials: </strong></label><br>
      <!-- <input type="text" id="credentials" v-model="this.credentials"> -->
      <textarea id="credentials" cols="30" rows="4" v-model="this.credentials"></textarea>
      <br><br>
      <label for="add_details"><strong>Additional Details: </strong></label><br>
      <!-- <input type="text" id="add_details" v-model="this.additional_details"> -->
      <textarea id="add_details" cols="30" rows="4" v-model="this.additional_details"></textarea>
    </form>

    <br><br>

      <button type="submit" @click="updateDetails(this.checkedNames)">Update Details</button>

    <div class="close" @click="$emit('close-modal')">
    </div>
  </div>
  </div>
</template>

<script scoped>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc, updateDoc } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
    name:"CounsellorEditProfileModal" ,

    data(){
        return{
            user:false,
            email:"",
            user_type:"patient",
            fbuser:"",
            checkedNames: [],
            additional_details:"",
            credentials:"",
            specialisations:[],
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
            }
        })
    },

    methods: {
      async getDetails(user) {
        let docRef = doc(db, "Counsellors", String(user));
        let counsellorDoc = await getDoc(docRef);  
        this.specialisations = counsellorDoc.data().counsellor_specialisations;
        this.credentials = counsellorDoc.data().credentials;
        this.additional_details = counsellorDoc.data().additional_details; 
        this.checkedNames = this.specialisations;

      },

      async updateDetails(checkedNames) {
        console.log("update details")
        this.credentials=document.getElementById("credentials").value;
        this.additional_details=document.getElementById("add_details").value;
        let docRef = doc(db, "Counsellors", String(this.fbuser));
        updateDoc(docRef, {
          counsellor_specialisations: checkedNames,
          credentials: this.credentials,
          additional_details: this.additional_details,
          }).then(
            alert("Profile details updated. Please wait while we refresh your page."),
            await new Promise((resolve) => setTimeout(resolve,800)),
            location.reload(),
          ).catch(e => {
            console.log(e)
        })
      }

      }
}
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000da;
  z-index: 1;
}

.modal {
  text-align: center;
  background-color: white;
  height: 500px;
  width: 500px;
  margin-top: 10%;
  padding: 60px 0;
  border-radius: 20px;
}
.close {
  margin: 10% 0 0 16px;
  cursor: pointer;
}

.close-img {
  width: 25px;
}

.check {
  width: 150px;
}

h6 {
  font-weight: 500;
  font-size: 28px;
  margin: 20px 0;
}

p {
  font-size: 16px;
  margin: 20px 0;
}

button {
  background-color: #ac003e;
  width: 150px;
  height: 40px;
  color: white;
  font-size: 14px;
  border-radius: 16px;
  /* margin-top: 50px; */
}

</style>