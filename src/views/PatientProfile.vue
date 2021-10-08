<template>
    <h3>Patient Profile</h3>
    <div id="bgBlock">
        <div id="patientDetails">
            <h3>Name: James Tan</h3>
            <h3>blahblahblah</h3>
        </div>
    </div>

    <div style="text-align:center;" v-if="user">
        <div><h3><strong>This is the profile page</strong></h3></div>
        <div v-if="user">
            <div>
                <p> Name: <strong>{{user.displayName}}</strong><br>
                Email: <strong>{{user.displayName}}</strong><br>
                Uid: <strong>{{user.displayName}}</strong><br>
                Provider: <strong>{{user.displayName}}</strong> </p>
            </div>
        </div>
        <Logout/>
    </div>
</template>

<script>
export default {
    name:"PatientProfile" 
}
</script>

<style scoped>
#bgBlock {
  border-radius: 35px;
  background: #B9D9EB;
  padding: 20px;
  width: 80%;
  height: 450px;
  margin:auto;
}

#patientDetails{
    float:left;
    margin-left: 20px;
}

</style>