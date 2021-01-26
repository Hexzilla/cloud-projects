<template>
    <v-container class="px-0 py-0">
        <v-row>
            <v-col class="py-0 my-0 px-1">
                <v-text-field
                    label="Hr"
                    @change="setHr($event)"
                    type="number"
                    :rules="numRules"
                    v-model="item.hr"
                ></v-text-field>
            </v-col>
            <v-col class="py-0 my-0 px-1">
                <v-text-field
                    label="Min"
                    @change="setMin($event)"
                    type="number"
                    :rules="numRules"
                    v-model="item.min"
                ></v-text-field>
            </v-col>
            <v-col class="py-0 my-0 px-1">
                <v-text-field
                    label=""
                    @change="setPct($event)"
                    type="number"
                    :rules="pctRules"
                    v-model="item.pct"
                ></v-text-field>
            </v-col>
            <v-col class="py-0 my-0 px-1">
                <v-text-field
                    label=""
                    @change="setTotalPct($event)"
                    type="number"
                    :rules="pctRules"
                    v-model="item.totalPct"
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

    created() {
        console.log("item---", this.item)
    },

    computed: {
        numRules() {
            return [
                // (v) => !!v || "required",
                (v) => v > 0 || " > 0"
            ]
        },
        pctRules() {
            return [
                // (v) => !!v || "required",
                (v) => v < 100 || " < 100",
                (v) => v > 0 || " > 0"
            ]
        }
    },
    
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