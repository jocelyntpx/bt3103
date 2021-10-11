<template>

  <!-- This component templates the user info (seen in Patients records, User's profile page ) -->
  <!-- <div><h3 id = "profile_page"><strong>This is the User Info</strong></h3></div> -->

  <div id = "user_info"> 
    <p> Joined since 10/05/2021 </p>
    <strong>Name:</strong> Rose Lee<br>
    <strong>Email:</strong> roseLee@gmail.com<br>
  </div> 


  <!-- <div>
      <p> Name: <strong>{{user.displayName}}</strong><br>
      Email: <strong>{{user.displayName}}</strong><br>
      Uid: <strong>{{user.displayName}}</strong><br>
      Provider: <strong>{{user.displayName}}</strong> </p>
  </div> -->
</template>

<script>
export default {

}
</script>

<style scoped>
#user_info {
  align-content: center;
  /* text-align:left; */
}

</style>