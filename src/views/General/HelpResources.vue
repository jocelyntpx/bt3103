<template>
    <br><br>
    <div v-if="user">
        <NavBarPatient/>
    </div>
    <div v-else>
        <NavBarGeneral/>
    </div>
    <br>
    <div id="bg">
        <br><br>
        <div id="textPosition">
            <h1>Help Resources</h1>
            <p>Browse through our articles to find out <br>
                how you can cope better with mental health.</p>
        </div>
        <br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br>
    </div>
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

<style scoped>
#bg{
    position: relative;
    width: 100%;
    height: 550px;
    background-size: cover;
    background-image: url("~@/assets/helpResources.png");
    background-repeat: no-repeat;
    background-position: center center;
    text-align: center;
    margin:auto;
    padding: 0;
}
#textPosition{
    position: relative;
    float: right;
    margin-right: 300px;
    margin-top: 50px;
    text-align: left;
}

</style>