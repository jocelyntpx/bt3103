<template>
    <div id="logged" v-if="user">
        <div id="nav">
            <router-link to="/patientProfile">My Profile</router-link> | 
            <router-link to="/findcounsellor">Find A Counsellor</router-link> | 
            <router-link to="/about">About Us</router-link> |
            <router-link to="/helpresources">Help Resources</router-link> |  
            <Logout/>
            <!-- <router-link to="/logout">Logout</router-link> -->
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Logout from '@/components/Logout.vue'

export default {
    name:'NavBarPatient',
    components:{
        Logout
    },

    data() {
        return {
            user:false,
        }     
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
            }
        })
    }
}
</script>

<style scoped>
#nav {
  text-align: right;
  /* float: right; */
  margin-right: 50px; 
}

#nav a{
  font-weight: bold;
  color:lightslategray;
}

#nav a.router-link-exact-active {
  color:black;
}
</style>
