<template>
    <div id="logged">
        <div id="nav">
            <!-- <div id="mhm"> -->
              <img id="mhmlogo" src="@/assets/mhmlogo.png" alt="" width="60" height="35">
              <h3 id="mhm">Mental Health Matters</h3>
            <!-- </div> -->
            <router-link to="/adminLogin">Admin</router-link> | 
            <router-link to="/">Home</router-link> | 
            <router-link to="/about">About Us</router-link> | 
            <router-link to="/helpResources">Help Resources</router-link> | 
            <router-link to="/contactUs">Contact Us</router-link> | 
            <router-link to="/patientLogin">Login</router-link> 
        </div>
    </div>
</template>

<style scoped>

#mhm{
  float: left;
  margin-left: 5px;
  margin-top: -2px;

  /* idk why but only -2px then looks aligned  */
} 

#mhmlogo {
  float: left;
  margin-left: 70px;
  margin-top: -10px;

}

#nav {
  text-align: right;
  /* float: right; */
  margin-right: 50px; 
}

#nav a{
  font-weight: bold;
  color:lightslategray;
}

#nav a.router-link-exact-active {
  color:black;
}
</style>




