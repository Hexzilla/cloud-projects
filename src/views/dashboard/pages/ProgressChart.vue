<template>
    <v-container class="px-0 py-0">
        <v-row>
            <v-col style="display:flex; align-items:center;">
                {{ this.unit }}
            </v-col>
            <v-col style="display:flex; align-items:center;">
                {{ this.qty }}
            </v-col>
            <v-col style="display:flex; align-items:center;">
                {{ this.hr }}
            </v-col>
            <v-col style="display:flex; align-items:center;">
                {{ this.min }}
            </v-col>
            <v-col class="px-0">
                <apexchart type="pie" width="90" :options="pieOptions" :series="pieSeries"></apexchart>
            </v-col>
            <v-col class="px-0">
                <apexchart type="donut" width="90" :options="doughnutOptions" :series="doughnutSeries"></apexchart>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

export default {
    name: "ProgressChart",
    props: ["item", "progresses"],

    data: () => ({            
        progress: null,
        unit: "",
        qty: "",
        hr: "",
        min: "",

        //---- chart
        pieSeries: [50, 20, 30],
        pieOptions: {
            chart: {
                width: 100,
                type: 'pie',
            },
            // labels: ['Progress', 'Remain'],
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            }
        },

        doughnutSeries: [30, 30, 40, 50, 60],
        doughnutOptions: {
            chart: {
                width: 100,
                type: 'donut',
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            }
        },
    }),

    created() {
        console.log("**item", this.item)

        if (this.progresses.length > 0) {
            if (this.item.level == 1) {
                this.progress = this.progresses.find(e => e.estMPTL1id == this.item.est_MP_TL1_id)
                if (this.progress) {
                    this.unit = this.progress.estMPTL1unitOfMeasure
                    this.qty = this.progress.estMPTL1qty * 1
                    this.hr = this.progress.daily_update_L1_effort_hours
                    this.min = this.progress.daily_update_L1_effort_mins
                }
            } else if (this.item.level == 2) {
                this.progress = this.progresses.find(e => e.estMPTL2id == this.item.est_MP_TL2_id)
                if (this.progress) {
                    this.unit = this.progress.estMPTL2unitOfMeasure
                    this.qty = this.progress.estMPTL2qty * 1
                    this.hr = this.progress.daily_update_L2_effort_hours
                    this.min = this.progress.daily_update_L2_effort_mins
                }
            } else if (this.item.level == 3) {
                this.progress = this.progresses.find(e => e.estMPTL3id == this.item.est_MP_TL3_id)
                if (this.progress) {
                    this.unit = this.progress.estMPTL3unitOfMeasure
                    this.qty = this.progress.estMPTL3qty * 1
                    this.hr = this.progress.daily_update_L3_effort_hours
                    this.min = this.progress.daily_update_L3_effort_mins
                }
            } else if (this.item.level == 4) {
                if (this.progress) {
                    this.progress = this.progresses.find(e => e.estMPTL4id == this.item.est_MP_TL4_id)
                    this.unit = this.progress.estMPTL4unitOfMeasure
                    this.qty = this.progress.estMPTL4qty * 1
                    this.hr = this.progress.daily_update_L4_effort_hours
                    this.min = this.progress.daily_update_L4_effort_mins
                }
            }
        }   
        console.log("**progress", this.progress)
    },

    methods: {
        
    }
}
</script>