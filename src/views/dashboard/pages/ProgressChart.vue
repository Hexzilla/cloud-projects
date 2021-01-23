<template>
    <v-container class="px-0 py-0">
        <v-row>
            <v-col style="display:flex; align-items:center;">
                Unit
            </v-col>
            <v-col style="display:flex; align-items:center;">
                Qty
            </v-col>
            <v-col style="display:flex; align-items:center;">
                Hr
            </v-col>
            <v-col style="display:flex; align-items:center;">
                Mins
            </v-col>
            <v-col class="px-0">
                <apexchart type="pie" width="120" :options="pieOptions" :series="pieSeries"></apexchart>
            </v-col>
            <v-col class="px-0">
                <apexchart type="donut" width="120" :options="doughnutOptions" :series="doughnutSeries"></apexchart>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

export default {
    name: "ProgressChart",
    props: ["item"],

    data: () => ({            
        //---- chart
        pieSeries: [80, 20],
        pieOptions: {
            chart: {
                width: 100,
                type: 'pie',
            },
            labels: ['Progress', 'Remain'],
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

    methods: {
        
    }
}
</script>