<template>
    <div v-if="user"> 
        <br><br>
        <NavBarCounsellor/>
        <br><br>
        <h2>Help Resources</h2>
        <p>Page for counsellors to edit/post resources</p>
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













