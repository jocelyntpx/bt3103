<template>
  This is session notes page. Session id is {{this.sessionID}}
</template>

<script>
export default {
    data() {
        return {
            sessionID: this.$route.params.id,
        }
    }
}
</script>

<style>

</style>