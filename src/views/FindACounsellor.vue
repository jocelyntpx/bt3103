<template>

  <br>    
  <div id = "counsellor_btn_div">
      <button @click="showCurrentlyAvailable = true">Currently Available</button>
      <button @click="showCurrentlyAvailable = false">All Counsellors</button>
    </div>

  <div id = "counsellors_list">
    <div id = "available_counsellors_list" v-if = "showCurrentlyAvailable">  
         <h5>These counsellors are available now to take on your choice of call, video call or chat session. <br>
         You can also choose to schedule a session with them for later, subjected to their availability. </h5> <br>
         
         <div> 
          Currently avail counsellors shown here, 3 per row <br>
          <CounsellorsCurrentlyAvailable/>
         </div>
    </div>

    <div id = "all_counsellors_list" v-else> 
      <h5> Showing all counsellors. </h5> <br>

      <div> All counsellors shown here, 3 per row </div>
    </div>
  </div> 



    


  <br><br>
  <Home/>
</template>

<script>
import Home from "@/components/Daily.vue";
import CounsellorsCurrentlyAvailable from "@/components/CounsellorsCurrentlyAvailable.vue";

export default {
name: 'FindACounsellor', 
components: {
  Home,CounsellorsCurrentlyAvailable 
},

data(){
    return{
      showCurrentlyAvailable: true
    }
}, 

methods:{

}
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#counsellor_btn_div {
  width: 200px;
  margin: 0 auto;
  display: inline;

  /* display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  position: relative;
  width: 465.65px;
  height: 680px;
  left: 466px;
  top: 672px;

  background: #FFFFFF;
  box-shadow: 0px 5px 20px 20px rgba(0, 0, 0, 0.02);
  border-radius: 10px; */ 
  }

</style>
