<template>
  <div id = "backBtn">
    <router-link to="/myPatients"> ← Back to My Patients page</router-link>
  </div>
  <h2>Patient's Records</h2>

    <div id="bgBlock">
      <UserInfo/>
      <br>
      <UserPreviousSessions/>
      <br>
    </div>
  <!-- </div>  -->
</template>

<script>
import UserInfo from "@/components/UserInfo.vue";
import UserPreviousSessions from "@/components/UserPreviousSessions.vue"

export default {
components: {
    UserInfo,UserPreviousSessions
},
name: "PatientRecords",
data() {
    return {

    }
}


}
</script>

<style scoped>
#bgBlock {
    border-radius: 35px;
    background: #B9D9EB;
    padding: 20px;
    width: 80%;
    height: 100%;
    margin:auto;
} 

#backBtn{
  text-align: left;
  margin-left: 250px; 
}
</style>