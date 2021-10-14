<template>
    <div v-if="user"> 
        <br><br>
        <NavBarCounsellor/>
        <div style="text-align:center;">
            <h1>Counsellor Profile</h1>
            <div id="bgBlock"> 
                <div id="counsellorDetails"> 
                    <p> Name: <strong>{{user.displayName}}</strong><br>
                    Email: <strong>{{user.email}}</strong><br>
                    User ID: <strong>{{user.uid}}</strong></p>
                </div>

                <div id = "reviewsTab"> 
                    <router-link to="/CounsellorReviews">View Patients' Reviews</router-link>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarCounsellor from "@/components/NavBarCounsellor.vue"

export default {
    components: {NavBarCounsellor},
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