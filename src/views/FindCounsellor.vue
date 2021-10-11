<template>
<h1> Find a Counsellor </h1><br><br>
  
  <div class = "main">
    <div class = "buttons">
      <div><button @click="showCurrentlyAvailable = true" id = "counsellor_btn_avail">Currently Available</button></div>
      <div><button @click="showCurrentlyAvailable = false" id = "counsellor_btn_all">All Counsellors</button></div>
    </div>

    <div class = "search_bars">
      <div class = "top">
        <input type="text" class = "search_for_counsellor" v-model="search" placeholder="Search for a counsellor"/>
      </div><br>
      <div class = "bottom">
        <FilterByCounsellorCategory/>
      </div> 
    </div>

  </div><br><br>

  <div class = "counsellors_list">
<!-- Currently available counsellors -->
    <div class = "available_counsellors_list" v-if = "showCurrentlyAvailable">  
      <h5>These counsellors are available now to take on your choice of call, video call or chat session. <br>
      You can also choose to schedule a session with them for later, subjected to their availability. </h5> <br>
      
      <div> 
      Currently avail counsellors shown here, 3 per row <br>
        <div class = "counsellors_box">
          <CounsellorsCurrentlyAvailable/>
        </div>
      </div>
    </div>
<!-- All counsellors -->
    <div class = "all_counsellors_list" v-else> 
      <h5> Showing all counsellors. </h5> <br>

      <div> All counsellors shown here, 3 per row </div>
    </div>
  </div> 



</template>


<script>
import CounsellorsCurrentlyAvailable from "@/components/CounsellorsCurrentlyAvailable.vue";
import FilterByCounsellorCategory from "@/components/FilterByCounsellorCategory.vue"

export default {
  components: {
    CounsellorsCurrentlyAvailable,FilterByCounsellorCategory
   },
  name: 'FindCounsellor', 
data(){
    return{
      showCurrentlyAvailable: true
    }
}, 
methods:{

}
}
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
.main {
  width: 80%;
  margin: auto;
  height: 150px;
}
.buttons {
  width: 80%; 
  height: 100%;
  float: left; 
  /* background: green; */
}
.search_bars {
  height: 100px;
  margin-left: 80%;
  align: left;
  /* font-size: 20px; */
  /* margin: 0 auto; */
  /* display: inline-block; */
}
#counsellor_btn_avail,#counsellor_btn_all {
  float: left;
  width: 45%;
  height: 100%;
  padding: 44px 28px;
  font-size: 30px;
  cursor: pointer;
  text-align: center;
}
/* #counsellor_btn_avail,#counsellor_btn_all:active {
  font-weight: bold;
  text-decoration: underline;
  background-color: #B9D9EB;
} */

.top {
  width: 100%;
  /* align: left; */
  /* align-content: stretch; */
}
.counsellors_box {
  background-color: #B9D9EB;
  width: 80%;
  margin: auto;
  padding: 20px;
}
.search_for_counsellor {
  width: 100%;
}

</style>
