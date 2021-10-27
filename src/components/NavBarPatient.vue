<template>
    <div id="logged" v-if="user">
        <div id="nav">
            <img id="mhmlogo" src="@/assets/mhmlogo.png" alt="" width="60" height="35">
            <h3 id="mhm">Mental Health Matters</h3>
            <!-- <router-link to="/patientProfile/:id">My Profile</router-link> |  -->
            <router-link :to="{ name: 'PatientProfile', params: { id: this.fbuser }}">My Profile</router-link> |
            <router-link to="/findcounsellor">Find A Counsellor</router-link> | 
            <!-- <router-link to="/about">About Us</router-link> | -->
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
            fbuser:"", // uid
        }     
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.fbuser = user.uid;
            }
        })
    }
}
</script>

<style scoped>
#mhm{
  float: left;
  margin-left: 10px;
  margin-top: -2px;

  /* idk why but only -2px then looks aligned  */
} 
#mhmlogo {
  float: left;
  margin-left: 110px;
  margin-top: -10px;

}
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
