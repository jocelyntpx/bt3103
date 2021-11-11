<template>
    <div class="flex space-x-4 space-y-4">
        <div class = "grid grid-flow-row grid-cols-3 gap-10 mx-40">
            <a  v-for= "article in HelpResources" v-bind:key="article.index">
                <div class="card text-center shadow-2xl lg:card-side bg-secondary text-accent-content">
                    <div class="card-body">
                        <p class="text-xl font-semibold">{{article.id}}</p> 
                        <img :src=article.data().picture alt="Picture cannot be displayed" id="articlePic">
                        <h5 id="category"> {{article.data().category}}</h5>
                        <div class="justify-center card-actions">
                            <button class="btn btn-sm" @click="this.$router.push({name: 'ArticlePage', params: { id: article.id }})">Read</button>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>

<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore"
import { getDocs, collection} from "firebase/firestore";
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
            HelpResources:[],
            fbuser:"",
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
        })

        this.displayArticles(); 
    },

    methods: {
        async displayArticles() {
            const querySnapshot = await getDocs(collection(db, "HelpResources"));
            querySnapshot.forEach((doc) => {
                this.HelpResources.push(doc)
            });
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
    height: 10%;
    width: 15%; 
    background-color: rgb(224, 236, 247);
    border-radius: 35px;
    border: 20px solid rgb(224, 236, 247);
}
#author{
    color: gray;
}
#articlePic {
    width: 320px;
    height: 200px;
}

</style>