<template>
    <br><br>
    <NavBarCounsellor/>

  This is session notes page. Session id is {{this.sessionID}}
</template>

<script>
import NavBarCounsellor from "@/components/NavBarCounsellor.vue"

export default {
    components: {NavBarCounsellor},
    data() {
        return {
            sessionID: this.$route.params.id,
        }
    }
}
</script>

<style>

</style>