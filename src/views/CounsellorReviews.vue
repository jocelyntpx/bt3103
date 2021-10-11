<template>
    <h1> Reviews for Mr John Tan </h1><br><br>
    <div id = "leaveReview" v-if = "userNotLeftReview">
        We notice you have not yet left a review for your previous session with Mr John Tan. 
        Leave a review now! (This is to be linked to the router page to leave a review)
    </div><br>

    <div class = "bgBlock">
        <h3> Recent Reviews (Total: 2 Reviews) </h3>
        <table class="table">
            <tr class="header"> 
                <th>Review Date</th> 
                <th>Rating</th>
                <th>Review</th>
            </tr>
            <!-- For loop to list the reviews -->
            <tr>
                <td>10/10/21</td>
                <td>★★★☆☆</td>
                <td>Was an okay session</td>
            </tr>
        </table>
    </div>


</template>

<script>
export default {
    data(){
        return{
            userNotLeftReview: true // Ultimately i think this argument wld be passed as a prop or something??
    }
}
}
</script>

<style scoped>

#leaveReview {
    border-radius: 35px;
    width: 50%;
    background-color:azure;
    margin-left:10%;
    padding:20px;
}

</style>