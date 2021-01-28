<template>
    <v-container id="regular-tables" tag="section" fluid>
        <v-progress-linear
            class="mb-1"
            indeterminate
            color="teal"
            v-if="wait">
        </v-progress-linear>
        <v-row>
            <v-col cols="12" md="7">
                <v-card class="px-2 py-2 mt-0">
                    <v-data-table
                        :headers="headers"
                        :items="leaveBalances"
                        :search="search"
                        :loading="loading"
                        loading-text="Loading... Please wait"
                        sort-by="id">
                        <template v-slot:top>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <DatePicker
                                            textName="Date"
                                            :date="selectedDate"
                                            :submit="(date) => {selectedDate = date
                                                                 dateChanged()}"
                                        ></DatePicker>
                                    </v-col>
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
                            <v-btn small color="teal" title='Detail' @click="showDetail(item)">
                                Detail
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
            <v-col cols="12" md="5">
                <v-card class="mt-0">
                    <v-card-title>
                        <div style="text-align: right; width: 100%">
                            <v-btn rounded small color="secondary" @click="addBalance" :disabled="addBtnValid">
                                Add
                            </v-btn>
                        </div>
                    </v-card-title>
                    <v-simple-table>
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-center">
                                +
                            </th>
                            <th class="text-center">
                                -
                            </th>
                            <th class="text-center">
                                Transaction Details
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(item, i) in leaveDetails"
                        :key="i"
                        >
                            <td class="text-center">{{ item.addBalance }}</td>
                            <td class="text-center">{{ item.reduceBalance }}</td>
                            <td class="text-center">{{ item.txnEvent }}</td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
                </v-card>
            </v-col>
        </v-row>

        <!--Add Dialog Begin-->
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>
                <span class="headline">Add Leave Balance</span>
                </v-card-title>

                <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-row>
                            <v-col>
                                {{detailData.name}}
                            </v-col>
                            <v-col>
                                {{detailData.date}}
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-select
                                    v-model="detailData.type"
                                    :items="balanceType"
                                    attach
                                    label="Add/Reduce"
                                ></v-select>
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="detailData.amount"
                                    type="number"
                                    :rules="amountRule"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-textarea
                                label="Comment"
                                v-model="detailData.comment"
                                rows="3"
                                ></v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
                    <v-btn :disabled="!valid" color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!--Add Dialog End-->
        <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
            {{ snackText }}
            <template v-slot:action="{ attrs }">
                <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>


<script>
    import DatePicker from './DatePicker'
    import leave_api from "@/apis/leave.js";

    export default {
        components: {
            DatePicker,
        },

        data: () => ({
            headers: [
                { text: "Name", align: "start", value: "name" },
                { text: "Designation", align: "start", value: "designation" },
                { text: "Value", align: "start", value: "leavebal" },
                { text: "Detail", align: "center", value: "detail"}
            ],
            loading: true,
            wait: false,
            leaveBalances: [],
            search: "",
            selectedItem: null,
            selectedDate: null,
            leaveDetails: [],
            dialog: false,
            valid: false,
            balanceType: ["Add", "Reduce"],
            detailData: {
                hrId: null,
                name: null,
                date: null,
                type: "Add",
                amount: 0,
                comment: null
            },
            addBtnValid: true,
            snack: false,
            snackColor: "",
            snackText: "",
        }),

        async created() {
            this.loading = true
            this.selectedDate = leave_api.getCurrentDate()
            this.leaveBalances = await leave_api.allLeaveBalance(this.selectedDate)
            this.loading = false
        },

        computed: {
            amountRule() {
                return [
                    (v) => v > 0 || " > 0",
                    (v) => v % 0.5 == 0 || "Invaild Number"
                ]
            }
        },
        methods: {
            async showDetail(item) {
                this.wait = true
                this.selectedItem = item
                this.leaveDetails = await leave_api.getLeaveBalanceDetails(this.selectedDate, item.hrid)
                this.addBtnValid = false
                this.wait = false
            },

            async dateChanged() {
                this.loading = true
                this.leaveBalances = await leave_api.allLeaveBalance(this.selectedDate)
                this.loading = false
            },

            addBalance() {
                if (this.$refs.form) {
                    this.$refs.form.resetValidation()
                }
                this.dialog = true
                this.detailData.name = this.selectedItem.name
                this.detailData.date = this.selectedDate
                this.detailData.hrId = this.selectedItem.hrid
            },

            async save() {
                if (!this.$refs.form.validate()) return
                this.wait = true
                this.close()
                let status = await leave_api.adjustBalance(this.detailData)
                this.show_snack(status)
                this.leaveDetails = await leave_api.getLeaveBalanceDetails(this.selectedDate, this.detailData.hrId)
                this.wait = false
            },

            close() {
                this.dialog = false
            },

            show_snack(success) {
                this.snack = true;
                if (success) {
                    this.snackColor = "success"
                    this.snackText = "Data saved"
                }
                else {
                    this.snackColor = "error";
                    this.snackText = "Error";
                }
            },
        }
    }
</script>