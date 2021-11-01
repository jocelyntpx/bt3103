<template>
    <br><br>
    <NavBarCounsellor/>

    <br>
    <div id="main" class="flex-auto justify-center">
        <p class="text-3xl font-semibold">{{this.title}}</p><br>
        <!-- <span class="title" v-if="!title.edit" v-on:click="$set(title, 'edit', !title.edit)">{{ this.title }}</span><br>
        <div v-if="title.edit">
            <textarea id="editTitle" name="editTitle" rows="4" cols="50" v-model="title" />
        </div>
        <button v-on:click="$set(title, 'edit', !title.edit)">
            <span v-if ="!title.edit">Edit</span>
            <span v-if="title.edit">Save</span>
        </button> -->

        <p class="italic text-sm" id="author"> Posted on {{this.postDate}} by {{this.author}}</p><br>
        <div class="flex justify-center">
        <img :src=this.picture alt="Picture cannot be displayed" width="600" height="310">
        </div><br>
        <p class="mx-60">{{this.mainText}}</p>


    </div>
</template>

<script>
import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc} from "firebase/firestore";
const db = getFirestore(firebaseApp);
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarCounsellor from "@/components/Counsellor/NavBarCounsellor.vue"

export default {
    components: {NavBarCounsellor,},
    name:"EditPage",

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
        // this.fbuser = auth.currentUser.uid;
        this.isCounsellor(this.fbuser);
        this.displayFullArticle();
    },

    methods: {
        async isCounsellor(user) {

            let docRef = doc(db, "Counsellors", user);
            console.log(user)
            let counsellorDoc = await getDoc(docRef);
                
            if (counsellorDoc.exists()) {
              console.log('Is counsellor!');
              this.counsellor = true;
            } else {
              console.log('No such counsellor!');
              this.counsellor = false;
            }

        },
        
        async displayFullArticle() {
            console.log("entered display")
            let docRef = doc(db, "HelpResources", this.title);
            let articleDoc = await getDoc(docRef);
            this.mainText = articleDoc.data().text
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