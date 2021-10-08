<template>
    <h3>My Patients</h3>
    <div style="text-align:center;" v-if="user">
        <div><h3><strong>This is the my patients page</strong></h3></div>
        <Logout/>
    </div>
</template>

<script>
export default {
    name:"MyPatients" 
}
</script>