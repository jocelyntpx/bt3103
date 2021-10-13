<template>
    <h3>Counsellor Profile</h3>
    <!-- Removed the user check for now bc doesnt seem to be loading properly -->
    <!-- <div style="text-align:center;" v-if="user"> -->
    <div style="text-align:center;">
        <!-- <div v-if="user"> -->
        <div id="bgBlock"> 
            <div id="counsellorDetails" v-if="user"> 
                <p> Name: <strong>{{user.displayName}}</strong><br>
                Email: <strong>{{user.email}}</strong><br>
                User ID: <strong>{{user.uid}}</strong></p>
            </div>

            <div id = "reviewsTab"> 
                <router-link to="/CounsellorReviews">View Patients' Reviews</router-link>
            </div>

        </div>
        <Logout/>
    </div>
</template>


<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    name:"CounsellorProfile" ,

    data(){
        return{
            user:false,
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        })
    },
}
</script>

<style scoped>
#bgBlock {
  border-radius: 35px;
  background: #B9D9EB;
  padding: 20px;
  width: 80%;
  height: 450px;
  margin:auto;
}

#counsellorDetails{
    float:left;
    margin-left: 20px;
}
</style>