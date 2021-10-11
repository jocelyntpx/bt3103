<template>

  <h1>Rose Lee </h1>
   
  <UserInfo/>
  <br>
  <UserPreviousSessions/>
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

<style>

</style>