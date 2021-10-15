<template>
    <div id = "backBtn">
        <router-link to="/myPatients"> ← Back to My Patients page</router-link>
    </div>

    <h1>Rose Lee</h1>
    
    <UserInfo/>
    <br>
    <UserPreviousSessions/>
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
#backBtn{
  text-align: left;
  margin-left: 250px; 
}
</style>