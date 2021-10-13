<template>
    <div id="app">
        <h1>Counsellor's Login</h1>
        <br/><br/>
        <div>
            <div id="test" width="700">
                    <div class = "formli">
                        <form id ="myForm">
                            <label for="email">Email: </label>
                            <input type="text" id="email" required="" placeholder="Enter email"> <br><br>
                            <label for="password">Password: </label>
                            <input type="text" id="password" required="" placeholder="Enter password"> <br><br>
                        </form>
                    </div>
                    <div>
                        <form @submit.prevent="login()">
                            <button id="savebutton" type="button" v-on:click="login()">Login</button>
                        </form>
                    </div>
            </div>
        </div>
    </div> 
</template>

<script>
import firebase from '@/uifire.js'
import 'firebase/compat/auth';
import 'firebaseui/dist/firebaseui.css'
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore"
import { collection, query, where, getDocs } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
    data() {
        return {
            email: "",
            password: "",
        };
    },
    methods: {
        async login() {

            this.email=document.getElementById("email").value;
            this.password=document.getElementById("password").value;

            if (this.email == null|| this.password==null){
                alert("Please fill in your email and password!")
            } else {
                var data = await getDocs(query(collection(db, "Counsellors"), where("email", "==", this.email)));
                // getDocs(collection(db,String(user))) 
                // db.collection("Counsellors").where("email","==",this.email).get()
                if(data.empty) {
                    alert("This is the admin page. Please proceed to the user login page instead!")
                } else {
                    await firebase
                        .auth()
                        .signInWithEmailAndPassword(this.email, this.password)
                        .then(() => {
                            alert('Successfully logged in');
                            this.$router.push({ path: '/counsellorProfile'});
                        })
                        .catch(error => {
                            alert(error.message);
                        });
                }
            }
        },
    },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;800;900&display=swap');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.formli{
    display: inline-block;
    text-align: right;
}

form{
    text-align: inline-block;
    align-items: center;
    margin: auto;
}
</style>