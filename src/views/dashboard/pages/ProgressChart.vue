<template>
    <!-- <apexchart type="pie" width="90" :options="pieOptions" :series="pieSeries"></apexchart> -->
    <v-container class="px-0 mx-0 py-1">
        <v-row>
            <v-col cols="12" md="3" sm="3" style="display:flex; align-items:center; font-size: 11px">
                UNIT: {{ this.unit }}
            </v-col>
            <v-col cols="12" md="2" sm="3" style="display:flex; align-items:center; font-size: 11px">
                QTY: {{ this.qty }}
            </v-col>
            <v-col cols="12" md="2" sm="3" style="display:flex; align-items:center; font-size: 11px">
                HR: {{ this.hr }}
            </v-col>
            <v-col cols="12" md="2" sm="3" style="display:flex; align-items:center; font-size: 11px">
                MIN: {{ this.min }}
            </v-col>
            <v-col cols="12" md="3" sm="12" xs="6" class="px-0">
                <apexchart type="pie" align="center" width="90" :options="pieOptions" :series="pieSeries"></apexchart>
            </v-col>
            <!-- <v-col class="px-0">
                <apexchart type="donut" width="90" :options="doughnutOptions" :series="doughnutSeries"></apexchart>
            </v-col> -->
        </v-row>
        <v-divider inset></v-divider>
    </v-container>
</template>

<script>

export default {
    name: "ProgressChart",
    props: ["item", "progresses"],

    data: () => ({            
        progress: null,
        unit: "",
        qty: 0,
        hr: 0,
        min: 0,
        total: 0,
        //---- chart
        // pieSeries: [this.total, 100-this.total],
        pieOptions: {
            chart: {
                type: 'pie',
            },
            labels: ['Progress', 'Remain'],
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            colors:['rgb(0, 227, 150)', 'rgb(0, 143, 251)']
        },

        // doughnutSeries: [30, 30, 40, 50, 60],
        // doughnutOptions: {
        //     chart: {
        //         type: 'donut',
        //     },
        //     dataLabels: {
        //         enabled: false
        //     },
        //     legend: {
        //         show: false
        //     }
        // },
    }),

    computed: {
        pieSeries() {
            return [this.total, 100-this.total]
        }
    },

    created() {
        console.log("**item", this.item)

        if (this.progresses.length > 0) {
            if (this.item.level == 1) {
                this.progress = this.progresses.find(e => e.estMPTL1id == this.item.est_MP_TL1_id)
                if (this.progress) {
                    this.unit = this.progress.estMPTL1unitOfMeasure
                    this.qty = this.progress.estMPTL1qty * 1
                    this.progress.daily_update_L1_effort_hours && (this.hr = this.progress.daily_update_L1_effort_hours)
                    this.progress.daily_update_L1_effort_mins && (this.min = this.progress.daily_update_L1_effort_mins)
                    this.progress.L1TotPctMarkToday && (this.total = this.progress.L1TotPctMarkToday * 1)
                }
            } else if (this.item.level == 2) {
                this.progress = this.progresses.find(e => e.estMPTL2id == this.item.est_MP_TL2_id)
                if (this.progress) {
                    this.unit = this.progress.estMPTL2unitOfMeasure
                    this.qty = this.progress.estMPTL2qty * 1
                    this.progress.daily_update_L2_effort_hours && (this.hr = this.progress.daily_update_L2_effort_hours)
                    this.progress.daily_update_L2_effort_mins && (this.min = this.progress.daily_update_L2_effort_mins)
                    this.progress.L2TotPctMarkToday && (this.total = this.progress.L2TotPctMarkToday * 1)
                }
            } else if (this.item.level == 3) {
                this.progress = this.progresses.find(e => e.estMPTL3id == this.item.est_MP_TL3_id)
                if (this.progress) {
                    this.unit = this.progress.estMPTL3unitOfMeasure
                    this.qty = this.progress.estMPTL3qty * 1
                    this.progress.daily_update_L3_effort_hours && (this.hr = this.progress.daily_update_L3_effort_hours)
                    this.progress.daily_update_L3_effort_mins && (this.min = this.progress.daily_update_L3_effort_mins)
                    this.progress.L3TotPctMarkToday && (this.total = this.progress.L3TotPctMarkToday * 1)
                }
            } else if (this.item.level == 4) {
                if (this.progress) {
                    this.progress = this.progresses.find(e => e.estMPTL4id == this.item.est_MP_TL4_id)
                    this.unit = this.progress.estMPTL4unitOfMeasure
                    this.qty = this.progress.estMPTL4qty * 1
                    this.progress.daily_update_L4_effort_hours && (this.hr = this.progress.daily_update_L4_effort_hours)
                    this.progress.daily_update_L4_effort_mins && (this.min = this.progress.daily_update_L4_effort_mins)
                    this.progress.L4TotPctMarkToday && (this.total = this.progress.L4TotPctMarkToday * 1)
                }
            }
        }   
        console.log("**progress", this.progress)
    },

    methods: {
        
    }
}
</script>