<template>
    <v-container class="px-0 py-0">
        <v-card :loading="loading">
        <v-card-title>
            <span class="headline" style="font-weight: bold; color: rgb(24, 103, 192); font-size: 20px;">Update ( <span style="font-size: 18px">{{this.item.name}}</span> )</span>
        </v-card-title>
        <br>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col>
                        <v-select
                            v-model="selectedSupervisor"
                            :items="supervisors"
                            attach
                            item-text="fullName"
                            item-value="id"
                            label="Select supervisor"
                            :rules="supervisorRule"
                            @change="supervisorChanged"
                        ></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-select
                            v-model="selectedPerformer"
                            :items="performers"
                            attach
                            item-text="firstname"
                            item-value="id"
                            label="Select performers"
                            :rules="performerRule"
                            multiple
                            chip
                            @change="performerChanged"
                        ></v-select>
                    </v-col>
                </v-row>
                <template v-if="saveData.length > 0">
                    <template v-for="(item, i) in saveData" >
                        <v-row :key="i">
                            <v-col cols="12" md="4" class="py-0 my-0" style="display:flex; align-items:center;">
                                {{ getPerformerName(item) }}
                            </v-col>
                            <v-col cols="12" md="3" class="py-0 my-0">
                                <v-text-field
                                    label="Hr"
                                    type="number"
                                    :rules="hrRules"
                                    v-model="item.hr"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3" class="py-0 my-0">
                                <v-text-field
                                    label="Min"
                                    type="number"
                                    :rules="minRules"
                                    v-model="item.min"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="2" class="py-0 my-0">
                                <v-text-field
                                    label="Percent"
                                    type="number"
                                    :rules="pctRules"
                                    v-model="item.pct"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </template>
                </template>
                <v-row>
                    <v-col style="height: 50px">
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!valid" color="primary darken-1" @click="save"> Save </v-btn>
        </v-card-actions>
        </v-card>

        <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
            {{ snackText }}
            <template v-slot:action="{ attrs }">
                <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script>
import daily_api from "@/apis/daily.js";

export default {
    name: "DailyUpdate",
    props: ["item", "supervisors", "performers"],

    data: () => ({
        valid: false,
        selectedSupervisor: null,
        selectedPerformer: null,
        saveData: [],
        itemId: null,
        loading: false,
        snack: false,
        snackColor: "",
	    snackText: "",
    }),

    created() {
        console.log("supervisors", this.supervisors)
        console.log("performers", this.performers)
        console.log("item", this.item)
        this.supervisors.forEach(e => {
            e.fullName = e.firstname + " " + e.lastname
        })
        this.item.level == 1 && (this.itemId = this.item.est_MP_TL1_id)
        this.item.level == 2 && (this.itemId = this.item.est_MP_TL2_id)
        this.item.level == 3 && (this.itemId = this.item.est_MP_TL3_id)
        this.item.level == 4 && (this.itemId = this.item.est_MP_TL4_id)
    },

    computed: {
        supervisorRule() {
            return [
                (v) => !!v || "required",
            ]
        },
        performerRule() {
            return [
                (v) => v && v.length > 0 || "required",
            ]
        },
        hrRules() {
            return [
                (v) => !!v || "required",
                (v) => v > 0 || " > 0",
                (v) => v < 24 || " < 24",
            ]
        },
        minRules() {
            return [
                (v) => !!v || "required",
                (v) => v > 0 || " > 0",
                (v) => v < 60 || " < 60",
            ]
        },
        pctRules() {
            return [
                (v) => !!v || "required",
                (v) => v < 100 || " < 100",
                (v) => v > 0 || " > 0"
            ]
        }
    },
    
    methods: {

        async save() {
            if (!this.$refs.form.validate()) return
            this.loading = true
            await this.sendData()    
            this.loading = false
            this.close()
        },

        async sendData() {
            let status
            if (this.item.level == 1) {
                for (let i in this.saveData)
                    status = await daily_api.add1(this.saveData[i])
            }
            if (this.item.level == 2) {
                for (let i in this.saveData)
                    status = await daily_api.add2(this.saveData[i])
            }
            if (this.item.level == 3) {
                for (let i in this.saveData)
                    status = await daily_api.add3(this.saveData[i])
            }
            if (this.item.level == 4) {
                for (let i in this.saveData)
                    status = await daily_api.add4(this.saveData[i])
            }

            this.show_snack(status)
        },

        performerChanged() {
            this.setSaveData()
        },

        supervisorChanged() {
            this.setSaveData && this.saveData.length > 0 && this.saveData.forEach(e=> e.supervisor = this.selectedSupervisor)
        },

        setSaveData() {
            if (!this.selectedPerformer) {
                this.saveData = []
                return
            }

            if (this.selectedPerformer.length < this.saveData.length) {
                let filter = this.saveData.filter(e => this.selectedPerformer.includes(e.performer))
                this.saveData = []
                this.saveData = filter
                return
            }

            this.selectedPerformer.length > 0 && this.selectedPerformer.forEach(item => {
                if (this.saveData.find(e => e.performer == item)) return

                let temp = {
                    id: this.itemId,
                    supervisor: this.selectedSupervisor,
                    performer: item,
                    hr: '',
                    min: '',
                    pct: '',
                    totalPct: 60 //todo
                }
                this.saveData.push(temp)
            })

            console.log("saveData", this.saveData)
        },

        getPerformerName(item) {
            let id = item.performer
            let found = this.performers.find(e => e.id == id)
            return found.firstname + " " + found.lastname
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