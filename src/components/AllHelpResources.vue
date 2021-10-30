<template>
    <div class = "all_articles">
            <a  v-for= "article in HelpResources" v-bind:key="article.index">
                <div id="article_box">
                    <h3><router-link :to="{ name: 'ArticlePage', params: { id: article.id}}"> {{article.id}} </router-link></h3>
                    <img :src=article.data().picture alt="Picture cannot be displayed" width="200" height="120">
                    <h5 id="category"> {{article.data().category}}</h5>
                    <em><h6 id="author"> By {{article.data().counsellor_name}} on {{article.data().post_date}}</h6></em>
                    <!-- <h3><router-link :to="{ name: 'PatientProfileCounsellor', params: { id: patient.id }}">{{patient.data().name}}</router-link></h3> -->
                </div>
            </a>
    </div>


</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore"
import { getDocs, collection} from "firebase/firestore";
const db = getFirestore(firebaseApp);
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
    // components: {NavBarCounsellor},   
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
        // this.fbuser = auth.currentUser.uid;
        // this.displayArticles(this.fbuser);
        this.displayArticles(); //no need user inside cos is available to non-logined ppl also
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
    /* margin: 10px;
    height: 20px;
    width: 15%; */
    background-color: rgb(224, 236, 247);
    border-radius: 35px;
    border: 20px solid rgb(224, 236, 247);
}
#author{
    color: gray;
}



</style>