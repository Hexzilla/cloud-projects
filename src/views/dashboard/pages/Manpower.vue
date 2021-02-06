<template>
    <v-container id="regular-tables" tag="section" fluid>
        <v-row>
            <v-col>
                <base-material-card
                color="green"
                >
                <template v-slot:heading>
                    <div class="display-1 font-weight-light">
                        Manpower Utilization
                    </div>
                </template>
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
                                    color="pink"
                                    text
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
                        <template v-slot:item.detail="{ item }">
                            <v-btn small color="pink" text title='Detail' @click="showDetail(item)">
                                Detail
                            </v-btn>
                        </template>
                    </v-data-table>
                </base-material-card>
            </v-col>
        </v-row>

        <v-dialog v-model="detailModal" max-width="800px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ getDetailTitle() }}</span><br>
                    <span style="font-size:14px">{{ this.fromDate + ' ~ ' + this.toDate }}</span>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                        :headers="modalHeaders"
                        :items="selectedData"
                        dense>
                    </v-data-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDetailDialog"> Cancel </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
                { text: "Name", align: "start", value: "name", class: "primary--text"},
                { text: "Total working days", align: "start", value: "total", class: "primary--text" },
                { text: "Med.Leave", align: "start", value: "medLeave", class: "primary--text" },
                { text: "Cas.Leave", align: "start", value: "casLeave", class: "primary--text" },
                { text: "Vacation", align: "start", value: "vacation", class: "primary--text"},
                { text: "Un Occ days", align: "start", value: "unOccDays", class: "primary--text"},
                { text: "", align: "center", value: "detail"}
            ],
            modalHeaders: [
                { text: "Date", align: "start", value: "dt", class: "primary--text" },
                { text: "Status", align: "start", value: "dayType", class: "primary--text" },
                { text: "Worked Hour", align: "start", value: "hrsWorked", class: "primary--text" },
                { text: "Wokred Min", align: "start", value: "minsWorked", class: "primary--text" },
            ],
            persons: [],
            fromDate: '',
            toDate: '',
            search: '',

            detailModal: false,
            selectedData: [],
            selectedItem: []
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
            },

            showDetail(item) {
                this.selectedItem = item
                this.selectedData = item.datewiseDetail
                this.detailModal = true
            },

            getDetailTitle() {
                if (this.selectedItem) {
                    return this.selectedItem.name
                }
                return ''
            },
            
            closeDetailDialog() {
                this.detailModal = false
            }
        }
    }
</script>