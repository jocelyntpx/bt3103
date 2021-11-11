<template>
  <div id="logged" v-if="user">
    <div id="nav">
      <img
        id="mhmlogo"
        src="@/assets/mhmlogo.png"
        alt=""
        width="60"
        height="35"
      />
      <h3 id="mhm">Mental Health Matters</h3>
      <router-link
        :to="{ name: 'CounsellorProfile', params: { id: this.fbuser } }"
        >My Profile</router-link
      >
      |
      <router-link :to="{ name: 'MyPatients', params: { showUpcoming: true } }"
        >My Patients</router-link
      >
      | <router-link to="/helpResourcesAdmin">Help Resources</router-link> |
      <Logout />
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Logout from "@/components/General/Logout.vue";

export default {
  name: "NavBarCounsellor",
  components: {
    Logout,
  },

  data() {
    return {
      user: false,
      fbuser: "",
    };
  },

  mounted() {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.fbuser = user.uid;
      }
    });
  },
};
</script>

<style scoped>
#mhm {
  float: left;
  margin-left: 10px;
  margin-top: -2px;
}

#mhmlogo {
  float: left;
  margin-left: 110px;
  margin-top: -10px;
}
#nav {
  text-align: right;
  margin-right: 50px;
}

#nav a {
  font-weight: bold;
  color: lightslategray;
}

#nav a.router-link-exact-active {
  color: black;
}
</style>
