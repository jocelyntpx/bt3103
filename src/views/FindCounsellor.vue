<template>
<br><br>
  <h1>Currently Available</h1><br><br>
  <h5>These counsellors are available now to take on your choice of call, video call or chat session. <br>
  You can also choose to schedule a session with them for later, subjected to their availability. </h5>

  <br><br>
  <Home/>
</template>

<script>
import Home from "@/components/daily.vue";

export default {
  components: {Home },
  name: 'FindCounsellor', 
data(){
    return{
        refreshComp:0
    }
}, 
methods:{
    change(){
        this.refreshComp += 1
    }
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
</style>
