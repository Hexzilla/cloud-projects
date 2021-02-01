<template>
    <v-container id="regular-tables" tag="section" fluid>
        <v-progress-linear
            indeterminate
            class="mb-1"
            color="green"
            v-if="wait">
        </v-progress-linear>
        <v-row>
            <v-col cols="12" sm="12" md="3">
                <v-card class="my-0" style="min-height: 100px">
                    <v-card-title class="flex flex-row-reverse px-0 mx-0 py-0">
                        <v-text-field
                            filled
                            label="Search"
                            append-icon="mdi-magnify"
                            @change="searchKeyChange($event)"
                        ></v-text-field>
                    </v-card-title>
                    <v-list :disabled="wait">
                        <v-list-item-group>
                            <v-list-item v-for="(item, i) in projects" :key="i">
                                <v-list-item-content v-on:click="project_listItemClicked(item)">
                                    <v-list-item-title v-text="item.prj_name"></v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                    <v-progress-circular
                                        v-if="waitProject == item"
                                        indeterminate
                                        color="green"
                                        :width="2"
                                        :size="24"
                                    ></v-progress-circular>
                                </v-list-item-icon>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="12" sm="12" md="9">
                <v-card class="px-2 py-2 my-0" style="min-height: 500px">
                    <v-container>
                        <v-row>
                            <v-col>
                                <p class="mb-0" style="color:#1867c0; font-size: 24px; font-weight: bold;">{{ project && project.prj_name}}</p>
                                    <p class="title mb-0 text--disabled">
                                        {{ clientName }}
                                    </p>
                            </v-col>
                        </v-row>
                    </v-container>
                    <template v-for="(item, i) in this.phases">
                        <v-container class="ml-3">
                            <v-row>
                                <v-col>
                                    <p class="subtitle-1 mb-0" style="color:#1867c0; font-size: 20px !important;"><b>{{ `Phase ${i + 1}` }}</b></p>
                                    <p class="title mb-0 text--disabled">
                                        {{ `${item.phase_opendate} ~ ${item.phase_closedate}` }}
                                    </p>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-treeview
                                        :open="initiallyOpen"
                                        :items="item.serverItems"
                                        item-key="ikey"
                                        activatable
                                    >
                                    <template v-slot:prepend="{ item }">
                                        <v-icon v-if="item.level == 0" color="teal">mdi-cube</v-icon>
                                        <v-icon v-if="item.level == 1" color="teal">mdi-numeric-1-box-outline</v-icon>
                                        <v-icon v-if="item.level == 2" color="teal">mdi-numeric-2-box-outline</v-icon>
                                        <v-icon v-if="item.level == 3" color="teal">mdi-numeric-3-box-outline</v-icon>
                                        <v-icon v-if="item.level == 4" color="teal">mdi-numeric-4-box-outline</v-icon>
                                    </template>
                                    <template v-slot:append="{ item }">
                                        <ProgressChart
                                            v-bind:item = item
                                            v-bind:progresses = progress
                                            v-if="item.level > 0"
                                        >
                                        </ProgressChart>
                                    </template>
                                    </v-treeview>
                                </v-col>
                            </v-row>
                        </v-container>
                    </template>
                </v-card>
            </v-col>
        </v-row>
</v-container>
</template>

<script>
    import api from "@/apis/project.js";
    import ProgressChart from './ProgressChart'

    export default {
        components: {
            ProgressChart
        },

        data: () => ({
            wait: false,
            project: null,
            projects: [],
            initiallyOpen: ["public"],
            allPerformers: [],
            phases: [],
            waitProject: null,
            progress:[]
        }),
        
        created: async function() {
            this.wait = true
            this.allProjects = await api.getProjects()
            this.projects = this.allProjects

            this.wait = false
        },

        computed: {
            clientName() {
                if (this.project)
                    return this.project.cl_name.length > 50 ? this.project.cl_name.substring(0, 50) + '...' : this.project.cl_name
                return null
            }
        },

        methods: {
           
            async project_listItemClicked(item) {
                console.log("item", item)
                this.wait = true
                this.phases = []
                this.waitProject = item
                this.project = item
                this.progress = await api.getProgress(item.prj_id, null, item.cl_code)

            console.log("------------progress", this.progress)
                item && await api.updateTaskList(item)
                item && item.phases && item.phases.length > 0 && item.phases.forEach(e => {
                    e.serverItems.length > 0 && this.setIkeyAndName(e.serverItems, 1)
                    item.phases = []
                    item.phases.push(e)
                })
            
                this.phases = item.phases
                this.waitProject = null
                this.wait = false
            },

            searchKeyChange: function(event) {
                this.projects = this.allProjects.filter(item => item.prj_name.toUpperCase().includes(event.toUpperCase()))
            },

            setIkeyAndName: function(items, ikey) {
                items.forEach((item, index) => {
                    if (item.level == 0) {
                        item.ikey = ikey
                    }else if (item.level == 1) {
                        item.name = item.TL1_name
                        item.ikey = ikey
                    } else if (item.level == 2) {
                        item.name = item.TL2_name
                        item.ikey = ikey
                    } else if (item.level == 3) {
                        item.name = item.TL3_name
                        item.ikey = ikey
                    } else {
                        item.name = item.TL4_name
                        item.level = 4
                        item.ikey = ikey
                    }
                    item.hr = ''
                    item.min = ''
                    item.pct = ''
                    item.totalPct = ''
                    ikey++

                    if (item.children && item.children.length > 0) {
                        ikey = this.setIkeyAndName(item.children, ikey)
                    } 
                })
                return ikey
            },
        }
    }
</script>