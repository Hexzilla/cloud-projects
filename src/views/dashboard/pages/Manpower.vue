<template>
    <v-container id="regular-tables" tag="section" fluid>
        <v-progress-linear
            indeterminate
            color="teal darken-2"
            v-if="wait">
        </v-progress-linear>
        <v-row>
            <v-col>
                <v-card class="my-0" style="min-height:500px">
                    <v-simple-table>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                <th class="text-center">
                                </th>
                                <th class="text-center" style="background-color: #1867c0; color:white; font-size: 16px">
                                    Total working days
                                </th>
                                <th class="text-center" style="background-color: #1867c0; color:white; font-size: 16px">
                                    Med.Leave
                                </th>
                                <th class="text-center" style="background-color: #1867c0; color:white; font-size: 16px">
                                    Cas.Leave
                                </th>
                                <th class="text-center" style="background-color: #1867c0; color:white; font-size: 16px">
                                    Vacation
                                </th>
                                <th class="text-center" style="background-color: #1867c0; color:white; font-size: 16px">
                                    Un Occ days
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                v-for="(item, i) in persons"
                                :key="i"
                                >
                                <td class="text-center" style="background-color: #f5f5f5; font-weight: bold;">{{ item.name }}</td>
                                <td class="text-center">{{ item.total }}</td>
                                <td class="text-center">{{ item.medLeave }}</td>
                                <td class="text-center">{{ item.casLeave }}</td>
                                <td class="text-center">{{ item.vacation }}</td>
                                <td class="text-center">{{ item.unOccDays }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        data: () => ({
            wait: false,
            persons: []
        }),

        created: async function() {
            this.wait = true
            this.persons = this.getPersons()
            this.wait = false
        },

        methods: {
            getPersons: function() {
                return [
                    {
                        name: 'Person',
                        total: 30,
                        medLeave: 1,
                        casLeave: 7,
                        vacation: 7,
                        unOccDays: 1
                    },
                    {
                        name: 'Person',
                        total: 20,
                        medLeave: 6,
                        casLeave: 3,
                        vacation: 8,
                        unOccDays: 1
                    },
                    {
                        name: 'Person',
                        total: 15,
                        medLeave: 0,
                        casLeave: 3,
                        vacation: 6,
                        unOccDays: 1
                    },
                    {
                        name: 'Person',
                        total: 12,
                        medLeave: 3,
                        casLeave: 5,
                        vacation: 3,
                        unOccDays: 1
                    },
                    {
                        name: 'Person',
                        total: 18,
                        medLeave: 4,
                        casLeave: 6,
                        vacation: 1,
                        unOccDays: 9
                    },
                    {
                        name: 'Person',
                        total: 10,
                        medLeave: 2,
                        casLeave: 3,
                        vacation: 1,
                        unOccDays: 9
                    },
                    {
                        name: 'Person',
                        total: 12,
                        medLeave: 9,
                        casLeave: 1,
                        vacation: 1,
                        unOccDays: 1
                    },
                    {
                        name: 'Person',
                        total: 20,
                        medLeave: 0,
                        casLeave: 0,
                        vacation: 0,
                        unOccDays: 0
                    },
                    {
                        name: 'Person',
                        total: 11,
                        medLeave: 1,
                        casLeave: 0,
                        vacation: 1,
                        unOccDays: 0
                    },
                    {
                        name: 'Person',
                        total: 100,
                        medLeave: 0,
                        casLeave: 0,
                        vacation: 0,
                        unOccDays: 0
                    }
                ]
            }
        }
    }
</script>