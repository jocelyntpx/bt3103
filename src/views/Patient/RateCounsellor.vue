<template>
    <br><br>
    <div id = "backBtn">
        <router-link to="/patientProfile"> ← Back to My Profile page</router-link>
    </div>
    <h1>Rate Counsellor!</h1>
    <p> Kindly leave a rating/review for your counsellor. </p>
    <div id="bgBlock">
        <h2>Mr John Tan</h2>
        <h1>☆☆☆☆☆</h1>
        <div id="innerBlock">
            <p>good</p>
        </div>
        <button id="submit">Submit</button>
    </div>
</template>

<script>

export default {
    name: "RateCounsellor",
}
</script>


<style scoped>
#bgBlock {
  border-radius: 35px;
  background: #B9D9EB;
  padding: 20px;
  width: 80%;
  height: 450px;
  margin:auto;
}
#innerBlock {
  border-radius: 35px;
  background: azure;;
  padding: 20px;
  width: 60%;
  height: 250px;
  margin:auto;
}
#submit{
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
#submit:hover{
    background-color:#4095c6;
}
#backBtn{
  text-align: left;
  margin-left: 250px; 
}
</style>