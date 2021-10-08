<template>
    <h3>Counsellor Profile</h3>
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
    name:"CounsellorProfile" 
}
</script>