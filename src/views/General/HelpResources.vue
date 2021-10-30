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
                <!-- insert search bar/filter bar here -->
                <br><br><br>
            <!-- <label for="search_bar">Search for an Article:</label> -->
            <input type="text" class = "search_for_article" v-model="search" placeholder="Search for an article"/>
            

        </div>
        <br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br>

        <!-- <AllHelpResources/> -->
        <AllHelpResources :key="refreshComponent"  :search=this.search  />
        <br><br><br><br><br><br>
    </div>
</template>

<script>
import NavBarGeneral from "@/components/General/NavBarGeneral.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarPatient from "@/components/Patient/NavBarPatient.vue"
import AllHelpResources from "@/components/General/AllHelpResources.vue"

export default {
    components: {NavBarGeneral, NavBarPatient, AllHelpResources},
    name:"HelpResources",

    data(){
        return{
            user:false,
            refreshComponent:0,
            search: "",
        }
    },

    watch: {
      search() {
        this.refreshComponent += 1
        console.log("refreshcomponent" , this.refreshComponent)
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