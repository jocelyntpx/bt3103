<template>
    <br><br>
    <div id="bg">
        <br><br>
        <NavBarGeneral/>
        <!-- <img id="bg" src="@/assets/Home.png" alt="" class="center"> -->
        <div id="main">
            <h1 id="heading">Mental Health Matters</h1>
            <p>blahblahblah...</p>
            <button id="registerButton">Register</button>
            
        </div>
        <br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br>
        <br><br><br><br><br><br><br><br><br><br><br>
    </div>
</template>

<script>
import NavBarGeneral from "@/components/NavBarGeneral.vue"

export default {
    components: {NavBarGeneral},
    name:"Home",
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;800;900&display=swap");

#bg{
    position: relative;
    height: 100%;
    background-size: cover;
    background-image: url("~@/assets/Home.png");
    background-repeat: no-repeat;
    background-position: center;
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
    display:inline-block;
    padding:0.3em 1.2em;
    margin:0 0.3em 0.3em 0;
    border-radius:2em;
    box-sizing: border-box;
    text-decoration:none;
    font-family:'Roboto',sans-serif;
    font-weight:300;
    color:#FFFFFF;
    background-color:#4eb5f1;
    text-align:center;
    transition: all 0.2s;
}
#registerButton:hover{
    background-color:#4095c6;
}
</style>