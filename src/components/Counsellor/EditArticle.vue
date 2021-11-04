<template>
<div class="flex space-x-4 space-y-4">
    <div class = "grid grid-flow-row grid-cols-3 gap-10">
            <a  v-for= "article in HelpResources" v-bind:key="article.index">
                <!-- <div id="article_box"> -->
                    <div class="card text-center shadow-2xl lg:card-side bg-secondary text-accent-content">
                        <div class="card-body">
                            <p class="text-xl font-semibold">{{article.id}}</p> 
                            <img :src=article.data().picture alt="Picture cannot be displayed" id="articlePic">
                            <h5 id="category"> {{article.data().category}}</h5>
                            <p class="italic text-sm" id="author"> You posted on {{article.data().post_date}}</p>
                            <div class="justify-center card-actions">
                            <button class="btn btn-sm" @click="this.$router.push({name: 'EditPage', params: { id: article.id }})">Edit Article</button>
                        </div>
                    </div>

                    <!-- <h3><router-link :to="{ name: 'ArticlePage', params: { id: article.id}}"> {{article.id}} </router-link></h3>
                    <img :src=article.data().picture alt="Picture cannot be displayed" width="200" height="120">
                    <h5 id="category"> {{article.data().category}}</h5>
                    <em><h6 id="author"> You posted on {{article.data().post_date}}</h6></em>
                    <button type="submit" @click="edit(article.id)">Edit Article</button> -->

                <!-- </div> -->
                </div>
            </a>
    </div>
</div>

</template>

<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore"
import { getDoc, doc} from "firebase/firestore";
const db = getFirestore(firebaseApp);
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default { 
    name:"AllHelpResources",
    props: {
        search:String
    },

    data(){
        return{
            user:false,
            counsellor:false,
            HelpResources:[],
            fbuser:"",
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        })
        this.fbuser = auth.currentUser.uid;
        this.displayArticles(this.fbuser);
        this.isCounsellor(this.fbuser);
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
        async displayArticles(user) {
            let docRef = doc(db, "Counsellors", String(user));
            let counsellorDoc = await getDoc(docRef);
            console.log(counsellorDoc.data().my_articles)
            for (const title in counsellorDoc.data().my_articles) {
                // console.log(counsellorDoc.data().my_articles[title])
                let HRdocRef = doc(db, "HelpResources", counsellorDoc.data().my_articles[title]);
                let HRDoc = await getDoc(HRdocRef);
                this.HelpResources.push(HRDoc)
                // console.log(HRDoc.data())
            }

            this.HelpResources = this.HelpResources.filter(doc => {
            return doc.id.toLowerCase().includes(this.search.toLowerCase())
            })

        },


    }
}


</script>

<style scoped>
#article_box{
    display: inline-block;
    margin: 10px;
    height: 300px;
    width: 350px; 
    background-color: rgb(224, 236, 247);
    border-radius: 35px;
    border: 20px solid rgb(224, 236, 247);
}
#author{
    color: gray;
}
#articlePic {
    /* border-radius: 50%;
    margin-top: 10px; */
    width: 320px;
    height: 200px;
}
</style>