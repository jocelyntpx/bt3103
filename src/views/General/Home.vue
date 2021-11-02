<template>
    <div id="bg">
        <br><br>
        <NavBarGeneral/>
        <div id="main">
            <p class="text-3xl" id="heading">Mental Health Matters</p>
            <p>We provide free, private online counselling <br>
            for everyone. A video call, voice call or just chat - <br>
            choose whichever you are comfortable with!</p> <br>
            <button class="btn btn-primary btn-active" id="registerButton" @click="goToLogin()">Register</button>
            
        </div>
    </div>
</template>

<script>
import NavBarGeneral from "@/components/General/NavBarGeneral.vue"

export default {
    components: {NavBarGeneral},
    name:"Home",

    data() {
        return{
            user:false,
        }
    },

    methods:{
        goToLogin(){
            this.$router.push('/patientLogin')
        }
    }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;800;900&display=swap");

#bg{
    position: relative;
    height: 100vh;
    background-size: cover;
    background-image: url("~@/assets/Home.png");
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
}
#main{
  float: right;
  margin-right: 140px;
  margin-top: 180px;
}
#heading{
    color:#417CC7;
    font-family: 'Nunito';
}
#registerButton{
    /* display:inline-block;
    padding:0.3em 1.2em;
    margin:0 0.3em 0.3em 0;
    border-radius:2em;
    box-sizing: border-box;
    text-decoration:none;
    font-family:'Roboto',sans-serif;
    font-weight:300;
    color:#FFFFFF;
    text-align:center;
    transition: all 0.2s; */
    background-color:#4eb5f1;
}
#registerButton:hover{
    background-color:#4095c6;
}
</style>