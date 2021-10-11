<template>
  <div id = "counsellor_preview_box"> 
    <h5><router-link to="/counsellorProfile">Mr John Tan</router-link></h5>
      ★★★☆☆ <br>
      Career <br><br>

  </div>
</template>

<script>

export default {
  name: "NotAvailableCounsellors",
  data() {

  },
  methods: {
  }
}
</script>

<style scoped>
#counsellor_preview_box {
  padding: 5px;
  width: 30%;
  background-color: white;
}
#consult_now {
  background-color: blueviolet;
  color: white;
}
</style>