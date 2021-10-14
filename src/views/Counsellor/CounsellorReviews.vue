<template>
    <div id = "backBtn">
        <router-link to="/counsellorProfile"> ← Back to My Profile page</router-link>
    </div>

    <h1> Reviews for Mr John Tan </h1><br><br>

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

</script>

<style scoped>
#backBtn{
  text-align: left;
  margin-left: 250px; 
}

</style>