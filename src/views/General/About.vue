<template>
<br><br>
<NavBarGeneral/>
<br>
    <div id="bg">
        <div id="textPosition">
            <h1>About Us</h1>
            <p>Mental Health Matters is an extension to the Samaritans of Singapore (SOS).<br> 
                MHM aims to provide you a better environment to seek mental help with more options - <br>
                video call, voice call and chat.</p>
        </div>
    </div>
    <a href="https://www.freepik.com/vectors/templates">Credit: Our website uses some template vectors created by freepik - www.freepik.com</a>
</template>

<script>
import NavBarGeneral from "@/components/General/NavBarGeneral.vue"

export default {
    components: {NavBarGeneral},
    name:"About" 
}
</script>

<style scoped>
#bg{
    position: relative;
    width: 100%;
    height: 90vh;
    background-size: cover;
    background-image: url("~@/assets/aboutUs.png");
    background-repeat: no-repeat;
    background-position: center center;
    text-align: center;
    margin:auto;
    padding: 0;
}
#textPosition{
    text-align: center;
    padding: 30px;
}
</style>