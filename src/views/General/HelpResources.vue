<template>
    <br><br>
    <div v-if="user">
        <NavBarPatient/>
    </div>
    <div v-else>
        <NavBarGeneral/>
    </div>
    
    <h1>Help Resources</h1><br><br>
    <h5>Browse through our articles to find out <br>
        how you can cope better with mental health.</h5>
</template>

<script>
import NavBarGeneral from "@/components/NavBarGeneral.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarPatient from "@/components/NavBarPatient.vue"

export default {
    components: {NavBarGeneral, NavBarPatient},
    name:"HelpfulResources",

    data(){
        return{
            userNotLeftReview: true,
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