<template>
    <br><br>
    <div v-if="user">
        <NavBarPatient/>
    </div>
    <div v-else>
        <NavBarGeneral/>
    </div>
    <br>
    <div>
        <div id="header">
            <div id="header_image">
                <div id="textPosition"><br><br>
                    <p class="text-4xl flex">Help Resources</p><br>
                    <p class = "flex justify-center">Browse through our articles to find out <br>
                        how you can cope better with mental health.</p>
                        <!-- insert search bar/filter bar here -->
                        <br>
                    <!-- <label for="search_bar">Search for an Article:</label> -->
                    <!-- <input type="text" class = "search_for_article" v-model="search" placeholder="Search for an article"/> -->
                    <div class="form-control flex-auto ">
                        <!-- <label for="search_bar">Search for Article</label> -->
                        <input type="text" class="input input-sm input-primary input-bordered " v-model="search" placeholder="Search for an article"/>
                    </div> 
                </div>
            </div>
        </div>
        <div class="pt-20 pb-20">
            <AllHelpResources :key="refreshComponent"  :search=this.search  />
        </div>
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
#header{
    background-color:rgb(211, 231,245)
}
#header_image{
    position: relative;
    width: 80%;
    height: 300px;
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
    margin-right: 190px;
    margin-top: 30px;
    text-align: left;
}

</style>