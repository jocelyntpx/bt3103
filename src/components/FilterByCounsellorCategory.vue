<template>
  <div class="filters">
    <div class="filter">
        <label for="counsellor_category">Filter by counsellor category: </label>
        <select name="basic-dropdown" v-model="selectedCategory">
            <option>All Categories</option>
            <option>General</option>
            <option>Career</option>
            <option>Relationships</option>
        </select>
    </div> 

    <div class="result">
      You have selected: <strong>{{ selectedCategory }}</strong>
    </div>
  </div>
</template>
 
<script>
export default {
  data () {
    return {
      selectedCategory: 'All Categories'
    }
  }
}
</script>
 
<style scoped>
 
.filters {
  width: 800px;
  margin: 0 auto;
}
 
.filter {
  text-align: left;
}
 
.result {
  margin-top: 30px;
  text-align: left;
}
 
label {
  display: block;
}
 
</style>