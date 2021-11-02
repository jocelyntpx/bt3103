<template>
<br><br>
<NavBarGeneral/>
<br>
    <div id="bg">
        <div id="textPosition">
            <p class="text-4xl">About Us</p>
            <br>
            <p>Mental Health Matters is an extension to the Samaritans of Singapore (SOS).<br> 
                We aim to provide you with a safe environment to seek mental help with more options - <br>
                video call, voice call and chat. <br>
                </p>
        </div>
    </div>
    <footer class="p-4 footer bg-base-300 text-base-content footer-center">
  <div>
    <p href="https://www.freepik.com/vectors/templates" class="text-base">Credit: Our website uses some template vectors created by freepik - www.freepik.com</p>
  </div>
  </footer>
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