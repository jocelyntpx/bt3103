<template>
    <br><br>
    <div v-if="user">
        <NavBarPatient/>
    </div>
    <div v-else-if="counsellor">
        <NavBarCounsellor/>
    </div>
    <div v-else>
        <NavBarGeneral/>
    </div>

    <br>
    <div id="main">
        <h1>{{this.title}}</h1>
        <img :src=this.picture alt="Picture cannot be displayed" width="600" height="310">
        <br>
        <p>{{this.mainText}}</p>
    </div>
</template>

<script>
import firebaseApp from '@/firebase.js';
import { getFirestore } from "firebase/firestore"
import { doc, getDoc} from "firebase/firestore";
const db = getFirestore(firebaseApp);
import NavBarGeneral from "@/components/NavBarGeneral.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarPatient from "@/components/NavBarPatient.vue"
import NavBarCounsellor from "@/components/NavBarCounsellor.vue"

export default {
    components: {NavBarGeneral, NavBarPatient, NavBarCounsellor,},
    name:"ArticlePage",

    data(){
        return{
            user:false,
            counsellor:false,
            fbuser:"",
            mainText:"",
            picture:"",
            title:this.$route.params.id
        }
    },

    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            this.user = user;
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
            let docRef = doc(db, "HelpResources", this.title);
            let articleDoc = await getDoc(docRef);
            this.mainText = articleDoc.data().text
            this.picture = articleDoc.data().picture

        }
    }

}
</script>

<style scoped>
#main{
    position: relative;
    width: 60%;
    text-align: center;
    margin:auto;
    padding: 0;
}
/* #textPosition{
    position: relative;
    float: right;
    margin-right: 300px;
    margin-top: 50px;
    text-align: left;
} */

</style>