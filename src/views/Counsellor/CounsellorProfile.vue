<template>
    <div v-if="user"> 
        <br><br>
        <NavBarCounsellor/>
        <div style="text-align:center;">
            <h1>Counsellor Profile</h1>
            <div id="bgBlock"> 
                <div id="col-1">
                    <div id="counsellorDetails"> 
                        <p> Name: <strong>{{user.displayName}}</strong><br>
                        Email: <strong>{{user.email}}</strong><br>
                        User ID: <strong>{{user.uid}}</strong></p>
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

export default {
    components: {NavBarCounsellor, CounsellorCalendar},
    name:"CounsellorProfile" ,

    data(){
        return{
            user:false,
            user_type:"patient",
            counsellor_ID:this.$route.params.id
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
            }
        })
    },
}
</script>

<style scoped>
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