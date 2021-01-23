<template>
    <v-container class="px-0 py-0">
        <v-row>
            <v-col class="py-0 my-0 px-1">
                <v-text-field
                    label="Hr"
                    @change="setHr($event)"
                    type="number"
                ></v-text-field>
            </v-col>
            <v-col class="py-0 my-0 px-1">
                <v-text-field
                    label="Min"
                    @change="setMin($event)"
                    type="number"
                ></v-text-field>
            </v-col>
            <v-col class="py-0 my-0 px-1">
                <v-text-field
                    label=""
                    @change="setPct($event)"
                    type="number"
                ></v-text-field>
            </v-col>
            <v-col class="py-0 my-0 px-1">
                <v-text-field
                    label=""
                    @change="setTotalPct($event)"
                    type="number"
                ></v-text-field>
            </v-col>
            <v-col class="py-0 my-0 px-1">
                <v-text-field
                    label="Hr"
                    disabled
                ></v-text-field>
            </v-col>
            <v-col class="py-0 my-0 px-1">
                <v-text-field
                    label="Min"
                    disabled
                ></v-text-field>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "InputGroup",
    props: ["item"],

    data: () => ({
    }),

    methods: {
        setHr: function(event) {
            this.item.hr = event
        },

        setMin: function(event) {
            this.item.min = event
        },

        setPct: function(event) {
            this.item.pct = event
        },

        setTotalPct: function(event) {
            this.item.totalPct = event
        }
    }
}
</script>