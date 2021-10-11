<template>
    <h3>Counsellor Profile</h3>
    <!-- Removed the user check for now bc doesnt seem to be loading properly -->
    <!-- <div style="text-align:center;" v-if="user"> -->
    <div style="text-align:center;">
        <div><h3><strong>This is the profile page</strong></h3></div>
        <!-- <div v-if="user"> -->
        <div> 
            <!-- <div>
                <p> Name: <strong>{{user.displayName}}</strong><br>
                Email: <strong>{{user.displayName}}</strong><br>
                Uid: <strong>{{user.displayName}}</strong><br>
                Provider: <strong>{{user.displayName}}</strong> </p>
            </div> -->
            <div>
                <p> Name: <strong>XXX</strong><br>
                Email: <strong>XXX</strong><br>
                Uid: <strong>XXX</strong><br>
                Provider: <strong>XXX</strong> </p>
            </div>

            <div id = "reviewsTab"> 
                <router-link to="/CounsellorReviews">View Patients' Reviews</router-link>
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