<template>
    <div id="logged" >
        <div id="nav">
            <router-link to="/counsellorProfile">My Profile</router-link> | 
            <router-link to="/myPatients">My Patients</router-link> | 
            <router-link to="/about">About Us</router-link> | 
            <router-link to="/helpResources">Help Resources</router-link>
            <!-- <router-link to="/logout">Logout</router-link> -->
        </div>
    </div>
</template>

// <script>
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// export default {
//     name:'NavBarPatient',

//     data() {
//         return {
//             user:false,
//         }     
//     },

//     mounted() {
//         const auth = getAuth();
//         onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 this.user = user;
//             }
//         })
//     }
// }
// </script>

<style scoped>

#mhm{
  float: left;
  margin-left: 100px;
  margin-top: -2px;

  /* idk why but only -2px then looks aligned  */
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

