<template>
  <div v-if="user">
    <br /><br />
    <NavBarCounsellor />
    <br />
    <div id="bg">
      <div id="textPosition">
        <br /><br />
        <p class="text-4xl flex">Help Resources</p>
        <br />
        <p class="flex justify-center">
          This is where you can post new articles and <br />
          edit articles you have already posted.
        </p>
        <br /><br />
        <div class="grid place-items-center">
          <div class="tabs tabs-boxed">
            <div>
              <button
                @click="showCreate = true"
                :class="[showCreate ? 'tab tab-md tab-active' : 'tab tab-md']"
              >
                Create New Article
              </button>
            </div>
            <div>
              <button
                @click="showCreate = false"
                :class="[
                  !showCreate ? 'tab tab-md tab-red tab-active' : 'tab tab-md',
                ]"
              >
                Edit My Article
              </button>
            </div>
          </div>
        </div>

        <br /><br /><br />
      </div>
    </div>
    <div class="bigContainer">
      <br /><br />
      <!-- create -->
      <div class="create_list" v-if="showCreate">
        <br />
        <h4>
          You are about to create a new article to be added onto Help Resources.
        </h4>
        <br />
        <div class="bg-base-300 text-base-content">
          <div class="bgBlock1">
            <AddArticle />
            <br /><br /><br /><br /><br /><br /><br /><br />
          </div>
        </div>
      </div>

      <!-- edit -->
      <div class="edit_list" v-else>
        <h4>Edit your past articles here.</h4>
        <br />
        <div class="bg-base-300 text-base-content">
          <div class="bgBlock2">
            <div class="form-control flex-auto w-1/3 ">
              <input
                type="text"
                class="input input-sm input-primary input-bordered "
                v-model="search"
                placeholder="Search for your article"
              />
            </div>

            <br />
            <EditArticle :key="refreshComponent" :search="this.search" />
            <br /><br /><br /><br /><br /><br /><br /><br />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBarCounsellor from "@/components/Counsellor/NavBarCounsellor.vue";
import AddArticle from "@/components/Counsellor/AddArticle.vue";
import EditArticle from "@/components/Counsellor/EditArticle.vue";

export default {
  components: { NavBarCounsellor, AddArticle, EditArticle },
  name: "HelpResourcesAdmin",

  data() {
    return {
      user: false,
      showCreate: this.$route.params.showUpcoming,
      refreshComponent: 0,
      search: "",
    };
  },

  watch: {
    search() {
      this.refreshComponent += 1;
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
.search_bar {
  float: right;
  margin-right: 30px;
}

#bg {
  position: relative;
  width: 100%;
  height: 550px;
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
  margin-top: 50px;
  text-align: left;
}

#createNewArticle {
  float: left;
  font-size: 15px;
  border: 2px solid rgb(125, 202, 233);
  border-radius: 20px;
  height: 30px;
}

#editArticle {
  float: left;
  font-size: 15px;
  margin-left: 50px;
  border: 2px solid rgb(125, 202, 233);
  border-radius: 20px;
  height: 30px;
}
</style>
