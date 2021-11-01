<template>
    <br><br>
    <NavBarGeneral/>
    <div id="app">
        <h1>Counsellor's Login</h1>
        <p>This page is only for counsellors. Please use the login button on the navigation bar <br> 
            above to login to/register your account. </p>
        <br/>
    </div> 

    <div class="wrapper">
        <div id="formContent">
            <h2 class="active"> Sign In </h2>

            <!-- <form> -->
            <input type="text" id="email_c" class="fadeIn second" required="" placeholder="Enter email">
            
              <input v-if="showPassword" :type="type" id="password" class="fadeIn third" required="" placeholder="Enter password">
              <input v-else :type="type" id="password" class="fadeIn third" required="" placeholder="Enter password">
              <button @click="showPassword" class="fadeIn third">{{ btnText}}</button>
            <!-- </form> -->
  
            <input type="submit" id="savebutton" class="fadeIn fourth" value="LogIn" v-on:click="login()">


            <div id="formFooter">
              <label for="my-modal-2" class="btn btn-primary modal-button">Forget Password?</label> 
              <input type="checkbox" id="my-modal-2" class="modal-toggle"> 
              <div class="modal">
                <div class="modal-box">
                    <div class="form-control"> 
                    <label class="label" for="email"><strong>Email: </strong></label>
                    <input class="input input-primary input-bordered" type="text" id="email" required="" name="email" v-model="email">
                    <!-- <input type="text" id="password" required="" name="login" placeholder="Enter password"> -->
                  </div>
            
                  <div class="modal-action">
                    <label for="my-modal-2" class="btn btn-primary" @click="reset()" >Reset</label> 
                    <label for="my-modal-2" class="btn">Close</label>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>

</template>

<script>
import firebase from '@/uifire.js'
import 'firebase/compat/auth';
import 'firebaseui/dist/firebaseui.css'
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore"
import { collection, query, where, getDocs } from "firebase/firestore";
import NavBarGeneral from "@/components/General/NavBarGeneral.vue"
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
    components: {NavBarGeneral,},
    name: "CounsellorLogin",

    data() {
        return {
            email: "",
            password: "",
            type: 'password',
            btnText: "Show Password"
        };
    },

    methods: {
        showPassword() {
          if(this.type === 'password') {
            this.type = 'text'
            this.btnText = 'Hide Password'
          } else {
            this.type = 'password'
            this.btnText = 'Show Password'
          }
        },

        async login() {
            this.email=document.getElementById("email_c").value;
            this.password=document.getElementById("password").value;

            if (this.email == "" || this.password== ""){
                alert("Please fill in your email and password!")
            } else {
                // var data = await getDoc(query(collection(db, "Counsellors"), where("email", "==", this.email)));

                const counsellorsRef = collection(db, "Counsellors")
                const data = await getDocs(query(counsellorsRef, where("email", "==", this.email)))
                var counsellorID = ""
                data.forEach((doc) => {
                  console.log(doc.id)
                  counsellorID = doc.id
                })

                // getDocs(collection(db,String(user))) 
                // db.collection("Counsellors").where("email","==",this.email).get()
                if(data.empty) {
                    alert("This is the admin page. Please proceed to the user login page instead!")
                } else {
                  await firebase
                        .auth()
                        .signInWithEmailAndPassword(this.email, this.password)
                        .then(() => {
                          // alert('Successfully logged in');
                            // this.$router.push({ path: '/counsellorProfile'});
                            // this.$router.push({ name: 'CounsellorProfile', params: { id: this.email } });
                            this.$router.push({ name: 'CounsellorProfile', params: { id: counsellorID } });
                        })
                        .catch(error => {
                            alert(error.message);
                        });
                }
            }
        },

        reset() {
          console.log(this.email)
          const auth = getAuth();
          if (this.email != "") {
            sendPasswordResetEmail(auth, this.email)
              .then(() => {
                console.log("email sent")
                alert("Check your email for further instructions to reset your password!")
              })
              .catch(function(error) {
                alert(error);
              });
          } else {
            alert("Please fill in your email.");
          }
        },
    },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.formli{
    display: inline-block;
    text-align: right;
}

form{
    text-align: inline-block;
    align-items: center;
    margin: auto;
}

@import url('https://fonts.googleapis.com/css?family=Poppins');

/* BASIC */

html {
  background-color: #56baed;
}

body {
  font-family: "Poppins", sans-serif;
  height: 100vh;
}

a {
  color: #92badd;
  display:inline-block;
  text-decoration: none;
  font-weight: 400;
}

h2 {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  display:inline-block;
  margin: 40px 8px 10px 8px; 
  color: #cccccc;
}

/* STRUCTURE */

.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column; 
  justify-content: center;
  width: 100%;
  min-height: 100%;
}

#formContent {
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  position: relative;
  padding: 0px;
  -webkit-box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
  box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
  text-align: center;
}

#formFooter {
  background-color: #f6f6f6;
  border-top: 1px solid #dce8f1;
  padding: 25px;
  text-align: center;
  -webkit-border-radius: 0 0 10px 10px;
  border-radius: 0 0 10px 10px;
}


/* TABS */

h2.active {
  color: #0d0d0d;
  border-bottom: 2px solid #5fbae9;
}


/* FORM TYPOGRAPHY*/

input[type=button], input[type=submit], input[type=reset]  {
  background-color: #56baed;
  border: none;
  color: white;
  padding: 15px 80px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;
  font-size: 13px;
  -webkit-box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
  box-shadow: 0 10px 30px 0 rgba(95,186,233,0.4);
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
  margin: 5px 20px 40px 20px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

input[type=button]:hover, input[type=submit]:hover, input[type=reset]:hover  {
  background-color: #39ace7;
}

input[type=button]:active, input[type=submit]:active, input[type=reset]:active  {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

input[type=text], input[type=password] {
  background-color: #E8F0FE;
  border: none;
  color: #0d0d0d;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  width: 85%;
  border: 2px solid #f6f6f6;
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;
  -webkit-border-radius: 5px 5px 5px 5px;
  border-radius: 5px 5px 5px 5px;
}

input[type=text]:focus {
  background-color: #fff;
  border-bottom: 2px solid #5fbae9;
}

input[type=text]:placeholder {
  color: #cccccc;
}

/* ANIMATIONS */

/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@-moz-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

.fadeIn {
  opacity:0;
  -webkit-animation:fadeIn ease-in 1;
  -moz-animation:fadeIn ease-in 1;
  animation:fadeIn ease-in 1;

  -webkit-animation-fill-mode:forwards;
  -moz-animation-fill-mode:forwards;
  animation-fill-mode:forwards;

  -webkit-animation-duration:1s;
  -moz-animation-duration:1s;
  animation-duration:1s;
}

.fadeIn.second {
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.fadeIn.third {
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.fadeIn.fourth {
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
  animation-delay: 1s;
}

/* Simple CSS3 Fade-in Animation */
.underlineHover:after {
  display: block;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 2px;
  background-color: #56baed;
  content: "";
  transition: width 0.2s;
}

.underlineHover:hover {
  color: #0d0d0d;
}

.underlineHover:hover:after{
  width: 100%;
}



/* OTHERS */

*:focus {
    outline: none;
} 

#icon {
  width:60%;
}

* {
  box-sizing: border-box;
}
</style>