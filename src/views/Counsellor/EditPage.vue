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

        <div v-if="!showEdit">
            <div class="flex justify-center gap-4">
                <button @click="showEditor()" class="btn btn-secondary btn-sm">Edit</button> 
                <button @click="deleteArticle()" class="btn btn-outline btn-secondary btn-sm" id = "deleteArticle">Delete</button>
            </div><br>

            <div class="flex justify-center">
                <img :src=this.picture alt="Picture cannot be displayed" width="600" height="310">
            </div><br>
            <div class="mx-60 text-justify" v-html="this.mainText"></div><br><br>    
        </div>

        <div v-else>
            <div class="flex justify-center">
                <img :src=this.picture alt="Picture cannot be displayed" width="600" height="310">
            </div><br>
            <div class="mx-60">
                <QuillEditor :key="refreshComponent" v-model:content="this.mainText" contentType="html" theme="snow"/>
            </div>
            <br>
            <div class="flex justify-center gap-4">
                <button class="btn btn-outline btn-secondary" @click="showEditor()">Back</button> 
                <button class="btn btn-secondary" @click="edit()">Save</button> 
            </div>
            <br><br>
        </div>
    </div>

    
        
        <!-- <div class="flex justify-center gap-4">
            <label for="my-modal-2" class="btn btn-secondary btn-sm modal-button">Edit</label> 
            <input type="checkbox" id="my-modal-2" class="modal-toggle"> 
            <div class="modal">
                <div class="modal-box">
                    <QuillEditor :key="refreshComponent" v-model:content="this.mainText" contentType="html" theme="snow"/>
              <label for="mainText"><strong>Main text: </strong></label><br> 
                <textarea id="mainText" class="textarea h-full w-full textarea-bordered" cols="100" rows="15" wrap="hard" v-html="this.mainText"></textarea> 
                    <br>

                    <div class="modal-action">
                    <label for="my-modal-2" class="btn btn-primary" @click="edit()">Save</label> 
                    <label for="my-modal-2" class="btn">Close</label>
                    </div>
                </div>
            </div><br><br>
            <button @click="deleteArticle()" class="btn btn-outline btn-secondary btn-sm" id = "deleteArticle">Delete</button>
        </div>

        <div class="flex justify-center">
            <img :src=this.picture alt="Picture cannot be displayed" width="600" height="310">
        </div><br>
        <div class="mx-60 text-justify" v-html="this.mainText"></div><br><br>
    </div> -->
</template>

<script>
import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc, updateDoc,deleteDoc,arrayRemove} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarCounsellor from "@/components/Counsellor/NavBarCounsellor.vue"
import { QuillEditor } from '@vueup/vue-quill'
import { getStorage, ref, deleteObject } from "firebase/storage";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export default {
    components: {NavBarCounsellor,QuillEditor},
    name:"EditPage",

    data(){
        return{
            user:false,
            fbuser:"",
            mainText:"<p>Edit article here..</p",
            picture:"",
            title:this.$route.params.id,
            postDate:"",
            author:"",
            refreshComponent: 0,
            showEdit: false,

        }
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
            this.fbuser = this.user.uid;
            this.displayFullArticle();
            this.$forceUpdate();
        })

    },


    methods: {
        showEditor() {
            if (this.showEdit) {
                this.showEdit = false
            } else {
                this.showEdit = true
            }
        },
        
        async displayFullArticle() {
            console.log("entered display")
            let docRef = doc(db, "HelpResources", this.title);
            let articleDoc = await getDoc(docRef);
            this.mainText = articleDoc.data().text;
            this.picture = articleDoc.data().picture;
            this.postDate = articleDoc.data().post_date;
            this.author = articleDoc.data().counsellor_name;
            console.log(this.mainText)
            this.refreshComponent += 1

        },

        async edit() {
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
                const picRef = ref(storage, 'articlePic');
                const deleteRef = ref(picRef, this.title);
                await deleteObject(deleteRef);

                //route back to HelpResourcesAdmin page
                this.$router.push({ name: 'HelpResourcesAdmin' }) 
            }

        }
    }

}
</script>

<style>
h1 {
    font-size: 30px;
    font-weight: bold;
}
h2 {
    font-size: 26px;
    font-weight: bold;
}
h3 {
    font-size: 22px;
    font-weight: bold;
}
li {
  display: list-item;
}
ol {
  display: block;
  list-style-type: decimal;
  margin-top: 1em;
  margin-bottom: 1em;
  margin-left: 0;
  margin-right: 0;
  padding-left: 40px;
}
ul {
  display: block;
  list-style-type: disc;
  margin-top: 1em;
  margin-bottom: 1 em;
  margin-left: 0;
  margin-right: 0;
  padding-left: 40px;
}
</style>