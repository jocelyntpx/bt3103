<template>
  <h1> Rose Lee </h1>
  <UserInfo/>
  <br>
  <h3> Previous Sessions </h3>
  <UserPreviousSessions/>
</template>

<script>
import UserInfo from "@/components/UserInfo.vue";
import UserPreviousSessions from "@/components/UserPreviousSessions.vue"

export default {
components: {
    UserInfo,UserPreviousSessions
},
data() {
    return {

    }
}


}
</script>

<style>

</style>