<template>
  <br /><br />
  <div v-if="user">
    <NavBarPatient />
  </div>
  <div v-else>
    <NavBarGeneral />
  </div>
  <br />
  <div>
    <div id="bg">
      <div id="textPosition">
        <br /><br />
        <p class="text-4xl flex">Help Resources</p>
        <br />
        <p class="flex justify-center">
          Browse through our articles to find out <br />
          how you can cope better with mental health.
        </p>
        <br />

        <div class="form-control flex-auto ">
          <input
            type="text"
            class="input input-sm input-primary input-bordered "
            v-model="search"
            placeholder="Search for an article"
          />
        </div>
      </div>
    </div>
    <div class="pt-20 pb-20">
      <AllHelpResources :key="refreshComponent" :search="this.search" />
    </div>
  </div>
</template>

<script>
import NavBarGeneral from "@/components/General/NavBarGeneral.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarPatient from "@/components/Patient/NavBarPatient.vue";
import AllHelpResources from "@/components/General/AllHelpResources.vue";

export default {
  components: { NavBarGeneral, NavBarPatient, AllHelpResources },
  name: "HelpResources",

  data() {
    return {
      user: false,
      refreshComponent: 0,
      search: "",
    };
  },

  watch: {
    search() {
      this.refreshComponent += 1;
      console.log("refreshcomponent", this.refreshComponent);
    },
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  },
};
</script>

<style scoped>
#bg {
  position: relative;
  width: 100%;
  height: 540px;
  background-size: cover;
  background-image: url("~@/assets/helpResources.png");
  background-repeat: no-repeat;
  background-position: center center;
  text-align: center;
  margin: auto;
  padding: 0;
}
#textPosition {
  position: relative;
  float: right;
  margin-right: 300px;
  margin-top: 100px;
  text-align: left;
}
</style>
