<template>
    <br><br>
    <NavBarGeneral/>
    <div style="text-align:center;">
        <h1 id="mainHead">Login Page</h1>
        <p>For first time users, you can either sign in with Google or sign up by clicking on "Sign in with email". </p>
        <div id="firebaseui-auth-container"></div>
    </div>
</template>

<script>
import firebase from '@/uifire.js'
import 'firebase/compat/auth';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import NavBarGeneral from "@/components/NavBarGeneral.vue"

export default {
    components: {NavBarGeneral},
    name: "Login",

    mounted(){
        var ui = firebaseui.auth.AuthUI.getInstance();
        if (!ui){
            ui = new firebaseui.auth.AuthUI(firebase.auth());
        }

        var uiConfig = {
            signInSuccessUrl: "/patientProfile",
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
            ]
        };
        ui.start("#firebaseui-auth-container", uiConfig)
    }
}
</script>


<style scoped>
#firebaseui-auth-container {
    margin-top: 50px;;
    margin-bottom: 50px;;
}
#pagecontent{
    height:100px;
    font-size:larger;
    font-weight:bolder;
    text-align:center;
}
#mainHead{
    text-align: center;
    /* text-shadow: 2px 2px grey; */
}
#bg{
    display: block;
    margin-left: auto;
    margin-right: auto;
    width:60%
}
h5{
    text-align: center;
    background-color: rgb(194,202,188);
}
</style>


