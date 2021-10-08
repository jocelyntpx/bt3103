<template>
    <div id="logged" v-if="user">
        <div id="nav">
            <router-link to="/patientProfile">My Profile</router-link>
            <router-link to="/findCounsellor">Find a Counsellor</router-link>
            <router-link to="/about">About Us</router-link>
            <router-link to="/helpResources">Help Resources</router-link>
            <!-- <router-link to="/logout">Logout</router-link> -->
        </div>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
    name:'NavBarPatient',

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
    padding:30px;
    text-align:center;
}

#nav a {
    font-weight: bold;
    color: darkblue;
}

#nav a.router-link-exact-active{
    color: purple;
}
</style>
