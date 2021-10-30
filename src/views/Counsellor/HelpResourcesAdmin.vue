<template>
    <div v-if="user"> 
        <br><br>
        <NavBarCounsellor/>
        <br><br>
        <div id="bg">
        <div id="textPosition">
            <h1>Help Resources</h1>
            <p>This is where you can post new articles and <br>
                edit articles you have already posted.</p>
            <br><br><br>
            <div class = "allArticles">
                <div><button @click="showCreate = true" id = "createNewArticle">Create New Article</button></div> 
                <div><button @click="showCreate = false" id = "editArticle"> Edit My Article</button></div>
            </div>
            <br><br><br>
        </div>
        </div>
              <div class = "bigContainer">
        <br><br>
        <!-- create -->
        <div class = "create_list" v-if = "showCreate">  
          <h4> You are about to create a new article to be added onto Help Resources. </h4>
            <div class = "bgBlock1">
              <AddArticle/> 
              <br><br><br><br><br><br><br><br>
            </div>
        </div>

        <!-- edit -->
        <div class = "edit_list" v-else> 
            <h4>Edit your past articles here. </h4>
            <div class = "bgBlock2">
                BYEBEYBYE
                <!-- <div class = "search_bar"> 
                    <input type="text" class = "search_for_patient" v-model="search" placeholder="Search for a patient"/>
                </div>
                <br>
                <PastPatients :key="refreshComponent"  :search=this.search  /> -->
                <br><br><br><br><br><br><br><br>
            </div>
        </div> 
    </div>

    </div>
</template>


<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarCounsellor from "@/components/NavBarCounsellor.vue"
import AddArticle from "@/components/AddArticle.vue"

export default {
    components: {NavBarCounsellor,AddArticle},
    name:"HelpResourcesAdmin" ,

    data(){
        return{
            user:false,
            showCreate: this.$route.params.showUpcoming,
            refreshComponent:0,
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

.allArticles {
    display: inline;
}

#createNewArticle{
    float:left;
    font-size: 15px;
    border: 2px solid rgb(125, 202, 233);
    border-radius: 20px;
    height: 30px;

}

 #editArticle{
     float:left;
     font-size: 15px;
     margin-left: 50px;
    border: 2px solid rgb(125, 202, 233);
    border-radius: 20px;
    height: 30px;
 }


#createNewArticle:hover, #editArticle:hover  {
     /* box-shadow: 3px 3px #B9D9EB;
     border-radius: 1px; 
     outline: #B9D9EB; */
     color:#a4c8dd;
 } 

</style>













