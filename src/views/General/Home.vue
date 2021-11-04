<template>
    <div id="bg">
        <br><br>
        <NavBarGeneral/>
        <div id="main">
            <p class="text-3xl -mt-16" id="heading">Mental Health Matters</p>
            <p>We provide free, private online counselling <br>
            for everyone. A video call, voice call or just chat. <br>
            Choose whichever you are comfortable with!</p> <br>
            <button class="btn btn-primary btn-active mb-24" id="registerButton" @click="goToLogin()">Register</button>

        <div class="grid grid-flow-row " id="logos">
            <div class="mt-8 font-semibold mb-2">In Partnership With:</div>

            <div class="grid place-items-center">
                <div class="grid grid-flow-col auto-cols-max gap-x-4">
                    <img id="SOSlogo" src="@/assets/SOS.png" alt="" width="100" height="85">
                    <img id="SAClogo" src="@/assets/SAC.png" alt="" width="170" height="78">
                </div>
            </div>

            <div class="grid place-items-center">
            <div class="mt-8 font-semibold"> Fully Funded By: </div>
            <img id="MOHlogo" src="@/assets/MOH.png" alt="" width="190" height="90">
            </div>
        </div>
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