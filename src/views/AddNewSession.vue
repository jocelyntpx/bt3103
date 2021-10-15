            
<template>
    <!-- Removed the user check for now bc doesnt seem to be loading properly -->
    <h3>Counsellor Profile</h3> 
    <div id="bgBlock">
        <div id="col-1">
            <!-- <div v-if="user"> -->
            <div id="counsellor">
                <div id="col-1-1">
                    <img id="profilePic" alt="Vue logo" src="https://icon-library.com/images/user-icon-jpg/user-icon-jpg-28.jpg">
                </div>
                <div id="col-1-2">
                    <h2>Mr John Tan</h2>
                    <h4>Rating: 4.5/5 stars</h4>
                    <div id = "reviewsTab"> 
                        <router-link to="/CounsellorReviews">View Patients' Reviews</router-link>
                    </div>
                </div>
            </div>
            <ul id="counsellorInfo">
                <li>Certified under the counselling specialist programme</li>
                <li>5 years of experience as a on call counsellor</li>
                <li>Specializes in career concerns</li>
            </ul>
            <!--<div>-->
                <!-- <div>
                    <p> Name: <strong>{{user.displayName}}</strong><br>
                    Email: <strong>{{user.displayName}}</strong><br>
                    Uid: <strong>{{user.displayName}}</strong><br>
                    Provider: <strong>{{user.displayName}}</strong> </p>
                </div> -->
                <!--<div>
                    <p> Name: <strong>XXX</strong><br>
                    Email: <strong>XXX</strong><br>
                    Uid: <strong>XXX</strong><br>
                    Provider: <strong>XXX</strong> </p>
                </div>-->
            <!--</div>-->
            <button id="viewSchedule">
                VIEW SCHEDULE
            </button>
        </div>
        <div id="col-2">
            <h3>Create new session</h3>
            <CreateSession/>
        </div>
    </div>
</template>

<script>
import CreateSession from '@/components/CreateSession.vue'
export default {
    name:"CounsellorProfile",
    components:{CreateSession}
}
</script>

<style scoped>

#bgBlock {
    display:flex;
    border-style:solid;
    border-color:#B9D9EB;
    border-width: 2px;
    background: transparent;
    border-radius: 20px;
    padding: 20px;
    width: 80%;
    height: 500px;
    margin: auto;
}
#col-1 {
  background-color: transparent;
  flex: 1;
  text-align: left;
}

#col-2 {
  background-color:rgb(224, 236, 247);
  flex: 1;
}

#col-1-1, #col-1-2 {
    align-self: center;
    padding: 20px;
}

#counsellor {
    display: flex;
}

#counsellorInfo {
    text-align: left;
    line-height: 2em;
}

#profilePic {
    height: 120px;
    border-radius: 50%;
    border-color: black;
    border-width: 2px;
    border-style: solid;
}

#viewSchedule {
    position: absolute;
    top: 550px;
    right:1150px;
}

</style>