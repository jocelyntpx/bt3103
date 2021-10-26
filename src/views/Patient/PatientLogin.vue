<template>
    <br><br>
    <NavBarGeneral/>
    <div style="text-align:center;">
        <br><br>
        <h1 id="mainHead">Login/Register Page</h1>
        <p>For first time users, you can register with the sign in form below as well. </p>
        <div id="firebaseui-auth-container"></div>
    </div>

    <div>
        <ResetPasswordModal v-show="showModal" @close-modal="showModal = false"/>
        <button @click="showModal = true">Forgot Password?</button>
    </div>
</template>

<script>
import firebase from '@/uifire.js'
import 'firebase/compat/auth';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import NavBarGeneral from "@/components/NavBarGeneral.vue"
import ResetPasswordModal from "@/components/ResetPasswordModal.vue"

export default {
    components: {NavBarGeneral, ResetPasswordModal},
    name: "Login",

    data() {
        return {
            showModal:false,
        };
    },

    mounted(){
        var ui = firebaseui.auth.AuthUI.getInstance();
        if (!ui){
            ui = new firebaseui.auth.AuthUI(firebase.auth());
        }
        //tried to add this but the login wont really appear?
        // var user = firebaseui.auth.AuthUI.getInstance().getCurrentUser();
        // console.log(user)
        var uiConfig = {
            
            // signInSuccessUrl:this.$router.push({ name: 'PatientProfile', params: { id: this.id } }),
            signInSuccessUrl: "/patientProfile/:id", //this part abit weird but not sure how to change it to the top
            signInOptions: [
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


