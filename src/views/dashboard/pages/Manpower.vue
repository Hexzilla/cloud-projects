<template>
    <v-container id="regular-tables" tag="section" fluid>
        <v-row>
            <v-col>
                <v-card class="my-0" style="min-height:500px">
                    <v-card-title>
                        <v-row>
                            <v-col>
                            </v-col>
                            <v-col>
                                <DatePicker
                                    textName="Date From"
                                    :date="fromDate"
                                    :submit="(date) => fromDate = date"
                                    :endDate="toDate"
                                ></DatePicker>
                            </v-col>
                            <v-col>
                                <DatePicker
                                    textName="Date To"
                                    :date="toDate"
                                    :submit="(date) => toDate = date"
                                    :startDate="fromDate"
                                ></DatePicker>
                            </v-col>
                            <v-col style="display:flex; align-items:center;">
                                <v-btn
                                    elevation="2"
                                    color="teal"
                                    small
                                    @click="getReport"
                                >Report</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="persons"
                        :search="search"
                        :loading="loading"
                        loading-text="Loading... Please wait"
                        sort-by="id">
                        <template v-slot:top>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-text-field
                                            v-model="search"
                                            append-icon="mdi-magnify"
                                            label="Search"
                                            single-line
                                            hide-details
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import DatePicker from './DatePicker'
    import people_api from "@/apis/people.js";

    export default {
        components: {
            DatePicker,
        },

        data: () => ({
            loading: false,
            headers: [
                { text: "Name", align: "start", value: "name" },
                { text: "Total working days", align: "start", value: "total" },
                { text: "Med.Leave", align: "start", value: "medLeave" },
                { text: "Cas.Leave", align: "start", value: "casLeave" },
                { text: "Vacation", align: "start", value: "vacation"},
                { text: "Un Occ days", align: "start", value: "unOccDays"}
            ],
            persons: [],
            fromDate: '',
            toDate: '',
            search: ''
        }),

        created: async function() {
            this.loading = true
            this.setInitialDate()
            this.persons = await people_api.getManPower(this.fromDate, this.toDate)
            this.loading = false
        },

        methods: {
            setInitialDate() {        
                let dt = new Date();
                let month = dt.getMonth(), year = dt.getFullYear();
                let FirstDay = new Date(year, month, 1);
                let LastDay = new Date(year, month + 1, 0);
                this.fromDate = people_api.dateToString(FirstDay)
                this.toDate = people_api.dateToString(LastDay)
            },

            async getReport() {
                this.loading = true
                this.persons = await people_api.getManPower(this.fromDate, this.toDate)
                this.loading = false
            }
        }
    }
</script>