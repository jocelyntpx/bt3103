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
        <div class="flex justify-center gap-4">
        <label for="my-modal-2" class="btn btn-secondary btn-sm modal-button">Edit</label> 
        <input type="checkbox" id="my-modal-2" class="modal-toggle"> 
            <div class="modal">
            <div class="modal-box">
            <form>
                <!-- <div id="v-model-multiple-checkboxes">
                    <label for="specialisations"><strong>Specialisations: </strong></label><br>
                    <input type="checkbox" id="all_categories" value="All Categories" v-model="this.checkedNames" />
                    <label for="all_categories">All Categories</label>
                    <input type="checkbox" id="general" value="General" v-model="this.checkedNames" />
                    <label for="general">General</label>
                    <input type="checkbox" id="career" value="Career" v-model="this.checkedNames" />
                    <label for="career">Career</label>
                    <input type="checkbox" id="relationships" value="Relationships" v-model="this.checkedNames" />
                    <label for="relationships">Relationships</label>
                <br>
                </div><br> -->
                <!-- <label for="title"><strong>Title: </strong></label><br>
                <textarea id="title" class="textarea h-24 textarea-bordered" cols="60" rows="4" v-model="this.title"></textarea>
                <br><br> -->
                <label for="mainText"><strong>Main text: </strong></label><br>
                <textarea id="mainText" class="textarea h-full w-full textarea-bordered" cols="100" rows="15" v-model="this.mainText"></textarea>
                </form><br>

                <div class="modal-action">
                <label for="my-modal-2" class="btn btn-primary" @click="edit()">Edit</label> 
                <label for="my-modal-2" class="btn">Close</label>
                </div>
            </div>
            </div><br><br>
            <button @click="deleteArticle()" class="btn btn-outline btn-secondary btn-sm" id = "deleteArticle">Delete</button>
        </div>

        <div class="flex justify-center">
        <img :src=this.picture alt="Picture cannot be displayed" width="600" height="310">
        </div><br>
        <p class="mx-60">{{this.mainText}}</p><br><br>



    </div>
</template>

<script>
import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc, updateDoc,deleteDoc,arrayRemove} from "firebase/firestore";
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
            // this.fbuser = user.id;
        })
        this.fbuser = auth.currentUser.uid;
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

        },

        async edit() {
            this.mainText = document.getElementById("mainText").value;
            //update articleDoc
            let docRef = doc(db, "HelpResources", this.title);
            updateDoc(docRef, {
            text: this.mainText,
            }).then(
                alert("Your article has been successfully edited. Please wait while we refresh your page."),
                await new Promise((resolve) => setTimeout(resolve,800)),
                location.reload(),
            ).catch(e => {
                console.log(e)
            })
        },

        async deleteArticle() {
            if (confirm("You are about to delete '" + this.title + "'. Confirm?")) {
                //delete from my_articles array for counsellor
                await updateDoc(doc(db,"Counsellors",String(this.fbuser)), {my_articles: arrayRemove(this.title)});
                //delete from document from session collection
                await deleteDoc(doc(db, "HelpResources", this.title));

                //route back to HelpResourcesAdmin page
                this.$router.push({ name: 'HelpResourcesAdmin' })
            }

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