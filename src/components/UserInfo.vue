<template>
  <!-- This component templates the user info (seen in Patients records, User's profile page ) -->
  <div><h3 id = "profilePage"><strong>This is the profile page</strong></h3></div>
  <div>
      <p> Name: <strong>{{user.displayName}}</strong><br>
      Email: <strong>{{user.displayName}}</strong><br>
      Uid: <strong>{{user.displayName}}</strong><br>
      Provider: <strong>{{user.displayName}}</strong> </p>
  </div>
</template>

<script>
export default {
  name: "UserInfo"
}
</script>

<style scoped>
#profilePage {

}

</style>