<template>
    <br><br>
    <div v-if="user">
        <NavBarPatient/>
    </div>
    <div v-else>
        <NavBarGeneral/>
    </div>

    <br>
    <div id="main" class="flex-auto justify-center">
        <p class="text-3xl font-semibold">{{this.title}}</p><br>
        <p class="italic text-sm" id="author"> Posted on {{this.postDate}} by {{this.author}}</p><br>
        <div class="flex justify-center">
        <img :src=this.picture alt="Picture cannot be displayed" width="600" height="310">
        </div><br>
        <div class="mx-60 text-justify" v-html="this.mainText"></div><br><br>
    </div>
    <footer class="p-4 footer bg-base-300 text-base-content footer-center">
  <div>
    <p class="text-base">Know someone who may be facing a crisis or going through a tough time? <br>
        Feel free to share about our service and articles with them.</p>
  </div>
</footer>

</template>

<script>
import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc} from "firebase/firestore";
const db = getFirestore(firebaseApp);
import NavBarGeneral from "@/components/General/NavBarGeneral.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarPatient from "@/components/Patient/NavBarPatient.vue"


export default {
    components: {NavBarGeneral, NavBarPatient, },
    name:"ArticlePage",

    data(){
        return{
            user:false,
            counsellor:false,
            fbuser:"",
            mainText:"",
            picture:"",
            title:this.$route.params.id,
            postDate:"",
            author:"",
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
            this.fbuser = user.id;
        })
        this.displayFullArticle();
    },

    methods: {
        
        async displayFullArticle() {
            console.log("entered display")
            let docRef = doc(db, "HelpResources", this.title);
            let articleDoc = await getDoc(docRef);
            this.mainText = articleDoc.data().text;
            this.picture = articleDoc.data().picture
            this.postDate = articleDoc.data().post_date;
            this.author = articleDoc.data().counsellor_name;
        }
    }

}
</script>

<style scoped>
/* #main{
    position: relative;
    width: 60%;
    text-align: center;
    margin:auto;
    padding: 0;
} */
/* #textPosition{
    position: relative;
    float: right;
    margin-right: 300px;
    margin-top: 50px;
    text-align: left;
} */

</style>