<template>
    <div v-if="user"> 
        <br><br>
        <NavBarCounsellor/>
        <br><br>
        <div id="bg">
        <div id="textPosition"><br><br>
            <p class="text-4xl flex justify-center">Help Resources</p><br>
            <p class = "flex justify-center">This is where you can post new articles and <br>
                edit articles you have already posted.</p>
            <br><br><br>
            <div class = "flex justify-center">
                <div><button @click="showCreate = true" class="btn btn-outline btn-secondary" id = "createNewArticle">Create New Article</button></div> 
                <div><button @click="showCreate = false" class="btn btn-outline btn-secondary" id = "editArticle"> Edit My Article</button></div>
            </div>
            <br><br><br>
        </div>
        </div>
              <div class = "bigContainer">
        <br><br>
        <!-- create -->
        <div class = "create_list" v-if = "showCreate">  
          <h4> You are about to create a new article to be added onto Help Resources. </h4>
          <div class="bg-base-300 text-base-content">
            <div class = "bgBlock1">
              <AddArticle/> 
              <br><br><br><br><br><br><br><br>
            </div>
          </div>
        </div>

        <!-- edit -->
        <div class = "edit_list" v-else> 
            <h4>Edit your past articles here. </h4><br>
            <div class="bg-base-300 text-base-content">
            <div class = "bgBlock2">
                <div class="form-control flex-auto w-1/3 ">
                  <!-- <label for="search_bar">Search for Article</label> -->
                  <input type="text" class="input input-sm input-primary input-bordered " v-model="search" placeholder="Search for your article"/>
                </div> 
                <!-- <div class = "search_bar"> 
                    <input type="text" class = "search_for_article" v-model="search" placeholder="Search for your article"/>
                </div> -->
                <br>
                <EditArticle :key="refreshComponent"  :search=this.search  />
                <br><br><br><br><br><br><br><br>
            </div>
            </div>
        </div> 
    </div>

    </div>
</template>


<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarCounsellor from "@/components/Counsellor/NavBarCounsellor.vue"
import AddArticle from "@/components/Counsellor/AddArticle.vue"
import EditArticle from "@/components/Counsellor/EditArticle.vue"

export default {
    components: {NavBarCounsellor,AddArticle,EditArticle},
    name:"HelpResourcesAdmin" ,

    data(){
        return{
            user:false,
            showCreate: this.$route.params.showUpcoming,
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
.search_bar {
    float:right;
    margin-right:30px;
}

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

/* .allArticles {
    display: inline;
} */

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


/* #createNewArticle:hover, #editArticle:hover  {

     color:#a4c8dd;
 }  */

</style>













