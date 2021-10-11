<!-- #bgBlock {
  border-radius: 35px;
  background: #B9D9EB;
  padding: 20px;
  width: 80%;
  height: 450px;
  margin:auto;
} -->

<template>

  <br>    
  <div class = "main">
    <div class = "buttons">
      <button @click="showCurrentlyAvailable = true" class = "counsellor_btn">Currently Available</button>
      <button @click="showCurrentlyAvailable = false" class = "counsellor_btn">All Counsellors</button>
    </div>

    <div class = "search_bars">
      <input type="text" v-model="search" placeholder="Search for a counsellor"/>
      <FilterByCounsellorCategory/>
    </div>

  </div><br><br>



  <div class = "counsellors_list">
    <div class = "available_counsellors_list" v-if = "showCurrentlyAvailable">  
         <h5>These counsellors are available now to take on your choice of call, video call or chat session. <br>
         You can also choose to schedule a session with them for later, subjected to their availability. </h5> <br>
         
         <div> 
          Currently avail counsellors shown here, 3 per row <br>
          <CounsellorsCurrentlyAvailable/>
         </div>
    </div>

    <div class = "all_counsellors_list" v-else> 
      <h5> Showing all counsellors. </h5> <br>

      <div> All counsellors shown here, 3 per row </div>
    </div>
  </div> 



  <br><br>
  <h1> IGNORE ALL BELOW; JUST FOR VIEW </h1>

  <Home/>
  <br><br>

  <PatientRecords/>

</template>


<script>
import Home from "@/components/daily.vue";
import PatientRecords from './PatientRecords.vue';

import CounsellorsCurrentlyAvailable from "@/components/CounsellorsCurrentlyAvailable.vue";
import FilterByCounsellorCategory from "@/components/FilterByCounsellorCategory.vue"


export default {
  components: {
    CounsellorsCurrentlyAvailable,FilterByCounsellorCategory,PatientRecords,Home
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
.buttons,.search_bars {
  height: 50px;
  font-size: 20px;
  margin: 0 auto;
  display: inline-block;
}
.counsellor_btn {
  float: left;
  width: 180px;
  height: 100%;
  background-color: #B9D9EB);
  padding: 14px 28px;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}
.counsellor_btn:hover {
  background-color: lightblue;
  color: black;
}

.search_bars {
  width: 800px;
  margin: 0 auto;
}

</style>
