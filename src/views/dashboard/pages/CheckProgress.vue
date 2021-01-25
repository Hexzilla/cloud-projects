<template>
    <v-container id="regular-tables" tag="section" fluid>
        <v-progress-linear
            indeterminate
            class="mb-1"
            color="green"
            v-if="wait">
        </v-progress-linear>
        <v-row>
            <v-col>
                <v-card class="px-2 py-2 my-0" style="min-height: 500px">
                    <v-card-title class="flex flex-row-reverse px-0 mx-0 py-0">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-select
                                    v-model="client"
                                    :items="clients"
                                    attach
                                    chips
                                    item-text="name"
                                    item-value="code"
                                    label="Select Client"
                                    @change="clientChange"
                                    :disabled="this.wait"
                                ></v-select>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-container>
                        <v-row>
                            <v-col>
                                <p class="mb-0" style="color:#1867c0; font-size: 24px; font-weight: bold;">{{ project && project.prj_name }}</p>
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
    import client_api from "@/apis/client.js";
    import ProgressChart from './ProgressChart'

    export default {
        components: {
            ProgressChart
        },

        data: () => ({
            wait: false,
            project: null,
            Projects: [],
            client: null,
            clients: [],
            initiallyOpen: ["public"],
            allPerformers: [],
            phases: [],
        }),
        
        created: async function() {
            this.wait = true
            this.projects = await api.getProjects()
            this.clients = await client_api.findAll()
            
            this.clients.forEach(item=> {
                item.name.length > 50 && (item.name = item.name.substring(0, 50) + "...")
            })
            this.wait = false
        },

        computed: {

        },

        methods: {
            clientChange: async function() {
                this.wait = true

                this.phases = []
                this.project = this.projects.filter(item=> item.cl_code == this.client)[0]
                console.log("project", this.project)
                console.log("projects", this.projects)

                this.project && await api.updateTaskList(this.project)
                
                this.project && this.project.phases && this.project.phases.length > 0 && this.project.phases.forEach(item => {
                    console.log("item", item)
                    item.serverItems.length > 0 && this.setIkeyAndName(item.serverItems, 1)
                    this.phases.push(item)
                })

                console.log("phases: ", this.phases)
                this.wait = false
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