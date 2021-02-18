<template>
    <div>
        <div v-for="(e, i) in items" :key="i" class="pl-5">
            <div class="body-1 py-2 my-1 font-weight-bold">
                {{e.TLx_name}}
            </div>
            <center v-if="e.efforts && e.efforts.length > 0">
                <v-simple-table style="max-width: 400px">
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-center px-0">
                                
                            </th>
                            <th class="text-center">
                                <v-icon color="blue" title="Peoples">mdi-account-group</v-icon>
                            </th>
                            <th class="text-center">
                                <v-icon color="blue" title="Minutes">mdi-clock-fast</v-icon>
                            </th>
                            <th class="text-center">
                                <v-icon color="blue" title="Days">mdi-calendar-month-outline</v-icon>
                            </th>
                            <th class="text-center px-0">
                                <v-icon color="blue" title="Chart">mdi-chart-arc</v-icon>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(v, j) in e.efforts" :key="`c` + j"
                        >
                            <td class="px-0 text-center">{{ v.rolename }}</td>
                            <td class="text-center">{{ v.people_count }}</td>
                            <td class="text-center">{{ v.estimatedTimeInMinutes }}</td>
                            <td class="text-center">{{ getDay(v) }} </td>
                            <td class="px-0" width="130px">
                                <Chart
                                    v-bind:data="v"
                                >
                                </Chart>
                            </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </center>
            <v-divider></v-divider>
        </div>
    </div>
</template>

<script>
import Chart from './Chart'

export default {
    components: {
        Chart
    },

    name: "ProgressDetail",
    props: ["items"],

    methods: {
        getDay(v) {
            if (v.total_minutes_to_be_spent)
                return parseInt(v.total_minutes_to_be_spent / 60 / 24)
            return ''
        }
    }
}
</script>