<template>
    <v-container>
    </v-container>
</template>

<script>
import project_api from "@/apis/project.js"

export default {
    data: () => ({
        prj_id: 0
    }),

    computed: {
    },

    created: async function() {
        this.prj_id = this.$route.query.prj_id
    },

    methods: {
    }
}
</script>