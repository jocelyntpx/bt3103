<template>
    <div>
        <v-calendar :attributes="attributes" @dayclick="onDayClick"/>
        <br><br>
    </div>
</template>

<script>

export default {
    name:"CounsellorCalendar",
    emits: ["updateFilteredDays"],

    data() {
        return {
            date: "",
            // attributes: [
            //     {
            //         key: this.date,
            //         highlight: true,
            //         dates: this.date
            //     }
            // ]
        }
    },

    methods: {
        onDayClick(day) {
            console.log("day.id from AllCounsellorsCalendarFilter: ", day.id);
            this.date = day.id
            this.$emit("updateFilteredDays", day.id) // send to parent
        }
    }
}

</script>