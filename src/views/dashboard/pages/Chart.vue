<template>
    <apexchart type="pie" align="center" width="90" :options="pieOptions" :series="pieSeries"></apexchart>
</template>

<script>

export default {
    name: "Chart",
    props: ["data"],

    data: () => ({            
        pieOptions: {
            chart: {
                type: 'pie',
            },
            labels: ['Total', 'Elapsed', 'Updated'],
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            // colors:['rgb(0, 227, 150)', 'rgb(0, 143, 251)']
        },

    }),

    computed: {
        pieSeries() {
            // return [this.total, 100-this.total]
            if (this.data.estimatedTimeInMinutes && this.data.total_minutes_to_be_spent && this.data.TotMinsUpToday)
                return [this.data.estimatedTimeInMinutes, this.data.total_minutes_to_be_spent, this.data.TotMinsUpToday]
            return [0, 0, 0]
        }
    },

    created() {
      
    },

    methods: {
        
    }
}
</script>