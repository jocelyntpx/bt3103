<template>
<br><br>
<NavBarGeneral/>
<br>
        <div id="header">
            <div id="textPosition">
                <br><br>
                <p class="text-4xl">About Us</p>
            </div>
        </div>
        <div class="grid px-20 pt-20">
            <h1 class="font-semibold text-3xl text-left color">Who We Are</h1>
            <br>
            <p class="font-semibold text-left color">Mental Health Matters is an extension to the Samaritans of Singapore (SOS).</p>
            <p class="font-semibold text-left color"> We aim to provide you with a convenient and safe environment to seek help <i>anytime, anywhere.</i></p>
        </div>
        <div class="grid px-20 pt-20 pb-8">
            <h1 class="font-semibold text-3xl text-left color">Our mission, vision and values</h1>
        </div>
        <br>
        <div class="grid grid-cols-3 px-20 pb-20">
            <div>
                <img class="icon" src="@/assets/mission.png">
                <p class="font-bold text-lg title">Mission</p>
                <p> MHM aims to contribute to and enrich the 
                    <br>mental well-being of Singaporeans</p>
            </div>
            <div>
                <img class="icon" src="@/assets/vision.png">
                <p class="font-bold text-lg title">Vision</p>
                <p>To be available to anyone who needs help</p>
            </div>
            <div>
                <img class="icon" src="@/assets/values.png">
                <p class="font-bold text-lg title">Our Values</p>
                <p>Respect, Accountability, Confidentiality</p>
            </div>
        </div>
<!--         <div class="grid px-20 pt-20 pb-20">
            <h1 class="font-semibold text-3xl text-left color">Our Services</h1>
            <br>
            <p class="font-semibold text-left color">Professional counselling for those experiencing personal, relationship, and work related difficulties.</p>
            <br>
            <p class="text-left color">Available via various options - video call, voice call, and chat. </p>
            <p class="text-left color">Round the clock support at your convenience, anytime anywhere</p>
        </div> -->
    <div class="grid grid-cols-2">
        <div id="counsellor">
            <div class="px-20">
                <br><br><br>
                <p class="font-bold text-md color">GET INVOLVED</p>
                <h1 class="font-bold text-3xl color">Be a Volunteer</h1>
                <br>
                <img class="icon2" src="@/assets/volunteer.png">
                <br>
                <p class="text-left">MHM offers various volunteering opportunities to fit your availability and area of expertise.</p>
                <br>
                <p class="text-left"> You can look forward to opportunities for growth and learning, meet like-minded friends and offer your support to someone in need.</p>
                <br><br>
                <p class="font-semibold color">Hope to have you onboard.</p>
                <br><br><br>
                <button class="btn" @click="goToContactUs()">Contact us</button>
            </div>
        </div>
        <div id="patient">
            <div class="px-20">
                <br><br><br>
                <p class="font-bold text-md color">GET HELP</p>
                <h1 class="font-bold text-3xl color">Need a listening ear?</h1>
                <br>
                <img class="icon2" src="@/assets/help.png">
                <br>
                <p class="text-left">Our professionally-trained counsellors provide a safe and non-judgemental space for you to talk about what you are feeling and develop ways to improve your well-being.</p>
                <br>
                <p class="text-left">Speak with us whichever way you find best - via <strong>video call, voice call or chat.</strong>
                    Our counsellors will happily accommodate to your needs.</p>
                <br><br>
                <p class="font-semibold color">Let's work together.</p>
                <br><br><br>
                <button class="btn" @click="goToLogin()">Register</button>
            </div>
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
    name:"About",
    methods:{
        goToLogin(){
            this.$router.push('/patientLogin')
        },
        goToContactUs(){
            this.$router.push('/contactUs')
        }
    }
}
</script>

<style scoped>
#header{
    position: relative;
    width: 100%;
    height: 300px;
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
.icon{
    width: 50px;
    height: 50px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.icon2{
    width: 100px;
    height: 100px;    
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.color {
    color: rgb(44,41,106)
}
#patient{
    background-color:rgb(180, 217,235);
    height: 650px;
}
#counsellor{
    background-color:rgb(211, 231, 245);
    height:650px;
}
</style>